import type { BlockContents, TransformerResult } from './types'
import { parse as sfcParse } from '@vue/compiler-sfc'
import { weixin } from './platform/weixin'
import { preflight } from './preflight'

export function core(options: CoreOptions): CoreReturns {
  const {
    content,
    platform = 'weixin',
  } = options

  const {
    template,
    script,
    // scriptSetup,
    styles,
    customBlocks,
  } = sfcParse(content).descriptor

  const style = styles[0]
  const config = customBlocks.find(block => block.type === 'config')

  const blocks: BlockContents = {
    template: template?.content || '',
    script: script?.content || '',
    style: style.content || '',
    config: config?.content || '',
  }

  // preflight transformer
  const preflighted = preflight({ blocks })

  // platform transformer
  let platformResult: TransformerResult | undefined
  switch (platform) {
    case 'weixin':
      platformResult = weixin({
        blocks: preflighted.blocks,
      })
      break
    default:
      platformResult = {
        blocks,
      }
      break
  }

  return {
    blocks: platformResult.blocks,
  }
}

export interface CoreOptions {
  content: string
  /**
   * 小程序平台
   * @default 'weixin'
   */
  platform?: 'weixin'
}

export interface CoreReturns {
  blocks: BlockContents
}
