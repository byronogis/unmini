import type { TransformOptions } from '../types/transformer'
import * as babel from '@babel/core'
import { join, parse, relative } from 'pathe'

export function transformTsToJs(code: string): string {
  /**
   * use babel to transform ts to js
   *
   * 使用 babel 转换 ts 到 js
   */

  const res = babel.transformSync(code, {
    presets: [
      ['@babel/preset-typescript', {
        // onlyRemoveTypeImports: true,
      }],
    ],
    filename: 'script.ts',
  })

  return res?.code || ''
}

export function splitAtFirstChar(str: string, char: string): [string, string | undefined] {
  const index = str.indexOf(char)
  if (index === -1) {
    return [str, undefined]
  }
  return [
    str.substring(0, index),
    str.substring(index + 1),
  ]
}

/**
 * split vue directive
 *
 * name:argument.modifier -> [name, argument, [modifier]]
 * name:argument -> [name, argument, []]
 * name -> [name, undefined, []]
 *
 * @example
 * v-on:click.stop.prevent -> ['on', 'click', ['stop', 'prevent']]
 *
 * @see https://vuejs.org/guide/essentials/template-syntax.html#modifiers
 */
export function resolveVueDirective(derictive: string): [string, string | undefined, string[]] {
  const [name, rest] = splitAtFirstChar(derictive, ':')
  const [arg, ...modifiers] = rest?.split('.') || []
  return [name, arg, modifiers]
}

/**
 * resolve code string to executable code
 */
export function resolveCode(code: string): any {
  // eslint-disable-next-line no-new-func
  return new Function(`return ${code}`)()
}

/**
 * transform unplugin-vue-router path to miniprogram path
 *
 * 转换 unplugin-vur-router 的路径为小程序路径
 */
export function resolveRoutePath(path: string, options: TransformOptions): string {
  const {
    id: file,
    resolvedConfig: {
      transform: {
        router: {
          prefix,
        },
      },
      routesDirFull,
    },
  } = options.ctx.options

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
  path = join(routesDirFull, path)

  const filePath = parse(file).dir

  const relativePath = relative(filePath, path)

  return relativePath
}
