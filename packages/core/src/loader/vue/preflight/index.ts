import type { TransformerOptions } from '../../../types'
import { Lang, parse } from '@ast-grep/napi'
import {
  expandAttributeSameNameShorthand,
} from './template'

export function preflight(options: TransformerOptions): void {
  const {
    ctx,
  } = options

  /**
   * template
   */

  const templateTransforms = [
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
}
