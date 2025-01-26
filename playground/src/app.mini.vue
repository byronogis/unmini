<script lang="ts">
import { polyfill as unmini } from 'unmini/polyfill'

export default unmini.defineApp({
  onLaunch() {
    // 展示本地存储能力
    const logs = unmini.mini.getStorageSync('logs') || []
    logs.unshift(Date.now())
    unmini.mini.setStorageSync('logs', logs)

    // 登录
    unmini.mini.login({
      success: (_res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
  globalData: {
    userInfo: null,
  },
})
</script>

<unmini lang="json">
{
  "pages": [
    "pages/home",
    "pages/logs",
    "pages/example"
  ],
  "window": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "Weixin",
    "navigationBarBackgroundColor": "#ffffff"
  },
  "style": "v2",
  "componentFramework": "glass-easel",
  "lazyCodeLoading": "requiredComponents"
}
</unmini>

<template>
  <RouterView />
</template>

<style lang="postcss">
/* @unmini-inject-start */
/* @unmini-inject-end */

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
</style>
