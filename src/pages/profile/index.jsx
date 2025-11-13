import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.less';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    nickName: '点击更新头像昵称'
  });
  
  const [statistics, setStatistics] = useState({
    diaryCount: 0,    // 日记数
    wordCount: 0,     // 总字数
    imageCount: 0,    // 图片数
    categoryCount: 0  // 分类数
  });

  useDidShow(() => {
    loadUserInfo();
    loadStatistics();
  });

  // 加载用户信息
  const loadUserInfo = () => {
    // TODO: 从云数据库或缓存加载用户信息
    const cachedUserInfo = Taro.getStorageSync('userInfo');
    if (cachedUserInfo) {
      setUserInfo(cachedUserInfo);
    }
  };

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      // 调用云函数获取统计数据
      const result = await Taro.cloud.callFunction({
        name: 'getUserStatistics'
      });

      if (result.result.success) {
        setStatistics(result.result.data);
      }
    } catch (error) {
      console.error('加载统计数据失败', error);
      // 失败时使用默认数据
      setStatistics({
        diaryCount: 0,
        wordCount: 0,
        imageCount: 0,
        categoryCount: 0
      });
    }
  };

  // 更新头像昵称
  const handleUpdateProfile = () => {
    Taro.navigateTo({ url: '/pages/profile-edit/index' });
    /* Taro.getUserProfile({
      desc: '用于完善用户资料',
      success: async (res) => {
        const { avatarUrl, nickName } = res.userInfo;
        setUserInfo({ avatarUrl, nickName });
        
        // 保存到本地缓存
        Taro.setStorageSync('userInfo', { avatarUrl, nickName });
        
        // 同步到云数据库
        try {
          console.log('开始调用云函数...');  // 添加日志
          
          const result = await Taro.cloud.callFunction({
            name: 'syncUserInfo',
            data: { avatarUrl, nickName }
          });
          
          console.log('云函数返回结果:', result);  // 添加日志
          
          Taro.showToast({
            title: '更新成功',
            icon: 'success'
          });
        } catch (error) {
          console.error('同步用户信息失败', error);  // 查看错误
          Taro.showToast({
            title: '更新成功',
            icon: 'success'
          });
        }
      },
      fail: () => {
        Taro.showToast({
          title: '取消授权',
          icon: 'none'
        });
      }
    }); */
  };

  // 往年今日
  const handlePastYears = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  // 随机漫游
  const handleRandomDiary = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  // 导出日记
  const handleExport = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  // 每日一句
  const handleDailyQuote = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  // 垃圾桶
  const handleTrash = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  // 更多设置
  const handleSettings = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  // 分享给好友
  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  };

  // 意见反馈
  const handleFeedback = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  };

  return (
    <View className='profile-page'>
      {/* 顶部导航栏 */}
      <View className='custom-navbar'>
        <View className='navbar-content'>
          <Text className='nav-title'>个人中心</Text>
          {/* <View className='nav-right'>
            <Text className='more-icon'>•••</Text>
            <Text className='record-icon'>⊙</Text>
          </View> */}
        </View>
      </View>

      {/* 用户信息区域 */}
      <View className='user-section' onClick={handleUpdateProfile}>
        <Image 
          className='avatar' 
          src={userInfo.avatarUrl}
          mode='aspectFill'
        />
        <View className='user-info'>
          <Text className='nickname'>{userInfo.nickName}</Text>
        </View>
        <Text className='arrow-icon'>›</Text>
      </View>

      {/* 统计数据 */}
      <View className='statistics-section'>
        <View className='stat-item'>
          <Text className='stat-number'>{statistics.diaryCount}</Text>
          <Text className='stat-label'>日记数</Text>
        </View>
        <View className='stat-divider'></View>
        <View className='stat-item'>
          <Text className='stat-number'>{statistics.wordCount}</Text>
          <Text className='stat-label'>总字数</Text>
        </View>
        <View className='stat-divider'></View>
        <View className='stat-item'>
          <Text className='stat-number'>{statistics.imageCount}</Text>
          <Text className='stat-label'>图片数</Text>
        </View>
        <View className='stat-divider'></View>
        <View className='stat-item'>
          <Text className='stat-number'>{statistics.categoryCount}</Text>
          <Text className='stat-label'>分类数</Text>
        </View>
      </View>

      {/* 快捷功能按钮 */}
      <View className='quick-actions'>
        <View className='action-card' onClick={handlePastYears}>
          <Text className='action-title'>往年今日</Text>
        </View>
        <View className='action-card' onClick={handleRandomDiary}>
          <Text className='action-title'>随机漫游</Text>
        </View>
      </View>

      {/* 功能列表 */}
      <View className='menu-list'>
        <View className='menu-item' onClick={handleExport}>
          <Text className='menu-icon'>📝</Text>
          <Text className='menu-label'>写日记提醒</Text>
          <View className='menu-right'>
            <Text className='menu-status'>已开启</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
        </View>

        <View className='menu-item'>
          <Text className='menu-icon'>🔒</Text>
          <Text className='menu-label'>密码锁</Text>
          <View className='menu-right'>
            <Text className='menu-status'>关闭</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
        </View>

        <View className='menu-item' onClick={handleExport}>
          <Text className='menu-icon'>📤</Text>
          <Text className='menu-label'>导出日记</Text>
          <Text className='menu-arrow'>›</Text>
        </View>

        <View className='menu-item' onClick={handleDailyQuote}>
          <Text className='menu-icon'>💬</Text>
          <Text className='menu-label'>每日一句</Text>
          <Text className='menu-arrow'>›</Text>
        </View>

        <View className='menu-item' onClick={handleTrash}>
          <Text className='menu-icon'>🗑️</Text>
          <Text className='menu-label'>垃圾桶</Text>
          <Text className='menu-arrow'>›</Text>
        </View>

        <View className='menu-item' onClick={handleSettings}>
          <Text className='menu-icon'>⚙️</Text>
          <Text className='menu-label'>更多设置</Text>
          <Text className='menu-arrow'>›</Text>
        </View>

        <View className='menu-item' onClick={handleShare}>
          <Text className='menu-icon'>🎁</Text>
          <Text className='menu-label'>分享给好友</Text>
          <View className='menu-right'>
            <Text className='menu-status'>去分享</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
        </View>

        <View className='menu-item' onClick={handleFeedback}>
          <Text className='menu-icon'>💡</Text>
          <Text className='menu-label'>意见反馈</Text>
          <Text className='menu-arrow'>›</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;