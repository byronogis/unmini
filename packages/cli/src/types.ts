import type { Config, ResolvedConfig } from '@unmini/config'

interface BaseCLIOptions {
  /**
   * Watch mode
   * @default false
   */
  watch?: boolean
}

export type CliOptions = BaseCLIOptions & Config

export type ResolvedCliOptions = BaseCLIOptions & ResolvedConfig
