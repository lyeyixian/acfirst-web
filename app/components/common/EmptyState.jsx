import { Stack, Text, ThemeIcon } from '@mantine/core'
import { IconFileX } from '@tabler/icons-react'

export default function EmptyState({ title, children, ...props }) {
  return (
    <Stack justify="center" align="center" spacing="xs" {...props}>
      <ThemeIcon color="gray" variant="outline" style={{ border: 0 }}>
        <IconFileX size="2rem" />
      </ThemeIcon>
      <Text size="lg" weight={500} color="dark.4">
        {title}
      </Text>
      {children}
    </Stack>
  )
}
