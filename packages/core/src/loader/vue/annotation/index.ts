import type { TransformerOptions } from '../../../types'
import { transformTsToJs } from '../../../utils'

export function annotation(options: TransformerOptions): void {
  const {
    ctx,
  } = options

  if (ctx.blocks.script?.lang === 'ts') {
    const code = transformTsToJs(ctx.blockContents.script)
    ctx.blockContents.script = code || ''
  }
}
