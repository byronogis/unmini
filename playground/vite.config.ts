import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import pkg from '../package.json'

function getRepoName(url: string) {
  const match = url.match(/github\.com\/[\w-]+\/([\w-]+)/)
  return match ? `/${match[1]}/` : '/'
}

const base = getRepoName(pkg.repository.url)

export default defineConfig({
  base,
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    VueRouter({
      dts: 'src/types/typed-router.d.ts',
      extensions: ['.mini.vue'],
      extendRoute(route) {
        /**
         * TODO check unplugin-vue-router after, should support built-in for base path
         *
         * add base path to all routes
         */
        route.path = `${base}${route.path}`
      },
    }),
    vue(),
    Layouts(),

    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
        {
          glob: 'src/types/**/!(*.d).ts',
          types: true,
        },
      ],
      vueTemplate: true,
    }),
    Components({
      extensions: ['mini.vue'],
      dts: 'src/types/components.d.ts',
    }),
    UnoCSS(),
    ViteEjsPlugin({
      title: `${pkg.name} | Playground`,
      name: pkg.name,
      version: pkg.version,
      repo: pkg.repository.url,
    }),

    VueDevTools(),
  ],
})
