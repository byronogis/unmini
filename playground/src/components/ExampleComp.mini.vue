<script lang="ts">
import { polyfill as unmini } from 'unmini/polyfill'

export default unmini.defineComponent({
  props: {
    name: String,
    msg: {
      type: String,
      default: 'hello world',
    },
    flag: Boolean,
    info: {
      type: Object,
      default() {
        return {
          id: 'id',
          label: 'label',
        }
      },
    },
  },
  data() {
    return {
      count: 0,
      list: [
        { id: String(Date.now()), label: String(Date.now()) },
      ],
      show: true,
      input: 'hello',
    }
  },
  methods: {
    inc() {
      this.$data.count = this.$data.count + 1
      console.log('inc')
    },
    dec() {
      this.$data.count = this.$data.count - 1
      console.log('dec')
    },
    add() {
      const val = String(Date.now())
      this.$data.list = [...this.$data.list, { id: val, label: this.$data.input }]
      console.log('add')
    },
    handleDelete({ currentTarget }: Event) {
      const {
        id,
      } = (currentTarget as HTMLElement).dataset
      this.$data.list = this.$data.list.filter(({ id: _id }) => id !== _id)
      console.log('delete')
    },
    modify({ currentTarget }: Event) {
      const {
        id,
      } = (currentTarget as HTMLElement).dataset

      this.$data.list = this.$data.list.map((item) => {
        if (item.id === id) {
          item.label = this.$data.input
        }
        return item
      })
      console.log('modify')
    },
    toggle() {
      this.$data.show = !this.$data.show
      console.log('toggle')
    },
    clickRoot() {
      console.log('clickRoot')
    },
    updatePropFlag() {
      // 事件触发, 注意传递参数的方式
      this.$emit('update:flag', {
        detail: !this.$props.flag,
      })
    },
  },
  lifetimes: {
    // ...
  },
  pageLifetimes: {
    // ...
  },
  options: {
    multipleSlots: true,
  },
})
</script>

<template>
  <div class="p-2em" @click="clickRoot">
    <div>Props:</div>
    <div class="mb-1em flex flex-col items-start">
      <span>name: {{ name }}</span>
      <span>msg: {{ msg }}</span>
      <span>flag: {{ flag }} <span class="color-emerald" @click="updatePropFlag">update</span></span>
      <span>info: {{ info.label }}</span>
    </div>

    <div>Data:</div>
    <div class="mb-1em flex flex-col items-start">
      <span>show: {{ show ? 'yes' : 'no' }} <span class="color-emerald" @click.stop="toggle">update</span></span>

      <div style="display: flex; align-items: center; column-gap: 1em;">
        <span>count: {{ count }}</span>
        <span class="color-emerald" @click.stop="dec">dec</span>
        <span class="color-emerald" @click="inc">inc</span>
      </div>
    </div>

    <div>CRUD:</div>
    <div class="my-1 flex items-center justify-between gap-2">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <input v-model="input" type="text" class="flex-1 p-1 rounded border-1 border-solid border-cyan" />
      <!-- eslint-disable-next-line vue/v-on-style -->
      <span v-on:click.stop="add">Add</span>
    </div>
    <ul class="mb-1em">
      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <li v-for="item, index in list" :key="item.id" class="flex justify-between items-center gap-1em">
        <span class="flex-1">{{ index + 1 }}: {{ item.label }}</span>
        <span :data-id="item.id" @click="modify">Modify</span>
        <span :data-id="item.id" @click="handleDelete">Del</span>
      </li>
    </ul>

    <div>Slot:</div>
    <div>default:</div>
    <slot name="default" />
    <div>other:</div>
    <slot name="other" />
  </div>
</template>

<style scoped lang="postcss">

</style>

<unmini lang="json">
{
  "styleIsolation": "shared"
}
</unmini>
