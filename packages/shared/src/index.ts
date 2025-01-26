import { execSync } from 'node:child_process'

/**
 * check if the command exists
 *
 * 检查命令是否存在
 */
export function checkCommand(command: string): boolean {
  try {
    execSync(`npx -c 'command -v ${command}'`, { stdio: 'ignore' })
    return true
  }
  catch {
    return false
  }
}

/**
 * get injected content
 *
 * if there is a start comment of the injection position,
 * then inject into it, otherwise overwrite the injection
 *
 * 获取注入后的内容
 *
 * 如果存在注入位置的起始注释，则注入其中, 否则进行覆盖注入
 */
export function getInjectedContent(options: GetInjectedContentOptions): string {
  const {
    oldContent,
    newContent,
    startComment,
    endComment,
  } = options

  let { customCommentRegExp } = options

  if (!customCommentRegExp && (!startComment || !endComment)) {
    throw new Error('startComment and endComment are required when customCommentRegExp is not passed')
  }

  const commentRegExp = customCommentRegExp ??= new RegExp(`(\/\/\\s*?${startComment}\\s*?|\\/\\*\\s*?${startComment}\\s*?\\*\\/|<!--\\s*?${startComment}\\s*?-->)[\\s\\S]*?(\/\/\\s*?${endComment}\\s*?|\\/\\*\\s*?${endComment}\\s*?\\*\\/|<!--\\s*?${endComment}\\s*?-->)`, 'g')

  const hasInjecctPlaceholder = oldContent.match(commentRegExp)

  if (hasInjecctPlaceholder) {
    return oldContent.replace(commentRegExp, `$1\n${newContent}\n$2`)
  }

  return newContent
}
interface GetInjectedContentOptions {
  oldContent: string
  newContent: string
  /**
   * start comment of the injection position
   *
   * required when customCommentRegExp is not passed
   *
   * 注入位置的起始注释
   *
   * 不传递 customCommentRegExp 时必填
   */
  startComment?: string
  /**
   * end comment of the injection position
   *
   * required when customCommentRegExp is not passed
   *
   * 注入位置的结束注释
   *
   * 不传递 customCommentRegExp 时必填
   */
  endComment?: string
  /**
   * custom comment regular expression
   *
   * startComment and endComment will be ignored
   *
   * 自定义注释正则表达式
   *
   * startComment 和 endComment 将被忽略
   */
  customCommentRegExp?: RegExp
}

/**
 * split string at the first char
 *
 * 从第一个字符处分割字符串
 *
 * @example
 * splitAtFirstChar('a.b.c', '.') // ['a', 'b.c']
 */
export function splitAtFirstChar(str: string, char: string): [string, string | undefined] {
  const index = str.indexOf(char)
  if (index === -1) {
    return [str, undefined]
  }
  return [
    str.substring(0, index),
    str.substring(index + 1),
  ]
}

/**
 * resolve code string to executable code
 *
 * 将代码字符串解析为可执行代码
 */
export function resolveCode(code: string): any {
  // eslint-disable-next-line no-new-func
  return new Function(`return ${code}`)()
}
