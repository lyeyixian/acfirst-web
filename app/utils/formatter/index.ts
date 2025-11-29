export function formatSize(size: string): string {
  const [units, widthHeightStr] = size.split('-')
  const [width, height] = widthHeightStr.split('x')

  return `${width} x ${height} (${units})`
}