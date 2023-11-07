import { ActionIcon, Group, NumberInput, rem } from '@mantine/core'
import { useRef } from 'react'

export default function AcfirstNumberInput() {
  const handlers = useRef()

  return (
    <Group spacing={5}>
      <ActionIcon
        size={36}
        variant="default"
        onClick={() => handlers.current.decrement()}
      >
        -
      </ActionIcon>
      <NumberInput
        hideControls
        name="quantity"
        type="number"
        min={1}
        defaultValue={1}
        handlersRef={handlers}
        styles={{ input: { width: rem(54), textAlign: 'center' } }}
      />
      <ActionIcon
        size={36}
        variant="default"
        onClick={() => handlers.current.increment()}
      >
        +
      </ActionIcon>
    </Group>
  )
}
