import type { Edit, SgNode } from '@ast-grep/napi'
import type { BlockContents } from '.'
import type { Context } from '..'

export interface TransformerOptions {
  ctx: Context
}

export interface TransformerResult {
  /**
   * the transformed code block content
   *
   * 转换后的代码块
   */
  blockContents: BlockContents
}

export interface TransformOptions {
  node: SgNode
  ctx: Context
}

export interface TransformResult {
  edits: Edit[]
}
