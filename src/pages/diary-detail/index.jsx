import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import './index.less';

const DiaryDetail = () => {
  const router = useRouter();
  const { id } = router.params; // 从路由获取日记ID

  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    return `${year}-${month}-${day}`;
  };

  // 格式化时间显示
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 获取星期
  const getWeekday = (dateStr) => {
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  };

  // 获取农历（简化版）
  const getLunarDate = () => {
    return '乙巳蛇年 八月廿三';
  };

  // 预览图片
  const handlePreviewImage = (index) => {
    Taro.previewImage({
      urls: diary.images,
      current: diary.images[index]
    });
  };

  // 删除日记
  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后将无法恢复，确定要删除这篇日记吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            Taro.showLoading({ title: '删除中...' });
            
            // 调用云函数删除
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

  // 更多操作
  const handleMore = () => {
    Taro.showActionSheet({
      itemList: ['编辑', '删除', '分享'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            handleEdit();
            break;
          case 1:
            handleDelete();
            break;
          case 2:
            Taro.showToast({ title: '分享功能开发中', icon: 'none' });
            break;
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
      {/* 自定义导航栏 */}
      <View className='custom-navbar'>
        <View className='navbar-content'>
          <View className='nav-left' onClick={handleBack}>
            <Text className='back-icon'>‹</Text>
          </View>
          <Text className='nav-title'>今天</Text>
          <View className='nav-right'>
            <Text className='more-icon' onClick={handleMore}>•••</Text>
            <Text className='record-icon'>⊙</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className='page-content'
        scrollY
        enhanced
        showScrollbar={false}
      >
        {/* 日期时间头部 */}
        <View className='datetime-header'>
          <View className='datetime-row'>
            <View className='datetime-main'>
              <Text className='date-text'>{formatDate(diary.datetime)}</Text>
              <Text className='time-text'>{formatTime(diary.datetime)}</Text>
              <Text className='weekday-text'>{getWeekday(diary.datetime)}</Text>
            </View>

            {/* 心情和天气 */}
            <View className='action-buttons'>
              {diary.mood && (
                <View className='action-btn'>
                  <Text className='action-icon'>{diary.mood.emoji}</Text>
                  <Text className='action-label'>心情</Text>
                </View>
              )}
              {diary.weather && (
                <View className='action-btn'>
                  <Text className='action-icon'>{diary.weather.emoji}</Text>
                  <Text className='action-label'>天气</Text>
                </View>
              )}
            </View>
          </View>

          {/* 农历信息 */}
          <View className='lunar-row'>
            <Text className='lunar-text'>{getLunarDate()}</Text>
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

        {/* 位置信息 */}
        {diary.location && (
          <View className='location-section'>
            <Text className='location-icon'>📍</Text>
            <View className='location-info'>
              <Text className='location-name'>{diary.location.name}</Text>
              <Text className='location-address'>{diary.location.address}</Text>
            </View>
          </View>
        )}

        {/* 分类标签 */}
        {diary.category && (
          <View className='category-section'>
            <View className='category-tag'>
              <Text className='category-icon'>#</Text>
              <Text className='category-text'>{diary.category}</Text>
            </View>
          </View>
        )}

        {/* 底部信息 */}
        <View className='footer-info'>
          <Text className='footer-text'>
            字数: {diary.content ? diary.content.length : 0}
          </Text>
          <Text className='footer-text'>
            创建于 {formatDate(diary.createTime || diary.datetime)}
          </Text>
        </View>

        {/* 底部占位 */}
        <View className='bottom-placeholder' />
      </ScrollView>
    </View>
  );
};

export default DiaryDetail;