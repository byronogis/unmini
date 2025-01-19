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
