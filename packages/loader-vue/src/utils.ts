import type { VueTransformOptions } from './types'
import { splitAtFirstChar } from '@unmini/shared'
import { join, parse, relative } from 'pathe'

/**
 * split vue directive
 *
 * name:argument.modifier -> [name, argument, [modifier]]
 * name:argument -> [name, argument, []]
 * name -> [name, undefined, []]
 *
 * @example
 * v-on:click.stop.prevent -> ['v-on', 'click', ['stop', 'prevent']]
 *
 * @see https://vuejs.org/guide/essentials/template-syntax.html#modifiers
 */
export function resolveVueDirective(derictive: string): [string, string | undefined, string[]] {
  const [name, rest] = splitAtFirstChar(derictive, ':')
  const [arg, ...modifiers] = rest?.split('.') || []
  return [name, arg, modifiers]
}

/**
 * transform unplugin-vue-router path to miniprogram path
 *
 * 转换 unplugin-vur-router 的路径为小程序路径
 */
export function resolveVueRoutePath(path: string, options: VueTransformOptions): string {
  const {
    id: file,
    loader: {
      router: {
        prefix,
      },
      vueRoutesDirFull,
    },
  } = options.ctx.payload

  /**
   * remove prefix
   */
  if (prefix && path.startsWith(prefix)) {
    path = path.substring(prefix.length)
  }

  /**
   * the full path of the route(file)
   *
   * 路由(文件)的完整路径
   */
  path = join(vueRoutesDirFull, path)

  const filePath = parse(file).dir

  const relativePath = relative(filePath, path)

  return relativePath
}
