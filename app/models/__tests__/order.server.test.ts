// Mock dependencies before importing the module
import { vi } from 'vitest'

vi.mock('~/utils/api/fetchApi')

import { describe, it, expect, beforeEach } from 'vitest'
import { createOrder, getOrder } from '../order.server'
import { fetchApi } from '~/utils/api/fetchApi'

const mockFetchApi = vi.mocked(fetchApi)

describe('order.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchApi.mockReset()
  })

  describe('createOrder', () => {
    it('creates order successfully', async () => {
      const orderData = {
        name: 'John Doe',
        phone: '1234567890',
        enquiry: 'Test enquiry',
        cartItems: [
          { code: 'TEST001', quantity: 2 },
          { code: 'TEST002', quantity: 1 },
        ],
      }
      const createdOrder = { id: 1, attributes: orderData }
      mockFetchApi.mockResolvedValue({ data: createdOrder })

      const result = await createOrder(orderData)

      expect(mockFetchApi).toHaveBeenCalledWith('/orders', {}, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            name: 'John Doe',
            phone: '1234567890',
            enquiry: 'Test enquiry',
            productDetails: [
              { code: 'TEST001', quantity: 2 },
              { code: 'TEST002', quantity: 1 },
            ],
          },
        }),
      })
      expect(result).toEqual(createdOrder)
    })

    it('returns null when unable to create order', async () => {
      const orderData = {
        name: 'John Doe',
        phone: '1234567890',
        enquiry: 'Test enquiry',
        cartItems: [],
      }
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await createOrder(orderData)

      expect(result).toBeNull()
    })

    it('returns null when fetchApi returns null', async () => {
      const orderData = {
        name: 'John Doe',
        phone: '1234567890',
        enquiry: 'Test enquiry',
        cartItems: [],
      }
      mockFetchApi.mockResolvedValue(null)

      const result = await createOrder(orderData)

      expect(result).toBeNull()
    })
  })

  describe('getOrder', () => {
    it('returns order data when found', async () => {
      const orderData = {
        id: 1,
        attributes: {
          name: 'John Doe',
          phone: '1234567890',
          enquiry: 'Test enquiry',
          productDetails: [
            { code: 'TEST001', quantity: 2 },
          ],
        },
      }
      mockFetchApi.mockResolvedValue({ data: [orderData] })

      const result = await getOrder('ORDER123')

      expect(mockFetchApi).toHaveBeenCalledWith('/orders', {
        filters: {
          orderId: {
            $eq: 'ORDER123',
          },
        },
        populate: 'productDetails',
      })
      expect(result).toEqual(orderData)
    })

    it('returns null when no order data', async () => {
      mockFetchApi.mockResolvedValue({ data: null })

      const result = await getOrder('INVALID')

      expect(result).toBeNull()
    })

    it('returns null when fetchApi returns null', async () => {
      mockFetchApi.mockResolvedValue(null)

      const result = await getOrder('ORDER123')

      expect(result).toBeNull()
    })
  })
})