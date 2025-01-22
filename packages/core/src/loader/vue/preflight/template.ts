import type { NapiConfig } from '@ast-grep/napi'
import type { TransformOptions, TransformResult } from '../../../types'

/**
 * @see https://vuejs.org/guide/essentials/template-syntax.html#same-name-shorthand
 */
export function expandAttributeSameNameShorthand(options: TransformOptions): TransformResult {
  const { node } = options

  const match = 'ATTR'

  const matcher: NapiConfig = {
    rule: {
      pattern: `$${match}`,
      kind: 'attribute',
      any: [
        { regex: '^:' },
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
    return node.replace(`:${name}="${name}"`)
  })

  return {
    edits,
  }
}
