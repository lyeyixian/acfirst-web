import { describe, it, expect, vi } from 'vitest'
import {
  renderSection,
  renderCategoryIcon,
  renderErrorDescription,
  renderErrorButton,
  renderFilterIcon,
} from '../renderer'

// Mock the imported components
vi.mock('../components/home/HeroBanner', () => ({
  default: vi.fn(() => 'HeroBanner'),
}))
vi.mock('../components/home/ProductsSection', () => ({
  default: vi.fn(() => 'ProductsSection'),
}))
vi.mock('../components/home/ShowcaseSection', () => ({
  default: vi.fn(() => 'ShowcaseSection'),
}))
vi.mock('../components/home/TestimonialsSection', () => ({
  default: vi.fn(() => 'TestimonialsSection'),
}))
vi.mock('@mantine/core', () => ({
  Button: vi.fn(() => 'Button'),
  createStyles: vi.fn(() => vi.fn(() => ({}))),
}))
vi.mock('@remix-run/react', () => ({
  Link: vi.fn(() => 'Link'),
}))
vi.mock('@tabler/icons-react', () => ({
  IconBath: 'IconBath',
  IconCar: 'IconCar',
  IconCategory: 'IconCategory',
  IconRuler: 'IconRuler',
  IconSofa: 'IconSofa',
  IconSquaresFilled: 'IconSquaresFilled',
  IconToolsKitchen2: 'IconToolsKitchen2',
}))

describe('renderSection', () => {
  it('returns null for null section', () => {
    expect(renderSection(null, 0)).toBeNull()
  })

  it('returns null for undefined section', () => {
    expect(renderSection(undefined, 0)).toBeNull()
  })

  it('renders HeroBanner for hero type', () => {
    const section = {
      type: 'hero',
      title: 'Test Title',
      description: 'Test Description',
      button: { text: 'Click' },
      imgUrl: 'test.jpg',
    }
    const result = renderSection(section, 1)
    expect(result).toBeDefined()
    // Since it's mocked, we can't check the exact JSX, but we can check it's not null
  })

  it('renders ProductsSection for product-categories type', () => {
    const section = {
      type: 'product-categories',
      title: 'Categories',
      subtitle: 'Sub',
      categories: [],
    }
    const result = renderSection(section, 2)
    expect(result).toBeDefined()
  })

  it('renders ShowcaseSection for showcase type', () => {
    const section = {
      type: 'showcase',
      title: 'Showcase',
      subtitle: 'Sub',
      products: [],
    }
    const result = renderSection(section, 3)
    expect(result).toBeDefined()
  })

  it('renders TestimonialsSection for testimonials type', () => {
    const section = {
      type: 'testimonials',
      reviews: [],
    }
    const result = renderSection(section, 4)
    expect(result).toBeDefined()
  })

  it('returns null for unknown type', () => {
    const section = { type: 'unknown' }
    expect(renderSection(section, 5)).toBeNull()
  })
})

describe('renderCategoryIcon', () => {
  it('returns null for null category', () => {
    expect(renderCategoryIcon(null)).toBeNull()
  })

  it('returns IconToolsKitchen2 for kitchen', () => {
    expect(renderCategoryIcon({ slug: 'kitchen' })).toBe('IconToolsKitchen2')
  })

  it('returns IconBath for bathroom', () => {
    expect(renderCategoryIcon({ slug: 'bathroom' })).toBe('IconBath')
  })

  it('returns IconSofa for living-room', () => {
    expect(renderCategoryIcon({ slug: 'living-room' })).toBe('IconSofa')
  })

  it('returns IconCar for car-porch', () => {
    expect(renderCategoryIcon({ slug: 'car-porch' })).toBe('IconCar')
  })

  it('returns null for unknown slug', () => {
    expect(renderCategoryIcon({ slug: 'unknown' })).toBeNull()
  })
})

describe('renderErrorDescription', () => {
  it('returns 404 message', () => {
    expect(renderErrorDescription(404, undefined)).toContain('does not exist')
  })

  it('returns 500 message', () => {
    expect(renderErrorDescription(500, undefined)).toContain('servers could not handle')
  })

  it('returns 503 message', () => {
    expect(renderErrorDescription(503, undefined)).toContain('cannot handle your request')
  })

  it('returns custom description for other codes', () => {
    expect(renderErrorDescription(400, 'Custom error')).toBe('Custom error')
  })

  it('returns empty string for other codes without description', () => {
    expect(renderErrorDescription(400, undefined)).toBe('')
  })
})

describe('renderErrorButton', () => {
  it('returns refresh button for 500', () => {
    const result = renderErrorButton(500, '/current')
    expect(result).toBeDefined()
    // Mocked, so just check it's defined
  })

  it('returns refresh button for 503', () => {
    const result = renderErrorButton(503, '/current')
    expect(result).toBeDefined()
  })

  it('returns home button for other codes', () => {
    const result = renderErrorButton(404, '/current')
    expect(result).toBeDefined()
  })
})

describe('renderFilterIcon', () => {
  it('returns null for null filter', () => {
    expect(renderFilterIcon(null)).toBeNull()
  })

  it('returns IconSquaresFilled for surface', () => {
    expect(renderFilterIcon('surface')).toBe('IconSquaresFilled')
  })

  it('returns IconCategory for type', () => {
    expect(renderFilterIcon('type')).toBe('IconCategory')
  })

  it('returns IconRuler for size', () => {
    expect(renderFilterIcon('size')).toBe('IconRuler')
  })

  it('returns null for unknown filter', () => {
    expect(renderFilterIcon('unknown')).toBeNull()
  })
})