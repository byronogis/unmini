/* eslint-disable antfu/no-top-level-await */
import { Lang, parse } from '@ast-grep/napi'
import { compileTemplate, parse as sfcParse } from '@vue/compiler-sfc'
import { mkdir, readFileSync, writeFile } from 'fs-extra'
import {
  transformer,
} from './src'

const file = 'demo.mini.vue'

const source = readFileSync(`./${file}`, {
  encoding: 'utf-8',
})

// const {
//   template,
//   script,
//   // scriptSetup,
//   styles,
//   customBlocks,
// } = sfcParse(source).descriptor

// const style = styles[0]
// const config = customBlocks.find(block => block.type === 'config')

// // const blocks = [
// //   template,
// //   script,
// //   // scriptSetup,
// //   style,
// //   config,
// // ]

// // const fileExtensions = {
// //   template: 'wxml',
// //   script: 'js',
// //   style: 'wxss',
// //   config: 'json',
// // } as Record<string, string>

// // const storageTask = blocks.map((block) => {
// //   return writeFile(
// //     `./output/${file.replace('.mini.vue', '')}.${fileExtensions[block?.type ?? '']}`,
// //     block?.content ?? '',
// //     {
// //       encoding: 'utf-8',
// //     },
// //   )
// // })

await mkdir('./output').catch(() => {})

// // Promise.all(storageTask).then(() => {
// //   console.log('转换后的模板已保存到 output 目录')
// // })

// const templateRoot = parse(Lang.Html, template?.content ?? '').root()
const res = transformer({
  source,
  platform: 'weixin',
})

writeFile(
  `./output/${file.replace('.mini.vue', '')}.wxml`,
  res.template.content,
  {
    encoding: 'utf-8',
  },
)
