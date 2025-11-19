import React, { useState, useEffect } from 'react';
// 1. 引入 useState 和 Image
import { View, Text, Picker, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Lunar, Solar } from 'lunar-javascript';

// 2. 引入新组件和新数据
import SelectionModal from '@/components/SelectionModal';
import { MOOD_LIST, WEATHER_LIST } from '@/constants/diary';

import './index.less';

const DateTimeHeader = ({ 
  datetime,
  mood,
  weather,
  onDateTimeChange,
  onMoodChange,
  onWeatherChange 
}) => {
  console.log(datetime,
  mood,
  weather,
  onDateTimeChange,
  onMoodChange,
  onWeatherChange )
  // 3. 移除旧的 moodOptions 和 weatherOptions 数组

  // 4. 添加弹窗的显示状态
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

  // --- 原有的日期/农历方法 (保持不变) ---
  const formatDate = () => {
    // ... (代码不变)
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = () => {
    // ... (代码不变)
    const date = new Date(datetime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getWeekday = () => {
    // ... (代码不变)
    const date = new Date(datetime);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  };

  const getLunarDate = () => {
    // ... (代码不变)
    try {
      const solar = Solar.fromDate(datetime);
      const lunar = solar.getLunar();
      const yearInGanZhi = lunar.getYearInGanZhi(); 
      const yearShengXiao = lunar.getYearShengXiao();
      const monthInChinese = lunar.getMonthInChinese();
      const dayInChinese = lunar.getDayInChinese();
      return `${yearInGanZhi}${yearShengXiao}年 ${monthInChinese}月${dayInChinese}`;
    } catch (error) {
      console.error('农历转换失败:', error);
      return '农历加载中...';
    }
  };

  // 时间修改
  const handleTimeChange = (e) => {
    // ... (代码不变)
    const timeStr = e.detail.value;
    const [hours, minutes] = timeStr.split(':');
    const newDate = new Date(datetime);
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    onDateTimeChange && onDateTimeChange(newDate);
  };

  // 修改日期
  const handleDateChange = (e) => {
    // ... (代码不变)
    const dateStr = e.detail.value;
    const newDate = new Date(dateStr);
    const oldDate = new Date(datetime);
    newDate.setHours(oldDate.getHours());
    newDate.setMinutes(oldDate.getMinutes());
    onDateTimeChange && onDateTimeChange(newDate);
  };

  // --- 5. 更新点击事件 ---
  const handleMoodClick = () => {
    setMoodModalVisible(true); // 不再调用 showActionSheet
  };

  const handleWeatherClick = () => {
    setWeatherModalVisible(true); // 不再调用 showActionSheet
  };

  // --- 6. 为 Modal 添加确认事件 ---
  const handleMoodConfirm = (selectedItem) => {
    if (selectedItem) {
      onMoodChange && onMoodChange(selectedItem);
    }
    setMoodModalVisible(false);
  };

  const handleWeatherConfirm = (selectedItem) => {
    if (selectedItem) {
      onWeatherChange && onWeatherChange(selectedItem);
    }
    setWeatherModalVisible(false);
  };


  return (
    <View className='datetime-header'>
      {/* 日期时间行 (代码不变) */}
      <View className='datetime-row'>
        <Picker 
          mode='date' 
          value={formatDate()}
          onChange={handleDateChange}
        >
          <View className='datetime-main'>
            <Text className='date-text'>{formatDate()}</Text>
            <Picker 
              mode='time' 
              value={formatTime()}
              onChange={handleTimeChange}
            >
              <Text className='time-text'>{formatTime()}</Text>
            </Picker>
            <Text className='weekday-text'>{getWeekday()}</Text>
          </View>
        </Picker>

        {/* --- 7. 修改按钮区域 --- */}
        <View className='action-buttons'>
          <View className='action-btn' onClick={handleMoodClick}>
            <Text className='action-icon'>{mood ? mood.emoji : '♡'}</Text>
            <Text className='action-label'>心情</Text>
          </View>
          <View className='action-btn' onClick={handleWeatherClick}>
            <Text className='action-icon'>{weather ? weather.emoji : '☁️'}</Text>
            <Text className='action-label'>天气</Text>
          </View>
        </View>
      </View>

      {/* 农历信息 (代码不变) */}
      <View className='lunar-row'>
        <Text className='lunar-text'>{getLunarDate()}</Text>
      </View>

      {/* --- 8. 添加弹窗组件 --- */}
      <SelectionModal
        visible={moodModalVisible}
        title='现在的心情怎么样'
        items={MOOD_LIST} // 使用你截图对应的完整列表
        columns={5} // 按照你的截图，心情是5列
        selected={mood}
        onClose={() => setMoodModalVisible(false)}
        onConfirm={handleMoodConfirm}
      />

      <SelectionModal
        visible={weatherModalVisible}
        title='今天的天气怎么样'
        items={WEATHER_LIST} // 使用你截图对应的完整列表
        columns={4} // 按照你的截图，天气是4列
        selected={weather}
        onClose={() => setWeatherModalVisible(false)}
        onConfirm={handleWeatherConfirm}
      />
    </View>
  );
};

export default DateTimeHeader;