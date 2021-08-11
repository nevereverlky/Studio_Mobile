const testFun = require('../../utils/testFun.js')
const HTTP = require('../../utils/http.js')
const utils = require('../../utils/newutil.js')

Page({


  data: {
    openid: null,
    AccessToken: null,

    refreshState: false,

    seachShow: false,

    imgSrc: '',//二维码

    naviId: '',
    i: 6,
  },

  tmpTestFun: function (num) {
    var that = this

    // var str = 't66' + (that.data.i++)
    // console.log(str)
    // that.setData({ naviId: str })
  },

  freshEvent: function (s) {
    var that = this
    console.log(s.detail)
    setTimeout(() => {
      that.setData({ refreshState: false })
    }, 1000)
  },

  // 复制内容
  copyIt: function ({ currentTarget }) { currentTarget.dataset.value != null ? wx.setClipboardData({ data: currentTarget.dataset.value }) : wx.showToast({ title: '请先获取', icon: "none" }) },


  getOpenId: function () {
    var that = this
    testFun.getUserOpenId(function (res) { that.setData({ openid: res }) })
  },
  getAccessToken: function () {
    var that = this
    testFun.getAccessToken(function (res) { that.setData({ AccessToken: res }) })
  },

  sendSubscribeMsg1: function () {
    var that = this

    if (!that.data.openid) { that.getOpenId() }
    if (!that.data.AccessToken) { that.getAccessToken() }

    // 审核结果模板   i6pErfUiZ1p4iycqGuHTBfbgMd3LtT9_oObbXS_-faI
    // 审核结果  {{phrase1.DATA]}
    // 审核内容  {{thing2.DATA]l
    // 审核时间  {{date3.DATA}}
    // 申请人  {{thing11.DATA}}
    // 备注  {{thing7.DATA]}

    wx.requestSubscribeMessage({
      tmplIds: ['i6pErfUiZ1p4iycqGuHTBfbgMd3LtT9_oObbXS_-faI'],
      success: function () {
        testFun.sendSubscribeMsg(
          that.data.openid,
          that.data.AccessToken,
          'i6pErfUiZ1p4iycqGuHTBfbgMd3LtT9_oObbXS_-faI',
          'index',
          {
            "phrase1": {
              "value": "已通过"
            },
            "thing2": {
              "value": "国家级XXX证书"
            },
            "date3": {
              "value": "2020年08月31日"
            },
            "thing11": {
              "value": "王大锤"
            },
            "thing7": {
              "value": "暂无"
            }
          },
          function (k) {
            if (k.errmsg == 'ok') {
              wx.showToast({ title: '发送成功' })
            } else {
              wx.showModal({ content: k.errmsg, showCancel: false })
            }
          })
      }
    })



  },

  sendSubscribeMsg2: function () {
    var that = this

    if (!that.data.openid) { that.getOpenId() }
    if (!that.data.AccessToken) { that.getAccessToken() }

    // 活动开始模板   nwxzBKgDlu7j_zBN1Mq0TTDqux_7-QjFHUhcqZYe_ZA
    // 温罄提示  {{thing1.DATA]}
    // 活动名称  {{thing2.DATA]l
    // 开始时间  {{date3.DATA}}
    // 活动地点  {{thing6.DATA}}
    // 活动时间  {{thing5.DATA]}

    wx.requestSubscribeMessage({
      tmplIds: ['nwxzBKgDlu7j_zBN1Mq0TTDqux_7-QjFHUhcqZYe_ZA'],
      success: function () {
        testFun.sendSubscribeMsg(
          that.data.openid,
          that.data.AccessToken,
          'nwxzBKgDlu7j_zBN1Mq0TTDqux_7-QjFHUhcqZYe_ZA',
          'index',
          {
            "thing1": {
              "value": "您报名的活动即将开始，请做好准备"
            },
            "thing2": {
              "value": "XX报告厅学习交流分享会"
            },
            "date3": {
              "value": "2020年08月31日"
            },
            "thing6": {
              "value": "学校图书馆"
            },
            "thing5": {
              "value": "测试活动时间~"
            }
          },
          function (k) {
            if (k.errmsg == 'ok') {
              wx.showToast({ title: '发送成功' })
            } else {
              wx.showModal({ content: k.errmsg, showCancel: false })
            }
          })
      }
    })

  },

  // 生成参数二维码
  createQRcode: function () {
    var that = this
    HTTP.getShareImgCode('pages/home/index/index', 'test', function (g) { that.setData({ imgSrc: g.data.data }) })
  },

  // saveToAlbum
  saveToAlbum: function () {
    utils.saveImgSrcToAlbum(
      this.data.imgSrc,
      function (s) {
        // console.log(s)
      })
  },



  selectEvent: function (s) {
    console.log(s.detail)
    this.setData({ seachShow: false })
  },


})