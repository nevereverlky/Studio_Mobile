const app = getApp()
const HTTP = require('../../../utils/http.js')

Page({

  data: {
    testMode: getApp().globalData.testMode,//测试模式

    username: '',
    password: '',

    isLoad: false,

    playAni: false,
  },

  onLoad: function () {
    if (this.data.testMode) { this.setData({ username: 'beta6', password: 'a111111' }) }
  },

  onReady: function () {
    setTimeout(() => {
      this.setData({ playAni: true })
    }, 600)
  },

  // 仅用于接收表单数据
  login: function (res) {
    var that = this
    that.setData(res.detail.value)
  },

  // 获取VX用户信息
  getUserInfo: function (res) {
    var that = this
    if (res.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showModal({ content: "请允许授权以绑定账号", showCancel: false })
    } else {
      wx.setStorageSync('wxUserInfo', res.detail.userInfo)

      wx.login({
        success: function ({ code }) {
          that.reallogin(code)
        }
      })
    }

  },


  reallogin: function (code) {
    var that = this
    that.setData({ isLoad: true })

    wx.setStorageSync('jobInfo', []);
    wx.removeStorageSync('job');


    HTTP.POST(
      '/user/openId',
      {
        username: that.data.username,
        password: that.data.password,
        code: code,
        avatarUrl: wx.getStorageSync('wxUserInfo').avatarUrl, //上传头像地址
      },
      function (res) {
        that.setData({ isLoad: false })

        wx.setStorageSync('server_token', res.data.data.token)
        wx.setStorageSync('jobInfo', res.data.data.jobInfo)

        app.globalData.userInfo = res.data.data.userInfo
        app.globalData.userInfo.avatarUrl = wx.getStorageSync('wxUserInfo').avatarUrl//获取本地头像地址

        app.globalData.roleInfo = res.data.data.roleInfo;

        wx.redirectTo({ url: '/pages/index/index' })

      },
      function () {
        that.setData({ isLoad: false })
      }
    )

  }

})