import React from 'react';
import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';

const ImageUploader = ({ 
  images = [], 
  maxCount = 9,
  onChange 
}) => {
  
  // 选择图片
  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: maxCount - images.length, // 最多可选择的图片数量
        sizeType: ['compressed'], // 压缩图
        sourceType: ['album', 'camera'], // 从相册选择或拍照
      });

      const newImages = [...images, ...res.tempFilePaths];
      onChange && onChange(newImages);
    } catch (error) {
      console.error('选择图片失败', error);
    }
  };

  // 预览图片
  const handlePreviewImage = (index) => {
    Taro.previewImage({
      urls: images,
      current: images[index]
    });
  };

  // 删除图片
  const handleDeleteImage = (index, e) => {
    e.stopPropagation(); // 阻止触发预览
    
    Taro.showModal({
      title: '提示',
      content: '确定删除这张图片吗？',
      success: (res) => {
        if (res.confirm) {
          const newImages = images.filter((_, i) => i !== index);
          onChange && onChange(newImages);
        }
      }
    });
  };

  return (
    <View className='image-uploader'>
      <View className='image-grid'>
        {/* 已上传的图片 */}
        {images.map((img, index) => (
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
            <View 
              className='delete-btn'
              onClick={(e) => handleDeleteImage(index, e)}
            >
              ×
            </View>
          </View>
        ))}

        {/* 添加按钮 */}
        {images.length < maxCount && (
          <View 
            className='image-item add-btn'
            onClick={handleChooseImage}
          >
            <View className='add-icon'>+</View>
          </View>
        )}
      </View>

      {/* 图片数量提示 */}
      {images.length > 0 && (
        <View className='image-count-tip'>
          已添加 {images.length}/{maxCount} 张图片
        </View>
      )}
    </View>
  );
};

export default ImageUploader;