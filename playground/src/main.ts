// TODO
// see https://github.com/unjs/unbuild/issues/248
// see https://github.com/unjs/unbuild/issues/447
// import { sum } from 'unmini'
import { sum } from '../../packages/core/src'
import 'virtual:uno.css'
import './style.css'

// @ts-expect-error
console.info(`[unmini]`, { sum: sum(1, 2) })
