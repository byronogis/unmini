import ui from '@nuxt/ui/vue-plugin'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
// TODO
// see https://github.com/unjs/unbuild/issues/248
// see https://github.com/unjs/unbuild/issues/447
// import { sum } from 'unmini'
// import { sum } from '../../packages/core/src'
// import 'virtual:uno.css'
import './style.css'

const app = createApp(App)

const router = createRouter({
  routes: [],
  history: createWebHistory(),
})

app.use(router)

app.use(ui)

app.mount('#app')
