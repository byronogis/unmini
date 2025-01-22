import type { Edit, SgNode } from '@ast-grep/napi'
import type { Context } from './context'

export interface TransformerOptions {
  ctx: Context
}

export interface TransformOptions {
  node: SgNode
  ctx: Context
}

export interface TransformResult {
  edits: Edit[]
}
