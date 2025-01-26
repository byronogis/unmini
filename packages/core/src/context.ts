import type { Hookable } from 'hookable'
import type { Arrayable } from 'type-fest'
import type { Config, ResolvedConfig } from './config'
import type { Hooks } from './hooks'
import type { LoaderPlain } from './loader'
import type { Plugin } from './plugin'
import { resolveConfig } from './config'
import { resolveHooks } from './hooks'
import { registerLoaders } from './loader'
import { registerPlugins } from './plugin'

export class CoreContext {
  config: ResolvedConfig
  hooks: Hookable<Hooks>
  registeredPlugins: Map<Plugin['key'], Plugin['options']> = new Map()
  registeredLoaders: Map<LoaderPlain['key'], LoaderPlain['options']> = new Map()

  constructor(options: ContextOptions) {
    const _configs = [options.configs].flat(2)
    // @ts-expect-error resolved poperty is not defined in Config but in ResolvedConfig
    this.config = _configs[0].resolved
      ? _configs[0] as ResolvedConfig
      : resolveConfig(..._configs)

    this.hooks = resolveHooks(this.config)

    /**
     * register plugins
     */
    registerPlugins(this)

    /**
     * register loaders
     */
    registerLoaders(this)
  }
}

interface ContextOptions {
  configs: ResolvedConfig | Arrayable<Config>
}
