import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getStrapiURL, getStrapiMedia, getStrapiMedias, formatDate } from '../api/helper'

describe('getStrapiURL', () => {
  beforeEach(() => {
    vi.stubEnv('STRAPI_URL_BASE', 'https://api.example.com')
  })

  it('returns base URL with path', () => {
    expect(getStrapiURL('/test-path')).toBe('https://api.example.com/test-path')
  })

  it('returns base URL without path', () => {
    expect(getStrapiURL()).toBe('https://api.example.com')
  })

  it('uses default URL when env var not set', () => {
    vi.stubEnv('STRAPI_URL_BASE', undefined)
    expect(getStrapiURL('/test')).toBe('http://127.0.0.1:1337/test')
  })
})

describe('getStrapiMedia', () => {
  beforeEach(() => {
    process.env.STRAPI_URL_BASE = 'https://api.example.com'
  })

  it('returns null when img is null', () => {
    expect(getStrapiMedia(null)).toBeNull()
  })

  it('returns null when url is null', () => {
    const img = { attributes: { url: null } }
    expect(getStrapiMedia(img)).toBeNull()
  })

  it('returns external URL as is', () => {
    const img = { attributes: { url: 'https://external.com/image.jpg' } }
    expect(getStrapiMedia(img)).toBe('https://external.com/image.jpg')
  })

  it('returns external URL starting with //', () => {
    const img = { attributes: { url: '//cdn.com/image.jpg' } }
    expect(getStrapiMedia(img)).toBe('//cdn.com/image.jpg')
  })

  it('prepends Strapi URL for internal media', () => {
    const img = { attributes: { url: '/uploads/image.jpg' } }
    expect(getStrapiMedia(img)).toBe('https://api.example.com/uploads/image.jpg')
  })
})

describe('getStrapiMedias', () => {
  beforeEach(() => {
    process.env.STRAPI_URL_BASE = 'https://api.example.com'
  })

  it('maps array of images correctly', () => {
    const imgs = [
      { attributes: { url: 'https://external.com/img1.jpg' } },
      { attributes: { url: '/uploads/img2.jpg' } },
      { attributes: { url: null } },
    ]
    const result = getStrapiMedias(imgs)
    expect(result).toEqual([
      'https://external.com/img1.jpg',
      'https://api.example.com/uploads/img2.jpg',
      null,
    ])
  })

  it('returns empty array for empty input', () => {
    expect(getStrapiMedias([])).toEqual([])
  })
})

describe('formatDate', () => {
  it('formats date string correctly', () => {
    const dateString = '2023-12-25T00:00:00.000Z'
    expect(formatDate(dateString)).toBe('December 25, 2023')
  })

  it('handles different date formats', () => {
    const dateString = '2021-01-01'
    expect(formatDate(dateString)).toBe('January 1, 2021')
  })
})

