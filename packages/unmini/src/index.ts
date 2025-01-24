import type { Config } from '@unmini/core'

export * from '@unmini/cli'
export * from '@unmini/config'
export * from '@unmini/core'
export {
  default as pluginUnoCSS,
} from '@unmini/plugin-unocss'

export {
  unmini as polyfill,
} from '@unmini/polyfill'

export function defineConfig(config: Config): Config {
  return config
}
