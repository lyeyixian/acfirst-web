import { ActionIcon, Group, NumberInput, rem } from '@mantine/core'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useRef } from 'react'

export default function AcfirstNumberInput({ ...props }) {
  const handlers = useRef()

  return (
    <Group spacing={5}>
      <ActionIcon
        size={36}
        variant="subtle"
        onClick={() => handlers.current.decrement()}
      >
        <IconMinus size="1rem" stroke={2} />
      </ActionIcon>
      <NumberInput
        hideControls
        name="quantity"
        type="number"
        min={1}
        defaultValue={1}
        handlersRef={handlers}
        variant="filled"
        styles={{ input: { width: rem(48), textAlign: 'center' } }}
        {...props}
      />
      <ActionIcon
        size={36}
        variant="subtle"
        onClick={() => handlers.current.increment()}
      >
        <IconPlus size="1rem" stroke={2} />
      </ActionIcon>
    </Group>
  )
}
