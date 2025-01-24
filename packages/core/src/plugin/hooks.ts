import type { Hookable } from 'hookable'
import type { BasicPluginOptions, Plugin } from '.'
import type { ResolvedConfig } from '../config'
import type { Context } from '../context'
import { createHooks } from 'hookable'

export function resolveHooks(config: ResolvedConfig): Hookable<Hooks> {
  const hooks = createHooks<Hooks>()

  config.plugins.forEach((plugin: Plugin) => {
    plugin.hooks && hooks.addHooks(plugin.hooks)
  })

  return hooks
}

export interface Hooks<T extends BasicPluginOptions = BasicPluginOptions> {
  'pre-inject-plugin-options': (cxt: Context, options: Plugin<T>['options']) => Plugin<T>['options']
  'post-output': (cxt: Context) => void
}

export type HookKeys = keyof Hooks
