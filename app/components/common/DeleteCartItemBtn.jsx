import { ActionIcon } from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import { IconTrash } from '@tabler/icons-react'

export default function DeleteCartItemBtn({ code }) {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="delete" action="/api/delete-cart">
      <input type="hidden" name="code" value={code} />
      <ActionIcon
        color="red.4"
        type="submit"
        loading={fetcher.state === 'submitting'}
      >
        <IconTrash size="1.2rem" />
      </ActionIcon>
    </fetcher.Form>
  )
}
