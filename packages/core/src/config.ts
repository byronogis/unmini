import type { Arrayable, SetRequiredDeep } from 'type-fest'
import type { Loader, LoaderReturns } from './loader'
import type { Plugin } from './plugin'
import type { Platform } from './types'
import process from 'node:process'
import { loadConfig as _loadConfig } from 'c12'
import { defu } from 'defu'
import { resolve } from 'pathe'

export async function loadConfig<T extends Config = Config>(
  ...configs: T[]
): Promise<ResolvedConfig> {
  const { config } = await _loadConfig({
    name: 'unmini',
  })

  const resolvedConfig = resolveConfig(...configs, config)

  return resolvedConfig
}

export const defaultConfig: Config = {
  platform: 'weixin',
  patterns: [],
  subExtension: 'mini',
  outputDir: 'unmini-output',
  clear: false,
  transform: {
  },
  loaders: [],
  plugins: [],
}

export function resolveConfig(...configs: Config[]): ResolvedConfig {
  configs.push(defaultConfig)
  const config = defu<Config, Config[]>(configs.unshift(), ...configs)

  config.cwd ??= process.cwd()
  config.srcDir ??= config.cwd
  config.patterns = Array.from(new Set(config.patterns)).filter(Boolean)
  config.plugins = config.plugins?.flat() ?? []
  config.loaders = config.loaders?.flat() ?? []

  return {
    ...config,
    resolved: true,
    outputDirFull: resolve(config.cwd, config.outputDir!),
    srcDirFull: resolve(config.cwd, config.srcDir),
  } as ResolvedConfig
}

export interface Config {
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
   * determines the working directory of patterns
   *
   * 源码目录
   *
   * 决定了 patterns 工作目录
   *
   * @default cwd
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
     * control the behavior of the output
     *
     * 输出行为
     */
    output?: {
      /**
       * whether to output the file
       *
       * can be a regular expression, or a function
       *
       * 文件是否需要输出
       *
       * @default []
       */
      exclude?: (RegExp | ((options: LoaderReturns[number] & { id: string }) => boolean))[]
    }
  }
  /**
   * loaders
   */
  loaders?: Arrayable<Loader<any>>[]
  /**
   * plugins
   */
  plugins?: Arrayable<Plugin>[]
}

export interface ResolvedConfig extends SetRequiredDeep<
  Config,
  | 'patterns' | 'subExtension'
  | 'cwd' | 'srcDir' | 'outputDir' | 'clear'
  | 'platform'
  | 'transform'
> {
  /**
   * whether the config has been resolved
   *
   * 配置是否已经被解析
   */
  resolved: true
  /**
   * loaders after flattening
   *
   * 扁平化后的加载器列表
   */
  loaders: Loader[]
  /**
   * plugins after flattening
   *
   * 扁平化后的插件列表
   */
  plugins: Plugin[]
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
