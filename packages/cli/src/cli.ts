import { defineCommand, runMain } from 'citty'
import { handle } from '.'
import { description, version } from '../package.json'

const main = defineCommand({
  meta: {
    name: 'unmini',
    version,
    description,
  },
  args: {
    patterns: {
      type: 'positional',
      description: 'Glob pattern',
      required: true,
    },
    cwd: {
      type: 'string',
      description: 'Current working directory',
      valueHint: 'dir',
    },
    outDir: {
      type: 'string',
      description: 'Output directory',
      alias: 'o',
      valueHint: 'dir',
      default: 'unmini-output',
    },
    srcDir: {
      type: 'string',
      description: 'Source directory, defaults to cwd',
      alias: 's',
      valueHint: 'dir',
    },
    watch: {
      type: 'boolean',
      description: 'Watch mode',
      alias: 'w',
    },
    clear: {
      type: 'boolean',
      description: 'Clear output directory before writing',
      alias: 'c',
    },
  },
  run({ args }) {
    handle({
      ...args,
      patterns: Array.isArray(args.patterns) ? args.patterns : [args.patterns],
    })
  },
})

runMain(main)
