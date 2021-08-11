const app = getApp()
const QR = require('../../func/qrcode.js') //生成二维码用的js文件
const util = require('../../func/base64.js')

Component({

  options: {
    addGlobalClass: true
  },

  properties: {

    show: {
      type: Boolean,
      value: false,
      observer: function () {
        if (this.data.show == true) {
          console.log("计时器清除(show) -- " + this.data.theTimer)
          clearInterval(this.data.theTimer)

          this.createPersonalQrcode()
          this.data.theTimer = setInterval(() => { this.createPersonalQrcode() }, 1000 * 10)

          //调整屏幕亮度
          wx.getScreenBrightness({
            success: function ({ value }) {
              wx.setStorageSync('screenBrightness', value)
              wx.setScreenBrightness({ value: 1 })
            }
          })
        } else {
          console.log("计时器清除(unshow) -- " + this.data.theTimer)
          clearInterval(this.data.theTimer)

          //调整屏幕亮度
          wx.setScreenBrightness({ value: wx.getStorageSync('screenBrightness') })
        }
      }
    }
  },
  data: {
    theTimer: 0,
    qrcode: '',
  },


  attached: function () { },

  methods: {

    // 隐藏界面
    unShowQrcode: function () { this.setData({ show: false }) },

    // 二维码生成
    createPersonalQrcode: function () {
      var time = (new Date()).getTime()
      if (app.globalData.timeTure == false) { time = app.globalData.localSetTime }

      var mes = {
        "legal": 'No2Class',
        "stuId": app.globalData.userInfo.stuId,
        "stuName": app.globalData.userInfo.realName,
        "timestamp": time
      }
      var str = JSON.stringify(mes)
      var base64str = util.baseEncode(str)
      var img = QR.createQrCodeImg(base64str, { size: 500 }) //生成二维码

      console.log("生成二维码" + Math.random())
      this.setData({ qrcode: img });
    }
  }
})