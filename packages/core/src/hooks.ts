import type { Hookable } from 'hookable'
import type { ResolvedConfig } from './config'
import type { CoreContext } from './context'
import type { ResolvedCoreOptions } from './core'
import type { LoaderReturns } from './loader'
import type { BasicPluginOptions, Plugin } from './plugin'
import { createHooks } from 'hookable'

export function resolveHooks(config: ResolvedConfig): Hookable<Hooks> {
  const hooks = createHooks<Hooks>()

  config.plugins.forEach((plugin: Plugin) => {
    plugin.hooks && hooks.addHooks(plugin.hooks)
  })

  return hooks
}

export interface Hooks<T extends BasicPluginOptions = BasicPluginOptions> {
  'pre-inject-plugin-options': (cxt: CoreContext, options: Plugin<T>['options']) => Plugin<T>['options']
  'post-output': (cxt: CoreContext) => void
  'run-loader': (cxt: CoreContext, option: ResolvedCoreOptions) => LoaderReturns
}

export type HookKeys = keyof Hooks
