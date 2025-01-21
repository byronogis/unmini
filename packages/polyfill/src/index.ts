import type { weixin } from './weixin'

export const unmini = {
  mini: {},
  global: {
    getApp() {},
    getCurrentPages() {},
  },
} as unknown as {
  mini: typeof weixin
  global: {
    getApp: WechatMiniprogram.App.GetApp
    getCurrentPages: WechatMiniprogram.Page.GetCurrentPages
  }
  // TODO add more ...
}
