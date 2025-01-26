# unmini

<!-- automd:badges name="unmini" license codecov bundlephobia packagephobia -->

[![npm version](https://img.shields.io/npm/v/unmini)](https://npmjs.com/package/unmini)
[![npm downloads](https://img.shields.io/npm/dm/unmini)](https://npm.chart.dev/unmini)
[![bundle size](https://img.shields.io/bundlephobia/minzip/unmini)](https://bundlephobia.com/package/unmini)
[![codecov](https://img.shields.io/codecov/c/gh/byronogis/unmini)](https://codecov.io/gh/byronogis/unmini)
[![license](https://img.shields.io/github/license/byronogis/unmini)](https://github.com/byronogis/unmini/blob/main/LICENSE)

<!-- /automd -->

[![JSDocs][jsdocs-src]][jsdocs-href]

小程序的代码生成引擎

使用让自己舒服的方式编写代码, 并最终生成小程序的代码.

应该可以支持任何小程序.

- [unmini](#unmini)
  - [How](#how)
  - [Usage](#usage)
  - [Loader](#loader)
  - [Plugin](#plugin)
  - [Contribution](#contribution)
  - [Sponsors](#sponsors)
  - [License](#license)

<details>
<summary>也许你可能想用类似 vue 单文件的形式书写, 并在最后转换为独立的文件, 这没问题.</summary>

你可以这样写(以微信小程序为例):

```vue
<script>
Component({
  data: {
    msg: 'Hello World'
  },
  methods: {
    onTap() {
      console.log('onTap')
    }
  }
})
</script>

<template>
  <view>
    <text>{{ msg }}</text>
    <button bindtap="onTap">
      Click me
    </button>
  </view>
</template>

<style>
  view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  text {
    font-size: 20px;
  }
  button {
    margin-top: 20px;
  }
</style>

<config>
{
  "navigationBarTitleText": "Hello World"
}
</config>
```

最终生成小程序的代码:

- xxx.wxml

```html
<view class="view">
  <text>{{ msg }}</text>
  <button bindtap="onTap">Click me</button>
</view>
```

- xxx.js

```js
Component({
  data: {
    msg: 'Hello World'
  },
  methods: {
    onTap() {
      console.log('onTap')
    }
  }
})
```

- xxx.wxss

```css
.view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
text {
  font-size: 20px;
}
button {
  margin-top: 20px;
}
```

- xxx.json

```json
{
  "navigationBarTitleText": "Hello World"
}
```
</details>

这一切都可以通过 unmini 实现.

## How

> 通过可扩展的插件([loader](#loader) & [plugin](#plugin))机制, 你可以自定义代码生成的规则, 以及代码的输出.

通过 pattern 收集文件, 对匹配 subExtension 成功的文件进行选择对应的 loader 转换处理, 其它文件则直接输出.

最终的文件不会包含 subExtension.

可参考 [playground](./playground) 目录下的示例.

## Usage

> [playground](./playground) 目录下有示例.

Install:

```bash
npm i unmini
# or use pnpm you want
pnpm i unmini
```

Add `unmini.config.ts`:

```ts
import { defineConfig } from 'unmini'

export default defineConfig({
  patterns: [
    '**/*.mini.ts', // 在具有可以处理 ts 文件的 loader 的情况下, 会执行对应 loader 的处理
    'project{,.private}.config.json', // 不会执行 loader 的处理, 直接输出
  ],
  subExtension: 'mini',
  srcDir: 'src',
  outputDir: 'dist/unmini',
})
```

Run `npx unmini`.

## Loader

匹配文件后缀, 并执行对应的转换处理.

下面是内置的 loader:

- [vue](./packages/loader-vue): 内置了 **一小部分** vue 语法的转换, 也就是说你可以同时在写 vue 代码和小程序代码, (可见[playgrpund](./playground/)), 你也可以通过传递 `keep: true` 来保留原始代码而不进行转换, 单纯起到文件分割的作用.

- [ts](./packages/loader-ts): 使用了 babel 转换 ts 文件为 js 文件.

## Plugin

在引擎的生命周期中, 你可以通过插件来扩展功能.

下面是内置的 plugin:

- [unocss](./packages/plugin-unocss): 通过 unocss 来处理原子化 css.

<!-- automd:fetch url="gh:byronogis/.github/main/snippets/readme-contrib-node-pnpm.md" -->

## Contribution

<details>
  <summary>Local development</summary>

- Clone this repository
- Install the latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run tests using `pnpm dev` or `pnpm test`

</details>

<!-- /automd -->

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/byronogis/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/byronogis/static/sponsors.svg'/>
  </a>
</p>

## License

<!-- automd:contributors author="byronogis" license="MIT" -->

Published under the [MIT](https://github.com/byronogis/unmini/blob/main/LICENSE) license.
Made by [@byronogis](https://github.com/byronogis) and [community](https://github.com/byronogis/unmini/graphs/contributors) 💛
<br><br>
<a href="https://github.com/byronogis/unmini/graphs/contributors">
<img src="https://contrib.rocks/image?repo=byronogis/unmini" />
</a>

<!-- /automd -->

<!-- automd:with-automd lastUpdate -->

---

_🤖 auto updated with [automd](https://automd.unjs.io) (last updated: Sun Jan 26 2025)_

<!-- /automd -->

<!-- Badges -->

[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-1fa669
[jsdocs-href]: https://www.jsdocs.io/package/pausable-timers
