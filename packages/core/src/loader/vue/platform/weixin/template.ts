import type { Edit } from '@ast-grep/napi'
import type { VueTransformOptions } from '../../'
import type { TransformResult } from '../../../../types'
import { Lang, parse } from '@ast-grep/napi'
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

    const nameMayHaveModifiers = nameWithDirective.split('@')[1]
      ?? nameWithDirective.split('v-on:')[1]!
    const [namePlain, ...modifiers] = nameMayHaveModifiers.split('.')
    const isStop = modifiers.includes('stop')
    const bind: 'bind' | 'catch' = isStop ? 'catch' : 'bind'
    const events: Record<string, string> = {
      click: 'tap',
    }
    const name = events[namePlain!] || namePlain

    const value = valueWithQuote!.slice(1, -1)

    return node.replace(`${bind}${name}="${value}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `<tag v-for="item,index in list" :key="item.id">`
 * -> `<tag wx:for="{{ list }}" wx:for-index="index" wx:for-item="item" wx:key="id">`
 *
 * `<tag v-for="item,index in list" :key="item">`
 * -> `<tag wx:for="{{ list }}" wx:for-index="index" wx:for-item="item" wx:key="*this">`
 */
export function transformVFor(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  // const match = 'V_FOR'

  const matcher = {
    rule: {
      kind: 'start_tag',
      has: {
        kind: 'attribute',
        regex: '^v-for',
      },
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    // <li v-for="item, index in list" :key="index">
    let item: string, index: string, list: string, key: string
    return _node.findAll({
      rule: {
        kind: 'attribute',
        any: [
          {
            regex: '^v-for|^:key|^v-bind:key',
          },
        ],
      },
    })
      .sort((_, b) => Number(b.text().startsWith('v-for')))
      .map((attributeNode) => {
        const attributeText = attributeNode.text()
        const [
          _name,
          valueWithQuote,
        ] = splitAtFirstChar(attributeText, '=')
        const value = valueWithQuote!.slice(1, -1)

        if (_name.startsWith('v-for')) {
          const expressionNode = parse(Lang.TypeScript, value).root().find({
            rule: {
              kind: 'sequence_expression',
              pattern: '$ITEM,$INDEX in $LIST',
            },
          })
          if (!expressionNode) {
            return undefined
          }
          [item, index, list] = [
            expressionNode.getMatch('ITEM')!.text(),
            expressionNode.getMatch('INDEX')!.text(),
            expressionNode.getMatch('LIST')!.text(),
          ]
          return attributeNode.replace(`wx:for="{{ ${list} }}" wx:for-index="${index}" wx:for-item="${item}"`)
        }
        else if (_name.startsWith(':key') || _name.startsWith('v-bind:key')) {
          key = value === item ? '*this' : value.split('.')[1]
          return attributeNode.replace(`wx:key="${key}"`)
        }

        return undefined
      })
  }).flat().filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `v-if="condition"` -> `wx:if="{{ condition }}"`
 * `v-else-if="condition"` -> `wx:elif="{{ condition }}"`
 * `v-else` -> `wx:else`
 */
export function transformVIf(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  // const match = 'V_IF'

  const matcher = {
    rule: {
      kind: 'attribute',
      any: [
        { regex: '^v-if' },
        { regex: '^v-else-if' },
        { regex: '^v-else' },
      ],
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const attributeText = node.text()
    if (!attributeText) {
      return undefined
    }

    const [
      name,
      valueWithQuote,
    ] = splitAtFirstChar(attributeText, '=')
    const value = valueWithQuote?.slice(1, -1)

    const directives: Record<string, string> = {
      'v-if': 'if',
      'v-else-if': 'elif',
      'v-else': 'else',
    }
    const directive = directives[name] || name

    return directive === 'v-else'
      ? node.replace(`wx:${directive}`)
      : node.replace(`wx:${directive}="{{ ${value} }}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `v-model="value"` -> `model:value="{{ value }}"`
 * `v-model:prop="value"` -> `model:prop="{{ value }}"`
 */
export function transformVModel(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'V_MODEL'

  const matcher = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      regex: '^v-model',
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
    const [, prop] = nameWithDirective.split(':')
    const value = valueWithQuote!.slice(1, -1)

    return node.replace(`model:${prop || 'value'}="{{ ${value} }}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `div` -> `view`
 * `span` -> `text`
 * `template` -> `block`
 */
export function transformElementName(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'ELEMENT'

  const matcher = {
    rule: {
      pattern: `$${match}`,
      kind: 'tag_name',
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const text = node.getMatch(match)?.text()
    if (!text) {
      return undefined
    }

    const elements: Record<string, string> = {
      div: 'view',
      span: 'text',
      ul: 'view',
      li: 'view',
      template: 'block',
    }
    const element = elements[text] || text

    return node.replace(element)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}
