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
    const { id } = event

    if (!id) {
      return {
        success: false,
        message: '日记ID不能为空'
      }
    }

    // 查询日记详情
    const result = await db.collection('diaries')
      .doc(id)
      .get()

    if (!result.data) {
      return {
        success: false,
        message: '日记不存在'
      }
    }

    // 格式化返回数据
    const diary = result.data
    const date = new Date(diary.datetime)
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

    return {
      success: true,
      data: {
        ...diary,
        id: diary._id,
        date: date.toISOString().split('T')[0],
        weekday: weekdays[date.getDay()],
        time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      }
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: '获取失败：' + err.message
    }
  }
}