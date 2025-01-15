import type { Edit, SgNode } from '@ast-grep/napi'
import type {
  PlatformTransformerOptions,
  PlatformTransformerResult,
} from '../../types/transformer'
import {
  trsnaformAttributeBind,
} from './template'

export function transformer({
  template,
}: PlatformTransformerOptions): PlatformTransformerResult {
  return {
    template: {
      content: trsnaformAttributeBind(template).content,
    },
  }
}
