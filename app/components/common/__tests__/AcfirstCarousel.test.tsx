import { render, screen } from '@testing-library/react'
import AcfirstCarousel from '../AcfirstCarousel'

test('renders children', () => {
  render(<AcfirstCarousel><div>Test slide</div></AcfirstCarousel>)
  expect(screen.getByText('Test slide')).toBeInTheDocument()
})