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
        })
      } else {
        notifications.show({
          title: 'Success',
          message: successMsg,
          color: 'teal',
          icon: <IconCheck size="1.2rem" />,
        })
      }

      fetcher.data = null

      if (func) {
        func()
      }
    }
  }, [fetcher.state])
}
