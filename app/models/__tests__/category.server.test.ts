// Mock dependencies before importing the module
import { vi } from 'vitest'

import { describe, it, expect, beforeEach } from 'vitest'
import { fetchApi } from '~/utils/api/fetchApi'
import { getCategories } from '../category.server'

vi.mock('~/utils/api/fetchApi')

const mockFetchApi = vi.mocked(fetchApi)

describe('category.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('getCategories', () => {
    it('returns categories data', async () => {
      const categoriesData = [
        {
          id: 1,
          attributes: {
            name: 'Floor Tiles',
            coverImg: { data: { attributes: { url: '/uploads/floor.jpg' } } },
          },
        },
        {
          id: 2,
          attributes: {
            name: 'Wall Tiles',
            coverImg: { data: { attributes: { url: '/uploads/wall.jpg' } } },
          },
        },
      ]
      mockFetchApi.mockResolvedValue({ data: categoriesData })

      const result = await getCategories()

      expect(mockFetchApi).toHaveBeenCalledWith('/categories', {
        populate: 'coverImg',
      })
      expect(result).toEqual(categoriesData)
    })

    it('returns null when no categories data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getCategories()

      expect(result).toBeNull()
    })

    it('returns null when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getCategories()

      expect(result).toBeNull()
    })
  })
})