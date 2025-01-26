import type { Edit, NapiConfig } from '@ast-grep/napi'
import type { VueTransformOptions, VueTransformResult } from '../types'

/**
 * @see https://vuejs.org/guide/essentials/template-syntax.html#same-name-shorthand
 *
 * @example
 * `:attr` -> `:attr="attr"`
 */
export function expandAttributeSameNameShorthand(options: VueTransformOptions): VueTransformResult {
  const { node } = options

  const match = 'ATTR'

  const matcher: NapiConfig = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      any: [
        { regex: '^v-bind:' },
      ],
      not: {
        has: {
          kind: 'quoted_attribute_value',
        },
      },
    },
  }

  const edits = node.findAll(matcher).map((node) => {
    const name = node.getMatch(match)?.text().split(':').pop()
    return node.replace(`v-bind:${name}="${name}"`)
  })

  return {
    edits,
  }
}

/**
 * @example
 * `@click` -> `v-on:click`
 * `@click.stop` -> `v-on:click.stop`
 * `:attr` -> `v-bind:attr`
 * `#name` -> `v-slot:name`
 * `v-model` -> `v-model:value`
 */
export function expandDerictiveShorthand(options: VueTransformOptions): VueTransformResult {
  const { node } = options

  const match = 'ATTR'

  const matcher: NapiConfig = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      any: [
        { regex: '^@|^:|^#|^v-model=' },
      ],
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const attributeText = _node.getMatch(match)?.text()
    if (!attributeText) {
      return undefined
    }

    const derictive = attributeText.match(/^([@:#]|v-model)/)![0]

    const derictives: Record<string, string> = {
      '@': 'v-on:',
      ':': 'v-bind:',
      '#': 'v-slot:',
      'v-model': 'v-model:value',
    }

    const _text = attributeText.replace(derictive, derictives[derictive]!)

    return _node.replace(_text)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}
