import type { DirectiveNode, ElementNode } from '@vue/compiler-core'
import { baseParse, createRoot, NodeTypes } from '@vue/compiler-core'
import { compileTemplate, parse } from '@vue/compiler-sfc'
import { readFileSync, writeFileSync } from 'fs-extra'

const content = readFileSync('./demo.mini.vue', {
  encoding: 'utf-8',
})

// 解析Vue单文件
const { descriptor } = parse(content)

// writeFileSync('./output.wxml', newTemplate, 'utf-8')
// console.log('转换后的模板已保存到 output.wxml')
