import type { BlockContents, CoreContext, Loader } from '@unmini/core'
import type { ResolvedVueLoaderOptions, VueLoaderOptions } from './types'
import { resolve } from 'node:path'
import { defineLoader, FileExtensions } from '@unmini/core'
import { defu } from 'defu'
import { annotation } from './annotation'
import { getContext } from './context'
import { weixin } from './platform/weixin'
import { preflight } from './preflight'

export * from './context'
export * from './types'
export * from './utils'

function resolveVueLoaderOptions({ config }: CoreContext, options: VueLoaderOptions): ResolvedVueLoaderOptions {
  const _options = defu(options, {
    block: {
      config: 'config',
    },
    router: {
      prefix: '',
      routesDir: 'pages',
    },
  })

  return {
    ..._options,
    vueRoutesDirFull: resolve(config.cwd, config.srcDir, _options.router!.routesDir!),
  }
}

export default function vue(options: VueLoaderOptions = {}): Loader<ResolvedVueLoaderOptions> {
  return defineLoader<ResolvedVueLoaderOptions>((coreCTX) => {
    const config = coreCTX.config
    const resolvedOptions = resolveVueLoaderOptions(coreCTX, options)

    return {
      key: '.vue',
      options: resolvedOptions,
      handler(_, payload) {
        const ctx = getContext(payload)

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
        switch (config.platform) {
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
          ext: FileExtensions[config.platform][name as keyof BlockContents],
        }))
      },
    }
  })
}
