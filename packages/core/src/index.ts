import type { ResolvedConfig } from '@unmini/config'
import type { SetRequired } from 'type-fest'
import type { LoaderReturns } from './loader'
import { resolveConfig } from '@unmini/config'
import { loader } from './loader'

export * from './constant'
export * from './errors'
export * from './loader/vue/context'
export * from './types'

export function resolveOptions(options: CoreOptions): ResolvedCoreOptions {
  return {
    resolvedConfig: resolveConfig(),
    ...options,
  }
}

export function core(_options: CoreOptions): CoreReturns {
  const options = resolveOptions(_options)

  return loader(options)
}

export interface CoreOptions {
  id: string
  resolvedConfig?: ResolvedConfig
  /**
   * content of file
   *
   * 单文件组件的内容
   */
  content: string
}

export type ResolvedCoreOptions = SetRequired<CoreOptions, 'resolvedConfig'>

export type CoreReturns = LoaderReturns
