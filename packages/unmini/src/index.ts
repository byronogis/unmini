import type { Config } from '@unmini/config'

export * from '@unmini/cli'
export * from '@unmini/config'
export * from '@unmini/core'
export * from '@unmini/polyfill'

export function defineConfig(config: Config): Config {
  return config
}
