export function formatSize(size) {
  const [units, widthHeightStr] = size.split('-')
  const [width, height] = widthHeightStr.split('x')

  return `${width} x ${height} (${units})`
}

export function formatSlug(slug) {
  return slug
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
