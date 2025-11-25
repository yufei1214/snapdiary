import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import CalendarSection from '../../components/CalendarSection';
import DiaryCard from '../../components/DiaryCard';
import CustomNavBar from '@/components/CustomNavBar'
import './index.less';

const Home = () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [diaryList, setDiaryList] = useState([]);
  const [diaryDates, setDiaryDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 添加加载状态
  const [selectedDate, setSelectedDate] = useState(todayStr); // 选中的日期 2025-11-24
  const [isToday, setIsToday] = useState(true); // 选中的日期是否为今天

  /* // 模拟数据 - 后续替换为云开发数据
  const mockDiaryData = [
    {
      id: '1',
      date: '2025-10-14',
      weekday: '周二',
      time: '13:48',
      title: '欢迎宝来到随影日记！！(*^▽^*) 让我们一起记录那些珍贵...',
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
  ]; */

  // 初始化数据
  useEffect(() => {
    loadDiaryList(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  }, [currentMonth]);

  // 页面显示时刷新数据
  useDidShow(() => {
    loadDiaryList(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  });

  // 下拉刷新
  usePullDownRefresh(async () => {
    await loadDiaryList(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    Taro.stopPullDownRefresh();
  });

  // 加载日记列表
  const loadDiaryList = async (year, month) => {
    // 防止重复请求
    if (isLoading) return;
    
    try {
      setIsLoading(true);

      // 调用云函数获取日记列表
      const result = await Taro.cloud.callFunction({
        name: 'getDiaryList',
        data: {
          year: year,
          month: month
        }
      });

      if (result.result.success) {
        const diaryData = result.result.data;
        setDiaryList(diaryData);
        
        // 提取有日记的日期
        const dates = diaryData.map(item => item.date);
        setDiaryDates([...new Set(dates)]);
      } else {
        throw new Error(result.result.message);
      }
    } catch (error) {
      console.error('加载日记列表失败', error);
      /* 
      // 如果加载失败，使用模拟数据
      setDiaryList(mockDiaryData);
      const dates = mockDiaryData.map(item => item.date);
      setDiaryDates([...new Set(dates)]); */
    } finally {
      setIsLoading(false);
    }
  };

  // 月份切换
  const handleMonthChange = (date) => {
    setCurrentMonth(date);
  };

  // 日期点击
  const handleDateClick = (dateStr) => {
    console.log('点击日期：', dateStr);
    
    // 检查是否是今天或之前的日期
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    clickedDate.getTime() === today.getTime() ? setIsToday(true) : setIsToday(false);

    if (clickedDate > today) {
      Taro.showToast({
        title: '不能选择未来日期',
        icon: 'none'
      });
      return;
    }
    
    // 设置选中日期
    setSelectedDate(dateStr);
    
    // 加载该月的日记
    loadDiaryList(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
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
    const url = `/pages/diary-edit/index?selectedDate=${selectedDate}`;
    
    Taro.navigateTo({
      url
    });
  };
  // 判断选中日期是否有日记
  const selectedDateHasDiary = () => {
    console.log('selectedDate', selectedDate);
    if (!selectedDate) return false;
    return diaryDates.includes(selectedDate);
  };
  return (
    <View className='home-page'>
      <CustomNavBar title="随影日记" showBack={false} />
      {/* 顶部标题栏 */}
      <View className='page-header'>
        {/* <View className='header-content'>
          <Text className='header-title'>随影日记</Text>
          <View className='header-actions'>
            <View className='action-btn'>•••</View>
            <View className='action-btn'>⊙</View>
          </View>
        </View> */}
        
        {/* 金句卡片 */}
        <View className='quote-card'>
          <Text className='quote-text'>正经人谁写日记啊</Text>
          {/* <View className='quote-like'>♡</View> */}
        </View>
      </View>

      {/* 日历区域 */}
      <CalendarSection
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        onDateClick={handleDateClick}
        diaryDates={diaryDates}
        selectedDate={selectedDate}  // 新增
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
          <Text className='write-btn-text'>
            {selectedDateHasDiary() ? '再写一篇' : isToday ? '记录此刻' : '写下回忆'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Home;