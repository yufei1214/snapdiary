export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/data/index',
    'pages/mine/index',
    'pages/diary-edit/index',
  ],

  window: {
    navigationBarTitleText: '随影日记',
    navigationBarBackgroundColor: '#ffffff',
    backgroundTextStyle: 'light'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#333',
    list: [
    {
      pagePath: 'pages/home/index',
      text: '相册',
      iconPath: 'assets/icons/menu_album.png',
      selectedIconPath: 'assets/icons/menu_album_active.png'
    },
    {
      pagePath: 'pages/data/index',
      text: '数据',
      iconPath: 'assets/icons/data.png',
      selectedIconPath: 'assets/icons/data_actived.png'
    },
    {
      pagePath: 'pages/mine/index',
      text: '我的',
      iconPath: 'assets/icons/menu_mine.png',
      selectedIconPath: 'assets/icons/menu_mine_active.png'
    }]

  }
});