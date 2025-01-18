import type { TransformerOptions, TransformerResult } from '../types'
import { Lang, parse } from '@ast-grep/napi'
import {
  expandAttributeSameNameShorthand,
} from './template'

export function preflight(options: TransformerOptions): TransformerResult {
  const {
    blocks,
  } = options

  const templateRoot = parse(Lang.Html, blocks.template).root()

  const shorthand = expandAttributeSameNameShorthand({ node: templateRoot })

  const templateResult = templateRoot.commitEdits(shorthand.edits)

  return {
    blocks: {
      ...blocks,
      template: templateResult,
    },
  }
}
