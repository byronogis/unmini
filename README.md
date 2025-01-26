# unmini

<!-- automd:badges name="unmini" license codecov bundlephobia packagephobia -->

[![npm version](https://img.shields.io/npm/v/unmini)](https://npmjs.com/package/unmini)
[![npm downloads](https://img.shields.io/npm/dm/unmini)](https://npm.chart.dev/unmini)
[![bundle size](https://img.shields.io/bundlephobia/minzip/unmini)](https://bundlephobia.com/package/unmini)
[![codecov](https://img.shields.io/codecov/c/gh/byronogis/unmini)](https://codecov.io/gh/byronogis/unmini)
[![license](https://img.shields.io/github/license/byronogis/unmini)](https://github.com/byronogis/unmini/blob/main/LICENSE)

<!-- /automd -->

[![JSDocs][jsdocs-src]][jsdocs-href]

Code Generation Engine for Mini Programs

Write code in your preferred way and generate mini program code.

Should support any mini program platform.

- [unmini](#unmini)
  - [How](#how)
  - [Usage](#usage)
  - [Loader](#loader)
  - [Plugin](#plugin)
  - [Contribution](#contribution)
  - [Sponsors](#sponsors)
  - [License](#license)

<details>
<summary>You might want to write in a Vue single-file component style and convert it to separate files later, which is perfectly fine.</summary>

Here's how you can write it (using WeChat Mini Program as an example):

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

The final generated mini program code:

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

All of this can be achieved through unmini.

## How

> Through an extensible plugin ([loader](#loader) & [plugin](#plugin)) mechanism, you can customize code generation rules and code output.

Files are collected through patterns, files matching the subExtension are processed by corresponding loaders, while other files are output directly.

The final files will not include the subExtension.

See examples in the [playground](./playground) directory.

## Usage

> Examples can be found in the [playground](./playground) directory.

Install:

```bash
npm i unmini
# or use pnpm if you want
pnpm i unmini
```

Add `unmini.config.ts`:

```ts
import { defineConfig } from 'unmini'

export default defineConfig({
  patterns: [
    '**/*.mini.ts', // Will process with corresponding loader if there's a loader that can handle ts files
    'project{,.private}.config.json', // Will be output directly without loader processing
  ],
  subExtension: 'mini',
  srcDir: 'src',
  outputDir: 'dist/unmini',
})
```

Run `npx unmini`.

## Loader

Match file extensions and perform corresponding transformations.

Here are the built-in loaders:

- [vue](./packages/loader-vue): Includes **a tiny portion** of vue syntax transformation, meaning you can write both Vue code and mini program code simultaneously (see [playground](./playground/)). You can also pass `keep: true` to preserve the original code without transformation, solely for file splitting purposes.

- [ts](./packages/loader-ts): Uses babel to transform ts files to js files.

## Plugin

You can extend functionality through plugins during the engine's lifecycle.

Here are the built-in plugins:

- [unocss](./packages/plugin-unocss): Process atomic CSS using unocss.

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
