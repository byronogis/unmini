import type { weixin } from './weixin'

export const unmini = {
  mini: {},
  // miniThis: {},
  getApp() {},
  getCurrentPages() {},
} as unknown as {
  mini: typeof weixin
  getApp: WechatMiniprogram.App.GetApp
  getCurrentPages: WechatMiniprogram.Page.GetCurrentPages
  // TODO add more ...
}
