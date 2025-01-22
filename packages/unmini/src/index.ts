import type { Config } from '@unmini/config'

export * from '@unmini/cli'
export * from '@unmini/config'
export * from '@unmini/core'
export {
  unmini as polyfill,
} from '@unmini/polyfill'

export function defineConfig(config: Config): Config {
  return config
}
