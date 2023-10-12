import qs from 'qs'
import { getStrapiURL } from './apiHelper'

// process.env.STRAPI_API_TOKEN=
// "bc4639f855e688f7aeef01b41b0ac7c6939f9491fbd3bf1c84eb8526dfb39e21aa6aaa657a36991d896e0dab4cc2fcb05058c47fd48b07b94db38691c9df4b3ea1ffe9aca3047b76f2dcb59147f702deb1aafe558651725282deb552e44c06db84b3e223969179b101e5de334723517509c1d09b86c65b576232e95f2f944c63"

export async function fetchApi(path, urlParamsObj = {}, options = {}) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      ...options,
    }

    // Build request URL
    const queryString = qs.stringify(urlParamsObj)
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ''}`
    )}`

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions)
    const data = await response.json()

    return data
  } catch (err) {
    console.error(err)
    throw new Error('Failed to fetch API')
  }
}
