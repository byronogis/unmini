import type { LoaderOptions, LoaderReturns } from '..'
import type { BlockContents, TransformerOptions, TransformOptions } from '../../types'
import type { Context } from './context'
import { FileExtensions } from '../../constant'
import { annotation } from './annotation'
import { getContext } from './context'
import { weixin } from './platform/weixin'
import { preflight } from './preflight'

export function vueLoader(options: LoaderOptions): LoaderReturns {
  const ctx = getContext(options)

  /**
   * preflight transformer
   *
   * 预处理转换器
   */
  preflight({ ctx })

  /**
   * platform transformer
   *
   * 平台转换器
   */
  switch (options.resolvedConfig.platform) {
    case 'weixin':
      weixin({ ctx })
      break

    default:
      break
  }

  /**
   * annotation transformer
   *
   * 注解转换器
   */
  annotation({ ctx })

  return Object.entries(ctx.blockContents).map(([name, content]) => ({
    content,
    ext: FileExtensions[options.resolvedConfig.platform][name as keyof BlockContents],
  }))
}

export type VueTransformerOptions = TransformerOptions<Context>
export type VueTransformOptions = TransformOptions<Context>
