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
    const { year, month, page = 1, pageSize = 20 } = event

    // 构建查询条件
    let query = db.collection('diaries')

    // 如果指定了年月，筛选该月的日记
    if (year && month) {
      const startDate = new Date(year, month - 1, 1).toISOString()
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()
      
      query = query.where({
        datetime: db.command.gte(startDate).and(db.command.lte(endDate))
      })
    }

    // 查询日记列表
    const result = await query
      .orderBy('datetime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    // 格式化返回数据
    const diaryList = result.data.map(diary => {
      const date = new Date(diary.datetime)
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      // 转换为东八区时间
      const chinaTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      
      return {
        id: diary._id,
        datetime: diary.datetime, // 原始日期时间字符串
        date: chinaTime.toISOString().split('T')[0],
        weekday: weekdays[chinaTime.getUTCDay()],
        time: `${String(chinaTime.getUTCHours()).padStart(2, '0')}:${String(chinaTime.getUTCMinutes()).padStart(2, '0')}`,
        title: diary.content.substring(0, 50) + (diary.content.length > 50 ? '...' : ''),
        content: diary.content.substring(0, 100),
        coverImage: diary.images && diary.images[0] ? diary.images[0] : '',
        tagIcon: diary.mood ? diary.mood.emoji : '📝',
        tagColor: '#FFD700',
        tagText: diary.category || '',
        isStarred: diary.isStarred || false,
        images: diary.images || [],
        mood: diary.mood,
        weather: diary.weather,
        location: diary.location
      }
    })

    return {
      success: true,
      data: diaryList,
      total: result.data.length
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: '获取失败：' + err.message,
      data: []
    }
  }
}