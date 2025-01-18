import type { TransformerOptions, TransformerResult } from '../../types'
import { Lang, parse } from '@ast-grep/napi'
import {
  trsnaformAttributeBind,
} from './template'

export function weixin(options: TransformerOptions): TransformerResult {
  const {
    blocks,
  } = options

  const templateRoot = parse(Lang.Html, blocks.template).root()

  const attributeBind = trsnaformAttributeBind({ node: templateRoot })

  const templateResult = templateRoot.commitEdits(attributeBind.edits)

  return {
    blocks: {
      ...blocks,
      template: templateResult,
    },
  }
}
