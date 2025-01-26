import type { VueTransformerOptions } from './types'
import { Lang, parse } from '@ast-grep/napi'
import {
  trsnaformUnMiniImportFilePath,
} from '@unmini/loader-ts'

export function keep(options: VueTransformerOptions): void {
  const {
    ctx,
  } = options

  /**
   * script
   */

  const scriptTransforms = [
    trsnaformUnMiniImportFilePath,
  ]

  scriptTransforms.forEach((transform) => {
    const scriptRoot = parse(Lang.TypeScript, ctx.blockContents.script).root()
    const { edits } = transform({
      node: scriptRoot,
      ctx,
    })
    ctx.blockContents.script = scriptRoot.commitEdits(edits)
  })
}
