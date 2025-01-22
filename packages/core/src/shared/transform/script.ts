import type { Edit, NapiConfig } from '@ast-grep/napi'
import type { TransformOptions, TransformResult } from '../../types/transformer'

/**
 * @example
 * `import { formatTime } from '../utils/index.mini'` -> `import { formatTime } from '../utils/index'`
 */
export function trsnaformUnMiniImportFilePath(options: TransformOptions): TransformResult {
  const {
    node,
    ctx,
  } = options

  const subExtension = ctx.options.resolvedConfig.subExtension

  const match = 'FILE_PATH'

  const matcher: NapiConfig = {
    rule: {
      pattern: `$${match}`,
      kind: 'string_fragment',
      inside: {
        kind: 'string',
        inside: {
          any: [
            { kind: 'export_statement' },
            { kind: 'import_statement' },
          ],
        },
      },
      any: [
        { regex: `\.${subExtension}$` },
      ],
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const text = _node.getMatch(match)?.text()
    if (!text) {
      return undefined
    }

    return _node.replace(text.replace(`.${subExtension}`, ''))
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}
