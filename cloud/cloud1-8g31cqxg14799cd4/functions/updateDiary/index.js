const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event) => {
  const { id, datetime, content, images, mood, weather, category, location } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    // 更新日记
    const result = await db.collection('diaries')
      .doc(id)
      .update({
        data: {
          datetime,
          content,
          images,
          mood,
          weather,
          category,
          location,
          updateTime: new Date().toISOString()
        }
      });
    
    return {
      success: true,
      message: '更新成功',
      data: result
    };
  } catch (error) {
    console.error('更新日记失败:', error);
    return {
      success: false,
      message: error.message || '更新失败'
    };
  }
};