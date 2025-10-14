import { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'

/**
 * useInfiniteScroll(fetcher, options)
 * fetcher(page) => Promise<{ data: Array, hasMore: boolean }>
 *
 * 返回: { items, loading, error, loadMore, refresh, page }
 */
export default function useInfiniteScroll(fetcher, options = {}) {
  const { pageSize = 10, initialPage = 1 } = options
  const [items, setItems] = useState([])
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    // 初始加载
    loadPage(initialPage, true)
    return () => { isMounted.current = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadPage(p = 1, replace = false) {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetcher(p, pageSize)
      // res: { data: [], hasMore: boolean }
      if (!isMounted.current) return
      setItems(prev => (replace ? res.data : [...prev, ...res.data]))
      setHasMore(res.hasMore)
      setPage(p)
    } catch (err) {
      setError(err)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }

  function loadMore() {
    if (!hasMore || loading) return
    loadPage(page + 1, false)
  }

  function refresh() {
    loadPage(initialPage, true)
  }

  return { items, loading, error, loadMore, refresh, hasMore, page }
}
