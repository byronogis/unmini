import type { SFCBlock, SFCScriptBlock, SFCStyleBlock, SFCTemplateBlock } from '@vue/compiler-sfc'
import type { BlockContents, ResolvedCoreOptions } from '../..'
import type { BaseContext } from '../../types/transformer'
import { parse as sfcParse } from '@vue/compiler-sfc'
import { CoreError } from '../../errors'

export function getContext(options: ResolvedCoreOptions): Context {
  const {
    template,
    script,
    styles,
    customBlocks,
  } = sfcParse(options.content, options.resolvedConfig.vue?.parseOptions).descriptor

  const style = styles[0]
  const config = customBlocks.find(block => block.type === options.resolvedConfig.block.config)

  if (!config) {
    throw new CoreError('[@unmini/core] Missing config block content')
  }

  return {
    options,
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

export interface Context extends BaseContext {
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
