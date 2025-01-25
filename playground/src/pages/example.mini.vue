<script lang="ts">
import { unmini } from 'unmini/polyfill'

export default unmini.defineComponent({
  // ...
  data() {
    return {
      flag: true,
    }
  },
  methods: {
    handleUpdateFlag(e: any) {
      console.log('handleUpdateFlag', { e })
      this.$data.flag = !this.$data.flag
    },
    goHome() {
      this.$router.push('/unmini/home')
    },
  },
})
</script>

<template>
  <div>
    <button class="m-auto block" @click="goHome">
      Go Home
    </button>

    <ExampleComp
      msg="hello from outside"
      name="name from outside"
      :flag
      :info="{ id: 'outside', label: 'info from outside' }"
      @update:flag="handleUpdateFlag"
    >
      <template #default>
        <div>default from outside</div>
      </template>

      <template #other>
        <div>other from outside</div>
      </template>
    </ExampleComp>
  </div>
</template>

<style scoped lang="postcss"></style>

<unmini lang="json">
{
  "usingComponents": {
    "ExampleComp": "/components/ExampleComp"
  },
  "navigationBarTitleText": "Example"
}
</unmini>
