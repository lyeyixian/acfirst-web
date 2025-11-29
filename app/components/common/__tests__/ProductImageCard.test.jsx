import { render, screen } from '@testing-library/react'
import ProductImageCard from '../ProductImageCard'

// Mock Remix Link
vi.mock('@remix-run/react', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}))

const mockProduct = {
  imgUrl: 'https://example.com/image.jpg',
  name: 'Test Product',
  code: 'test-code',
  category: 'Test Category',
  viewCount: 42,
}

test('renders product information', () => {
  render(<ProductImageCard product={mockProduct} height={300} />)
  expect(screen.getByText('Test Product')).toBeInTheDocument()
  expect(screen.getByText('Test Category')).toBeInTheDocument()
  expect(screen.getByText('42')).toBeInTheDocument()
})

test('renders link to product page', () => {
  render(<ProductImageCard product={mockProduct} height={300} />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('href', '/products/c/test-code')
})

test('handles missing viewCount', () => {
  const productWithoutViews = { ...mockProduct, viewCount: undefined }
  render(<ProductImageCard product={productWithoutViews} height={300} />)
  expect(screen.getByText('0')).toBeInTheDocument()
})