import { Component } from 'react'
import Taro from '@tarojs/taro'
import './app.less'

class App extends Component {
  componentDidMount() {
    // 初始化云开发
    if (Taro.cloud) {
      Taro.cloud.init({
        env: 'cloud1-8g31cqxg14799cd4', // 替换成你的环境ID
        traceUser: true
      })
      console.log('云开发初始化成功')
    } else {
      console.error('当前环境不支持云开发')
    }
  }

  componentDidShow() {}
  componentDidHide() {}

  render() {
    return this.props.children
  }
}

export default App