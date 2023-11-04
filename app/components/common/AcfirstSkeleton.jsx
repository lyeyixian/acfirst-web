import { Skeleton } from '@mantine/core'
import { useSkeletonLoading } from '../hooks/skeleton'
import { useRef } from 'react'

export default function AcfirstSkeleton({ children }) {
  const imageRef = useRef(null)
  const { loading, handleOnLoad } = useSkeletonLoading(imageRef)

  return (
    <Skeleton width="auto" visible={loading}>
      {children(handleOnLoad, imageRef)}
    </Skeleton>
  )
}
