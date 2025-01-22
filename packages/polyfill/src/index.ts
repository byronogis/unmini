/* eslint-disable ts/ban-ts-comment */

import type { weixin } from './weixin'
import { defineComponent } from 'vue'

export const unmini = {
  mini: {},
  global: {
    getApp() {},
    getCurrentPages() {},
  },

  defineComponent,
  defineApp: defineComponent,
} as unknown as {
  mini: typeof weixin
  global: {
    // @ts-ignore Cannot find namespace
    getApp: WechatMiniprogram.App.GetApp
    // @ts-ignore Cannot find namespace
    getCurrentPages: WechatMiniprogram.Page.GetCurrentPages
  }

  defineComponent: typeof defineComponent
  defineApp: typeof defineComponent
  // TODO add more ...
}
