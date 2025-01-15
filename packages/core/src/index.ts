import type {
  TransformerResult,
  TranssformerOptions,
} from './types/transformer'
import { Lang, parse } from '@ast-grep/napi'
import { parse as sfcParse } from '@vue/compiler-sfc'
import {
  transformer as weixinTransformer,
} from './platforms/weixin'
import {
  expandAttributeSameNameShorthand,
} from './preflight/template'

export function transformer({
  source,
  platform = 'weixin',
}: TranssformerOptions): TransformerResult {
  const {
    template,
    // script,
    // scriptSetup,
    // styles,
    // customBlocks,
  } = sfcParse(source).descriptor

  // const style = styles[0]
  // const config = customBlocks.find(block => block.type === 'config')

  const templateRoot = parse(Lang.Html, template?.content ?? '').root()

  const preflightedTemplate = expandAttributeSameNameShorthand(templateRoot)

  if (platform === 'weixin') {
    return weixinTransformer({ template: parse(Lang.Html, preflightedTemplate).root() })
    // return templateContent
  }

  return {
    template: {
      content: template?.content ?? '',
    },
  }
}
