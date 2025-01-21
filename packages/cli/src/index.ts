import type { CliOptions, ResolvedCliOptions } from './types'
import { loadConfig } from '@unmini/config'
import { core, CoreError } from '@unmini/core'
import { cyan, dim, green } from 'colorette'
import { consola } from 'consola'
import { existsSync, mkdir, readFile, remove, writeFile } from 'fs-extra'
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
    throw new PrettyError(
      `No glob patterns, try ${cyan(`${name} <path/to/**/*>`)}`,
    )
  }

  const files = await glob([
    ...options.patterns,
  ], {
    cwd: options.srcDirFull,
    absolute: true,
    expandDirectories: false,
  })
  await Promise.all(files.map(async (file) => {
    fileCache.set(file, await readFile(file, 'utf8'))
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

  if (!options.clear) {
    await remove(options.outputDirFull)
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
        fileCache.set(absolutePath, await readFile(absolutePath, 'utf8'))
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
    const sourceCache = Array.from(fileCache).map(([id, code]) => ({ id, code }))

    const transformedList = sourceCache.map(({ id, code }) => {
      try {
        // Check if the file should be kept (not transformed, copied as is)
        const keep = options.transform.exclude.some((pattern) => {
          if (typeof pattern === 'function') {
            return pattern({ id })
          }
          return pattern.test(id)
        })

        const result = !keep
          ? core({
              content: code,
              type: id.endsWith('app.mini.vue') ? 'app' : 'component',
              resolvedConfig: options,
            })
          : undefined
        return {
          id,
          code,
          result,
          keep,
        }
      }
      catch (error: any) {
        if (error instanceof CoreError) {
          throw new PrettyError(`[@unmini/cli:${id}] ${error.message}`)
        }
        throw error
      }
    })

    await remove(options.outputDirFull)
    await mkdir(options.outputDirFull, { recursive: true })

    await Promise.all(transformedList.map(async ({ id, result, keep, code }) => {
      const absOriginal = resolve(id)

      const relativePath = relative(options.srcDirFull, absOriginal)

      if (relativePath.startsWith('..')) {
        return null
      }

      const newPath = join(options.outputDirFull, relativePath)
      const newDir = dirname(newPath)
      if (!existsSync(newDir)) {
        await mkdir(newDir, { recursive: true })
      }

      if (keep) {
        return await writeFile(newPath, code, 'utf-8')
      }
      else {
        const filename = basename(id, options.extension)
        !keep && Object.entries(result!.blockContents).map(async ([block, content]) => {
          // Skip the template block for app
          if (filename === 'app' && block === 'template') {
            return
          }

          // @ts-expect-error - block is a key of BlockContents
          const fileExt = result.extensions[block]
          const blockPath = format({
            dir: newDir,
            name: filename,
            ext: fileExt,
          })
          await writeFile(blockPath, content, 'utf-8')
        })
      }
    }))
  }
}
