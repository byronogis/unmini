import type { Edit, SgNode } from '@ast-grep/napi'
import type { BlockContents } from '.'

export interface TransformerOptions {
  blocks: BlockContents
  platform?: 'weixin'
}

export interface TransformerResult {
  blocks: BlockContents
}
export interface TransformOptions {
  node: SgNode
}

export interface TransformResult {
  edits: Edit[]
  // content: string
}
