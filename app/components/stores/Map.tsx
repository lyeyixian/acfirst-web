import { AspectRatio, Skeleton, createStyles } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan('sm')

  return {
    map: {
      boxSizing: 'border-box',
      flex: 1,
      marginLeft: theme.spacing.md,

      [BREAKPOINT]: {
        marginLeft: 0,
      },
    },
  }
})

export default function Map({ src }) {
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef(null)

  useEffect(() => {
    const iframeCurrent = iframeRef.current
    iframeCurrent?.addEventListener('load', () => {
      setLoading(false)
    })

    return () => {
      iframeCurrent?.removeEventListener('load', () => {
        setLoading(false)
      })
    }
  }, [iframeRef])

  const { classes } = useStyles()

  return (
    <Skeleton visible={loading} className={classes.map}>
      <AspectRatio ratio={16 / 9} mih={300}>
        <iframe
          ref={iframeRef}
          src={src}
          style={{ border: 0 }}
          loading="lazy"
          title="Google Maps"
        ></iframe>
      </AspectRatio>
    </Skeleton>
  )
}
