import type { Edit, NapiConfig } from '@ast-grep/napi'
import type { TSTransformOptions, TSTransformResult } from './types'

/**
 * @example
 * `import { formatTime } from '../utils/index.mini'` -> `import { formatTime } from '../utils/index'`
 */
export function trsnaformUnMiniImportFilePath(options: TSTransformOptions): TSTransformResult {
  const {
    node,
    ctx,
  } = options

  const subExtension = ctx.payload.ctx.config.subExtension

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

/**
 * @example
 * `import { unmini } from 'unmini/polyfill'` -> ``
 */
export function removeUnMiniPolyfillImport(options: TSTransformOptions): TSTransformResult {
  const {
    node,
  } = options

  const match = 'POLYFILL_IMPORT'

  const matcher: NapiConfig = {
    rule: {
      pattern: `$${match}`,
      kind: 'import_statement',
      regex: 'unmini/polyfill',
    },
  }

  const edits = node.findAll(matcher).map((_node) => {
    const text = _node.getMatch(match)?.text()
    if (!text) {
      return undefined
    }

    return _node.replace('')
  }).filter(Boolean) as Edit[]

  return {
    edits,
  }
}
