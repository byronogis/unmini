import type { FSWatcher } from 'chokidar'
import type { CliOptions } from './types'
import { resolveOptions } from '.'

let watcher: FSWatcher

export async function getWatcher(_options?: CliOptions): Promise<FSWatcher> {
  // test case entry without options
  if (watcher && !_options) {
    return watcher
  }

  const options = await resolveOptions(_options ?? {})

  const { watch } = await import('chokidar')
  const ignored = ['**/{.git,node_modules}/**']
  // cli may create multiple watchers
  const newWatcher = watch(options?.patterns as string[], {
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored,
    cwd: options.srcDirFull,
  })
  watcher = newWatcher
  return newWatcher
}
