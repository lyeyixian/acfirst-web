import { Skeleton } from '@mantine/core'
import { useSkeletonLoading } from '../hooks/skeleton'

export default function AcfirstSkeleton({ imageRef, children }) {
  const { loading, handleOnLoad } = useSkeletonLoading(imageRef)

  return <Skeleton visible={loading}>{children(handleOnLoad)}</Skeleton>
}
