import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Textarea, ScrollView } from '@tarojs/components';
import Taro, { useLoad }  from '@tarojs/taro';
import DateTimeHeader from './components/DateTimeHeader';
import ImageUploader from './components/ImageUploader';
import CustomNavBar from '@/components/CustomNavBar'
import { MOOD_LIST, WEATHER_LIST } from '@/constants/diary';
import SelectionModal from '@/components/SelectionModal';
import CategoryModal from './components/CategoryModal';
import './index.less';

const DiaryEdit = () => {
  const [datetime, setDatetime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // 接收路由传入的日期
  const [diary, setDiary] = useState(null); // 编辑时的日记数据
  const [mood, setMood] = useState(MOOD_LIST[0]);
  const [weather, setWeather] = useState(WEATHER_LIST[0]);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [autoSaving, setAutoSaving] = useState(false);
  // 子组件中的状态声在此处，是因为在选择心情和天气时会发生原生组件穿透问题，所以挪到父组件，当弹窗出现时禁用输入框
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false); // 是否是编辑模式
  const [diaryId, setDiaryId] = useState(null); // 编辑的日记ID

  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

  const categories = [
    { id: 1, name: '运动', count: 0 },
    { id: 2, name: '随影日记介绍', count: 3 },
  ]


  // 接收路由参数（从首页传来的日期）
  useLoad((options) => {
    if(options.id) {
      setIsEditMode(true);
      setDiaryId(options.id);
      loadDiaryDetail(options.id); // 加载数据
    }else {
      setSelectedDate(options.selectedDate || null);
      if (options.selectedDate) {
        // 将字符串日期转换为 Date 对象
        setDatetime(new Date(options.selectedDate));
      }
    }
    
  });

  // 判断选中日期是否是今天
  const isToday = () => {
    if (!selectedDate) return true; // 没有日期，默认是今天（正常都会由 query 传入）
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return selectedDate === todayStr;
  };

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


  // 加载日记详情
  const loadDiaryDetail = async (id) => {
    try {
      Taro.showLoading({ title: '加载中...' });
      
      const result = await Taro.cloud.callFunction({
        name: 'getDiaryDetail',
        data: { id }
      });
      
      Taro.hideLoading();
      
      if (result.result.success) {
        const diary = result.result.data;
        setDiary(diary);
        
        // 填充数据到表单
        setDatetime(new Date(diary.datetime));
        setContent(diary.content || '');
        setImages(diary.images || []);
        setMood(diary.mood || MOOD_LIST[0]);
        setWeather(diary.weather || WEATHER_LIST[0]);
        setCategory(diary.category || null);
        setLocation(diary.location || null);
        
        // 设置 selectedDate（用于判断标题）
        const date = new Date(diary.datetime);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        
        console.log('日记详情加载成功:', diary);
      } else {
        throw new Error(result.result.message);
      }
    } catch (error) {
      Taro.hideLoading();
      console.error('加载日记详情失败', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
      
      // 加载失败返回上一页
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }
  };
  // 自动保存草稿
  const handleAutoSave = () => {
    setAutoSaving(true);
    // TODO: 保存到本地存储或云端
    console.log('自动保存草稿');
    
    setTimeout(() => {
      setAutoSaving(false);
    }, 500);
  };

  /* // 选择主题分类
  const handleSelectCategory = () => {
    Taro.showActionSheet({
      itemList: ['生活', '工作', '学习', '旅行', '运动'],
      success: (res) => {
        const categories = ['生活', '工作', '学习', ];
        setCategory(categories[res.tapIndex]);
      }
    });
  }; */

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
  /* 是“记录此刻”时,新增datetime字段用(new Date()).toISOString(),修改用diary.datetime;
  是“写下回忆”时,新增datetime字段用 new Date(options.selectedDate).toISOString()；修改用diary.datetime */
  const getDatetime = () => {
    // 编辑模式，永远保持原时间
    if (isEditMode) {
      return diary.datetime;
    }

    // 新增模式
    if (isToday()) {
      return new Date().toISOString();  // 记录此刻
    } else {
      return new Date(selectedDate).toISOString(); // 写下回忆
    }
  }

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
      // 处理图片：区分本地路径和云存储 fileID
      const uploadedImages = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        // 如果是云存储的 fileID（以 cloud:// 开头），直接使用
        if (img.startsWith('cloud://')) {
          uploadedImages.push(img);
        } 
        // 如果是本地临时路径，需要上传
        else {
          const cloudPath = `diary-images/${Date.now()}-${i}.jpg`;
          const uploadResult = await Taro.cloud.uploadFile({
            cloudPath,
            filePath: img
          });
          uploadedImages.push(uploadResult.fileID);
        }
      }

      // 调用云函数保存日记
      const result = await Taro.cloud.callFunction({
        name: isEditMode ? 'updateDiary' : 'saveDiary', // 根据模式调用不同云函数
        data: {
          ...(isEditMode && { id: diaryId }), // 编辑模式需要传入 id
          datetime: getDatetime(), // isEditMode&&diary ? diary.datetime : datetime.toISOString(),
          content,
          images: uploadedImages,
          mood,
          weather,
          category,
          location
        }
      });

      Taro.hideLoading();

      if (result.result.success) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        });

        // 延迟返回
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      } else {
        throw new Error(result.result.message);
      }

    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({
        title: '保存失败：' + error.message,
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

  // 弹窗确认处理函数
  const handleMoodConfirm = (selectedItem) => {
    if (selectedItem) {
      setMood(selectedItem);
    }
    setMoodModalVisible(false);
  };

  const handleWeatherConfirm = (selectedItem) => {
    if (selectedItem) {
      setWeather(selectedItem);
    }
    setWeatherModalVisible(false);
  };
  // 判断是否有 Modal 打开 (用于禁用 Textarea)
  const isModalOpen = moodModalVisible || weatherModalVisible;

  // 计算日期差，用于title显示
  const getDateTitle = () => {
    if (!selectedDate || isToday()) return "今天";
    
    const selected = new Date(selectedDate);
    const today = new Date();
    const diffDays = Math.floor((today - selected) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "昨天";
    if (diffDays === 2) return "前天";
    if (diffDays <= 7) return `${diffDays}天前`;
    return selectedDate.slice(5).replace('-', '月') + '日';
  };
  // 选择主题分类
  const handleSelectCategory = () => {
    setCategoryModalVisible(true);
  };

  // 确认选择分类
  const handleCategoryConfirm = (list) => {
    setSelectedCategoryIds(list.map(item => item.id))
  }

  const categoryMap = useMemo(() => {
    const map = {}
    categories.forEach(item => {
      map[item.id] = item
    })
    return map
  }, [categories])
  return (
    <View className='diary-edit-page'>
      <CustomNavBar title={isEditMode? '编辑' : (isToday() ? "今天" : "补记")} onBack={handleBack} /> {/* 回忆/往日 */}
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
          onMoodClick={() => setMoodModalVisible(true)} 
          onWeatherClick={() => setWeatherModalVisible(true)}
        />

        {/* 内容输入区域 */}
        <View className='content-section'>
          <Textarea
            className='content-input'
            placeholder='写下快乐、感想、成长...'
            placeholderClass='content-placeholder'
            value={content}
            onInput={(e) => setContent(e.detail.value)}
            autoHeight
            maxlength={-1}
            // 当任意 Modal 打开时，禁用 Textarea
            disabled={isModalOpen}
          />
          
          {autoSaving && (
            <View className='auto-save-tip'>草稿自动保存</View>
          )}
        </View>
        <View className="info-section">
          {/* 字数统计和其他信息 */}
          <View className='info-row'>
            <View className='info-item'>
              <Text className='info-icon'>✏️</Text>
              <Text className='info-text'>字数: {wordCount}</Text>
            </View>
            {/* TODO */}
            {/* <View className='info-item voice-input'>
              <Text className='voice-icon'>🎤</Text>
              <Text className='voice-text'>语音识别</Text>
            </View> */}
          </View>
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
                主题分类{selectedCategoryIds.length > 0 ? `：${
                  selectedCategoryIds
      .map(id => categoryMap[id]?.name)
      .filter(Boolean)
      .join('、')}` : ''}
              </Text>
              <Text className='action-item-arrow'>›</Text>
            </View>
            {/* 分类弹窗 */}
            <CategoryModal 
              visible={categoryModalVisible} 
              categoryList={categories}
              selectedIds={selectedCategoryIds}
              onChange={handleCategoryConfirm}
              onClose={() => setCategoryModalVisible(false)}
            />

            {/* TODO */}
            {/* <View className='action-item' onClick={handleSelectTemplate}>
              <Text className='action-item-icon'>📄</Text>
              <Text className='action-item-text'>模板</Text>
              <Text className='action-item-arrow'>›</Text>
            </View> */}

            <View className='action-item' onClick={handleSelectLocation}>
              <Text className='action-item-icon'>📍</Text>
              <Text className='action-item-text'>
                {location ? location.name : '所在位置'}
              </Text>
              <Text className='action-item-arrow'>›</Text>
            </View>
          </View>
        </View>

        {/* 底部占位 */}
        <View className='bottom-placeholder' />
      </ScrollView>

      <SelectionModal
        visible={moodModalVisible}
        title='心情'
        items={MOOD_LIST} 
        columns={5} 
        selected={mood}
        onClose={() => setMoodModalVisible(false)}
        onConfirm={handleMoodConfirm}
      />

      <SelectionModal
        visible={weatherModalVisible}
        title='天气'
        items={WEATHER_LIST} 
        columns={4} 
        selected={weather}
        onClose={() => setWeatherModalVisible(false)}
        onConfirm={handleWeatherConfirm}
      />

      {/* 保存按钮 */}
      <View className='save-btn-wrapper'>
        <View className='save-btn' onClick={handleSave}>
          <Text className='save-btn-text'>保存</Text>
        </View>
            {/* TODO */}
        {/* <View className='faq-link'>
          <Text className='faq-text'>❓常见问题</Text>
        </View> */}
      </View>
    </View>
  );
};

export default DiaryEdit;