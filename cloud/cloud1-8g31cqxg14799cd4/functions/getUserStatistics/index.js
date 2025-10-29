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
    // 获取用户的所有日记
    const diaryResult = await db.collection('diaries')
      .where({ _openid: wxContext.OPENID })
      .get()

    const diaries = diaryResult.data

    // 统计数据
    const statistics = {
      diaryCount: diaries.length,                           // 日记数
      wordCount: 0,                                          // 总字数
      imageCount: 0,                                         // 图片数
      categoryCount: 0                                       // 分类数
    }

    // 统计字数和图片数
    const categories = new Set()
    diaries.forEach(diary => {
      // 统计字数
      if (diary.content) {
        statistics.wordCount += diary.content.length
      }
      
      // 统计图片数
      if (diary.images && diary.images.length > 0) {
        statistics.imageCount += diary.images.length
      }
      
      // 统计分类
      if (diary.category) {
        categories.add(diary.category)
      }
    })

    statistics.categoryCount = categories.size

    return {
      success: true,
      data: statistics
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: '获取统计数据失败：' + err.message,
      data: {
        diaryCount: 0,
        wordCount: 0,
        imageCount: 0,
        categoryCount: 0
      }
    }
  }
}