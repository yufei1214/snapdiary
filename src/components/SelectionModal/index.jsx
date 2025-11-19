import React, { useState, useEffect } from 'react'; // <-- 修正 1：从 'react' 导入
import Taro from '@tarojs/taro'; // <-- 修正 1：Taro 单独导入
import { View, Text, ScrollView, Image } from '@tarojs/components'; // <-- 修正 2：添加了 Image
import './index.less';
/**
 * @param {object} props
 * @param {boolean} props.visible 是否显示
 * @param {string} props.title 弹窗标题
 * @param {array} props.items 选项数组 (例如: [{ emoji: '😊', label: '开心' }])
 * @param {number} props.columns 网格的列数 (心情用5, 天气用4)
 * @param {object} props.selected 
 * @param {function} props.onClose 点击遮罩层或取消
 * @param {function} props.onConfirm 点击确定
 */
export default function SelectionModal(props) {
  const { visible, title, items = [], columns = 4, selected, onClose, onConfirm } = props
  
  // 内部状态，用于跟踪用户在点击“确定”前的选择
  const [internalSelected, setInternalSelected] = useState(selected)

  // 当弹窗显示时，同步外部传入的 selected 状态
  useEffect(() => {
    if (visible) {
      setInternalSelected(selected)
    }
  }, [visible, selected])

  if (!visible) {
    return null
  }

  // 处理点击“确定”
  const handleConfirm = () => {
    onConfirm(internalSelected)
  }

  // 处理点击遮罩层（关闭弹窗）
  const handleOverlayClick = () => {
    onClose()
  }

  // 阻止事件冒泡，防止点击内容区关闭弹窗
  const handleContentClick = (e) => {
    e.stopPropagation()
  }

  return (
    <View className='modal-overlay' onClick={handleOverlayClick}>
      <View className='modal-content' onClick={handleContentClick}>
        <View className='modal-header'>
          <Text className='modal-title'>{title}</Text>
          <Text className='modal-confirm-btn' onClick={handleConfirm}>
            确定
          </Text>
        </View>

        <ScrollView className='modal-body' scrollY>
          <View
            className='grid-container'
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {items.map((item) => {
            	const isSelected = internalSelected && internalSelected.label === item.label;
              return (
                <View
                  key={item.label}
                  className={`grid-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setInternalSelected(item)}
                >
                  {/* 根据 item.emoji 或 item.icon 决定显示
                    心情用 emoji (Text), 天气用 icon (Image)
                  */}
                  {item.emoji && <Text className='item-emoji'>{item.emoji}</Text>}
                  {item.icon && <Image src={item.icon} className='item-icon' />}
                  
                  <Text className='item-label'>{item.label}</Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}