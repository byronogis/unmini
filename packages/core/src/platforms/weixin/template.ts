import type { Edit, SgNode } from '@ast-grep/napi'
import type {
  TransformResult,
} from '../../types/transformer'

export function trsnaformAttributeBind(node: SgNode): TransformResult {
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
    content: node.commitEdits(edits),
  }
}
