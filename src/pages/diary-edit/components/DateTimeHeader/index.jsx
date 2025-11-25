import React, { useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import { Lunar, Solar } from 'lunar-javascript';
import SelectionModal from '@/components/SelectionModal';
import { MOOD_LIST, WEATHER_LIST } from '@/constants/diary';

import './index.less';

const DateTimeHeader = ({ 
  datetime,
  mood,
  weather,
  onDateTimeChange,
  onMoodChange,
  onWeatherChange,
  onMoodClick, 
  onWeatherClick
}) => {
  /* console.log(datetime,
  mood,
  weather,
  onDateTimeChange,
  onMoodChange,
  onWeatherChange ) */

  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

  const formatDate = () => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = () => {
    const date = new Date(datetime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getWeekday = () => {
    const date = new Date(datetime);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  };

  const getLunarDate = () => {
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
    const timeStr = e.detail.value;
    const [hours, minutes] = timeStr.split(':');
    const newDate = new Date(datetime);
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    onDateTimeChange && onDateTimeChange(newDate);
  };

  // 修改日期
  const handleDateChange = (e) => {
    const dateStr = e.detail.value;
    const newDate = new Date(dateStr);
    const oldDate = new Date(datetime);
    newDate.setHours(oldDate.getHours());
    newDate.setMinutes(oldDate.getMinutes());
    onDateTimeChange && onDateTimeChange(newDate);
  };

  // Modal 确认事件
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
      {/* 日期时间 */}
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

        <View className='action-buttons'>
          <View className='action-btn' onClick={onMoodClick}>
            <Text className='action-icon'>{mood ? mood.emoji : '♡'}</Text>
            <Text className='action-label'>心情</Text>
          </View>
          <View className='action-btn' onClick={onWeatherClick}>
            <Text className='action-icon'>{weather ? weather.emoji : '☁️'}</Text>
            <Text className='action-label'>天气</Text>
          </View>
        </View>
      </View>

      {/* 农历信息 */}
      <View className='lunar-row'>
        <Text className='lunar-text'>{getLunarDate()}</Text>
      </View>

      {/* 弹窗组件 */}
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