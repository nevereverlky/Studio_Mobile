const HTTP = require('../../../utils/http.js')

Page({

  data: {},

  onLoad: function () { },

  // 获得表单数据并校验
  submit: function ({ detail }) {
    var that = this
    var submitData = detail.value

    if (
      submitData.pwd1 == null || submitData.pwd2 == null || submitData.pwd3 == null ||
      submitData.pwd1 == '' || submitData.pwd2 == '' || submitData.pwd3 == ''
    ) {
      wx.showToast({ title: '请检测是否填写完整', icon: 'none' })
      return
    }
    if (submitData.pwd2 != submitData.pwd3) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    } else {
      wx.login({ success: res => { that.requestChangePwd(res.code, submitData.pwd1, submitData.pwd2) } })
    }
  },

  requestChangePwd: function (code, oldPwd, newPwd) {

    wx.showLoading({ title: '请稍后...' })

    HTTP.PUT(
      '/user/pwd',
      {
        password: oldPwd,
        newPassword: newPwd
      },
      function (res) {
        wx.removeStorageSync('server_token')
        wx.reLaunch({ url: '../prelogin/index' })
      }
    )

  }
})