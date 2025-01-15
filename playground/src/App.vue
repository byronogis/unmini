<script setup lang="ts">
import { computed, ref } from 'vue'
import { transformer } from '../../packages/core/src'

const source = ref('')

const result = computed(() => {
  return transformer({
    source: source.value,
    platform: 'weixin',
  })
})
</script>

<template>
  <UApp>
    <UCard
      class="w-full h-full"
      :ui="{
        body: 'flex gap-4 h-full',
      }"
    >
      <UTextarea v-model="source" class="flex-1 h-full" :ui="{ base: 'h-full' }" />

      <UContainer class="flex-1 flex flex-col gap-4">
        <!-- <UTextarea v-model="result.template.content" /> -->
        <UTextarea v-model="source" />
        <UTextarea v-model="source" />
        <UTextarea v-model="source" />
      </UContainer>
    </UCard>
  </UApp>
</template>

<style>
#app {
  width: min(90vw, 1440px);
  height: 90vh;
}
</style>
