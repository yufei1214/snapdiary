import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

const CalendarSection = ({ currentMonth, onMonthChange, onDateClick, diaryDates = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 获取当前月份信息
  const { year, month, daysInMonth, firstDayOfWeek } = useMemo(() => {
    const date = new Date(currentMonth);
    const y = date.getFullYear();
    const m = date.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    
    return {
      year: y,
      month: m + 1,
      daysInMonth: days,
      firstDayOfWeek: firstDay
    };
  }, [currentMonth]);

  // 生成日历数据
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // 补充空白天数
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, isEmpty: true });
    }
    
    // 添加实际日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasDiary = diaryDates.includes(dateStr);
      const isToday = dateStr === todayStr;
      
      days.push({
        date: day,
        dateStr,
        hasDiary,
        isToday,
        isEmpty: false
      });
    }
    
    return days;
  }, [year, month, daysInMonth, firstDayOfWeek, diaryDates]);

  // 获取当前周的日期（收起状态显示）
  const currentWeekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    
    if (year !== today.getFullYear() || month !== today.getMonth() + 1) {
      // 如果不是当前月，显示第一周
      return calendarDays.slice(0, 7);
    }
    
    // 找到今天在日历中的位置
    const todayIndex = calendarDays.findIndex(day => day.date === currentDay);
    if (todayIndex === -1) return calendarDays.slice(0, 7);
    
    // 计算今天所在周的起始位置
    const weekStartIndex = Math.floor(todayIndex / 7) * 7;
    return calendarDays.slice(weekStartIndex, weekStartIndex + 7);
  }, [calendarDays, year, month]);

  // 切换展开/收起
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 切换月份
  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 2, 1);
    onMonthChange && onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month, 1);
    onMonthChange && onMonthChange(newDate);
  };

  // 点击日期
  const handleDateClick = (day) => {
    if (!day.isEmpty) {
      onDateClick && onDateClick(day.dateStr);
    }
  };

  // 渲染星期标题
  const renderWeekDays = () => {
    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
    return (
      <View className='calendar-weekdays'>
        {weekDays.map((day, index) => (
          <View key={index} className='weekday-item'>
            {day}
          </View>
        ))}
      </View>
    );
  };

  // 渲染日期格子
  const renderDayItem = (day, index) => {
    if (day.isEmpty) {
      return <View key={index} className='day-item day-empty' />;
    }

    const classNames = ['day-item'];
    if (day.isToday) classNames.push('day-today');
    if (day.hasDiary) classNames.push('day-has-diary');

    return (
      <View 
        key={index} 
        className={classNames.join(' ')}
        onClick={() => handleDateClick(day)}
      >
        <View className='day-number'>{day.date}</View>
        {day.hasDiary && <View className='diary-dot'>😊</View>}
      </View>
    );
  };

  return (
    <View className='calendar-section'>
      {/* 月份选择器 */}
      <View className='calendar-header'>
        <View className='month-selector'>
          <View className='arrow-btn' onClick={handlePrevMonth}>
            <Text className='arrow-icon'>‹</Text>
          </View>
          <Text className='month-text' onClick={toggleExpand}>
            {year}年{month}月 ▼
          </Text>
          <View className='arrow-btn' onClick={handleNextMonth}>
            <Text className='arrow-icon'>›</Text>
          </View>
        </View>
        
        <Text className='view-all-text'>🔍 查看全部日记</Text>
      </View>

      {/* 日历主体 */}
      <View className='calendar-body'>
        {renderWeekDays()}
        
        <View className='calendar-days'>
          {(isExpanded ? calendarDays : currentWeekDays).map((day, index) => 
            renderDayItem(day, index)
          )}
        </View>

        {/* 展开/收起提示 */}
        <View className='calendar-expand-info'>
          <Text className='expand-text'>本周{diaryDates.length}篇日记</Text>
          <View className='expand-btn' onClick={toggleExpand}>
            <Text className='expand-btn-text'>{isExpanded ? '收起' : '展开'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CalendarSection;