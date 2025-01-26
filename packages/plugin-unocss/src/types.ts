import type { BasicPluginOptions } from '@unmini/core'

export interface UnoCSSOptions extends BasicPluginOptions {
  /**
   * the path of the file to inject css output, relative to cwd
   *
   * 接受注入 css 的文件路径, 相对于工作目录
   *
   * @default outputDir/app.[platform.style]
   * @example 'dist/app.wxss'
   */
  injectFilePath?: string
  /**
   * the patterns to match files
   *
   * the working directory is srcDir in unmini config
   *
   * 匹配文件的 glob 模式
   *
   * 工作目录为 unmini 配置中的 srcDir
   *
   * @default unmini.patterns
   */
  patterns?: string[]
}

export type ResolvedUnoCSSOptions = Required<UnoCSSOptions>
