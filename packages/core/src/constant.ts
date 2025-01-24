import type { BlockContents, Platform } from './types'

export const FileExtensions: Record<Platform, {
  [K in keyof BlockContents]: string
}> = {
  weixin: {
    template: '.wxml',
    style: '.wxss',
    script: '.js',
    config: '.json',
  },
}

export const PlatformAPIs: Record<Platform, string> = {
  weixin: 'wx',
}

/**
 * The comment used to inject code
 */
export const INJECT_START_COMMENT = '@unmini-inject-start'
export const INJECT_END_COMMENT = '@unmini-inject-end'
// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-useless-lazy, regexp/optimal-quantifier-concatenation
export const INJECT_COMMENT_RE = new RegExp(`(\/\/\\s*?${INJECT_START_COMMENT}\\s*?|\\/\\*\\s*?${INJECT_START_COMMENT}\\s*?\\*\\/|<!--\\s*?${INJECT_START_COMMENT}\\s*?-->)[\\s\\S]*?(\/\/\\s*?${INJECT_END_COMMENT}\\s*?|\\/\\*\\s*?${INJECT_END_COMMENT}\\s*?\\*\\/|<!--\\s*?${INJECT_END_COMMENT}\\s*?-->)`, 'g')
