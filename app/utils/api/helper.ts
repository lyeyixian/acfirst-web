export function getStrapiURL(path = ''): string {
  return `${process.env.STRAPI_URL_BASE || 'http://127.0.0.1:1337'}${path}`
}

export function getStrapiMedia(img: any): string | null {
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

export function getStrapiMedias(imgs: any[]): (string | null)[] {
  return imgs.map((img) => getStrapiMedia(img))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

  return date.toLocaleDateString('en-US', options)
}