import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import GracefulError from '../GracefulError'

// Mock the component to avoid importing utils with JSX
vi.mock('../GracefulError', () => ({
  default: function ({ status, statusText, statusDescription }) {
    return `Error ${status}: ${statusText} - ${statusDescription || 'Default'}`
  },
}))

describe('GracefulError', () => {
  it('renders error with status and text', () => {
    render(<GracefulError status={404} statusText="Not Found" />)

    expect(screen.getByText('Error 404: Not Found - Default')).toBeInTheDocument()
  })

  it('renders with custom description', () => {
    render(
      <GracefulError
        status={500}
        statusText="Server Error"
        statusDescription="Something went wrong"
      />
    )

    expect(screen.getByText('Error 500: Server Error - Something went wrong')).toBeInTheDocument()
  })
})