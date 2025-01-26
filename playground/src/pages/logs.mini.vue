<script lang="ts">
import { polyfill as unmini } from 'unmini/polyfill'
import { formatTime } from '../utils/index.mini'

export default unmini.defineComponent({
  data() {
    return {
      logs: [],
    } as {
      logs: { date: string, timeStamp: string }[]
    }
  },
  lifetimes: {
    attached() {
      this.$data.logs = (unmini.mini.getStorageSync('logs') || []).map((log: string) => {
        return {
          date: formatTime(new Date(log)),
          timeStamp: log,
        }
      })
    },
  },
})
</script>

<template>
  <scroll-view class="scrollarea" scroll-y type="list">
    <block wx:for="{{logs}}" wx:key="timeStamp" wx:for-item="log">
      <view class="log-item">
        <!-- @vue-skip -->
        {{ index + 1 }}. {{ log.date }}
      </view>
    </block>
  </scroll-view>
</template>

<style scoped lang="postcss">
page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.scrollarea {
  flex: 1;
  overflow-y: hidden;
}
.log-item {
  margin-top: 20rpx;
  text-align: center;
}
.log-item:last-child {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

<unmini lang="json">
{
  "usingComponents": {
  }
}
</unmini>
