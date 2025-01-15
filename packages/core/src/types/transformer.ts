import type { Edit, SgNode } from '@ast-grep/napi'

export interface TranssformerOptions {
  source: string
  platform: 'weixin'
}

export type TransformerResult = PlatformTransformerResult

export interface TransformResult {
  edits: Edit[]
  content: string
}

export interface PlatformTransformerOptions {
  template: SgNode
  // style: SgNode
  // script: SgNode
}

export interface PlatformTransformerResult {
  template: {
    content: string
  }
}
