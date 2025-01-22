import type { LoaderOptions, LoaderReturns } from '.'
import { Lang, parse } from '@ast-grep/napi'
import {
  removeUnMiniPolyfillImport,
  trsnaformUnMiniImportFilePath,
} from '../shared/transform/script'
import { transformTsToJs } from '../utils'

export function tsLoader(options: LoaderOptions): LoaderReturns {
  const ctx = {
    options,
    content: options.content,
  }

  /**
   * script
   */

  const scriptTransforms = [
    trsnaformUnMiniImportFilePath,
    removeUnMiniPolyfillImport,
  ]

  scriptTransforms.forEach((transform) => {
    const scriptRoot = parse(Lang.TypeScript, ctx.content).root()
    const { edits } = transform({
      node: scriptRoot,
      ctx,
    })
    ctx.content = scriptRoot.commitEdits(edits)
  })

  return [{
    content: transformTsToJs(ctx.content),
    ext: 'js',
  }]
}
