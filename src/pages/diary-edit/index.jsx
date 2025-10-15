import React, { useState, useEffect } from 'react';
import { View, Text, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import DateTimeHeader from './components/DateTimeHeader';
import ImageUploader from './components/ImageUploader';
import './index.less';

const DiaryEdit = () => {
  const [datetime, setDatetime] = useState(new Date());
  const [mood, setMood] = useState(null);
  const [weather, setWeather] = useState(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [autoSaving, setAutoSaving] = useState(false);

  // 监听内容变化，更新字数
  useEffect(() => {
    setWordCount(content.length);
  }, [content]);

  // 自动保存（草稿）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim() || images.length > 0) {
        handleAutoSave();
      }
    }, 3000); // 3秒后自动保存

    return () => clearTimeout(timer);
  }, [content, images, mood, weather, category, location]);

  // 自动保存草稿
  const handleAutoSave = () => {
    setAutoSaving(true);
    // TODO: 保存到本地存储或云端
    console.log('自动保存草稿');
    
    setTimeout(() => {
      setAutoSaving(false);
    }, 500);
  };

  // 选择主题分类
  const handleSelectCategory = () => {
    Taro.showActionSheet({
      itemList: ['生活', '工作', '学习', '旅行', '运动', '美食', '娱乐', '其他'],
      success: (res) => {
        const categories = ['生活', '工作', '学习', '旅行', '运动', '美食', '娱乐', '其他'];
        setCategory(categories[res.tapIndex]);
      }
    });
  };

  // 选择模板
  const handleSelectTemplate = () => {
    Taro.showToast({
      title: '模板功能开发中',
      icon: 'none'
    });
  };

  // 选择位置
  const handleSelectLocation = async () => {
    try {
      const res = await Taro.chooseLocation();
      setLocation({
        name: res.name,
        address: res.address,
        latitude: res.latitude,
        longitude: res.longitude
      });
    } catch (error) {
      console.error('选择位置失败', error);
    }
  };

  // 保存日记
  const handleSave = async () => {
    if (!content.trim() && images.length === 0) {
      Taro.showToast({
        title: '请输入内容或添加图片',
        icon: 'none'
      });
      return;
    }

    Taro.showLoading({ title: '保存中...' });

    try {
      // TODO: 上传图片到云存储
      // TODO: 保存日记数据到云数据库
      
      const diaryData = {
        datetime: datetime.toISOString(),
        mood,
        weather,
        content,
        images,
        category,
        location,
        createTime: new Date().toISOString()
      };

      console.log('保存日记数据：', diaryData);

      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      Taro.hideLoading();
      Taro.showToast({
        title: '保存成功',
        icon: 'success'
      });

      // 延迟返回
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);

    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: '保存失败',
        icon: 'none'
      });
      console.error('保存失败', error);
    }
  };

  // 返回确认
  const handleBack = () => {
    if (content.trim() || images.length > 0) {
      Taro.showModal({
        title: '提示',
        content: '内容尚未保存，确定要离开吗？',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateBack();
          }
        }
      });
    } else {
      Taro.navigateBack();
    }
  };

  return (
    <View className='diary-edit-page'>
      {/* 自定义导航栏 */}
      <View className='custom-navbar'>
        <View className='navbar-content'>
          <View className='nav-left' onClick={handleBack}>
            <Text className='back-icon'>‹</Text>
          </View>
          <Text className='nav-title'>今天</Text>
          <View className='nav-right'>
            <Text className='more-icon'>•••</Text>
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
        <DateTimeHeader
          datetime={datetime}
          mood={mood}
          weather={weather}
          onDateTimeChange={setDatetime}
          onMoodChange={setMood}
          onWeatherChange={setWeather}
        />

        {/* 内容输入区域 */}
        <View className='content-section'>
          <Textarea
            className='content-input'
            placeholder='写下今日感想、感恩、成长、快乐...'
            placeholderClass='content-placeholder'
            value={content}
            onInput={(e) => setContent(e.detail.value)}
            autoHeight
            maxlength={-1}
          />
          
          {autoSaving && (
            <View className='auto-save-tip'>草稿自动保存</View>
          )}
        </View>

        {/* 图片上传区域 */}
        <ImageUploader
          images={images}
          onChange={setImages}
        />

        {/* 底部操作区域 */}
        <View className='bottom-actions'>
          {/* 功能按钮行 */}
          <View className='action-row'>
            <View className='action-item' onClick={handleSelectCategory}>
              <Text className='action-item-icon'>#</Text>
              <Text className='action-item-text'>
                {category || '主题分类'}
              </Text>
              <Text className='action-item-arrow'>›</Text>
            </View>

            <View className='action-item' onClick={handleSelectTemplate}>
              <Text className='action-item-icon'>📄</Text>
              <Text className='action-item-text'>模板</Text>
              <Text className='action-item-arrow'>›</Text>
            </View>

            <View className='action-item' onClick={handleSelectLocation}>
              <Text className='action-item-icon'>📍</Text>
              <Text className='action-item-text'>
                {location ? location.name : '所在位置'}
              </Text>
              <Text className='action-item-arrow'>›</Text>
            </View>
          </View>

          {/* 字数统计和其他信息 */}
          <View className='info-row'>
            <View className='info-item'>
              <Text className='info-icon'>🕐</Text>
              <Text className='info-text'>字数: {wordCount}</Text>
            </View>
            <View className='info-item voice-input'>
              <Text className='voice-icon'>🎤</Text>
              <Text className='voice-text'>语音识别</Text>
            </View>
          </View>
        </View>

        {/* 底部占位 */}
        <View className='bottom-placeholder' />
      </ScrollView>

      {/* 保存按钮 */}
      <View className='save-btn-wrapper'>
        <View className='save-btn' onClick={handleSave}>
          <Text className='save-btn-text'>保存</Text>
        </View>
        <View className='faq-link'>
          <Text className='faq-text'>❓常见问题</Text>
        </View>
      </View>
    </View>
  );
};

export default DiaryEdit;