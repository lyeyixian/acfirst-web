export function getStrapiURL(path = '') {
  return `${process.env.STRAPI_URL_BASE || 'http://localhost:1337'}${path}`
}

export function getStrapiMedia(img) {
  if (img == null) return null
  const url = img.attributes.url

  if (url == null) {
    return null
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${getStrapiURL()}${url}`
}

export function getStrapiMedias(imgs) {
  return imgs.map((img) => getStrapiMedia(img))
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }

  return date.toLocaleDateString('en-US', options)
}
