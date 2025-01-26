/* eslint-disable perfectionist/sort-exports */
import type { Config } from '@unmini/core'

export * from '@unmini/cli'
export * from '@unmini/core'
export { unmini as polyfill } from '@unmini/polyfill'

/**
 * loaders
 */
export { default as loaderTS } from '@unmini/loader-ts'
export { default as loaderVue } from '@unmini/loader-vue'

/**
 * plugins
 */
export { default as pluginUnoCSS } from '@unmini/plugin-unocss'

export function defineConfig(config: Config): Config {
  return config
}
