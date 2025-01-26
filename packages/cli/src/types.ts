import type { Config, ResolvedConfig } from '@unmini/core'

interface BaseCLIOptions {
  /**
   * Watch mode
   * @default false
   */
  watch?: boolean
}

export type CliOptions = BaseCLIOptions & Config

export type ResolvedCliOptions = BaseCLIOptions & ResolvedConfig
