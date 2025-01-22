import type { Edit, NapiConfig } from '@ast-grep/napi'
import type { VueTransformOptions } from '../../'
import type { Platform, TransformResult } from '../../../../types'
import { PlatformAPIs } from '../../../../constant'

/**
 * @example
 * `unmini.mini.API` -> `wx.API`
 */
export function trsnaformPlatformAPI(options: VueTransformOptions): TransformResult {
  const {
    node,
    ctx,
  } = options

  const match = 'API'

  const matcher: NapiConfig = {
    rule: {
      pattern: `unmini.mini.$${match}`,
      kind: 'member_expression',
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const text = _node.getMatch(match)?.text()
    if (!text) {
      return undefined
    }

    const _platform = ctx.options.resolvedConfig.platform as Platform

    return _node.replace(`${PlatformAPIs[_platform]}.${text}`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `unmini.global.getApp()` -> `getApp()`
 */
export function trsnaformGlobalAPI(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'API'

  const matcher: NapiConfig = {
    rule: {
      pattern: `unmini.global.$${match}`,
      kind: 'member_expression',
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const text = _node.getMatch(match)?.text()
    if (!text) {
      return undefined
    }

    return _node.replace(text)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `data() { return { a: 1 } }` -> `data: { a: 1 }`
 */
export function trsnaformDataDefine(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  // const match = 'DATA'

  const matcher: NapiConfig = {
    rule: {
      regex: '^data',
      kind: 'method_definition',
      inside: {
        kind: 'object',
        inside: {
          kind: 'export_statement',
        },
      },
    },
  }

  const dataNode = node.find(matcher)
  const dataReturnNode = dataNode?.find({
    rule: {
      kind: 'object',
      inside: {
        kind: 'return_statement',
      },
    },
  })

  const text = dataReturnNode?.text()

  if (!text) {
    return {
      edits: [],
    }
  }

  const edits = [dataNode!.replace(`data: ${text}`)] as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `console.log(this.$data.a)` -> `console.log(this.data.a)`
 */
export function trsnaformDataEvaluation(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'DATA'

  const matcher: NapiConfig = {
    rule: {
      pattern: `$${match}`,
      // TODO work in playground but not in api
      // regex: '^this.\$data',
      kind: 'member_expression',
      not: {
        any: [
          {
            nthChild: 1,
            inside: {
              kind: 'assignment_expression',
            },
          },
          {
            inside: {
              kind: 'member_expression',
            },
          },
        ],
      },
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const text = _node.getMatch(match)?.text()
    if (!text || !text.startsWith('this.$data')) {
      return undefined
    }
    return _node.replace(text.replace(/^this\.\$data/, 'this.data'))
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `this.$data.a = 1` -> `this.setData({ a: 1 })`
 * `this.$data.a = 1; this.$data.b = 2` -> `this.setData({ a: 1, b: 2 })`
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips/runtime_setData.html
 */
export function trsnaformDataAssignment(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'DATA'

  const matcher: NapiConfig = {
    rule: {
      pattern: `$${match}`,
      // TODO work in playground but not in api
      // regex: '^this.\$data',
      kind: 'expression_statement',
      has: {
        kind: 'assignment_expression',
      },
    },
  }

  const handledIndex: number[] = []

  const edits = node.findAll(matcher).reduce((acc, cur, index, arr) => {
    const text = cur.getMatch(match)?.text()
    if (!text || !text.startsWith('this.$data')) {
      return acc
    }

    if (handledIndex.includes(index)) {
      acc.push(cur.replace(''))
      return acc
    }

    const _list = [
      text.slice('this.$data.'.length),
    ]

    let nextIndex = index + 1
    while (nextIndex < arr.length) {
      const nodeNext = cur.next()
      if (!nodeNext?.text().startsWith('this.$data')) {
        break
      }

      const traverseNext = arr[nextIndex].getMatch(match)
      const isSame = nodeNext?.id() === traverseNext?.id()
      if (!isSame) {
        break
      }
      _list.push(nodeNext.text().slice('this.$data.'.length))
      handledIndex.push(nextIndex)
      nextIndex++
    }

    acc.push(cur.replace(`this.setData({ ${_list.map((i) => {
      const _arr = i.split('=')
      const key = _arr[0].trim()
      const value = _arr.slice(1).join('=')
      return `'${key.trim()}': ${value}`
    }).join(', ')} })`))

    return acc
  }, [] as Edit[]).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `export default { a: 1 }` -> `App({ a: 1 })`
 */
export function trsnaformExportDefault(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'DEFINE'

  const matcher: NapiConfig = {
    rule: {
      pattern: `export default $${match}`,
      regex: '^export.default',
      kind: 'export_statement',
    },
  }

  const exportNode = node.find(matcher)
  const text = exportNode?.getMatch(match)?.text()

  if (!text) {
    return {
      edits: [],
    }
  }

  const names: Record<string, string> = {
    defineApp: 'App',
    defineComponent: 'Component',
    definePage: 'Page',
  }

  const _text = text.replace(/^.*(defineApp|defineComponent|definePage)/, (_, name) => {
    return names[name]
  })

  const edits = [exportNode!.replace(_text)] as Edit[]

  return {
    edits,
  }
}
