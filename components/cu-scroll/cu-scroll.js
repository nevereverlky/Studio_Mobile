const app = getApp()
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    // multipleSlots: true,
  },
  /**
   * 组件的对外属性
   */
  properties: {
    cusBGC: {
      type: String,
      value: ''
    },
    refreshState: {
      type: Boolean,
      value: false,
    },
    styleType: {
      type: String,
      value: 'page',
    },
    customNavi: {//有没有导航条
      type: Boolean,
      value: false,
    },
    enableFresh: {//是否可以下拉刷新
      type: Boolean,
      value: true,
    },
    isLoading: {//是否可以触底加载
      type: Boolean,
      value: null,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    // StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // Custom: app.globalData.Custom,

    scrollStyle: 'width:100%;height:100%;',
  },


  attached: function () {
    if (this.data.styleType == 'page') {
      if (this.data.customNavi) {
        // 去导航条
        this.setData({ scrollStyle: 'width:100vw;height:calc(100vh - ' + this.data.CustomBar + 'px)' })
      } else {
        // 不去导航条
        this.setData({ scrollStyle: 'width:100vw;height:100vh;' })
      }
    } else if (this.data.styleType == 'part') {
      // 100%
      this.setData({ scrollStyle: 'width:100%;height:100%;' })
    } else {
      // 自定义
      this.setData({ scrollStyle: this.data.styleType })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refreshEvent(s) {
      var that = this
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      that.triggerEvent('refreshEvent', s, myEventOption)
    },
    
    toEnd:function(s){
      var that = this
      that.triggerEvent('reachEnd', s)
    }
  }
})