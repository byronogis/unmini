import type { Context } from '../context'
import type { Hooks } from './hooks'
import { CoreError } from '../errors'

export * from './hooks'

export function registerPlugins(ctx: Context): void {
  const {
    plugins,
  } = ctx.config

  plugins.forEach((plugin) => {
    const {
      key,
      options = {},
      hooks,
    } = plugin

    options.enabled = options.enabled ?? true

    const _options = hooks?.['pre-inject-plugin-options']?.(ctx, options) ?? options

    if (!_options.enabled) {
      return
    }

    if (!/^[a-z0-9-_]+$/.test(key)) {
      throw new CoreError(`[unmini] Plugin key ${key} is illegal, only a-z0-9-_ are allowed`)
    }

    if (ctx.registeredPlugins.has(key)) {
      throw new CoreError(`[unmini] Plugin key ${key} has been registered`)
    }

    hooks && ctx.hooks.addHooks(hooks)

    ctx.registeredPlugins.set(key, _options)
  })
}

export function definePlugin<T extends BasicPluginOptions = BasicPluginOptions>(plugin: Plugin<T>): Plugin<T> {
  return plugin
}

export interface Plugin<T extends BasicPluginOptions = BasicPluginOptions> {
  key: string
  options?: T
  hooks?: Partial<Hooks<T>>
}

export interface BasicPluginOptions {
  /**
   * whether to enable plugin
   *
   * 是否启用插件
   *
   * @default true
   */
  enabled?: boolean
}
