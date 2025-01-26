import type { VueTransformerOptions } from '../types'
import { Lang, parse } from '@ast-grep/napi'
import {
  removeUnMiniPolyfillImport,
  trsnaformUnMiniImportFilePath,
} from '@unmini/loader-ts'
import {
  expandAttributeSameNameShorthand,
  expandDerictiveShorthand,
} from './template'

export function preflight(options: VueTransformerOptions): void {
  const {
    ctx,
  } = options

  /**
   * template
   */

  const templateTransforms = [
    expandDerictiveShorthand, // order sensitive
    expandAttributeSameNameShorthand,
  ]

  templateTransforms.forEach((transform) => {
    const templateRoot = parse(Lang.Html, ctx.blockContents.template).root()
    const { edits } = transform({
      node: templateRoot,
      ctx,
    })
    ctx.blockContents.template = templateRoot.commitEdits(edits)
  })

  /**
   * script
   */

  const scriptTransforms = [
    trsnaformUnMiniImportFilePath,
    removeUnMiniPolyfillImport,
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
