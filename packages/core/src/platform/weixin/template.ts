import type { Edit } from '@ast-grep/napi'
import type { TransformOptions, TransformResult } from '../../types'

/**
 * @example
 * `:attr="value"` -> `attr="{{ value }}"`
 */
export function trsnaformAttributeBind(options: TransformOptions): TransformResult {
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
      _valueWithQuote,
    ] = attributeText.split('=')
    const name = nameWithDirective.split(':').pop()
    const value = _valueWithQuote.slice(1, -1)
    return node.replace(`${name}="{{ ${value} }}"`)
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}
