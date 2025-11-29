import { useEffect, useState } from 'react'

export const useSkeletonLoading = (ref: React.RefObject<any>) => {
  const [loading, setLoading] = useState(true)
  const handler = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (ref.current?.complete) {
      handler()
    }
  }, [ref])

  return { loading, handleOnLoad: handler }
}
