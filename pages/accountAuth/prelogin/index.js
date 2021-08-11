const app = getApp()
const HTTP = require('../../../utils/http.js')

Page({

  data: {
    playAni: false,
  },

  onLoad: function (op) {
    const scene = decodeURIComponent(op.scene)
    wx.setStorageSync('lanuchSceneArray', scene.split('='))
    // scene=e%3D202008241548364157136110062020
  },

  onReady: function () {

    // 首页卡顿问题(800ms加载动画)
    // 删除延时真机会PPT~)不信试试？
    // By Isaac
    setTimeout(() => {
      this.setData({ playAni: true })
    }, 800)

    setTimeout(() => {
      this.prelogin()
    }, 1000)
  },

  checkTime: function () {
    console.log(app.globalData.localSetTime)
    app.globalData.localSetTime += 1000
    setTimeout(this.checkTime, 1000);
  },

  prelogin: function () {
    var that = this

    HTTP.GET(
      '/user',
      {},
      function (res) {
        var severDate = new Date(res.header.Date)
        var severTime = severDate.getTime()

        var localDate = new Date()
        var localTime = localDate.getTime()

        if (Math.abs(localDate - severTime) >= 15000) {
          app.globalData.timeTure = false
          // console.log(app.globalData.timeTure)
          app.globalData.localSetTime = severTime
          that.checkTime()
        } else {
          app.globalData.timeTure = true //时间在误差内
        }

        // console.log(res.data.data.avatarUrl)

        app.globalData.userInfo = res.data.data.userInfo
        app.globalData.roleInfo = res.data.data.roleInfo
        app.globalData.userInfo.avatarUrl = res.data.data.avatarUrl
        wx.redirectTo({ url: '../../index/index' })

      },
      function () { }
    )

  },


})