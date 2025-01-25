import { defineConfig, pluginUnoCSS } from 'unmini'

export default defineConfig({
  block: {
    config: 'unmini',
  },
  patterns: [
    '**/*.mini.vue',
    '**/*.mini.ts',
    'project{,.private}.config.json',
    'sitemap.json',
  ],
  subExtension: 'mini',
  srcDir: 'src',
  outputDir: 'dist/unmini',
  clear: true,
  transform: {
    router: {
      prefix: '/unmini',
      routesDir: 'pages',
    },
    output: {
      exclude: [
        /**
         * 不(需要)输出 app 的模板文件
         */
        ({ id, ext }) => {
          if (id.endsWith('app.mini.vue') && ext === '.wxml') {
            return true
          }
          return false
        },
      ],
    },
  },
  plugins: [
    pluginUnoCSS({
      // ...
    }),
  ],
})
