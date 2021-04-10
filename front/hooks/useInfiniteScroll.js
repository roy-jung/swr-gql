import { useCallback, useState, useEffect, useRef } from 'react'

const useInfiniteScroll = targetEl => {
  const observerRef = useRef(null)
  const [isIntersecting, setIntersecting] = useState(null)

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(entries =>
        setIntersecting(entries.some(entry => entry.isIntersecting)),
      )
    }
    return observerRef.current
  }, [observerRef.current])

  useEffect(() => {
    if (targetEl.current) getObserver().observe(targetEl.current)
    return () => {
      getObserver().disconnect()
    }
  }, [targetEl.current])

  return isIntersecting
}

export default useInfiniteScroll
