import type { TransformerOptions, TransformerResult } from '../../types'
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

export function weixin(options: TransformerOptions): TransformerResult {
  const {
    ctx,
  } = options

  /**
   * template
   */

  let templateResult = ctx.blockContents.template

  const templateTransforms = [
    trsnaformAttributeBind,
  ]

  templateTransforms.forEach((transform) => {
    const templateRoot = parse(Lang.Html, templateResult).root()
    const { edits } = transform({
      node: templateRoot,
      ctx,
    })
    templateResult = templateRoot.commitEdits(edits)
  })

  /**
   * script
   */

  let scriptResult = ctx.blockContents.script

  const scriptTransforms = [
    trsnaformGlobalAPI,
    trsnaformPlatformAPI,
    trsnaformDataDefine,
    trsnaformDataEvaluation,
    trsnaformDataAssignment,
    trsnaformExportDefault,
  ]

  scriptTransforms.forEach((transform) => {
    const scriptRoot = parse(Lang.JavaScript, scriptResult).root()
    const { edits } = transform({
      node: scriptRoot,
      ctx,
    })
    scriptResult = scriptRoot.commitEdits(edits)
  })

  return {
    blockContents: {
      ...ctx.blockContents,
      template: templateResult,
      script: scriptResult,
    },
  }
}
