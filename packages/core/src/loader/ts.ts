import type { LoaderOptions, LoaderReturns } from '.'
import { transformTsToJs } from '../utils'

export function tsLoader(options: LoaderOptions): LoaderReturns {
  return [{
    content: transformTsToJs(options.content),
    ext: 'js',
  }]
}
