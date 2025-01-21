import type { ResolvedConfig } from '@unmini/config'
import type { SetRequired } from 'type-fest'
import type { BlockContents, Platform, SourceType, TransformerResult } from './types'
import { resolveConfig } from '@unmini/config'
import { annotation } from './annotation'
import { FileExtensions } from './constant'
import { getContext } from './context'
import { weixin } from './platform/weixin'
import { preflight } from './preflight'

export * from './constant'
export * from './context'
export * from './errors'
export * from './types'

export function resolveOptions(options: CoreOptions): ResolvedCoreOptions {
  return {
    platform: 'weixin',
    type: 'component',
    resolvedConfig: resolveConfig(),
    ...options,
  }
}

export function core(_options: CoreOptions): CoreReturns {
  const options = resolveOptions(_options)
  const ctx = getContext(options)

  let result: TransformerResult | undefined

  /**
   * preflight transformer
   *
   * 预处理转换器
   */
  result = preflight({ ctx })

  /**
   * platform transformer
   *
   * 平台转换器
   */
  switch (options.platform) {
    case 'weixin':
      result = weixin({ ctx })
      break
    default:
      break
  }

  /**
   * annotation transformer
   *
   * 注解转换器
   */
  result = annotation({ ctx: { ...ctx, blockContents: result.blockContents } })

  return {
    extensions: FileExtensions[options.platform],
    ...result,
  } as CoreReturns
}

export interface CoreOptions {
  /**
   * content of sfc
   *
   * 单文件组件的内容
   */
  content: string
  /**
   * platform of miniprogram
   *
   * 小程序平台
   *
   * @default 'weixin'
   */
  platform?: Platform
  /**
   * content type of sfc
   *
   * 单文件组件的内容类型
   *
   * @default 'component'
   */
  type?: SourceType
  resolvedConfig?: ResolvedConfig
}

export type ResolvedCoreOptions = SetRequired<CoreOptions, 'platform' | 'type' | 'resolvedConfig'>

export interface CoreReturns extends TransformerResult {
  /**
   * extension of block content
   *
   * 代码块对应的文件扩展名
   */
  extensions?: Record<keyof BlockContents, string>
}
