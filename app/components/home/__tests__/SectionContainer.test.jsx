import { render, screen } from '@testing-library/react'
import SectionContainer from '../SectionContainer'

test('renders section container with title, subtitle, and children', () => {
  render(
    <SectionContainer title="Test Title" subtitle="Test Subtitle">
      <div>Test Content</div>
    </SectionContainer>
  )
  expect(screen.getByText('Test Title')).toBeInTheDocument()
  expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  expect(screen.getByText('Test Content')).toBeInTheDocument()
})