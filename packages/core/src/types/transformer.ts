import type { Edit, SgNode } from '@ast-grep/napi'
import type { ResolvedCoreOptions } from '../'

/**
 * Base context for transformer
 */
export interface BaseContext {
  options: ResolvedCoreOptions
}

export interface TransformerOptions<T extends BaseContext = BaseContext> {
  ctx: T
}

export interface TransformOptions<T extends BaseContext = BaseContext> {
  node: SgNode
  ctx: T
}

export interface TransformResult {
  edits: Edit[]
}
