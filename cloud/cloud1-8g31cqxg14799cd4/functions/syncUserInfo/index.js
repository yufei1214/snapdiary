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
    // 获取 openid，如果是测试环境就用测试ID
    let openid = wxContext.OPENID
    
    // 如果 openid 为空（测试环境），使用测试ID
    if (!openid || openid === 'undefined') {
      openid = 'test_openid_' + Date.now()
      console.log('使用测试 openid:', openid)
    } else {
      console.log('真实 openid:', openid)
    }
    
    const { avatarUrl, nickName } = event

    // 验证参数
    if (!avatarUrl || !nickName) {
      return {
        success: false,
        message: '头像或昵称不能为空'
      }
    }

    console.log('接收到的数据:', { avatarUrl, nickName })

    // 查询用户是否已存在
    const userResult = await db.collection('users')
      .where({ _openid: openid })
      .get()

    console.log('查询用户结果:', userResult.data.length + ' 条')

    const now = new Date()

    if (userResult.data.length > 0) {
      // 用户已存在，更新信息
      console.log('更新用户信息...')
      
      await db.collection('users')
        .where({ _openid: openid })
        .update({
          data: {
            avatarUrl,
            nickName,
            updateTime: now
          }
        })
      
      console.log('更新成功')
    } else {
      // 新用户，创建记录
      console.log('创建新用户...')
      
      await db.collection('users').add({
        data: {
          _openid: openid,  // 手动添加 openid
          avatarUrl,
          nickName,
          createTime: now,
          updateTime: now
        }
      })
      
      console.log('创建成功')
    }

    return {
      success: true,
      message: '同步成功',
      data: {
        avatarUrl,
        nickName
      }
    }
  } catch (err) {
    console.error('云函数错误:', err)
    return {
      success: false,
      message: '同步失败：' + err.message
    }
  }
}