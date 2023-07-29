import { AspectRatio, Skeleton, createStyles } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan('sm')

  return {
    map: {
      // TODO: size of map incorrect when screen is smaller but haven't reach sm breakpoint
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
      {/* TODO: add transition to skeleton */}
      <AspectRatio ratio={16 / 9}>
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
