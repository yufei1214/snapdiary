const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event) => {
  const { startDate, endDate } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    const result = await db.collection('diaries')
      .where({
        _openid: wxContext.OPENID,
        date: db.command.gte(startDate).and(db.command.lte(endDate))
      })
      .orderBy('datetime', 'desc')
      .get();
    
    // 格式化数据
    const formattedData = result.data.map(item => {
      const datetime = new Date(item.datetime);
      const date = item.date || datetime.toISOString().split('T')[0];
      
      return {
        id: item._id,
        date: date,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][datetime.getDay()],
        time: `${String(datetime.getHours()).padStart(2, '0')}:${String(datetime.getMinutes()).padStart(2, '0')}`,
        title: item.content ? item.content.substring(0, 30) + (item.content.length > 30 ? '...' : '') : '无标题',
        content: item.content || '',
        coverImage: item.images && item.images.length > 0 ? item.images[0] : '',
        tagIcon: item.mood ? item.mood.emoji : '📝',
        tagColor: '#FFD700',
        tagText: item.category || '日常',
        isStarred: item.isStarred || false
      };
    });
    
    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error('获取日记列表失败:', error);
    return {
      success: false,
      message: error.message || '获取失败'
    };
  }
};