import type { Edit, NapiConfig } from '@ast-grep/napi'
import type { VueTransformOptions } from '../../'
import type { Platform, TransformResult } from '../../../../types'
import { Lang, parse } from '@ast-grep/napi'
import { PlatformAPIs } from '../../../../constant'
import { resolveCode, resolveRoutePath } from '../../../../utils'

/**
 * @example
 * `this.$router.push({ path: '/path/to/page' })` -> `wx.navigateTo({ url: '/path/to/page' })`
 */
export function transformRouter(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = {
    name: 'NAME',
    arg: 'ARG',
  }

  const names: Record<string, string> = {
    push: 'navigateTo',
    // ...
  }

  const matcher: NapiConfig = {
    rule: {
      pattern: `this.$router.$${match.name}($${match.arg})`,
      kind: 'call_expression',
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const nameText = _node.getMatch(match.name)?.text()
    const argText = _node.getMatch(match.arg)?.text()
    if (!nameText || !argText) {
      return undefined
    }

    if (!argText.startsWith('{')) {
      const argTextRemovedQuotes = argText.slice(1, -1)
      return _node.replace(`this.pageRouter.${names[nameText]}({ url: '${resolveRoutePath(argTextRemovedQuotes, options)}' })`)
    }

    const pathPairText = parse(Lang.TypeScript, argText).root().find({
      rule: {
        kind: 'pair',
        regex: '^path:',
      },
    })!.text()

    const url = resolveRoutePath(pathPairText.replace('path:', '').trim().slice(1, -1), options)

    const _argText = argText.replace(pathPairText, `url: '${url}'`)

    return _node.replace(`this.pageRouter.${names[nameText]}(${_argText})`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

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
 * `props: { foo: String }` -> `properties: { foo: { type: String} }`
 * `props: { foo: { type: String, default: 'foo' } }` -> `properties: { foo: { type: String, value: 'foo' } }`
 * `props: { foo: { type: String, default: () => 'foo' } }` -> `properties: { foo: { type: String, value: 'foo' } }`
 * `props: { bar: { type: Object, default: () => ({ bar: 'bar' })} }` -> `properties: { foo: { type: String, value: { bar: 'bar' } } }`
 */
export function transformPropertyDefine(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  // const match = 'PROPS'

  const matcher: NapiConfig = {
    rule: {
      kind: 'pair',
      regex: '^props:',

    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const text = _node.text()
    if (!text) {
      return undefined
    }

    const _text = text.replace('props', 'properties')

    const propsExpression = resolveCode(`{ ${_text} }`).properties
    const properties = Object.entries(propsExpression).map(([key, value]) => {
      if (typeof value !== 'object') {
        return `${key}: { type: ${(value as () => void)?.name} }`
      }

      const {
        type,
        default: _default,
      } = value as Record<string, any>
      if (typeof _default === 'function') {
        return `${key}: { type: ${(type as () => void)?.name}, value: ${JSON.stringify(_default())} }`
      }
      else {
        return `${key}: { type: ${(type as () => void)?.name}, value: ${JSON.stringify(_default)} }`
      }
    }).join(', ')

    return _node.replace(`properties: { ${properties} }`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `this.$props.foo` -> `this.data.foo`
 */
export function transformPropertyEvaluation(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const text = node.text()
  const _text = text.replace(/this\.\$props/g, 'this.data')
  const edits = [node.replace(_text)] as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `this.$emit('foo', { detail: name })` -> `this.triggerEvent('foo', name)`
 * `this.$emit('foo', { detail: { name } })` -> `this.triggerEvent('foo', { name })`
 */
export function transformEmit(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'EMIT'

  const matcher: NapiConfig = {
    rule: {
      pattern: `this.$emit($$$${match})`,
      kind: 'call_expression',
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const texts = _node.getMultipleMatches(match).map(i => i.text()).filter(i => i !== ',')
    if (!texts.length) {
      return undefined
    }

    const [
      eventName,
      eventArgument,
      eventOptions,
    ] = texts

    const eventArgumentText = parse(Lang.TypeScript, eventArgument).root().find({
      rule: {
        kind: 'pair',
        regex: '^detail:',
      },
    })?.text().replace('detail:', '')

    return _node.replace(`this.triggerEvent(${eventName}, ${eventArgumentText}, ${eventOptions})`)
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
    },
  }

  const dataNode = node.find(matcher)
  const dataReturnNode = dataNode?.find({
    rule: {
      kind: 'return_statement',
    },
  })

  const text = dataReturnNode?.text()

  if (!text) {
    return {
      edits: [],
    }
  }

  const _text = text.replace(/^return/, '')

  const edits = [dataNode!.replace(`data: ${_text}`)] as Edit[]

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
 * `export default unmini.defineApp({ a: 1 })` -> `App({ a: 1 })`
 * `export default unmini.defineComponent({ a: 1 })` -> `Component({ a: 1 })`
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
  }

  const _text = text.replace(/^.*(defineApp|defineComponent)/, (_, name) => {
    return names[name]
  })

  const edits = [exportNode!.replace(_text)] as Edit[]

  return {
    edits,
  }
}
