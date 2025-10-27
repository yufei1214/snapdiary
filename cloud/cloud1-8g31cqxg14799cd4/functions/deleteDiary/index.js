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

    // 先查询日记是否存在且属于当前用户
    const diary = await db.collection('diaries')
      .doc(id)
      .get()

    if (!diary.data) {
      return {
        success: false,
        message: '日记不存在'
      }
    }

    // 删除图片（如果有）
    if (diary.data.images && diary.data.images.length > 0) {
      try {
        await Promise.all(
          diary.data.images.map(fileID => 
            cloud.deleteFile({ fileList: [fileID] })
          )
        )
      } catch (err) {
        console.error('删除图片失败', err)
        // 即使图片删除失败，也继续删除日记记录
      }
    }

    // 删除日记记录
    await db.collection('diaries').doc(id).remove()

    return {
      success: true,
      message: '删除成功'
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: '删除失败：' + err.message
    }
  }
}