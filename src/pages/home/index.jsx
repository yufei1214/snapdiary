import React, { useCallback } from 'react'
import { View, ScrollView } from '@tarojs/components'
import DiaryCard from '@/components/DiaryCard'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { fetchDiaries } from '@/services/diaryService'
import './index.less'
import Taro from '@tarojs/taro'

export default function Home() {
  const { items, loading, loadMore, refresh, hasMore } = useInfiniteScroll(fetchDiaries, { pageSize: 10 })

  const handleToDetail = useCallback((id) => {
    // 跳转到详情页（先占位，后续实现 detail page）
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
  }, [])

  const onScrollToLower = () => {
    // ScrollView 到底部触发
    if (!loading && hasMore) loadMore()
  }

  return (
    <ScrollView
      className="home"
      scrollY
      onScrollToLower={onScrollToLower}
      lowerThreshold={150}
    >
      <View className="masonry">
        {items.map(item => (
          <DiaryCard key={item.id} data={item} onClick={handleToDetail} />
        ))}
      </View>

      <View className="loader">
        {loading ? <View>加载中…</View> : (!hasMore ? <View>没有更多了</View> : null)}
      </View>
    </ScrollView>
  )
}
