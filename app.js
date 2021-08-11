const HTTP = require('utils/http.js')
const http = require('./utils/http')
// webApi在 utils/http.js 里面定义

App({
  globalData: {
    testMode: true,//是否测试模式
    

    roleInfo: null,
    timeTure: true,
    // localSetTime: null,
    // power: null,
    // code: null,

    userInfo: {
      // classId: "190907104",
      // enrollDate: 1567236347000,
      // extInfo: {},
      // grade: "2020",
      // major: "测试专业",
      // realName: "薛之谦",
      // sex: "男",
      // stuId: "123456789",
      // userId: "201908311525464037560001201924",
      // userInfoId: "201908311525463486938300073124",
    },


    // apiUrl: 'https://hupanyouth.cn',

    // apiUrl: 'http://121.36.28.205:7100/',

    // apiUrl: 'http://121.40.155.31:8080',//测试服务器(李宇龙)

    // apiUrl: 'https://g.upblog.cn',//测试服务器(Isaac反代)

  },

  onLaunch: function () {
    var app = this

    // 获取自定义导航条高度
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })


    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({ title: '更新提示', content: '版本更新，是否重启？', success: function (res) { if (res.confirm) { updateManager.applyUpdate() } } })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({ title: '更新提示', content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~' })
          })
        }
      })
    }

  },

  onPageNotFound: function () {
    wx.showToast({ title: '页面不存在，跳转首页中...' })
    setTimeout(() => {
      wx.redirectTo({ url: '/pages/accountAuth/prelogin/index' })
    }, 1000)

  },

  getDateStrByTimeStr: function (time) {
    var dateTime = new Date(time);
    var dateStr = '';
    dateStr += dateTime.getFullYear() + '年';
    dateStr += (dateTime.getMonth() + 1) + '月';
    dateStr += dateTime.getDate() + '日';
    dateStr += dateTime.getHours() + '时';
    dateStr += dateTime.getMinutes() + '分';
    return dateStr;
  },


})