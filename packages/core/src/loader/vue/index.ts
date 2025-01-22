import type { LoaderOptions, LoaderReturns } from '..'
import type { BlockContents, TransformerResult } from '../../types'
import { FileExtensions } from '../../constant'
import { annotation } from './annotation'
import { getContext } from './context'
import { weixin } from './platform/weixin'
import { preflight } from './preflight'

export function vueLoader(options: LoaderOptions): LoaderReturns {
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
  switch (options.resolvedConfig.platform) {
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

  return Object.entries(result.blockContents).map(([name, content]) => ({
    content,
    ext: FileExtensions[options.resolvedConfig.platform][name as keyof BlockContents],
  }))
}
