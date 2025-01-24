import type { Edit } from '@ast-grep/napi'
import type { VueTransformOptions } from '../../'
import type { TransformResult } from '../../../../types'
import { Lang, parse } from '@ast-grep/napi'
import { splitAtFirstChar } from '@unmini/shared'
import { resolveVueDirective } from '../../../../utils'

/**
 * @example
 * `v-bind:attr="value"` -> `attr="{{ value }}"`
 */
export function transformVBind(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'ATTR'

  const matcher = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      regex: '^v-bind:',
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const attributeText = node.getMatch(match)?.text()
    if (!attributeText) {
      return undefined
    }

    const [
      directive,
      valueWithQuote,
    ] = splitAtFirstChar(attributeText, '=')
    const [, dArg] = resolveVueDirective(directive)
    const value = valueWithQuote!.slice(1, -1)
    return node.replace(`${dArg}="{{ ${value} }}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `v-on:click="handler"` -> `bindclick="handler"`
 * `v-on:click.stop="handler"` -> `catchclick="handler"`
 */
export function transformVOn(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'EVENT'

  const matcher = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      regex: '^v-on:',
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const attributeText = node.getMatch(match)?.text()
    if (!attributeText) {
      return undefined
    }

    const [
      directive,
      valueWithQuote,
    ] = splitAtFirstChar(attributeText, '=')

    const [, dArg, dModifiers] = resolveVueDirective(directive)
    const isStop = dModifiers.includes('stop')
    const bind: 'bind' | 'catch' = isStop ? 'catch' : 'bind'
    const events: Record<string, string> = {
      click: 'tap',
      // ...
    }
    const name = events[dArg!] || dArg

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
            regex: '^v-for|^v-bind:key',
          },
        ],
      },
    })
      .sort((_, b) => Number(b.text().startsWith('v-for')))
      .map((attributeNode) => {
        const attributeText = attributeNode.text()
        const [
          derictive,
          valueWithQuote,
        ] = splitAtFirstChar(attributeText, '=')
        const value = valueWithQuote!.slice(1, -1)

        if (derictive.startsWith('v-for')) {
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
        else if (derictive.startsWith('v-bind:key')) {
          key = value === item ? '*this' : value.split('.')[1]!
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
      directive,
      valueWithQuote,
    ] = splitAtFirstChar(attributeText, '=')
    const value = valueWithQuote?.slice(1, -1)

    const directives: Record<string, string> = {
      'v-if': 'if',
      'v-else-if': 'elif',
      'v-else': 'else',
    }
    const _directive = directives[directive] || directive

    return _directive === 'v-else'
      ? node.replace(`wx:${_directive}`)
      : node.replace(`wx:${_directive}="{{ ${value} }}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
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
    const [, dArg] = resolveVueDirective(nameWithDirective)
    const value = valueWithQuote!.slice(1, -1)

    return node.replace(`model:${dArg}="{{ ${value} }}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `v-slot:foo` -> `slot="foo"`
 */
export function transformVSlot(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  const match = 'SLOT'

  const matcher = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      regex: '^v-slot',
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const attributeText = node.getMatch(match)?.text()
    if (!attributeText) {
      return undefined
    }

    const [
      nameWithDirective,
      ,
    ] = splitAtFirstChar(attributeText, '=')
    const [, dArg] = resolveVueDirective(nameWithDirective)

    return node.replace(`slot="${dArg}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}

/**
 * @example
 * `<template slot="foo"></template>` -> `<view slot="foo"></view>`
 *
 * #TODO view can customize by config
 */
export function transformVSlotTagName(options: VueTransformOptions): TransformResult {
  const {
    node,
  } = options

  // const match = 'SLOT_ELEMENT'

  const matcher = {
    rule: {
      kind: 'element',
      has: {
        kind: 'start_tag',
        has: {
          kind: 'attribute',
          regex: '^slot=',
        },
      },
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const elementText = node.text()
    if (!elementText) {
      return undefined
    }

    const _text = elementText.replace(/^<template([^>]*)>([\s\S]*)<\/template>$/, '<view$1>$2</view>')

    return node.replace(_text)
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
