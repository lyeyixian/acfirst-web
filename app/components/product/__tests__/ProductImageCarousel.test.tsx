import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ProductImageCarousel from '../ProductImageCarousel'

// Mock dependencies
vi.mock('@mantine/carousel', () => {
  const Carousel = ({ children, ...props }) => <div {...props}>{children}</div>
  Carousel.Slide = ({ children }) => <div>{children}</div>

  return {
    Carousel,
    useAnimationOffsetEffect: vi.fn(),
  }
})

vi.mock('@mantine/core', () => ({
  createStyles: vi.fn(() => vi.fn(() => ({ classes: {} }))),
  Image: ({ src, ...props }) => <img src={src} {...props} />,
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  Skeleton: ({ children, visible, ...props }) => (
    <div data-testid="skeleton" data-visible={visible} {...props}>
      {children}
    </div>
  ),
}))

vi.mock('../common/AcfirstCarousel', () => ({
  default: ({ children, onSlideChange, ...props }) => (
    <div {...props} onClick={() => onSlideChange && onSlideChange(1)}>
      {children}
    </div>
  ),
}))

vi.mock('../common/AcfirstSkeleton', () => ({
  default: ({ children }) => <div>{children(() => {}, null)}</div>,
}))

describe('ProductImageCarousel', () => {
  it('renders big and small carousels with images', () => {
    const productImages = ['image1.jpg', 'image2.jpg']
    render(<ProductImageCarousel productImages={productImages} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(4) // 2 big + 2 small
    expect(images[0]).toHaveAttribute('src', 'image1.jpg')
    expect(images[1]).toHaveAttribute('src', 'image2.jpg')
  })

  it('renders with single image', () => {
    const productImages = ['image1.jpg']
    render(<ProductImageCarousel productImages={productImages} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2) // 1 big + 1 small
  })

  it('handles empty images', () => {
    const productImages = []
    render(<ProductImageCarousel productImages={productImages} />)

    const images = screen.queryAllByRole('img')
    expect(images).toHaveLength(0)
  })
})