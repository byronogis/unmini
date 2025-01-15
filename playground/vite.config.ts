import ui from '@nuxt/ui/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig, optimizeDeps } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import pkg from '../package.json'

function getRepoName(url: string) {
  const match = url.match(/github\.com\/[\w-]+\/([\w-]+)/)
  return match ? `/${match[1]}/` : '/'
}

export default defineConfig({
  base: getRepoName(pkg.repository.url),
  plugins: [
    vue(),
    ui(),
    tailwindcss(),
    // UnoCSS(),
    createHtmlPlugin({
      entry: '/src/main.ts',
      inject: {
        data: {
          title: `${pkg.name} | Playground`,
          name: pkg.name,
          version: pkg.version,
          repo: pkg.repository.url,
        },
      },
    }),
    // {
    //   name: 'arg-grep-node',
    //   transform(code, id) {
    //     console.log({ code, id })
    //   },
    // },
  ],
  optimizeDeps: {
    exclude: [
      '@ast-grep/napi-linux-x64-musl',
      '@ast-grep/napi-linux-x64-gnu',
    ],
  },
  assetsInclude: [
    '**/*.node',
  ],
})
