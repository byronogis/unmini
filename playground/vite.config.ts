import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import pkg from '../package.json'

function getRepoName(url: string) {
  const match = url.match(/github\.com\/[\w-]+\/([\w-]+)/)
  return match ? `/${match[1]}/` : '/'
}

export default defineConfig({
  base: getRepoName(pkg.repository.url),
  plugins: [
    UnoCSS(),
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
  ],
})
