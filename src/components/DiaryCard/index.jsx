import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.less'

/**
 * props:
 *  - data: { id, fileUrl, text, width, height, date }
 *  - onClick: function(id)
 */
export default function DiaryCard({ data, onClick }) {
  // 为了瀑布流等比例显示，使用图片本身宽高计算高度（通过 CSS）
  return (
    <View className="diary-card" onClick={() => onClick && onClick(data.id)}>
      <Image
        className="photo"
        src={data.fileUrl}
        mode="widthFix"
        lazyLoad
        webp
      />
      <View className="caption">
        <Text className="date">{new Date(data.date).toLocaleDateString()}</Text>
        <Text className="text" decode>{data.text}</Text>
      </View>
    </View>
  )
}
