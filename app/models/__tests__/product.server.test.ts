// Mock dependencies before importing the module
import { vi } from 'vitest'

vi.mock('~/utils/api/fetchApi')

import { describe, it, expect, beforeEach } from 'vitest'
import {
  getProduct,
  getProducts,
  getRelatedProducts,
  incrementProductViewCount,
  getProductCodes,
} from '../product.server'
import { fetchApi } from '~/utils/api/fetchApi'

const mockFetchApi = vi.mocked(fetchApi)

const mockProductData = {
  id: 1,
  attributes: {
    name: 'Test Product',
    code: 'TEST001',
    size: '60x60',
    surface: 'Polished',
    type: 'Ceramic',
    category: {
      data: {
        attributes: {
          name: 'Floor Tiles',
        },
      },
    },
    coverImg: {
      data: {
        attributes: {
          url: '/uploads/test-image.jpg',
        },
      },
    },
    viewCount: 10,
  },
}

const mockApiResponse = {
  data: [mockProductData],
  meta: {
    pagination: {
      pageCount: 1,
    },
  },
}

describe('product.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('getProduct', () => {
    it('returns product data when found', async () => {
      mockFetchApi.mockResolvedValue({ data: [mockProductData] })

      const result = await getProduct('TEST001')

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        filters: {
          code: {
            $eq: 'TEST001',
          },
        },
        populate: 'deep',
      })
      expect(result).toEqual(mockProductData)
    })

    it('returns null when no product data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getProduct('INVALID')

      expect(result).toBeNull()
    })

    it('returns null when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getProduct('TEST001')

      expect(result).toBeNull()
    })
  })

  describe('getProducts', () => {
    it('returns products with default options', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProducts()

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        populate: 'deep',
        pagination: {
          page: 1,
          pageSize: 6,
        },
        filters: {},
        sort: 'viewCount:desc',
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns products with custom page', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProducts({ page: 2 })

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        populate: 'deep',
        pagination: {
          page: 2,
          pageSize: 6,
        },
        filters: {},
        sort: 'viewCount:desc',
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns products with category filter', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProducts({ category: 'floor-tiles' })

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        populate: 'deep',
        pagination: {
          page: 1,
          pageSize: 6,
        },
        filters: {
          category: {
            slug: {
              $eq: 'floor-tiles',
            },
          },
        },
        sort: 'viewCount:desc',
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns products with code filters', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProducts({ filters: { code: ['TEST001', 'TEST002'] } })

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        populate: 'deep',
        pagination: {
          page: 1,
          pageSize: 6,
        },
        filters: {
          code: { $in: ['TEST001', 'TEST002'] },
        },
        sort: 'viewCount:desc',
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns products with other filters', async () => {
      mockFetchApi.mockResolvedValue(mockApiResponse)

      const result = await getProducts({ filters: { type: 'Ceramic' } })

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        populate: 'deep',
        pagination: {
          page: 1,
          pageSize: 6,
        },
        filters: {
          type: { $eq: 'Ceramic' },
        },
        sort: 'viewCount:desc',
      })
      expect(result).toEqual(mockApiResponse)
    })

    it('returns empty result when no data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getProducts()

      expect(result).toEqual({
        data: [],
        meta: {
          pagination: {
            pageCount: 0,
          },
        },
      })
    })

    it('returns empty result when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getProducts()

      expect(result).toEqual({
        data: [],
        meta: {
          pagination: {
            pageCount: 0,
          },
        },
      })
    })
  })

  describe('getRelatedProducts', () => {
    it('returns related products', async () => {
      const relatedProducts = [mockProductData]
      mockFetchApi.mockResolvedValue({ data: relatedProducts })

      const result = await getRelatedProducts('TEST001', 'floor-tiles', 'Ceramic', 'Polished', '60x60')

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        populate: 'deep',
        filters: {
          $and: [
            {
              $or: [
                {
                  category: {
                    slug: {
                      $eq: 'floor-tiles',
                    },
                  },
                },
                {
                  type: {
                    $eq: 'Ceramic',
                  },
                },
                {
                  surface: {
                    $eq: 'Polished',
                  },
                },
                {
                  size: {
                    $eq: '60x60',
                  },
                },
              ],
            },
            {
              code: {
                $ne: 'TEST001',
              },
            },
          ],
        },
        pagination: {
          start: 0,
          limit: 10,
        },
        sort: 'viewCount:desc',
      })
      expect(result).toEqual(relatedProducts)
    })

    it('returns empty array when no data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getRelatedProducts('TEST001', 'floor-tiles', 'Ceramic', 'Polished', '60x60')

      expect(result).toEqual([])
    })

    it('returns empty array when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getRelatedProducts('TEST001', 'floor-tiles', 'Ceramic', 'Polished', '60x60')

      expect(result).toEqual([])
    })
  })

  describe('incrementProductViewCount', () => {
    it('increments view count successfully', async () => {
      const updatedProduct = { ...mockProductData, attributes: { ...mockProductData.attributes, viewCount: 11 } }
      mockFetchApi.mockResolvedValue({ data: updatedProduct })

      const result = await incrementProductViewCount(1, 10)

      expect(mockFetchApi).toHaveBeenCalledWith('/products/1', {}, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            viewCount: 11,
          },
        }),
      })
      expect(result).toEqual(updatedProduct)
    })

    it('handles null viewCount', async () => {
      const updatedProduct = { ...mockProductData, attributes: { ...mockProductData.attributes, viewCount: 1 } }
      mockFetchApi.mockResolvedValue({ data: updatedProduct })

      const result = await incrementProductViewCount(1, null)

      expect(mockFetchApi).toHaveBeenCalledWith('/products/1', {}, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            viewCount: 1,
          },
        }),
      })
      expect(result).toEqual(updatedProduct)
    })

    it('returns null when unable to update', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await incrementProductViewCount(1, 10)

      expect(result).toBeNull()
    })

    it('returns null when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await incrementProductViewCount(1, 10)

      expect(result).toBeNull()
    })
  })

  describe('getProductCodes', () => {
    it('returns product codes without category filter', async () => {
      const codesData = [{ code: 'TEST001' }, { code: 'TEST002' }]
      mockFetchApi.mockResolvedValue({ data: codesData })

      const result = await getProductCodes()

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        fields: ['code'],
        sort: 'viewCount:desc',
        filters: {},
      })
      expect(result).toEqual(codesData)
    })

    it('returns product codes with category filter', async () => {
      const codesData = [{ code: 'TEST001' }]
      mockFetchApi.mockResolvedValue({ data: codesData })

      const result = await getProductCodes('floor-tiles')

      expect(mockFetchApi).toHaveBeenCalledWith('/products', {
        fields: ['code'],
        sort: 'viewCount:desc',
        filters: {
          category: {
            slug: {
              $eq: 'floor-tiles',
            },
          },
        },
      })
      expect(result).toEqual(codesData)
    })

    it('returns empty array when no data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getProductCodes()

      expect(result).toEqual([])
    })

    it('returns empty array when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getProductCodes()

      expect(result).toEqual([])
    })
  })
})