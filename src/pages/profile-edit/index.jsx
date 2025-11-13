import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import './index.less';

const ProfileEdit = () => {
  const [userInfo, setUserInfo] = useState({
    avatarUrl: '',
    nickName: ''
  });
  const [isSaving, setIsSaving] = useState(false); // 保存状态

  useEffect(() => {
    // 从缓存加载用户信息
    loadUserInfo();
  }, []);

  // 加载用户信息
  const loadUserInfo = () => {
    const cachedUserInfo = Taro.getStorageSync('userInfo');
    if (cachedUserInfo) {
      setUserInfo(cachedUserInfo);
    } else {
      // 默认值
      setUserInfo({
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
        nickName: ''
      });
    }
  };

  // 返回
  const handleBack = () => {
    // 检查是否有修改
    const cachedUserInfo = Taro.getStorageSync('userInfo');
    const hasChanged = 
  (cachedUserInfo && userInfo.avatarUrl !== cachedUserInfo.avatarUrl) ||
  (cachedUserInfo && userInfo.nickName !== cachedUserInfo.nickName) ||
  !cachedUserInfo;

    if (hasChanged) {
      Taro.showModal({
        title: '提示',
        content: '信息已修改，是否保存？',
        confirmText: '保存',
        cancelText: '不保存',
        success: (res) => {
          if (res.confirm) {
            handleSave(() => {
              Taro.navigateBack();
            });
          } else {
            Taro.navigateBack();
          }
        }
      });
    } else {
      Taro.navigateBack();
    }
  };

  // 点击头像区域 - 获取微信头像
  const handleChangeAvatar = async (e) => {
    console.log('选择微信头像:', e);
    const avatarUrl = e.detail && e.detail.avatarUrl;
    if (!avatarUrl) {
        Taro.showToast({
            title: '未选择头像',
            icon: 'none'
        });
        return;
    }
    setUserInfo(prev => ({
        ...prev,
        avatarUrl: avatarUrl,
    }));
    Taro.showToast({
        title: '头像获取成功',
        icon: 'success',
        duration: 1500
    });
  };

  // 昵称输入
  const handleNicknameChange = (e) => {
    const nickName = e.detail.value;
    setUserInfo(prev => ({ ...prev, nickName }));
  };

  // 保存到本地和云端
  const saveToLocalAndCloud = async (data) => {
    // 1. 保存到本地缓存（立即生效，速度快）
    console.log('保存到本地缓存:', data);
    Taro.setStorageSync('userInfo', data);
    
    // 2. 同步到云数据库（永久保存，多设备同步）
    console.log('开始同步到云端...');
    try {
      const result = await Taro.cloud.callFunction({
        name: 'syncUserInfo',
        data: {
          avatarUrl: data.avatarUrl,
          nickName: data.nickName
        }
      });
      
      console.log('云端同步结果:', result);
      
      if (result.result && result.result.success) {
        console.log('云端同步成功');
        return { success: true, message: '保存成功' };
      } else {
        console.log('云端同步失败:', result.result && result.result.message);
        return { success: false, message: (result.result && result.result.message) || '云端同步失败' };
      }
    } catch (error) {
      console.error('云端同步异常:', error);
      return { success: false, message: '网络异常' };
    }
  };

  // 保存
  const handleSave = async (callback) => {
    // 验证数据
    if (!userInfo.nickName || userInfo.nickName.trim() === '') {
      Taro.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    if (userInfo.nickName === '点击设置昵称') {
      Taro.showToast({
        title: '请修改昵称',
        icon: 'none'
      });
      return;
    }

    // 防止重复点击
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    Taro.showLoading({ title: '保存中...' });

    try {
      // 保存到本地和云端
      const result = await saveToLocalAndCloud({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName.trim()
      });

      Taro.hideLoading();
      
      if (result.success) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        });

        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          if (callback) {
            callback();
          } else {
            Taro.navigateBack();
          }
        }, 1500);
      } else {
        // 虽然云端失败，但本地已保存
        Taro.showToast({
          title: '本地保存成功，云端同步失败',
          icon: 'none',
          duration: 2000
        });

        setTimeout(() => {
          if (callback) {
            callback();
          } else {
            Taro.navigateBack();
          }
        }, 2000);
      }
    } catch (error) {
      Taro.hideLoading();
      console.error('保存失败:', error);
      
      Taro.showToast({
        title: '保存失败',
        icon: 'none'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className='profile-edit-page'>
      {/* 自定义导航栏 */}
      <View className='custom-navbar'>
        <View className='navbar-content'>
          <View className='nav-left' onClick={handleBack}>
            <Text className='back-icon'>‹</Text>
          </View>
          <Text className='nav-title'>编辑资料</Text>
          <View className='nav-right'>
            <Text 
              className={`save-text ${isSaving ? 'saving' : ''}`}
              onClick={() => handleSave()}
            >
              {isSaving ? '保存中...' : '保存'}
            </Text>
          </View>
        </View>
      </View>

      {/* 页面内容 */}
      <View className='page-content'>
        {/* 头像区域 */}
        <View className='edit-section'>
            <Button 
                openType="chooseAvatar" 
                onChooseAvatar={handleChangeAvatar}
                className='avatar-btn'
            >
                <View className='section-item'>
                    <Text className='item-label'>头像</Text>
                    <View className='item-content'>
                    <Image 
                        className='avatar-preview' 
                        src={userInfo.avatarUrl}
                        mode='aspectFill'
                    />
                    </View>
                </View>
            </Button>
        </View>

        {/* 昵称区域 */}
        <View className='edit-section'>
          <View className='section-item'>
            <Text className='item-label'>昵称</Text>
            <View className='item-content'>
              <Input
                className='nickname-input'
                type='text'
                value={userInfo.nickName}
                placeholder='请输入昵称'
                placeholderClass='placeholder'
                onInput={handleNicknameChange}
                maxlength={20}
              />
            </View>
          </View>
        </View>

        {/* 提示信息 */}
        <View className='tip-section'>
          <Text className='tip-text'>💡 点击头像可以获取微信头像和昵称</Text>
          <Text className='tip-text'>💡 昵称可以自定义修改，最多20个字符</Text>
          <Text className='tip-text'>💡 修改后点击右上角"保存"按钮</Text>
          <View className='tip-divider' />
          <Text className='tip-text'>📱 数据保存说明：</Text>
          <Text className='tip-text'>• 本地保存：打开速度快，离线可用</Text>
          <Text className='tip-text'>• 云端保存：永久存储，多设备同步</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileEdit;