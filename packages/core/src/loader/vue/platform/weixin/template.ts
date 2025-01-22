import type { Edit } from '@ast-grep/napi'
import type { VueTransformOptions } from '../../'
import type { TransformResult } from '../../../../types'
import { splitAtFirstChar } from '../../../../utils'

/**
 * @example
 * `:attr="value"` -> `attr="{{ value }}"`
 * `v-bind:attr="value"` -> `attr="{{ value }}"`
 */
export function transformAttributeBind(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'ATTR'

  const matcher = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      any: [
        { regex: '^:' },
        { regex: '^v-bind:' },
      ],
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const attributeText = node.getMatch(match)?.text()
    if (!attributeText) {
      return undefined
    }

    const [
      nameWithDirective,
      valueWithQuote,
    ] = splitAtFirstChar(attributeText, '=')
    const name = nameWithDirective.split(':').pop()
    const value = valueWithQuote!.slice(1, -1)
    return node.replace(`${name}="{{ ${value} }}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `@click="handler"` -> `bindclick="handler"`
 * `@click.stop="handler"` -> `catchclick="handler"`
 */
export function transformEventBind(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'EVENT'

  const matcher = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      any: [
        { regex: '^@' },
        { regex: '^v-on:' },
      ],
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const attributeText = node.getMatch(match)?.text()
    if (!attributeText) {
      return undefined
    }

    const [
      nameWithDirective,
      valueWithQuote,
    ] = splitAtFirstChar(attributeText, '=')

    let name = nameWithDirective.split('@')[1]
      ?? nameWithDirective.split('v-on:')[1]!
    const [namePlain, ...modifiers] = name.split('.')
    const isStop = modifiers.includes('stop')
    const bind: 'bind' | 'catch' = isStop ? 'catch' : 'bind'
    const events: Record<string, string> = {
      click: 'tap',
    }
    name = events[namePlain!] || namePlain

    const value = valueWithQuote!.slice(1, -1)

    return node.replace(`${bind}${name}="${value}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}
