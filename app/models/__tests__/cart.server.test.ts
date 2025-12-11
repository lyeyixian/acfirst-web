// Mock dependencies before importing the module
import { vi } from 'vitest'

vi.mock('~/utils/api/fetchApi')
vi.mock('~/utils/api/helper')
vi.mock('../product.server')

import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCart,
  addCart,
  clearCart,
  addToCart,
  updateCart,
  removeFromCart,
} from '../cart.server'
import { fetchApi } from '~/utils/api/fetchApi'
import { getStrapiMedia } from '~/utils/api/helper'
import { getProduct } from '../product.server'

// Get references to the mocked functions
const mockFetchApi = vi.mocked(fetchApi)
const mockGetStrapiMedia = vi.mocked(getStrapiMedia)
const mockGetProduct = vi.mocked(getProduct)

const mockCartData = {
  id: 1,
  attributes: {
    cartId: 'test-cart-id',
    cartItems: [
      {
        id: 1,
        name: 'Test Product',
        code: 'TEST001',
        size: '60x60',
        surface: 'Polished',
        type: 'Ceramic',
        category: 'Floor Tiles',
        imgUrl: 'https://example.com/image.jpg',
        quantity: 2,
      },
    ],
  },
}

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

describe('cart.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
    mockGetStrapiMedia.mockReset()
    mockGetProduct.mockReset()
  })

  describe('getCart', () => {
    it('returns cart data when found', async () => {
      mockFetchApi.mockResolvedValue({ data: [mockCartData] })

      const result = await getCart('test-cart-id')

      expect(mockFetchApi).toHaveBeenCalledWith('/carts', {
        filters: {
          cartId: {
            $eq: 'test-cart-id',
          },
        },
      })
      expect(result).toEqual(mockCartData)
    })

    it('returns null when no cart data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getCart('test-cart-id')

      expect(result).toBeNull()
    })

    it('returns null when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getCart('test-cart-id')

      expect(result).toBeNull()
    })
  })

  describe('addCart', () => {
    it('creates a new cart successfully', async () => {
      const newCartData = { id: 2, attributes: { cartItems: [] } }
      mockFetchApi.mockResolvedValue({ data: newCartData })

      const result = await addCart()

      expect(mockFetchApi).toHaveBeenCalledWith('/carts', {}, {
        method: 'POST',
        body: JSON.stringify({ data: { cartItems: [] } }),
      })
      expect(result).toEqual(newCartData)
    })

    it('throws error when unable to create cart', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      await expect(addCart()).rejects.toThrow('Unable to create cart!')
    })
  })

  describe('clearCart', () => {
    it('clears cart items successfully', async () => {
      mockFetchApi
        .mockResolvedValueOnce({ data: [mockCartData] }) // getCart call
        .mockResolvedValueOnce({ data: { ...mockCartData, attributes: { ...mockCartData.attributes, cartItems: [] } } }) // clearCart call

      const result = await clearCart('test-cart-id')

      expect(mockFetchApi).toHaveBeenCalledTimes(2)
      expect(result.attributes.cartItems).toEqual([])
    })

    it('throws 404 when cart not found', async () => {
      mockFetchApi.mockResolvedValueOnce({ data: null }) // getCart returns null

      await expect(clearCart('test-cart-id')).rejects.toThrow()
    })
  })

  describe('addToCart', () => {
    beforeEach(() => {
      mockGetStrapiMedia.mockReturnValue('https://example.com/image.jpg')
    })

    it('adds new item to cart', async () => {
      const cartWithoutItems = { ...mockCartData, attributes: { ...mockCartData.attributes, cartItems: [] } }
      mockGetProduct.mockResolvedValue(mockProductData)
      mockGetStrapiMedia.mockReturnValue('mock-image-url')
      mockFetchApi
        .mockResolvedValueOnce({ data: [cartWithoutItems] }) // getCart
        .mockResolvedValueOnce({ data: { ...cartWithoutItems, attributes: { ...cartWithoutItems.attributes, cartItems: [{
          id: mockProductData.id,
          name: mockProductData.attributes.name,
          code: mockProductData.attributes.code,
          size: mockProductData.attributes.size,
          surface: mockProductData.attributes.surface,
          type: mockProductData.attributes.type,
          category: mockProductData.attributes.category.data.attributes.name,
          imgUrl: 'mock-image-url',
          quantity: 2,
        }] } } }) // update cart

      const result = await addToCart('TEST001', 2, 'test-cart-id')

      expect(mockGetProduct).toHaveBeenCalledWith('TEST001')
      expect(mockGetStrapiMedia).toHaveBeenCalled()
      expect(mockFetchApi).toHaveBeenCalledTimes(2)
      expect(result.attributes.cartItems).toHaveLength(1)
      expect(result.attributes.cartItems[0].quantity).toBe(2)
    })

    it('increases quantity of existing item', async () => {
      mockFetchApi
        .mockResolvedValueOnce({ data: [mockCartData] }) // getCart
        .mockResolvedValueOnce({ data: { ...mockCartData, attributes: { ...mockCartData.attributes, cartItems: [{ ...mockCartData.attributes.cartItems[0], quantity: 4 }] } } }) // update cart

      const result = await addToCart('TEST001', 2, 'test-cart-id')

      expect(mockGetProduct).not.toHaveBeenCalled()
      expect(result.attributes.cartItems[0].quantity).toBe(4)
    })

    it('returns error when cart not found', async () => {
      mockFetchApi.mockResolvedValueOnce({ data: null }) // getCart returns null

      const result = await addToCart('TEST001', 2, 'test-cart-id')

      expect(result).toEqual({ error: 'Cart not found' })
    })

    it('returns error when product not found', async () => {
      const cartWithoutItems = { ...mockCartData, attributes: { ...mockCartData.attributes, cartItems: [] } }
      mockGetProduct.mockResolvedValue(null)
      mockFetchApi.mockResolvedValueOnce({ data: [cartWithoutItems] }) // getCart

      const result = await addToCart('INVALID', 2, 'test-cart-id')

      expect(mockGetProduct).toHaveBeenCalledWith('INVALID')
      expect(result).toEqual({ error: 'Product not found' })
    })

    it('returns error when unable to update cart', async () => {
      const cartWithoutItems = { ...mockCartData, attributes: { ...mockCartData.attributes, cartItems: [] } }
      mockGetProduct.mockResolvedValue(mockProductData)
      mockGetStrapiMedia.mockReturnValue('mock-image-url')
      mockFetchApi
        .mockResolvedValueOnce({ data: [cartWithoutItems] }) // getCart
        .mockResolvedValueOnce({ data: null }) // update cart fails

      const result = await addToCart('TEST001', 2, 'test-cart-id')

      expect(mockGetProduct).toHaveBeenCalledWith('TEST001')
      expect(result).toEqual({ error: 'Unable to add to cart!' })
    })
  })

  describe('updateCart', () => {
    it('updates item quantity successfully', async () => {
      mockFetchApi
        .mockResolvedValueOnce({ data: [mockCartData] }) // getCart
        .mockResolvedValueOnce({ data: { ...mockCartData, attributes: { ...mockCartData.attributes, cartItems: [{ ...mockCartData.attributes.cartItems[0], quantity: 5 }] } } }) // update cart

      const result = await updateCart('TEST001', 5, 'test-cart-id')

      expect(result.attributes.cartItems[0].quantity).toBe(5)
    })

    it('returns error when cart not found', async () => {
      mockFetchApi.mockResolvedValueOnce({ data: null }) // getCart returns null

      const result = await updateCart('TEST001', 5, 'test-cart-id')

      expect(result).toEqual({ error: 'Cart not found' })
    })

    it('returns error when unable to update cart', async () => {
      mockFetchApi
        .mockResolvedValueOnce({ data: [mockCartData] }) // getCart
        .mockResolvedValueOnce({ data: null }) // update cart fails

      const result = await updateCart('TEST001', 5, 'test-cart-id')

      expect(result).toEqual({ error: 'Unable to update existing cart item!' })
    })
  })

  describe('removeFromCart', () => {
    it('removes item from cart successfully', async () => {
      mockFetchApi
        .mockResolvedValueOnce({ data: [mockCartData] }) // getCart
        .mockResolvedValueOnce({ data: { ...mockCartData, attributes: { ...mockCartData.attributes, cartItems: [] } } }) // update cart

      const result = await removeFromCart('TEST001', 'test-cart-id')

      expect(result.attributes.cartItems).toEqual([])
    })

    it('returns error when cart not found', async () => {
      mockFetchApi.mockResolvedValueOnce({ data: null }) // getCart returns null

      const result = await removeFromCart('TEST001', 'test-cart-id')

      expect(result).toEqual({ error: 'Cart not found' })
    })

    it('returns error when unable to remove from cart', async () => {
      mockFetchApi
        .mockResolvedValueOnce({ data: [mockCartData] }) // getCart
        .mockResolvedValueOnce({ data: null }) // update cart fails

      const result = await removeFromCart('TEST001', 'test-cart-id')

      expect(result).toEqual({ error: 'Unable to remove product from cart!' })
    })
  })
})