import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AcfirstSkeleton from '../AcfirstSkeleton'

test('renders skeleton with children', () => {
  const mockChildren = vi.fn(() => <div>Content</div>)
  render(<AcfirstSkeleton>{mockChildren}</AcfirstSkeleton>)
  expect(mockChildren).toHaveBeenCalled()
  expect(screen.getByText('Content')).toBeInTheDocument()
})