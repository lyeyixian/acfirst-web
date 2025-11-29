import { render, screen } from '@testing-library/react'
import HeroBanner from '../HeroBanner'

// Mock Remix Link
vi.mock('@remix-run/react', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}))

const mockProps = {
  title: 'Welcome to Acfirst',
  description: 'Quality ceramics for your home',
  buttonProps: {
    text: 'Shop Now',
    url: '/products',
    type: 'primary',
    newTab: false,
  },
  imgUrl: 'https://example.com/hero.jpg',
}

test('renders hero banner with title, description, and button', () => {
  render(<HeroBanner {...mockProps} />)
  expect(screen.getByText('Welcome to Acfirst')).toBeInTheDocument()
  expect(screen.getByText('Quality ceramics for your home')).toBeInTheDocument()
  expect(screen.getByText('Shop Now')).toBeInTheDocument()
})

test('button links to correct URL', () => {
  render(<HeroBanner {...mockProps} />)
  const link = screen.getByRole('link', { name: 'Shop Now' })
  expect(link).toHaveAttribute('href', '/products')
})