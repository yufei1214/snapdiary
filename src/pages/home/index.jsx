import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import CalendarSection from '../../components/CalendarSection';
import DiaryCard from '../../components/DiaryCard';
import './index.less';

const Home = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [diaryList, setDiaryList] = useState([]);
  const [diaryDates, setDiaryDates] = useState([]);
  
  // 模拟数据 - 后续替换为云开发数据
  const mockDiaryData = [
    {
      id: '1',
      date: '2025-10-14',
      weekday: '周二',
      time: '13:48',
      title: '欢迎宝来到每刻日记！！(*^▽^*) 让我们一起记录那些珍贵...',
      content: '',
      coverImage: '',
      tagIcon: '📝',
      tagColor: '#FFD700',
      tagText: '功能介绍',
      isStarred: true,
    },
    {
      id: '2',
      date: '2025-10-14',
      weekday: '周二',
      time: '13:48',
      title: '常见问题：❤️1.删除小程序、删除微信或更换手机后，数据...',
      content: '',
      coverImage: '',
      tagIcon: '❓',
      tagColor: '#FFD700',
      tagText: '常见问题',
      isStarred: true,
    },
    {
      id: '3',
      date: '2025-10-14',
      weekday: '周二',
      time: '13:48',
      title: '🔔温馨提示：左滑可删除默认日记哦～ 系统的编辑和删除功能，...',
      content: '',
      coverImage: '',
      tagIcon: '⚠️',
      tagColor: '#FFD700',
      tagText: '温馨提示',
      isStarred: true,
    },
  ];

  // 初始化数据
  useEffect(() => {
    loadDiaryList();
  }, [currentMonth]);

  // 加载日记列表
  const loadDiaryList = async () => {
    try {
      // TODO: 后续替换为云开发接口
      // const res = await Taro.cloud.callFunction({
      //   name: 'getDiaryList',
      //   data: {
      //     year: currentMonth.getFullYear(),
      //     month: currentMonth.getMonth() + 1
      //   }
      // });
      
      // 使用模拟数据
      setDiaryList(mockDiaryData);
      
      // 提取有日记的日期
      const dates = mockDiaryData.map(item => item.date);
      setDiaryDates([...new Set(dates)]);
    } catch (error) {
      console.error('加载日记列表失败', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  };

  // 月份切换
  const handleMonthChange = (date) => {
    setCurrentMonth(date);
  };

  // 日期点击
  const handleDateClick = (dateStr) => {
    console.log('点击日期：', dateStr);
    // TODO: 可以实现跳转到该日期的日记详情
  };

  // 日记卡片点击
  const handleDiaryClick = (diary) => {
    console.log('点击日记：', diary);
    Taro.navigateTo({
      url: `/pages/diary-detail/index?id=${diary.id}`
    });
  };

  // 写日记按钮点击
  const handleWriteDiary = () => {
    Taro.navigateTo({
      url: '/pages/diary-edit/index'
    });
  };

  return (
    <View className='home-page'>
      {/* 顶部标题栏 */}
      <View className='page-header'>
        <View className='header-content'>
          <Text className='header-title'>每刻日记</Text>
          <View className='header-actions'>
            <View className='action-btn'>•••</View>
            <View className='action-btn'>⊙</View>
          </View>
        </View>
        
        {/* 金句卡片 */}
        <View className='quote-card'>
          <Text className='quote-text'>等待有时，是另一种行动。⏳</Text>
          <View className='quote-like'>♡</View>
        </View>
      </View>

      {/* 日历区域 */}
      <CalendarSection
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        onDateClick={handleDateClick}
        diaryDates={diaryDates}
      />

      {/* 日记列表 */}
      <ScrollView 
        className='diary-list'
        scrollY
        enhanced
        showScrollbar={false}
      >
        {diaryList.length > 0 ? (
          diaryList.map(diary => (
            <DiaryCard
              key={diary.id}
              diary={diary}
              onClick={handleDiaryClick}
            />
          ))
        ) : (
          <View className='empty-state'>
            <Text className='empty-text'>📝 还没有日记，快来写第一篇吧～</Text>
          </View>
        )}
        
        {/* 底部占位，避免被写日记按钮遮挡 */}
        <View className='bottom-placeholder' />
      </ScrollView>

      {/* 写日记按钮 */}
      <View className='write-btn-wrapper'>
        <View className='write-btn' onClick={handleWriteDiary}>
          <Text className='write-btn-icon'>✏️</Text>
          <Text className='write-btn-text'>记录此刻</Text>
        </View>
      </View>
    </View>
  );
};

export default Home;