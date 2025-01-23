import type { VueTransformerOptions } from '../../'
import { Lang, parse } from '@ast-grep/napi'
import {
  transformEmit,
  transformPropertyDefine,
  transformPropertyEvaluation,
  trsnaformDataAssignment,
  trsnaformDataDefine,
  trsnaformDataEvaluation,
  trsnaformExportDefault,
  trsnaformGlobalAPI,
  trsnaformPlatformAPI,
} from './script'
import {
  transformElementName,
  transformVBind,
  transformVFor,
  transformVIf,
  transformVModel,
  transformVOn,
  transformVSlot,
  transformVSlotTagName,
} from './template'

export function weixin(options: VueTransformerOptions): void {
  const {
    ctx,
  } = options

  /**
   * template
   */

  const templateTransforms = [
    transformVIf,
    transformVFor,
    transformVModel,
    transformVBind,
    transformVOn,
    transformVSlot,
    transformVSlotTagName,
    transformElementName, // order sensitive
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
    trsnaformGlobalAPI,
    trsnaformPlatformAPI,
    transformPropertyDefine,
    transformPropertyEvaluation,
    transformEmit,
    trsnaformDataDefine,
    trsnaformDataEvaluation,
    trsnaformDataAssignment,
    trsnaformExportDefault,
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
