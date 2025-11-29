import { render, screen } from '@testing-library/react'
import ProductsSection from '../ProductsSection'

// Mock Remix Link
vi.mock('@remix-run/react', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}))

const mockProps = {
  title: 'Our Products',
  subtitle: 'Explore our categories',
  categories: [
    { name: 'Tiles', slug: 'tiles', imgUrl: 'tile.jpg' },
    { name: 'Pipes', slug: 'pipes', imgUrl: 'pipe.jpg' },
  ],
}

test('renders products section with title and categories', () => {
  render(<ProductsSection {...mockProps} />)
  expect(screen.getByText('Our Products')).toBeInTheDocument()
  expect(screen.getByText('Explore our categories')).toBeInTheDocument()
  expect(screen.getByText('Tiles')).toBeInTheDocument()
  expect(screen.getByText('Pipes')).toBeInTheDocument()
})

test('category cards link to correct URLs', () => {
  render(<ProductsSection {...mockProps} />)
  const tilesLink = screen.getByRole('link', { name: /tiles/i })
  const pipesLink = screen.getByRole('link', { name: /pipes/i })
  expect(tilesLink).toHaveAttribute('href', '/products/tiles')
  expect(pipesLink).toHaveAttribute('href', '/products/pipes')
})