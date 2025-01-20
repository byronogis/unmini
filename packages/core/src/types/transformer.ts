import type { Edit, SgNode } from '@ast-grep/napi'
import type { BlockContents, Platform } from '.'

export interface TransformerOptions {
  /**
   * 代码块
   */
  blocks: BlockContents
  /**
   * 小程序平台
   */
  platform?: Platform
}

export interface TransformerResult {
  /**
   * 转换后的代码块
   */
  blocks: BlockContents
  /**
   * 代码块对应的文件扩展名
   */
  extensions?: Record<keyof BlockContents, string>
}

export interface TransformOptions {
  node: SgNode
}

export interface TransformResult {
  edits: Edit[]
  // content: string
}
