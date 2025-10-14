// 简单 mock：生成一组带尺寸的图片条目（用于本地开发）
// 后面替换成：wx.cloud.callFunction(...) 或 fetch('/api/entries?page=...')
const TOTAL = 100

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeItem(id) {
  const w = 400
  const h = randInt(300, 900)
  // 使用 picsum 占位图，实际项目请替换为真实图片 fileID 或 URL
  const fileUrl = `https://picsum.photos/id/${(id % 100) + 1}/${w}/${h}`
  return {
    id,
    fileUrl,
    text: ['今天打羽毛球', '学会了游泳', '要去爬山', '咖啡店的午后', '傍晚的散步'][id % 5] + ` — 记录 ${id}`,
    width: w,
    height: h,
    date: Date.now() - id * 24 * 3600 * 1000,
  }
}

/**
 * fetchDiaries(page, pageSize) => Promise<{ data: [], hasMore }>
 */
export async function fetchDiaries(page = 1, pageSize = 10) {
  // 模拟网络延迟
  await new Promise(r => setTimeout(r, 500))

  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, TOTAL)
  const data = []
  for (let i = start; i < end; i++) {
    data.push(makeItem(i + 1))
  }
  return {
    data,
    hasMore: end < TOTAL
  }
}
