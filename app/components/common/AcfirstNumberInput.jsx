import { NumberInput } from '@mantine/core'

export default function AcfirstNumberInput() {
  return (
    <NumberInput
      name="quantity"
      my="xs"
      type="number"
      min={1}
      defaultValue={1}
    />
  )
}
