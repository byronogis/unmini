<script lang="ts">
import { unmini } from 'unmini/polyfill'

// 获取应用实例
const app = unmini.global.getApp<IAppOption>()

console.log('Page Home', { app })

export default unmini.defineComponent({
  data() {
    return {
      // ...
    }
  },
  methods: {
    goLogsPage() {
      if (!unmini.global.getApp()) {
        // eslint-disable-next-line no-alert
        window.alert('该页面使用了小程序模板语法, 需要使用微信小程序打开')
        return
      }
      this.$router.push('/unmini/logs')
    },
    goExamplePage() {
      this.$router.push({
        path: '/unmini/example',
      })
    },
  },
})
</script>

<template>
  <div class="flex flex-col items-center gap-1em h-full grid place-content-center">
    <button @click="goLogsPage">
      Logs
    </button>

    <button @click="goExamplePage">
      Example
    </button>
  </div>
</template>

<style scoped lang="postcss">
page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<unmini lang="json">
{
  "usingComponents": {
  }
}
  </unmini>
