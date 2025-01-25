import type { SFCParseOptions } from '@vue/compiler-sfc'
import type { Arrayable, SetRequiredDeep } from 'type-fest'
import type { LoaderOptions, LoaderReturns, Platform } from '.'
import type { Plugin } from './plugin'
import process from 'node:process'
import { defu } from 'defu'
import { resolve } from 'pathe'

export const defaultConfig: Config = {
  platform: 'weixin',
  patterns: [],
  subExtension: 'mini',
  outputDir: 'unmini-output',
  clear: false,
  transform: {
  },
  vue: {
    block: {
      config: 'config',
    },
    router: {
      prefix: '',
      routesDir: 'pages',
    },
  },
  plugins: [],
}

export function resolveConfig(...configs: Config[]): ResolvedConfig {
  configs.push(defaultConfig)
  const config = defu<Config, Config[]>(configs.unshift(), ...configs)

  config.cwd ??= process.cwd()
  config.srcDir ??= config.cwd
  config.patterns = Array.from(new Set(config.patterns)).filter(Boolean)
  config.plugins = config.plugins?.flat() ?? []

  return {
    ...config,
    resolved: true,
    outputDirFull: resolve(config.cwd, config.outputDir!),
    srcDirFull: resolve(config.cwd, config.srcDir),
    vueRoutesDirFull: resolve(config.cwd, config.srcDir, config.vue!.router!.routesDir!),
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
   * the options for vue
   *
   * vue 配置
   */
  vue?: {
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
    router?: {
      /**
       * 指定的前缀会在解析时移除, 比如可以用于当在 vite 中指定 base 时
       *
       * @default ''
       */
      prefix?: string
      /**
       * directory to store the route file, relative to srcDir
       *
       * 存放路由文件的目录, 相对于 srcDir
       *
       * @default pages
       */
      routesDir?: string
    }
    /**
     * the options for vue parser
     *
     * vue 解析器配置
     */
    parseOptions?: SFCParseOptions
  }
  /**
   * custom converters
   *
   * 自定义转换器
   */
  loaders?: Record<string, (options: LoaderOptions) => LoaderReturns>
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
  | 'vue' | 'vue.block' | 'vue.block.config' | 'vue.router' | 'vue.router.prefix' | 'vue.router.routesDir'
> {
  /**
   * whether the config has been resolved
   *
   * 配置是否已经被解析
   */
  resolved: true
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
  /**
   * Full path to the directory where the route file is stored
   *
   * 存放路由文件的目录的完整路径
   */
  vueRoutesDirFull: string
}
