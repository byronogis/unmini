import type { CliOptions, ResolvedCliOptions } from './types'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { core, CoreContext, CoreError, loadConfig } from '@unmini/core'
import { cyan, dim, green } from 'colorette'
import { consola } from 'consola'
import { remove } from 'fs-extra'
import { basename, dirname, format, join, relative, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'
import { glob } from 'tinyglobby'
import { version } from '../package.json'
import { handleError, PrettyError } from './errors'
import { getWatcher } from './watcher'

const name = 'unmini'

export async function handle(_options: CliOptions): Promise<void> {
  const fileCache = new Map<string, string>()

  const options = await loadConfig<CliOptions>(_options) as ResolvedCliOptions

  if (!options.patterns?.length) {
    handleError(new PrettyError(`No glob patterns, try ${cyan(`${name} <path/to/**/*>`)}`))
  }

  const ctx = new CoreContext({ configs: options })

  const files = await glob([
    ...options.patterns,
  ], {
    cwd: options.srcDirFull,
    absolute: true,
    expandDirectories: false,
  })
  await Promise.all(files.map(async (file) => {
    fileCache.set(file, readFileSync(file, 'utf8'))
  }))

  consola.log(green(`${name} v${version}`))

  if (options.watch) {
    consola.start('unmini in watch mode...')
  }
  else {
    consola.start('unmini for production...')
  }

  const debouncedBuild = debounce(
    async () => {
      generate(options).catch(handleError)
    },
    100,
  )

  if (options.clear) {
    await remove(options.outputDirFull)
  }

  if (!existsSync(options.outputDirFull)) {
    mkdirSync(options.outputDirFull, { recursive: true })
  }

  await generate(options)

  await startWatcher().catch(handleError)

  async function startWatcher(): Promise<void> {
    if (!options.watch) {
      return
    }
    const { patterns } = options

    const watcher = await getWatcher(options)

    watcher.on('all', async (type, file) => {
      const absolutePath = resolve(options.srcDirFull, file)

      consola.log(`${green(type)} ${dim(file)}`)

      if (type.startsWith('unlink')) {
        // unlink: file has been removed
        fileCache.delete(absolutePath)
      }
      else {
        fileCache.set(absolutePath, readFileSync(absolutePath, 'utf8'))
      }

      debouncedBuild()
    })

    consola.info(
      `Watching for changes in ${(patterns)
        .map((i: string) => cyan(i))
        .join(', ')}`,
    )
  }

  async function generate(options: ResolvedCliOptions): Promise<void> {
    const sourceCache = Array.from(fileCache).map(([id, content]) => ({ id, content }))

    /**
     * transform files
     *
     * 转换文件
     */
    const transformedList = (await Promise.all(sourceCache.map(async ({ id, content }) => {
      try {
        const shouldTransform = id.split('.').at(-2) === options.subExtension

        const result = shouldTransform
          ? await core({ id, content, ctx })
          : [{ content, ext: id.split('.').at(-1) || '' }]

        return result.map(i => ({ ...i, id }))
      }
      catch (error: any) {
        if (error instanceof CoreError) {
          throw new PrettyError(`[@unmini/cli:${id}] ${error.message}`)
        }
        throw error
      }
    }))).flat()

    /**
     * output files by directory structure
     *
     * 按照目录结构输出文件
     */
    await Promise.all(transformedList.map(async (transformed) => {
      const { id, content, ext } = transformed
      const absOriginal = resolve(id)

      const relativePath = relative(options.srcDirFull, absOriginal)

      if (relativePath.startsWith('..')) {
        return null
      }

      const newPath = join(options.outputDirFull, relativePath)
      const newDir = dirname(newPath)
      if (!existsSync(newDir)) {
        mkdirSync(newDir, { recursive: true })
      }

      let filename = basename(id).split('.').slice(0, -1).join('.')
      if (filename.endsWith(`.${options.subExtension}`)) {
        filename = filename.replace(`.${options.subExtension}`, '')
      }

      /**
       * exclude files while output
       */
      if (options.transform.output?.exclude?.length) {
        const shouldExclude = options.transform.output.exclude.some((i) => {
          if (typeof i === 'function') {
            return i(transformed)
          }

          return i.test(filename)
        })

        if (shouldExclude) {
          return null
        }
      }

      writeFileSync(format({
        dir: newDir,
        name: filename,
        ext,
      }), content, 'utf-8')

      return true
    }))

    await ctx.hooks.callHook('post-cli-output', ctx)
  }
}
