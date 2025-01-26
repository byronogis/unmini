import type { SetRequired } from 'type-fest'
import type { LoaderReturns } from './loader'
import { loadConfig } from './config'
import { CoreContext } from './context'
import { loader } from './loader'

export async function resolveCoreOptions(options: CoreOptions): Promise<ResolvedCoreOptions> {
  if (!options.ctx) {
    const configs = await loadConfig()
    options.ctx = new CoreContext({ configs })
  }

  return options as ResolvedCoreOptions
}

export async function core(_options: CoreOptions): Promise<CoreReturns> {
  const options = await resolveCoreOptions(_options)

  return await loader(options)
}

export interface CoreOptions {
  /**
   * core context
   */
  ctx?: CoreContext
  /**
   * file path
   *
   * 一般为文件路径
   */
  id: string
  /**
   * content of file
   *
   * 文件内容
   */
  content: string
}

export type ResolvedCoreOptions = SetRequired<CoreOptions, 'ctx'>

export type CoreReturns = LoaderReturns
