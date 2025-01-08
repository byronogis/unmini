export function sum(a: number, b: number): number {
  // Convert to string and get decimal places count
  // 转换为字符串，获取小数位数
  const aDecimals = (a.toString().split('.')[1] || '').length
  const bDecimals = (b.toString().split('.')[1] || '').length

  // Get maximum decimal places
  // 取最大小数位数
  const maxDecimals = Math.max(aDecimals, bDecimals)

  // Calculate and fix precision
  // 进行计算并修正精度
  return Number((a + b).toFixed(maxDecimals))
}
