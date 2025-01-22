import * as babel from '@babel/core'

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
