// Mock dependencies before importing the module
import { vi } from 'vitest'

import { describe, it, expect, beforeEach } from 'vitest'
import { fetchApi } from '~/utils/api/fetchApi'
import { getPage } from '../page.server'

vi.mock('~/utils/api/fetchApi')

const mockFetchApi = vi.mocked(fetchApi)

describe('page.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('getPage', () => {
    it('returns page data when found', async () => {
      const pageData = {
        id: 1,
        attributes: {
          title: 'About Us',
          content: 'About our company',
          slug: 'about',
        },
      }
      mockFetchApi.mockResolvedValue({ data: [pageData] })

      const result = await getPage('about')

      expect(mockFetchApi).toHaveBeenCalledWith('/pages', {
        filters: {
          slug: {
            $eq: 'about',
          },
        },
        populate: 'deep',
      })
      expect(result).toEqual(pageData)
    })

    it('throws error when no page data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      await expect(getPage('invalid')).rejects.toThrow('Data missing from response')
    })

    it('throws error when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      await expect(getPage('about')).rejects.toThrow('Data missing from response')
    })
  })
})