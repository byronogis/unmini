import type { Loader } from '@unmini/core'
import type { TSContext, TSLoaderOptions } from './types'
import { Lang, parse } from '@ast-grep/napi'
import { defineLoader } from '@unmini/core'
import {
  removeUnMiniPolyfillImport,
  trsnaformUnMiniImportFilePath,
} from './transform'
import { transformTsToJs } from './utils'

export * from './transform'
export * from './types'
export * from './utils'

export default function ts(_options: TSLoaderOptions = {}): Loader<TSLoaderOptions> {
  return defineLoader<TSLoaderOptions>(() => {
    return {
      key: '.ts',
      options: { },
      handler(_, payload) {
        const ctx: TSContext = {
          payload,
        }

        /**
         * script
         */

        const scriptTransforms = [
          trsnaformUnMiniImportFilePath,
          removeUnMiniPolyfillImport,
        ]

        scriptTransforms.forEach((transform) => {
          const scriptRoot = parse(Lang.TypeScript, ctx.payload.content).root()
          const { edits } = transform({
            node: scriptRoot,
            ctx,
          })
          ctx.payload.content = scriptRoot.commitEdits(edits)
        })

        return [{
          content: transformTsToJs(ctx.payload.content),
          ext: 'js',
        }]
      },
    }
  })
}
