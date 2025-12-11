// Mock dependencies before importing the module
import { vi } from 'vitest'

vi.mock('~/utils/api/fetchApi')
vi.mock('fs/promises')
vi.mock('path')

// Mock global fetch
const mockGlobalFetch = vi.fn()
vi.stubGlobal('fetch', mockGlobalFetch)

import { describe, it, expect, beforeEach } from 'vitest'
import { getReviews } from '../testimonial.server'
import { fetchApi } from '~/utils/api/fetchApi'
import fs from 'fs/promises'
import path from 'path'

const mockFetchApi = vi.mocked(fetchApi)
const mockFs = vi.mocked(fs)
const mockPath = vi.mocked(path)

describe('testimonial.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
    mockFs.writeFile.mockReset()
    mockFs.readFile.mockReset()
    mockPath.resolve.mockReset()
    mockGlobalFetch.mockReset()
    // Clear global singleton cache
    global.__singletons = {}
    // Mock environment variables
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('SERP_API_KEY', 'test-api-key')
    // Mock path.resolve to return a valid path
    mockPath.resolve.mockReturnValue('data/reviewsCache.json')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('getReviews', () => {
    it('fetches reviews from API when no cache available', async () => {
      // Clear any existing cache
      global.__singletons = {}

      const apiResponse = {
        reviews: [
          {
            rating: 5,
            date: '2023-01-01',
            snippet: 'Excellent service',
            user: {
              name: 'John Doe',
              thumbnail: 'https://example.com/photo.jpg',
            },
          },
        ],
      }

      mockFs.readFile.mockRejectedValue(new Error('File not found'))
      mockGlobalFetch.mockResolvedValue({
        json: vi.fn().mockResolvedValue(apiResponse),
      })
      mockFs.writeFile.mockResolvedValue()

      const result = await getReviews()

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        'https://serpapi.com/search.json?engine=google_maps_reviews&data_id=0x304b57814b1f25b7%3A0x37d89c1c2cb83e9f&hl=en&api_key=test-api-key'
      )
      expect(mockFs.writeFile).toHaveBeenCalled()
      expect(result.type).toBe('testimonials')
      expect(result.reviews).toHaveLength(1)
      expect(result.reviews[0]).toEqual({
        rating: 5,
        relative_time_description: '2023-01-01',
        text: 'Excellent service',
        profile_photo_url: 'https://example.com/photo.jpg',
        author_name: 'John Doe',
      })
    })

    it('returns static reviews when no API key', async () => {
      // Clear any existing cache and run first
      global.__singletons = {}
      vi.stubEnv('SERP_API_KEY', undefined)
      mockFs.readFile.mockRejectedValue(new Error('File not found'))

      const result = await getReviews()

      expect(result.type).toBe('testimonials')
      expect(result.reviews.length).toBeGreaterThan(0) // Has reviews
      expect(mockGlobalFetch).not.toHaveBeenCalled()
    })

    it('returns static reviews when API call fails', async () => {
      // Clear any existing cache and run first
      global.__singletons = {}
      mockFs.readFile.mockRejectedValue(new Error('File not found'))
      mockGlobalFetch.mockRejectedValue(new Error('API error'))
      mockFs.writeFile.mockResolvedValue()

      const result = await getReviews()

      expect(result.type).toBe('testimonials')
      expect(result.reviews.length).toBeGreaterThan(0) // Has reviews
    })


  })
})