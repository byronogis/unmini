import type { SFCParseOptions } from '@vue/compiler-sfc'
import type { SetRequiredDeep } from 'type-fest'
import process from 'node:process'
import { loadConfig as _loadConfig } from 'c12'
import { defu } from 'defu'
import { resolve } from 'pathe'

export const defaultConfig: Config = {
  block: {
    config: 'config',
  },
  patterns: [],
  extension: '.mini.vue',
  outputDir: 'unmini-output',
  clear: false,
  transform: {
    exclude: [],
  },
}

export async function loadConfig<T extends Config = Config>(
  ...configs: T[]
): Promise<ResolvedConfig> {
  const { config } = await _loadConfig({
    name: 'unmini',
  })

  const resolvedConfig = resolveConfig(...configs, config)

  return resolvedConfig
}

export function resolveConfig(...configs: Config[]): ResolvedConfig {
  configs.push(defaultConfig)
  const config = defu<Config, Config[]>(configs.unshift(), ...configs)

  config.cwd ??= process.cwd()
  config.srcDir ??= config.cwd

  return {
    ...config,
    outputDirFull: resolve(config.cwd, config.outputDir!),
    srcDirFull: resolve(config.cwd, config.srcDir),
  } as ResolvedConfig
}

export interface Config {
  /**
   * 代码块配置
   */
  block?: {
    /**
     * the name of the config block
     *
     * 配置项内容的代码块名称
     *
     * @default 'config'
     */
    config?: string
  }
  /**
   * the patterns to match files
   *
   * powered by [tinyglobby](https://github.com/SuperchupuDev/tinyglobby#readme)
   *
   * 匹配文件的 glob 模式
   *
   * @default []
   */
  patterns?: string[]
  /**
   * the extension of the single file
   *
   * 单文件扩展名
   *
   * @default '.mini.vue'
   */
  extension?: string
  /**
   * work directory
   *
   * 工作目录
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * source directory
   *
   * 源码目录
   */
  srcDir?: string
  /**
   * output directory
   *
   * 输出目录
   *
   * @default 'unmini-output'
   */
  outputDir?: string
  /**
   * whether to clear the output directory first
   *
   * 是否先清空输出目录
   *
   * @default false
   */
  clear?: boolean
  /**
   * the options for transform
   *
   * 转换配置
   */
  transform?: {
    /**
     * files will be written directly without conversion
     *
     * can be a regular expression, or a function
     *
     * 文件直接复制而不经过转换
     *
     * @default []
     */
    exclude?: (RegExp | (({ id }: { id: string }) => boolean))[]
  }
  /**
   * the options for vue
   *
   * vue 配置
   */
  vue?: {
    /**
     * the options for vue parser
     *
     * vue 解析器配置
     */
    parseOptions?: SFCParseOptions
  }
  // [key: string]: any
}

export interface ResolvedConfig extends SetRequiredDeep<
  Config,
  | 'block' | 'block.config' | 'patterns' | 'extension' | 'transform' | 'transform.exclude'
  | 'cwd' | 'srcDir' | 'outputDir' | 'clear'
> {
  /**
   * Full path to output directory
   *
   * 输出目录的完整路径
   */
  outputDirFull: string
  /**
   * Full path to source directory
   *
   * 源码目录的完整路径
   */
  srcDirFull: string
  /**
   * Whether the configuration is resolved
   */
  resolved: true
}
