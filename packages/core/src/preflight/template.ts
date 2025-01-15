import type { NapiConfig, SgNode } from '@ast-grep/napi'

export function expandAttributeSameNameShorthand(node: SgNode): string {
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

  return node.commitEdits(edits)
}
