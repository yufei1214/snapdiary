export default defineAppConfig({
  pages: [
  'pages/home/index',
  'pages/add/index',
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
      pagePath: 'pages/add/index',
      text: '添加',
      iconPath: 'assets/icons/menu_add.png',
      selectedIconPath: 'assets/icons/menu_add_active.png'
    },
    {
      pagePath: 'pages/mine/index',
      text: '我的',
      iconPath: 'assets/icons/menu_mine.png',
      selectedIconPath: 'assets/icons/menu_mine_active.png'
    }]

  }
});