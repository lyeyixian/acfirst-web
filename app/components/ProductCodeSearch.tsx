import { MultiSelect } from '@mantine/core'
import { useProductCodeSearcher } from './hooks/productCodeSearcher'
import { useDebounceSearchParams } from './hooks/helper'

export default function ProductCodeSearch({ codes }) {
  const { selectedCodes, setSelectedCodes } = useProductCodeSearcher()
  const [, setSearch] = useDebounceSearchParams(500)

  const handleSelectedCodesChange = (selectedCodes) => {
    setSelectedCodes(selectedCodes)
    setSearch({ codes: selectedCodes })
  }

  return (
    <MultiSelect
      searchable
      label="Search for product code"
      data={codes}
      value={selectedCodes}
      onChange={handleSelectedCodesChange}
      limit={5}
    />
  )
}