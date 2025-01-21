import type { ResolvedCoreOptions } from '..'
import { CoreError } from '../errors'
import { tsLoader } from './ts'
import { vueLoader } from './vue'

export function loader(options: LoaderOptions): LoaderReturns {
  const {
    id,
    content,
    // resolvedConfig,
  } = options

  const _ext = id.split('.').at(-1)
  if (!_ext) {
    throw new CoreError('[@unmini/core] Missing file extension')
  }

  switch (_ext) {
    case 'vue':
      return vueLoader(options)

    case 'ts':
      return tsLoader(options)

    default:
      return [{ content, ext: _ext }]
  }
}

export interface LoaderOptions extends ResolvedCoreOptions {
  // ...
}

export type LoaderReturns = {
  /**
   * the transformed code content
   */
  content: string
  /**
   * the extension of the transformed file
   */
  ext: string
}[]
