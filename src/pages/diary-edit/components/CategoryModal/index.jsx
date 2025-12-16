import React, { useState, useEffect } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import './index.less'

const CategoryModal = ({
	visible,
	categoryList = [],
	selectedIds = [],
	onClose,
	onChange,
}) => {
	const [searchValue, setSearchValue] = useState('')

	const toggleSelect = (item) => {
		let nextSelectedIds;

		if (selectedIds.includes(item.id)) {
			nextSelectedIds = selectedIds.filter(id => id !== item.id)
		} else {
			nextSelectedIds = [...selectedIds, item.id]
		}
		console.log('切换选择分类，当前选中：', nextSelectedIds, Boolean(onChange));
		if (onChange) {
			const selectedList = categoryList.filter(cat =>
				nextSelectedIds.includes(cat.id)
			)
			console.log('调用 onChange，传递选中分类列表：', selectedList);
			onChange(selectedList)
		}
	}


	return (
		<View className={`category-modal ${visible ? 'show' : ''}`}>
			{/* 遮罩 */}
			<View className="modal-mask" onClick={onClose} />

			{/* 内容 */}
			<View className="modal-content">
				{/* 顶部 */}
				<View className="modal-header">
					<View className="header-left">
						<Text className="title">分类</Text>
						<View className="add-icon">+</View>
					</View>

					<View className="search-box">
						<Input
							className="search-input"
							placeholder="搜索分类"
							value={searchValue}
							onInput={e => setSearchValue(e.detail.value)}
						/>
					</View>

					<View className="header-right">
						<Text className="hint-text">↓ 左滑可操作</Text>
						<View className="close-arrow" onClick={onClose}>⌄</View>
					</View>
				</View>

				{/* 分类列表 */}
				<ScrollView className="category-list">
					{categoryList.map(item => {
						const checked = selectedIds.includes(item.id)

						return (
							<View
								key={item.id}
								className={`category-item ${checked ? 'selected' : ''}`}
								onClick={() => toggleSelect(item)}
							>
								<Text className="item-name">{item.name}</Text>
								<View className="item-right">
									<Text className="item-count">{item.count}篇</Text>
									{checked && <Text className="check-icon">✓</Text>}
								</View>
							</View>
						)
					})}
				</ScrollView>
			</View>
		</View>
	)
}

export default CategoryModal
