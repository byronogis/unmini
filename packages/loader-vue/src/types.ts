import type { Edit, SgNode } from '@ast-grep/napi'
import type { BasicLoaderOptions } from '@unmini/core'
import type { SFCParseOptions } from '@vue/compiler-sfc'
import type { SetRequiredDeep } from 'type-fest'
import type { VueContext } from './context'

export interface VueTransformerOptions {
  ctx: VueContext
}

export interface VueTransformOptions {
  node: SgNode
  ctx: VueContext
}

export interface VueTransformResult {
  edits: Edit[]
}

export interface VueLoaderOptions extends BasicLoaderOptions {
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

export interface ResolvedVueLoaderOptions extends SetRequiredDeep<
  VueLoaderOptions,
  | 'block' | 'block.config'
  | 'router' | 'router.prefix' | 'router.routesDir'
> {
  /**
   * Full path to the directory where the route file is stored
   *
   * 存放路由文件的目录的完整路径
   */
  vueRoutesDirFull: string
}
