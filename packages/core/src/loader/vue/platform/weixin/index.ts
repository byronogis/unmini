import type { TransformerOptions } from '../../../../types'
import { Lang, parse } from '@ast-grep/napi'
import {
  trsnaformDataAssignment,
  trsnaformDataDefine,
  trsnaformDataEvaluation,
  trsnaformExportDefault,
  trsnaformGlobalAPI,
  trsnaformPlatformAPI,
} from './script'
import {
  trsnaformAttributeBind,
} from './template'

export function weixin(options: TransformerOptions): void {
  const {
    ctx,
  } = options

  /**
   * template
   */

  const templateTransforms = [
    trsnaformAttributeBind,
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
