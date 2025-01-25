import type { UserModule } from '../types'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

export const install: UserModule = ({ app }) => {
  const router = createRouter({
    history: createWebHistory(),
    routes: setupLayouts(routes),
  })

  console.log({
    routes: setupLayouts(routes),
  })

  if (import.meta.hot) {
    handleHotUpdate(router)
  }

  app.use(router)
}
