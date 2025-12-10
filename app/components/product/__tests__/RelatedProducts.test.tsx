import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'

// Mock dependencies
vi.mock('@mantine/core', () => ({
  createStyles: vi.fn(() => vi.fn(() => ({ classes: {} }))),
  Title: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }) => <div {...props}>{children}</div>,
  Stack: ({ children, ...props }) => <div {...props}>{children}</div>,
  ThemeIcon: ({ children, ...props }) => <div {...props}>{children}</div>,
  useMantineTheme: () => ({ white: 'white' }),
  Skeleton: ({ children, visible, ...props }) => (
    <div data-testid="skeleton" data-visible={visible} {...props}>
      {children}
    </div>
  ),
}))

vi.mock('@mantine/carousel', () => {
  const Carousel = ({ children, ...props }) => <div {...props}>{children}</div>
  Carousel.Slide = ({ children }) => <div>{children}</div>

  return {
    Carousel,
  }
})

vi.mock('../common/AcfirstCarousel', () => ({
  default: ({ children, ...props }) => <div {...props}>{children}</div>,
}))

vi.mock('../common/ProductImageCard', () => ({
  default: ({ product }) => `Product: ${product.name}`,
}))

import RelatedProducts from '../RelatedProducts'

describe('RelatedProducts', () => {
  it('renders empty state when no products', () => {
    const products = []
    render(<RelatedProducts products={products} />)

    expect(screen.getByText('Related Products')).toBeInTheDocument()
    expect(screen.getByText('No related products found')).toBeInTheDocument()
  })
})