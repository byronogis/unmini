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
