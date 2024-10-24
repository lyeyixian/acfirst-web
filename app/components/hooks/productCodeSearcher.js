import { createContext, useContext, useState } from 'react'

const ProductCodeContext = createContext()

export const ProductCodeProvider = ({ children }) => {
  const [selectedCodes, setSelectedCodes] = useState([])

  return (
    <ProductCodeContext.Provider value={{ selectedCodes, setSelectedCodes }}>
      {children}
    </ProductCodeContext.Provider>
  )
}

export const useProductCodeSearcher = () => {
  return useContext(ProductCodeContext)
}
