import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

const DiaryCard = ({ 
  diary,
  onClick 
}) => {
  const {
    id,
    date,          // 日期字符串，如 "2025-10-14"
    weekday,       // 星期，如 "周二"
    time,          // 时间，如 "13:48"
    title,         // 标题
    content,       // 内容预览
    coverImage,    // 封面图片 URL
    tagIcon,       // 标签图标（emoji 或图片）
    tagColor,      // 标签背景色
    tagText,       // 标签文字
    isStarred,     // 是否标星
    weather,
  } = diary;
  console.log('DiaryCard diary:', diary);
  // 格式化日期显示
  const formatDate = () => {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    return day;
  };

  // 点击卡片
  const handleCardClick = () => {
    if (onClick) {
      onClick(diary);
    } else {
      // 默认跳转到日记详情页
      Taro.navigateTo({
        url: `/pages/diary-detail/index?id=${id}`
      });
    }
  };

  return (
    <View className='diary-card' onClick={handleCardClick}>
      {/* 左侧日期 */}
      <View className='card-left'>
        {isStarred && <View className='star-icon'>⭐</View>}
        <View className='date-info'>
          <Text className='date-day'>{formatDate()}</Text>
          <Text className='date-weekday'>{weekday}</Text>
          <Text className='date-time'>{time}</Text>
        </View>
      </View>

      {/* 中间内容 */}
      <View className='card-center'>
        <View className='card-content'>
          {/* <Text className='card-title'>{title}</Text> */}
          {content && (
            <Text className='card-preview'>{content}</Text>
          )}
        </View>
        
        {/* 封面图片（如果有） */}
        {/* {coverImage && (
          <View className='card-image-wrapper'>
            <Image 
              className='card-image' 
              src={coverImage} 
              mode='aspectFill'
            />
          </View>
        )} */}
      </View>

      {/* 右侧标签 */}
      {
        coverImage ? 
        <View className='card-image-wrapper'>
            <Image 
              className='card-image' 
              src={coverImage} 
              mode='aspectFill'
            />
        </View>
        :
        <View 
          className='card-tag'
          style={{ backgroundColor: tagColor || '#FFD700' }}
        >
          <Text className='tag-icon-emoji'>{tagIcon}</Text>
          <Text className='tag-icon-emoji'>{weather.emoji}</Text>
          {/* {tagIcon.startsWith('http') ? (
            <Image className='tag-icon-img' src={tagIcon} mode='aspectFit' />
          ) : (
            <Text className='tag-icon-emoji'>{tagIcon}</Text>
          )}
          {tagText && (
            <View className='tag-text-wrapper'>
              {tagText.split('').map((char, index) => (
                <Text key={index} className='tag-text-char'>{char}</Text>
              ))}
            </View>
          )} */}
        </View>
      }
      {/* {tagIcon && (
        <View 
          className='card-tag'
          style={{ backgroundColor: tagColor || '#FFD700' }}
        >
          {tagIcon.startsWith('http') ? (
            <Image className='tag-icon-img' src={tagIcon} mode='aspectFit' />
          ) : (
            <Text className='tag-icon-emoji'>{tagIcon}</Text>
          )}
          {tagText && (
            <View className='tag-text-wrapper'>
              {tagText.split('').map((char, index) => (
                <Text key={index} className='tag-text-char'>{char}</Text>
              ))}
            </View>
          )}
        </View>
      )} */}
    </View>
  );
};

export default DiaryCard;