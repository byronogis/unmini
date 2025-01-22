import type { VueTransformerOptions } from '..'
import { transformTsToJs } from '../../../utils'

export function annotation(options: VueTransformerOptions): void {
  const {
    ctx,
  } = options

  if (ctx.blocks.script?.lang === 'ts') {
    const code = transformTsToJs(ctx.blockContents.script)
    ctx.blockContents.script = code || ''
  }
}
