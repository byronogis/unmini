import type { TransformerOptions, TransformerResult } from '../../../types'
import { Lang, parse } from '@ast-grep/napi'
import {
  expandAttributeSameNameShorthand,
} from './template'

export function preflight(options: TransformerOptions): TransformerResult {
  const {
    ctx,
  } = options

  const templateRoot = parse(Lang.Html, ctx.blockContents.template).root()

  const shorthand = expandAttributeSameNameShorthand({ node: templateRoot, ctx })

  const templateResult = templateRoot.commitEdits(shorthand.edits)

  return {
    blockContents: {
      ...ctx.blockContents,
      template: templateResult,
    },
  }
}
