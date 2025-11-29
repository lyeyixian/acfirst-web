import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'

test('renders title and icon', () => {
  render(<EmptyState title="No items found" />)
  expect(screen.getByText('No items found')).toBeInTheDocument()
  expect(document.querySelector('svg')).toBeInTheDocument() // IconFileX
})

test('renders children', () => {
  render(
    <EmptyState title="Empty">
      <div>Some description</div>
    </EmptyState>
  )
  expect(screen.getByText('Some description')).toBeInTheDocument()
})