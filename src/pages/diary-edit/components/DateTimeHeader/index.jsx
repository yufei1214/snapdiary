import React, { useState, useEffect } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Lunar, Solar } from 'lunar-javascript';
import './index.less';

const DateTimeHeader = ({ 
  datetime,
  mood,
  weather,
  onDateTimeChange,
  onMoodChange,
  onWeatherChange 
}) => {
  // 心情选项
  const moodOptions = [
    { emoji: '😊', label: '开心' },
    { emoji: '😢', label: '难过' },
    { emoji: '😡', label: '生气' },
    { emoji: '😰', label: '焦虑' },
    { emoji: '😴', label: '困倦' },
    { emoji: '🤔', label: '思考' },
    { emoji: '😎', label: '酷' },
    { emoji: '🥰', label: '爱' },
  ];

  // 天气选项
  const weatherOptions = [
    { emoji: '☀️', label: '晴' },
    { emoji: '⛅', label: '多云' },
    { emoji: '☁️', label: '阴' },
    { emoji: '🌧️', label: '雨' },
    { emoji: '⛈️', label: '雷雨' },
    { emoji: '🌨️', label: '雪' },
    { emoji: '🌫️', label: '雾' },
    { emoji: '🌪️', label: '风' },
  ];

  // 格式化日期显示
  const formatDate = () => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 格式化时间显示
  const formatTime = () => {
    const date = new Date(datetime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 获取星期
  const getWeekday = () => {
    const date = new Date(datetime);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  };

  // 获取农历信息
  const getLunarDate = () => {
    console.log('获取农历信息的日期：', datetime);
    
    try {
      // 将 Date 对象转换为 Solar 对象
      const solar = Solar.fromDate(datetime);
      // 转换为农历
      const lunar = solar.getLunar();
      
      // 获取天干地支年份（如：乙巳蛇年）
      const yearInGanZhi = lunar.getYearInGanZhi(); // 乙巳
      const yearShengXiao = lunar.getYearShengXiao(); // 蛇
      
      // 获取农历月份（如：八月）
      const monthInChinese = lunar.getMonthInChinese();
      
      // 获取农历日期（如：廿三）
      const dayInChinese = lunar.getDayInChinese();
      
      return `${yearInGanZhi}${yearShengXiao}年 ${monthInChinese}月${dayInChinese}`;
    } catch (error) {
      console.error('农历转换失败:', error);
      return '农历加载中...';
    }
  };

  // 选择心情
  const handleMoodClick = () => {
    Taro.showActionSheet({
      itemList: moodOptions.map(item => `${item.emoji} ${item.label}`),
      success: (res) => {
        const selectedMood = moodOptions[res.tapIndex];
        onMoodChange && onMoodChange(selectedMood);
      }
    });
  };

  // 选择天气
  const handleWeatherClick = () => {
    Taro.showActionSheet({
      itemList: weatherOptions.map(item => `${item.emoji} ${item.label}`),
      success: (res) => {
        const selectedWeather = weatherOptions[res.tapIndex];
        onWeatherChange && onWeatherChange(selectedWeather);
      }
    });
  };

  // 修改时间
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

  return (
    <View className='datetime-header'>
      {/* 日期时间行 */}
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

        {/* 心情和天气按钮 */}
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

      {/* 农历信息 */}
      <View className='lunar-row'>
        <Text className='lunar-text'>{getLunarDate()}</Text>
      </View>
    </View>
  );
};

export default DateTimeHeader;