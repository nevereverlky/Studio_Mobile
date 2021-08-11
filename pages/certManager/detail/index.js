const HTTP = require('../../../utils/http.js')
const util = require('../../../utils/newutil.js')
Page({

  data: {
    certificateId: '',
    rejectReasonInput: '',
  },

  onLoad: function (options) {
    var that = this

    that.setData({ certificateId: options.certificateId })

    that.init()

  },

  init: function () {
    var that = this

    wx.showLoading({ title: '加载中...' })

    HTTP.GET(
      '/certificate/details',
      {
        certificateId: that.data.certificateId,
        // certificateType: ''
      },
      function (res) {
        wx.hideLoading()
        var tmpData = res.data.data

        tmpData.certificatePublishTime = util.timeStamp2Time(tmpData.certificatePublishTime / 1000, 'Y年M月D日')
        if (tmpData.expirationTime) {
          tmpData.expirationTime = util.timeStamp2Time(tmpData.expirationTime / 1000, 'Y年M月D日')
        }
        that.setData(tmpData)
      },
      function () { }
    )

  },

  // 证书缩略图
  showPicture: function (s) { wx.previewImage({ urls: [s.currentTarget.dataset.url] }) },

  // 更新驳回理由
  updateRejectReason: function (s) { this.setData({ rejectReasonInput: s.detail.value }) },

  /**
 * 证书审核
 */
  toPass: function () {
    var that = this
wx.showLoading({  title: '请稍后...'})

    wx.showModal({
      content: '确定通过该证书?',
      success(res) {
        if (res.confirm) {
          HTTP.PUT(
            '/certificateStamp/confirm',
            {
              certificateId: that.data.certificateId,
              certificateType: that.data.certificateType,//根据证书大类传值
            },
            function () {
              that.sendSubscribeMsg(true)
              wx.showToast({ title: "通过成功" })
              setTimeout(() => { wx.navigateBack() }, 1000)
            },
            function () { }
          )

        }
      }
    });
  },
  toReject: function () {
    var that = this

    if (that.data.rejectReasonInput == '') {
      wx.showToast({ title: '请填写驳回理由', icon: 'none' })
      return
    }

    wx.showLoading({  title: '请稍后...'})

    wx.showModal({
      content: '确定驳回该证书?',
      success(res) {
        if (res.confirm) {

          HTTP.PUT(
            '/certificateStamp/reject',
            {
              certificateId: that.data.certificateId,
              certificateType: that.data.certificateType,//根据证书大类传值
              rejectReason: that.data.rejectReasonInput,//驳回理由
              teamId: that.data.teamId,//certificateType=='COMPETITION'的时候才需要
            },
            function (res) {
              that.sendSubscribeMsg(false)
              wx.showToast({ title: "驳回成功" })
              setTimeout(() => { wx.navigateBack() }, 1000)
            },
            function () { }
          )
        }
      }
    })
  },

  // toDelete: function () {

  //   var that = this
  //   wx.showModal({
  //     content: '确定删除该证书?',
  //     success(res) {
  //       if (res.confirm) {

  //       }
  //     }
  //   })

  // },

  /**
 * 发送订阅消息 - 通过/驳回
 */
  sendSubscribeMsg: function (state) {
    var that = this
    var tmpData = that.data

    var data = {}

    data.auditId = that.data.userId//接收者userId

    data.result = state ? '通过' : '驳回'//审核结果
    data.detail = tmpData.certificateName ? tmpData.certificateName : tmpData.competitionName
    data.auditTime = util.timeStamp2Time(new Date().getTime() / 1000, 'Y-M-D h:m:s')//审核时间  2020-08-29 01:56:15
    data.applicant = tmpData.extInfo.realName//getApp().globalData.userInfo.realName,//申请人
    if (state) {
      data.note = '发证时间:' + tmpData.certificatePublishTime//备注
    } else {
      data.note = '驳回原因:' + that.data.rejectReasonInput
    }
    // data.page=''//跳转页面(选填)

    wx.login({
      success: function ({ code }) {
        HTTP.POST(
          '/activity/audit',
          data,
          function (g) {
            wx.showToast({ title: '提醒发送成功' })
          },
          function () { }
        )

        
      }
    })

  },

})