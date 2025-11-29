import { createContext, useContext, useState, ReactNode } from 'react'

const ProductCodeContext = createContext<{
  selectedCodes: string[]
  setSelectedCodes: (codes: string[]) => void
} | null>(null)

export const ProductCodeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

  return (
    <ProductCodeContext.Provider value={{ selectedCodes, setSelectedCodes }}>
      {children}
    </ProductCodeContext.Provider>
  )
}

export const useProductCodeSearcher = () => {
  const context = useContext(ProductCodeContext)
  if (!context) {
    throw new Error('useProductCodeSearcher must be used within ProductCodeProvider')
  }
  return context
}