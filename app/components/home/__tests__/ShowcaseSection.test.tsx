import { render, screen } from '@testing-library/react'
import ShowcaseSection from '../ShowcaseSection'

// Mock ProductImageCard
vi.mock('../../common/ProductImageCard', () => ({
  default: ({ product }) => <div data-testid="product-card">{product.name}</div>,
}))

const mockProps = {
  title: 'Showcase',
  subtitle: 'Featured products',
  products: [
    { name: 'Product 1', code: 'p1', imgUrl: 'img1.jpg', category: 'Cat1', viewCount: 10 },
    { name: 'Product 2', code: 'p2', imgUrl: 'img2.jpg', category: 'Cat2', viewCount: 20 },
  ],
}

test('renders showcase section with products', () => {
  render(<ShowcaseSection {...mockProps} />)
  expect(screen.getByText('Showcase')).toBeInTheDocument()
  expect(screen.getByText('Featured products')).toBeInTheDocument()
  expect(screen.getByText('Product 1')).toBeInTheDocument()
  expect(screen.getByText('Product 2')).toBeInTheDocument()
})

test('renders empty state when no products', () => {
  render(<ShowcaseSection title="Showcase" subtitle="Featured products" products={[]} />)
  expect(screen.getByText('No products found')).toBeInTheDocument()
})