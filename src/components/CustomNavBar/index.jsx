import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

const CustomNavBar = ({ 
  title = '随影日记', 
  showBack = true, 
  onBack,
  rightContent 
}) => {
  // 获取系统信息（状态栏高度）
  const systemInfo = Taro.getSystemInfoSync();
  const statusBarHeight = systemInfo.statusBarHeight || 0;
  // 导航栏高度 = 状态栏高度 + 标题栏高度（一般是44px）
  const navBarHeight = statusBarHeight + 44;

  // 返回按钮点击
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      Taro.navigateBack();
    }
  };

  return (
    <>
			<View 
				className='custom-nav-bar' 
				style={{ height: `${navBarHeight}px` }}
			>
				{/* 状态栏占位 */}
				<View 
					className='status-bar' 
					style={{ height: `${statusBarHeight+6}px` }}
				/>
				
				{/* 导航栏内容 */}
				<View className='nav-bar-content'>
					{/* 左侧返回按钮 */}
					{showBack && (
						<View className='nav-left' onClick={handleBack}>
							<Text className='back-icon'>&lang;</Text>
						</View>
					)}
					
					{/* 中间标题 */}
					<View className='nav-center'>
						<Text className='nav-title'>{title}</Text>
					</View>
					
					{/* 右侧内容区域 */}
					<View className='nav-right'>
						{rightContent}
					</View>
				</View>
			</View>
			 {/* 占位元素，防止内容被遮挡 */}
      <View style={{ height: `${navBarHeight}px` }} />
    </>
  );
};

export default CustomNavBar;