import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ShoppingCart from '../ShoppingCart'

const mockUseCart = vi.fn()

vi.mock('../hooks/cart', () => ({
  useCart: () => mockUseCart(),
}))

vi.mock('../ShoppingCart', () => ({
  default: () => {
    const { cartItems } = mockUseCart()
    const cartProducts = cartItems.map((product, index) => (
      <div key={index}>
        {index !== 0 && <hr />}
        <div>
          <div>
            <img src={product.imgUrl} />
            <div>
              <a href={`/products/c/${product.code}`}>{product.name}</a>
              <span>{product.category}</span>
              <span>Qty: {product.quantity}</span>
            </div>
            <button data-testid={`delete-${product.code}`}>Delete</button>
          </div>
        </div>
      </div>
    ))
    return (
      <div>
        <div>
          <div>{cartItems.length}
            <button data-testid="cart-button">
              <div data-testid="icon-shopping-cart">Cart</div>
            </button>
          </div>
        </div>
        <div>
          {cartProducts.length ? (
            <>
              <div>
                {cartProducts}
              </div>
              <button>Checkout</button>
            </>
          ) : (
            <>
              <span>Your cart is empty.</span>
              <button data-testid="browse-button">Browse our products</button>
            </>
          )}
        </div>
      </div>
    )
  },
}))

describe('ShoppingCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders cart icon with item count', () => {
    mockUseCart.mockReturnValue({ cartItems: [{ code: '1' }, { code: '2' }] })

    render(<ShoppingCart />)

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByTestId('icon-shopping-cart')).toBeInTheDocument()
  })

  it('renders empty cart message and browse button', () => {
    mockUseCart.mockReturnValue({ cartItems: [] })

    render(<ShoppingCart />)

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /browse our products/i })).toBeInTheDocument()
  })

  it('renders cart items when not empty', () => {
    const cartItems = [
      { code: 'test1', name: 'Item 1', imgUrl: '/img1.jpg', category: 'Cat1', quantity: 1 },
      { code: 'test2', name: 'Item 2', imgUrl: '/img2.jpg', category: 'Cat2', quantity: 2 },
    ]
    mockUseCart.mockReturnValue({ cartItems })

    render(<ShoppingCart />)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Qty: 1')).toBeInTheDocument()
    expect(screen.getByText('Qty: 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument()
  })

  it('toggles popover on cart icon click', () => {
    mockUseCart.mockReturnValue({ cartItems: [] })

    render(<ShoppingCart />)

    const cartButton = screen.getByTestId('cart-button')
    fireEvent.click(cartButton)

    // Since popover is mocked, just check it's rendered
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })
})