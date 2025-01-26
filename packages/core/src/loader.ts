import type { CoreContext, ResolvedCoreOptions } from '.'
import { CoreError } from './errors'

export async function loader(options: ResolvedCoreOptions): Promise<LoaderReturns> {
  const {
    id,
    ctx,
  } = options

  const _ext = id.split('.').at(-1)
  if (!_ext) {
    throw new CoreError('[@unmini/core] Missing file extension')
  }

  const results = await ctx.hooks.callHookWith(async (fnList, args) => {
    return await Promise.all(fnList.map((fn) => {
    // @ts-expect-error TODO see https://github.com/unjs/hookable/issues/87
      return fn(...args)
    }))
    // @ts-expect-error TODO see https://github.com/unjs/hookable/issues/87
  }, 'run-loader', ctx, options)

  return results.flat()
}

export function registerLoaders(ctx: CoreContext): void {
  const {
    loaders,
  } = ctx.config

  loaders.forEach((loader) => {
    const {
      key,
      options = {},
      handler,
    } = typeof loader === 'function' ? loader(ctx) : loader

    options.enabled = options.enabled ?? true

    if (!options.enabled) {
      return
    }

    if (ctx.registeredLoaders.has(key)) {
      throw new CoreError(`[@unmini/core] Loader key ${key} has been registered`)
    }

    // @ts-expect-error TODO see https://github.com/unjs/hookable/issues/87
    ctx.hooks.hook('run-loader', (_ctx, _options) => {
      return _options.id.endsWith(key)
        ? handler(_ctx, {
            ..._options,
            loader: options,
          })
        : []
    })

    ctx.registeredLoaders.set(key, options)
  })
}

export function defineLoader<T extends BasicLoaderOptions = BasicLoaderOptions>(loader: Loader<T>): Loader<T> {
  return loader
}

export interface LoaderPayload<T extends BasicLoaderOptions = BasicLoaderOptions> extends ResolvedCoreOptions {
  /**
   * the configuration of the current loader
   *
   * 指向当前 loader 的配置
   */
  loader: T
}

export type Loader<T extends BasicLoaderOptions = BasicLoaderOptions> =
  | LoaderPlain<T>
  | ((ctx: CoreContext) => LoaderPlain<T>)

export interface LoaderPlain<T extends BasicLoaderOptions = BasicLoaderOptions> {
  key: string
  options?: T
  handler: (cxt: CoreContext, payload: LoaderPayload<T>) => LoaderReturns
}

export type LoaderReturns = {
  /**
   * the transformed code content
   */
  content: string
  /**
   * the extension of the transformed file
   */
  ext: string
}[]

export interface BasicLoaderOptions {
  /**
   * whether to enable file loader
   *
   * 是否启用文件加载器
   *
   * @default true
   */
  enabled?: boolean
}
