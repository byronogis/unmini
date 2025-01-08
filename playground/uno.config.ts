import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetTypography(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  safelist: [
    // ...
  ],
  rules: [
    [/^grid-wrap-(.+)$/, ([, s]) => ({ 'grid-template-columns': `repeat(auto-fit, minmax(${s}, 1fr))` })],
  ],
})
