export interface CliOptions {
  /**
   * Current working directory
   * @default process.cwd()
   */
  cwd?: string
  /**
   * Glob pattern to match files
   */
  patterns?: Array<string>
  /**
   * Output directory for transformed files
   * @default 'unmini-output'
   */
  outDir?: string
  /**
   * Source directory to resolve patterns
   * @default cwd
   */
  srcDir?: string
  /**
   * Watch mode
   * @default false
   */
  watch?: boolean
  /**
   * Clear output directory before writing
   * @default false
   */
  clear?: boolean
  [key: string]: unknown
}

export type ResolvedCliOptions = Required<CliOptions> & {
  /**
   * Full path to output directory
   */
  outDirFull: string
  /**
   * Full path to source directory
   */
  srcDirFull: string
}
