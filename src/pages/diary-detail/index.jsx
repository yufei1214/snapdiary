import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import CustomNavBar from '@/components/CustomNavBar'
import { Lunar, Solar } from 'lunar-javascript';
import './index.less';

const DiaryDetail = () => {
  const router = useRouter();
  const { id } = router.params; // 从路由获取日记ID

  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);

  useDidShow(() => {
    if (id) {
      loadDiaryDetail();
    }
  }, [id]);

  // 加载日记详情
  const loadDiaryDetail = async () => {
    try {
      setLoading(true);

      // 调用云函数获取日记详情
      const result = await Taro.cloud.callFunction({
        name: 'getDiaryDetail',
        data: { id }
      });

      if (result.result.success) {
        setDiary(result.result.data);
      } else {
        Taro.showToast({
          title: result.result.message || '日记不存在',
          icon: 'none'
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error('加载日记详情失败', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期显示
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 获取星期
  const getWeekday = (dateStr) => {
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  };

  // 获取农历（简化版）
  /* const getLunarDate = () => {
    return '乙巳蛇年 十月初三';
  }; */

  const getLunarDate = (datetime) => {
    try {
      const solar = Solar.fromDate(new Date(datetime));
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
  // 预览图片
  const handlePreviewImage = (index) => {
    Taro.previewImage({
      urls: diary.images,
      current: diary.images[index]
    });
  };

  // 删除日记
  const deleteAction = () => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后将无法恢复，确定要删除这篇日记吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            Taro.showLoading({ title: '删除中...' });
            
            const result = await Taro.cloud.callFunction({
              name: 'deleteDiary',
              data: { id }
            });

            Taro.hideLoading();

            if (result.result.success) {
              Taro.showToast({
                title: '删除成功',
                icon: 'success'
              });

              setTimeout(() => {
                Taro.navigateBack();
              }, 1500);
            } else {
              Taro.showToast({
                title: result.result.message,
                icon: 'none'
              });
            }
          } catch (error) {
            Taro.hideLoading();
            Taro.showToast({
              title: '删除失败',
              icon: 'none'
            });
            console.error('删除失败', error);
          }
        }
      }
    });
  };

  // 编辑日记
  const handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/diary-edit/index?id=${id}`
    });
  };

  // 分享
  const handleShare = () => {
    Taro.showToast({ 
      title: '分享功能开发中', 
      icon: 'none' 
    });
  };

  // 点赞
  const handleLike = () => {
    Taro.showToast({ 
      title: '点赞功能开发中', 
      icon: 'none' 
    });
  };

  // 收藏
  const handleStar = () => {
    Taro.showToast({ 
      title: '收藏功能开发中', 
      icon: 'none' 
    });
  };

  // 有感
  const handleComment = () => {
    Taro.showToast({ 
      title: '评论功能开发中', 
      icon: 'none' 
    });
  };

  // 删除
  const handleDelete = () => {
    Taro.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          deleteAction();
        }
      }
    });
  };

  // 返回
  const handleBack = () => {
    Taro.navigateBack();
  };

  if (loading) {
    return (
      <View className='diary-detail-page loading'>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!diary) {
    return null;
  }

  return (
    <View className='diary-detail-page'>
      <CustomNavBar title='详情' onBack={handleBack} />

      <ScrollView 
        className='page-content'
        scrollY
        enhanced
        showScrollbar={false}
      >
        {/* 头部信息 */}
        <View className='detail-header'>
          {/* 日期时间 + 星期 */}
          <View className='datetime-row'>
            <Text className='datetime-text'>{formatDate(diary.datetime)}</Text>
            <Text className='weekday-text'>{getWeekday(diary.datetime)}</Text>
          </View>

          {/* 农历 */}
          <View className='lunar-row'>
            <Text className='lunar-text'>{getLunarDate(diary.datetime)}</Text>
          </View>

          {/* 心情和天气 */}
          <View className='mood-weather-row'>
            {diary.mood && (
              <View className='mood-weather-item'>
                <Text className='emoji'>{diary.mood.emoji}</Text>
                <Text className='label'>{diary.mood.label || '心情'}</Text>
              </View>
            )}
            {diary.weather && (
              <View className='mood-weather-item'>
                <Text className='emoji'>{diary.weather.emoji}</Text>
                <Text className='label'>{diary.weather.label || '天气'}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 日记内容 */}
        <View className='content-section'>
          <Text className='content-text'>{diary.content}</Text>
        </View>

        {/* 图片展示 */}
        {diary.images && diary.images.length > 0 && (
          <View className='images-section'>
            <View className={`images-grid ${
              diary.images.length === 1 ? 'images-grid-single' : 
              diary.images.length === 2 ? 'images-grid-double' :
              diary.images.length === 4 ? 'images-grid-four' : ''
            }`}>
              {diary.images.map((img, index) => (
                <View 
                  key={index} 
                  className='image-item'
                  onClick={() => handlePreviewImage(index)}
                >
                  <Image 
                    className='image' 
                    src={img} 
                    mode='aspectFill'
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 底部信息 */}
        <View className='footer-info'>
          <Text className='footer-text'>字数: {diary.content ? diary.content.length : 0}</Text>
          <Text className='footer-text'>创建于 {formatDate(diary.createTime || diary.datetime)}</Text>
        </View>

        {/* 底部占位 */}
        <View className='bottom-placeholder' />
      </ScrollView>

      {/* 底部操作栏 */}
      <View className='bottom-action-bar'>
        <View className='action-item' onClick={handleShare}>
          <Text className='action-icon'>🔗</Text>
          <Text className='action-text'>分享</Text>
        </View>
        
        <View className='action-item' onClick={handleLike}>
          <Text className='action-icon'>❤️</Text>
          <Text className='action-text'>赞</Text>
        </View>
        
        <View className='action-item' onClick={handleStar}>
          <Text className='action-icon'>⭐</Text>
          <Text className='action-text'>星标</Text>
        </View>
        
        <View className='action-item' onClick={handleComment}>
          <Text className='action-icon'>💬</Text>
          <Text className='action-text'>有感</Text>
        </View>
        
        <View className='action-item' onClick={handleEdit}>
          <Text className='action-icon'>✏️</Text>
          <Text className='action-text'>编辑</Text>
        </View>
        
        <View className='action-item' onClick={handleDelete}>
          <Text className='action-icon'>🗑️</Text>
          <Text className='action-text'>删除</Text>
        </View>
      </View>
    </View>
  );
};

export default DiaryDetail;