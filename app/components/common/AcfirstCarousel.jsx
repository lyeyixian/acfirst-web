import { Carousel } from '@mantine/carousel'
import { createStyles, getStylesRef, rem } from '@mantine/core'

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

export default function AcfirstCarousel({ children, ...props }) {
  const { classes } = useStyles()

  return (
    <Carousel
      classNames={{
        root: classes.carousel,
        controls: classes.carouselControls,
        indicator: classes.carouselIndicator,
      }}
      {...props}
    >
      {children}
    </Carousel>
  )
}
