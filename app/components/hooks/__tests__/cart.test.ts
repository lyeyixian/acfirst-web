import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useCart } from '../cart'

const mockUseRouteLoaderData = vi.fn()

vi.mock('@remix-run/react', () => ({
  useRouteLoaderData: () => mockUseRouteLoaderData(),
}))

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty cart when no loader data', () => {
    mockUseRouteLoaderData.mockReturnValue(null)

    const { result } = renderHook(() => useCart())

    expect(result.current.cartItems).toEqual([])
    expect(result.current.cartId).toBeNull()
  })

  it('extracts cart data from loader data', () => {
    const mockCartData = {
      cart: {
        attributes: {
          cartId: 'test-cart-id',
          cartItems: [{ id: 1, name: 'Test Item' }],
        },
      },
    }
    mockUseRouteLoaderData.mockReturnValue(mockCartData)

    const { result } = renderHook(() => useCart())

    expect(result.current.cartId).toBe('test-cart-id')
    expect(result.current.cartItems).toEqual([{ id: 1, name: 'Test Item' }])
  })
})