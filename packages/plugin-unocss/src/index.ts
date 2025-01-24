import type { Context, Platform } from '@unmini/core'
import type { ResolvedUnoCSSOptions, UnoCSSOptions } from './types'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { definePlugin, FileExtensions, INJECT_COMMENT_RE } from '@unmini/core'
import { checkCommand, getInjectedContent } from '@unmini/shared'
import { exists, readFile, readFileSync, unlinkSync, writeFile } from 'fs-extra'
import { resolve } from 'pathe'

const NAME = 'unocss'

export default function unocss(options: UnoCSSOptions): any {
  return definePlugin<UnoCSSOptions>({
    key: NAME,
    options,
    hooks: {
      'pre-inject-plugin-options': (ctx, options = {}) => {
        const {
          config,
        } = ctx

        return {
          enabled: true,
          injectFilePath: resolve(config.cwd, config.outputDir!, `app${FileExtensions[config.platform as Platform].style}`),
          patterns: config.patterns,
          ...options,
        }
      },
      'post-output': async (ctx) => {
        await run(ctx)
      },
    },
  })
}

export async function run(ctx: Context): Promise<void> {
  const { content: unocssContent } = generate(ctx)

  const _option = ctx.registeredPlugins.get(NAME) as ResolvedUnoCSSOptions

  let content = ''

  const isFileExist = await exists(_option.injectFilePath)

  if (!isFileExist) {
    content = unocssContent
  }
  else {
    const oldContent = await readFile(_option.injectFilePath, 'utf-8')
    content = getInjectedContent({
      oldContent,
      newContent: unocssContent,
      customCommentRegExp: INJECT_COMMENT_RE,
    })
  }

  await writeFile(_option.injectFilePath, content)
}

export function generate(ctx: Context): {
  content: string
} {
  if (!checkCommand('unocss')) {
    throw new Error(`[unmini] unocss is not installed, please install it first. see https://unocss.dev/integrations/cli`)
  }

  const _option = ctx.registeredPlugins.get(NAME) as ResolvedUnoCSSOptions

  const tempFile = resolve(tmpdir(), `unmini-unocss-${Date.now()}.css`)

  spawnSync(
    'unocss',
    [
      ..._option.patterns,

      `--out-file`,
      tempFile,

      // TODO support transformer
      // '--write-transformed',

      '--preflights',
      'false',
    ],
    {
      /**
       *
       */
      cwd: ctx.config.srcDirFull,
    },
  )

  const content = readFileSync(tempFile, 'utf-8')
  unlinkSync(tempFile)

  return {
    content,
  }
}
