const HTTP = require('../../../../utils/http.js')

Page({

  data: {
    activityId: '',

    refreshState: false,//刷新状态
    isLoading: false,

    scannerList: [],

    newStuId: '',

  },

  onLoad: function (options) {
    var that = this

    if (options.activityId == undefined) {
      wx.showToast({ title: '非法请求，请重试', icon: "none", mask: true })
      setTimeout(() => { wx.navigateBack() }, 1000)
    } else {
      that.setData({ activityId: options.activityId })
      that.init()
    }
  },


  init: function (callback) {
    var that = this
    that.setData({ isLoading: true })
    HTTP.GET(
      '/activityStamp/stamper',
      { activityId: that.data.activityId },
      function (res) {
        that.setData({ scannerList: res.data.data })
        that.setData({ isLoading: false })
        if (typeof (callback) == 'function') { callback() }
      },
      function () { that.setData({ isLoading: false }) }
    )
  },

  // 下拉刷新事件
  freshEvent: function () { this.init(() => { this.setData({ refreshState: false }) }) },

  // 更新学号
  updateStuId: function (h) { this.setData({ newStuId: h.detail.value }) },
  // 清空学号
  clearStuId: function () { this.setData({ newStuId: '' }) },

  // 添加记录员
  addScanner: function (k) {
    var that = this
    if (k.currentTarget.dataset.type == 'scan') {
      var util = require('../../../../utils/newutil.js')
      util.parseUserCode(
        false,
        function ({ stuId }) {
          wx.showModal({
            content: '确认要添加学号「' + stuId + '」吗?',
            success: function (g) {
              if (g.confirm) {
                that.setData({ newStuId: stuId })
                add()
              }
            }
          })
        }
      )
    } else {
      add()
    }

    function add() {
      wx.showLoading({ title: '添加中...', mask: true })
      HTTP.POST(
        '/activityStamp/stamper',
        {
          activityId: that.data.activityId,
          stamperStuId: that.data.newStuId
        },
        function (res) {
          wx.showToast({ title: '添加成功', mask: true })
          that.init()
          that.clearStuId()
        },
        function () { }
      )
    }

  },

  // 添加记录员
  deleteScanner: function (k) {
    var that = this

    wx.showModal({
      content: '请确定您要删除的学号：\n' + k.currentTarget.dataset.id,
      success: function (j) {
        if (j.confirm) {

          wx.showLoading({ title: '删除中...', mask: true })
          HTTP.DELETE(
            '/activityStamp/stamper',
            {
              activityId: that.data.activityId,
              stamperStuId: k.currentTarget.dataset.id
            },
            function (res) {
              wx.showToast({ title: '删除成功', mask: true })
              that.init()
            },
            function () { }
          )

        } else { wx.showToast({ title: '取消删除', icon: "none" }) }
      }
    })


  },

})