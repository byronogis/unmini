import type { UserModule } from './types'
import { createApp } from 'vue'
import App from './app.mini.vue'
import 'virtual:uno.css'
import './style.css'

const app = createApp(App)

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(i => i.install?.({ app }))

app.mount('#app')
