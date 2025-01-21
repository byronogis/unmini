import type { TransformerOptions, TransformerResult } from '../types'
import * as babel from '@babel/core'

export function annotation(options: TransformerOptions): TransformerResult {
  const {
    ctx,
  } = options

  /**
   * use babel to transform ts to js
   *
   * 使用 babel 转换 ts 到 js
   */
  if (ctx.blocks.script?.lang === 'ts') {
    const res = babel.transformSync(ctx.blockContents.script, {
      presets: ['@babel/preset-typescript'],
      filename: 'script.ts',
    })

    ctx.blockContents.script = res?.code || ''
  }

  return {
    blockContents: ctx.blockContents,
  }
}
