import type { Edit, SgNode } from '@ast-grep/napi'
import type { BasicLoaderOptions, LoaderPayload } from '@unmini/core'

export interface TSLoaderOptions extends BasicLoaderOptions {
  // ...
}

export interface TSContext {
  payload: LoaderPayload<TSLoaderOptions>
}

export interface TSTransformOptions {
  node: SgNode
  ctx: TSContext
}

export interface TSTransformResult {
  edits: Edit[]
}
