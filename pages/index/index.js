const HTTP = require('../../utils/http.js')

Page({
  data: {
    testMode: getApp().globalData.testMode,//测试模式

    CustomBar: getApp().globalData.CustomBar,//

    refreshState: false,//下拉刷新状态

    showUserInfo: false,//详细信息显示

    showQrcode: false,//二维码显示

    pushMenu: [false, false, false],

    analysisData: {
      loadEnd: false,
      stamp: [-1, -1, -1, -1, -1],//校园章，讲座章，社会实践，志愿时长，义工时长
      entry: -1,//报名状态
    }

  },

  testScanLanuch: function () {
    wx.setStorageSync('lanuchSceneArray', ['e', '202009051500304136640310062020'])
    this.checkLanuchScene()
  },

  testAllRole: function () {
    this.setData({
      display_recorder: true,
      display_maker: true,
      display_certManager: true,
      not_student: true,
    })
  },

  testClearLogin: function () {
    wx.removeStorageSync('server_token')
    wx.reLaunch({ url: '../accountAuth/prelogin/index' })
  },

  testGuide: function () {
    wx.setStorageSync('isOld', false)
    wx.showModal({ content: '重置成功，请重新进入小程序', showCancel: false })
  },


  onLoad: function () {
    var that = this
    // 个人信息赋值
    that.setData({ userInfo: getApp().globalData.userInfo })
    //检查用户身份
    that.checkIdentify()

    that.initData(() => { })

    that.checkLanuchScene()
  },

  // 检查是否有启动参数
  checkLanuchScene: function () {
    var sceneArray = wx.getStorageSync('lanuchSceneArray')
    if (sceneArray != undefined) {
      switch (sceneArray[0]) {
        case 'e': {
          wx.navigateTo({ url: '../activityQuery/index?activityEntryId=' + sceneArray[1] })
          break
        }
      }
    }
    wx.removeStorageSync('lanuchSceneArray')
  },

  // 下拉刷新
  freshEvent: function () {
    this.initData(() => {
      this.setData({ refreshState: false })
    })
  },

  // 显示二维码
  showQrcode: function () { this.setData({ showQrcode: true }) },

  // 初始化主页数据
  initData: function (callback) {
    var that = this
    // 恢复状态前数据
    that.setData({
      ['analysisData.loadEnd']: false,
      ['analysisData.stamp[3]']: -1,
      ['analysisData.stamp[4]']: -1,
      ['analysisData.entry']: -1
    })

    // 获取活动章...数  //真机测试请'关闭调试'否则会卡顿
    HTTP.GET(
      '/user/analysisData',
      {
        activityType: 'all'
      },
      function (res) {
        callback()
        that.aniPlay(
          function () {
            //因为返回的是字符串，所以需要经过处理
            var tmpStamp = res.data.data[0].stamp
            var tmpEntry = res.data.data[1].activityEntry[1]

            tmpStamp = tmpStamp.substring(1, tmpStamp.length - 1).split(',')
            // 全是浮点数，前三个(0-2)需要取整数
            for (var i = 0; i < tmpStamp.length; i++) {
              if (i < 3) { tmpStamp[i] = parseInt(tmpStamp[i]) }
            }
            that.setData({
              ['analysisData.loadEnd']: true,
              ['analysisData.stamp']: tmpStamp,
              ['analysisData.entry']: tmpEntry
            })
          }
        )
      },
      function () { callback() }
    )

  },

  // 数据更新动画
  aniPlay: function (aniEnd) {
    if (!wx.getStorageSync('isOld')) {
      aniEnd()
      return
    }
    var that = this
    var i = 0
    numDH()
    function numDH() {
      if (i < 10) {
        setTimeout(function () {
          that.setData({
            ['analysisData.stamp[0]']: i,
            ['analysisData.stamp[1]']: i,
            ['analysisData.stamp[2]']: i,
            // ['analysisData.stamp[3]']: i,
            // ['analysisData.stamp[4]']: i,
          })
          i++
          numDH()
        }, 50)
      } else {
        aniEnd()
      }
    }
  },

  // 个人详细信息
  showUserInfo: function () {
    this.setData({ showUserInfo: !this.data.showUserInfo })
  },

  // 跳转章详情
  toDetail: function (s) {
    wx.navigateTo({ url: '/pages/stampDetail/index?type=' + s.currentTarget.dataset.type })
  },

  // 下拉菜单
  changeMenu: function (o) {
    var that = this
    var id = o.currentTarget.dataset.id//控制的菜单ID
    var tmpPushMenu = that.data.pushMenu
    tmpPushMenu[id] = !tmpPushMenu[id]//可能性能损耗,忽略
    this.setData({ pushMenu: tmpPushMenu })
  },

  // 退出登陆
  logOut: function () {
    var that = this
    wx.showModal({
      content: '确认退出吗',
      success: function (res) {
        if (res.confirm) {
          HTTP.DELETE(
            '/user/openId',
            {},
            function () { wx.redirectTo({ url: '/pages/accountAuth/prelogin/index' }) },
            function () { }
          )

        }
      }
    })
  },

  // tap跳转 绑定页面数据到target
  navi: function (k) { wx.navigateTo({ url: k.currentTarget.dataset.target }) },


  checkIdentify: function () {
    var showrole = getApp().globalData.roleInfo
    //三个bool变量，分别表示记录员和活动创建者的权限，用于决定隐藏按钮
    var display_recorder = false
    var display_maker = false
    var not_student = true
    var display_certManager = false

    for (var i = 0; i < showrole.length; i++) {
      switch (showrole[i]) {
        case 'ACTIVITY_STAMPER'://扫码员
          display_recorder = true
          break
        case 'ACTIVITY_MANAGER'://活动创建
        case 'PARTY_ACTIVITY_MANAGER':
        case 'VOLUNTEER_WORK_MANAGER':
        case 'VOLUNTEER_ACTIVITY_MANAGER':
        case 'PRACTICE_ACTIVITY_MANAGER':
          display_maker = true
          break
        case 'CERTIFICATE_CONFIRM'://证书审核员
        case 'CERTIFICATE_MANAGER':
          display_certManager = true
          break
        case 'NOT_STUDENT':
          not_student = false
          break
      }
    }
    //设置视图属性，隐藏相关选项
    this.setData({
      display_recorder: display_recorder,
      display_maker: display_maker,
      display_certManager: display_certManager,
      not_student: not_student,
    })
  },

})
