import type { LoaderOptions, LoaderReturns, Platform } from '@unmini/core'
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
  platform: 'weixin',
  patterns: [],
  subExtension: 'mini',
  outputDir: 'unmini-output',
  clear: false,
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
  config.patterns = Array.from(new Set(config.patterns))

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
   * the platform of miniprogram
   *
   * 小程序平台
   *
   * @default 'weixin'
   */
  platform?: Platform & string
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
   * sub extension, recognize files that need to be converted
   *
   * e.g. `page.mini.vue` `utils.mini.ts`
   *
   * 子扩展名, 识别需要转换文件
   *
   * patterns 的结果中不包含子扩展名的文件将被直接复制
   *
   * @default 'mini'
   */
  subExtension?: string
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
     * custom converters
     *
     * 自定义转换器
     */
    loaders?: Record<string, (options: LoaderOptions) => LoaderReturns>
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
  | 'block' | 'block.config' | 'patterns' | 'subExtension'
  | 'cwd' | 'srcDir' | 'outputDir' | 'clear'
  | 'platform'
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
}
