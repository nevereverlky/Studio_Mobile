const app = getApp()
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    appName: {
      type: String,
      value: '第二课堂..'
    },
    appIcon: {
      type: String,
      value: '/images/LOGOnew.png'
    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    currentPage: 0,
    isOld: wx.getStorageSync('isOld'),
    // StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // Custom: app.globalData.Custom
  },
  attached: function(){  },
  methods: {
    closeThis() {
      this.setData({ isOld: true })
      wx.setStorageSync('isOld', true)
    },
    toNext() {
      this.setData({ currentPage: this.data.currentPage + 1 })
    }
    // BackPage() {
    //   wx.navigateBack({
    //     delta: 1
    //   });
    // },
    // toHome() {
    //   wx.reLaunch({
    //     url: '/pages/index/index',
    //   })
    // }
  }
})