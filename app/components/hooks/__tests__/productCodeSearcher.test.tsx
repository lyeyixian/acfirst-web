import { render, screen, act } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { ProductCodeProvider, useProductCodeSearcher } from '../productCodeSearcher'

describe('ProductCodeProvider and useProductCodeSearcher', () => {
  it('provides context to children', () => {
    const TestComponent = () => {
      const { selectedCodes, setSelectedCodes } = useProductCodeSearcher()
      return (
        <div>
          <span data-testid="codes">{selectedCodes.join(',')}</span>
          <button onClick={() => setSelectedCodes(['code1'])}>Set Codes</button>
        </div>
      )
    }

    render(
      <ProductCodeProvider>
        <TestComponent />
      </ProductCodeProvider>
    )

    expect(screen.getByTestId('codes')).toHaveTextContent('')

    const button = screen.getByText('Set Codes')
    act(() => {
      button.click()
    })

    expect(screen.getByTestId('codes')).toHaveTextContent('code1')
  })

  it('throws error when hook used outside provider', () => {
    const TestComponent = () => {
      useProductCodeSearcher()
      return <div>Test</div>
    }

    expect(() => render(<TestComponent />)).toThrow(
      'useProductCodeSearcher must be used within ProductCodeProvider'
    )
  })
})