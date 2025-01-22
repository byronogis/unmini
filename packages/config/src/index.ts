import type { Config, ResolvedConfig } from '@unmini/core'
import { resolveConfig } from '@unmini/core'
import { loadConfig as _loadConfig } from 'c12'

export async function loadConfig<T extends Config = Config>(
  ...configs: T[]
): Promise<ResolvedConfig> {
  const { config } = await _loadConfig({
    name: 'unmini',
  })

  const resolvedConfig = resolveConfig(...configs, config)

  return resolvedConfig
}
