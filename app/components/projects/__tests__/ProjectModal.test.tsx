import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ProjectModal from '../ProjectModal'

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
  Card: Object.assign(
    ({ children, ...props }) => <div {...props}>{children}</div>,
    { Section: ({ children, ...props }) => <div {...props}>{children}</div> }
  ),
  Image: ({ src, ...props }) => <img src={src} {...props} />,
  Text: ({ children, ...props }) => <div {...props}>{children}</div>,
  Skeleton: ({ children, visible, ...props }) => (
    <div data-testid="skeleton" data-visible={visible} {...props}>
      {children}
    </div>
  ),
}))

vi.mock('../common/AcfirstCarousel', () => ({
  default: ({ children, ...props }) => <div {...props}>{children}</div>,
}))

vi.mock('../common/AcfirstSkeleton', () => ({
  default: ({ children }) => <div>{children(() => {}, null)}</div>,
}))

describe('ProjectModal', () => {
  it('renders title and images', () => {
    const projectImgUrls = ['image1.jpg', 'image2.jpg']
    render(<ProjectModal title="Project Title" projectImgUrls={projectImgUrls} />)

    expect(screen.getByText('Project Title')).toBeInTheDocument()
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', 'image1.jpg')
  })

  it('renders with single image', () => {
    const projectImgUrls = ['image1.jpg']
    render(<ProjectModal title="Project Title" projectImgUrls={projectImgUrls} />)

    expect(screen.getByText('Project Title')).toBeInTheDocument()
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(1)
  })
})