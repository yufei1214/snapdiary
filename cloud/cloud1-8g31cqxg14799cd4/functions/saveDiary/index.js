// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { 
      datetime, 
      content, 
      images, 
      mood, 
      weather, 
      category, 
      location 
    } = event

    // 数据验证
    if (!content && (!images || images.length === 0)) {
      return {
        success: false,
        message: '内容和图片不能同时为空'
      }
    }

    // 保存日记
    const result = await db.collection('diaries').add({
      data: {
        datetime: datetime || new Date().toISOString(),
        content: content || '',
        images: images || [],
        mood: mood || null,
        weather: weather || null,
        category: category || null,
        location: location || null,
        isStarred: false,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })

    return {
      success: true,
      message: '保存成功',
      data: {
        _id: result._id
      }
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: '保存失败：' + err.message
    }
  }
}