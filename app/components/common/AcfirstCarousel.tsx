import { Carousel } from '@mantine/carousel'
import { createStyles, getStylesRef, rem } from '@mantine/core'
import type { ReactNode } from 'react'

interface AcfirstCarouselProps {
  children: ReactNode
  classNames?: Record<string, string>
  [key: string]: any
}

const useStyles = createStyles((theme) => ({
  carousel: {
    '&:hover': {
      [`& .${getStylesRef('carouselControls')}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getStylesRef('carouselControls'),
    transition: 'opacity 150ms ease',
    opacity: 0,
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: 'width 250ms ease',

    '&[data-active]': {
      width: rem(16),
    },
  },
}))

export default function AcfirstCarousel({ children, classNames, ...props }: AcfirstCarouselProps) {
  const { classes } = useStyles()

  return (
    <Carousel
      classNames={{
        root: classes.carousel,
        controls: classes.carouselControls,
        indicator: classes.carouselIndicator,
        ...classNames,
      }}
      {...props}
    >
      {children}
    </Carousel>
  )
}
