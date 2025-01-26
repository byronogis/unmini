import type { BlockContents, LoaderPayload } from '@unmini/core'
import type { SFCBlock, SFCScriptBlock, SFCStyleBlock, SFCTemplateBlock } from '@vue/compiler-sfc'
import type { ResolvedVueLoaderOptions } from './types'
import { CoreError } from '@unmini/core'
import { parse as sfcParse } from '@vue/compiler-sfc'

export function getContext(payload: LoaderPayload<ResolvedVueLoaderOptions>): VueContext {
  const {
    template,
    script,
    styles,
    customBlocks,
  } = sfcParse(payload.content, payload.loader.parseOptions).descriptor

  const style = styles[0]
  const config = customBlocks.find(block => block.type === payload.loader.block.config)

  if (!config) {
    throw new CoreError('[@unmini/loader-vue] Missing config block content')
  }

  return {
    payload,
    blocks: {
      config,
      script,
      template,
      style,
    },
    blockContents: {
      template: template?.content || '',
      script: script?.content || 'export default {}',
      style: style?.content || '',
      config: config?.content || '',
    },
  }
}

export interface VueContext {
  payload: LoaderPayload<ResolvedVueLoaderOptions>
  /**
   * the raw sfc code block parsed by vue compiler
   *
   * 由 vue 编译器解析的 sfc 代码块
   */
  blocks: {
    config: SFCBlock
    script?: SFCScriptBlock | null
    template?: SFCTemplateBlock | null
    style?: SFCStyleBlock | null
  }
  /**
   * the content of each block that has been processed for nullable values
   *
   * 处理过空值的各代码块的内容
   */
  blockContents: BlockContents
}
