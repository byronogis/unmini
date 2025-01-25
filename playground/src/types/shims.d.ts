/// <reference types="miniprogram-api-typings" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}
