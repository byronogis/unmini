<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const inc = () => count.value++

    const list = ref([1, 2, 3])

    return { count, inc, list }
  }
}
</script>

<!-- <script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const inc = () => count.value++

const list = ref([1, 2, 3])
</script> -->

<template>
  <div>
    <button :data-value="count" :hidden @click="inc">count is: {{ count }}</button>

    <div v-for="(i, idx) in list" :key="idx">{{ i }}</div>
  </div>
</template>

<style scoped lang="postcss">
button {
  color: red;
}
</style>

<config lang="json">
{
  "title": "Demo",
  "description": "A demo component",
  "author": "you",
  "tags": ["demo"],
  "display": "demo",
  "screenshots": ["https://example.com/screenshot.png"]
}
</config>
