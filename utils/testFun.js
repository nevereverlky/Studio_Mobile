const appid = 'wx551daf14b0dfa9c0'
const appsecret = '77109ce85fbf46043f0eb8d55e23abfa'

// 内部简单封装
function request(url, method, data, success) {
  wx.request({
    url: url,
    method: method,
    data: data,
    success: function (s) { success(s) },
    fail: function () { wx.showToast({ title: '网络错误', icon: "none" }) }
  })
}


// 获取OpenId
function getUserOpenId(callback) {
  wx.login({
    success: function ({ code }) {

      request(
        'https://api.weixin.qq.com/sns/jscode2session',
        'GET',
        {
          appid: appid,
          secret: appsecret,
          js_code: code,
          grant_type: 'authorization_code'
        },
        function (s) {
          if (s.data.errMsg == null) {
            callback(s.data.openid)
          } else {
            callback(s.data.errMsg)
          }
        })

    }
  })

}


// 小程序 appID 和 appSecret 获取 token
function getAccessToken(callback) {

  request(
    'https://api.weixin.qq.com/cgi-bin/token',
    'GET',
    {
      appid: appid,
      secret: appsecret,
      grant_type: 'client_credential'
    },
    function (s) {
      if (s.data.errMsg == null) {
        callback(s.data.access_token)
      } else {
        callback(s.data.errMsg)
      }
    })
}


// 发送订阅消息
// https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html
function sendSubscribeMsg(OPENID, ACCESS_TOKEN, TEMPLATE_ID, page, data, callback) {
  request(
    'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + ACCESS_TOKEN,
    'POST',
    {
      "touser": OPENID,
      "template_id": TEMPLATE_ID,
      "page": page,
      "data": data,
      // "miniprogram_state": "developer",
      // "lang": "zh_CN",
    },
    function (s) {
      callback(s.data)
    }
  )
}

// 生成参数QRcode
// https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html#%E4%BA%91%E8%B0%83%E7%94%A8
function createScanCode(ACCESS_TOKEN, data, callback) {
  // tmpData = {
  //   scene: "a=1",//参数，最多32个,只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~
  //   page: 'pages/index/index',//根目录开始
  //   width: '430',//最小 280px，最大 1280px
  //   auto_color: 'false',//自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false
  //   is_hyaline: 'false',//透明底色？
  // }

  request(
    'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + ACCESS_TOKEN,
    'POST',
    data,
    function (s) {
      if (typeof (s.data) == 'object') {
        wx.showModal({ content: s.data.errmsg, showCancel: false })
      } else {
        // wx.arrayBufferToBase64(arrayBuffer) // 从基础库 2.4.0 开始，本接口停止维护，必须借助后端
        console.log('wx.arrayBufferToBase64() //从基础库 2.4.0 开始，本接口停止维护，必须借助后端')
        wx.showModal({
          content: '生成成功，请在Network中查看\n' +
            'wx.arrayBufferToBase64() \n' +
            '//从基础库 2.4.0 开始，本接口停止维护，必须借助后端',
            showCancel:false
        })
        callback(s.data)
      }
    }
  )
}




module.exports = {
  getAccessToken: getAccessToken,
  getUserOpenId: getUserOpenId,
  sendSubscribeMsg: sendSubscribeMsg,
  createScanCode: createScanCode
}
