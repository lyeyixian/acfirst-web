import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useEffect } from 'react'

export const useNotification = (fetcher, successMsg, errorMsg, func) => {
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.error) {
        notifications.show({
          title: `Error: ${fetcher.data.error}`,
          message: errorMsg,
          color: 'red',
          icon: <IconX size="1.2rem" />,
          withBorder: true,
          styles: (theme) => ({
            root: { backgroundColor: theme.colors.gray[0] },
          }),
        })
      } else {
        notifications.show({
          title: 'Success',
          message: successMsg,
          color: 'teal',
          icon: <IconCheck size="1.2rem" />,
          background: 'red',
          withBorder: true,
          styles: (theme) => ({
            root: { backgroundColor: theme.colors.gray[0] },
          }),
        })
      }

      fetcher.data = null

      if (func) {
        func()
      }
    }
  }, [fetcher.state])
}
