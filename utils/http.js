// const apiUrl = 'https://hupanyouth.cn'
// const apiUrl = 'http://121.36.28.205:7100/'
// const apiUrl = 'http://121.40.155.31:8080'//测试服务器(李宇龙)

// apiUrl: 'https://hupanyouth.cn',
// const webAPI = app.globalData.apiUrl

const webAPI = 'https://g.upblog.cn'
// const webAPI = 'http://121.40.155.31:8080'



/**
 * 内部封装请求 By Isaac
 * @param {string} _method 可选OPTIONS|GET|HEAD|POST|PUT|DELETE|TRACE|CONNECT
 * @param {string} _url 请求API后缀
 * @param {json} _data 请求数据
 * @param {function} _success 成功回调(带数据)
 * @param {function} _fail 失败回调(带数据)
 */
function request(_method, _url, _data, _success, _fail, _headjson) {
  // wx.showLoading({ title: '请稍后...', mask: true })
  var ContentType = 'application/x-www-form-urlencoded'

  if (_headjson) { ContentType = 'application/json' }

  wx.request({
    url: webAPI + _url,
    method: _method,
    header: {
      'Content-Type': ContentType,
      'Authorization': wx.getStorageSync('server_token')
    },
    data: _data,
    success: function (res) {
      wx.hideLoading()
      switch (res.data.errorCode) {
        case "401": {
          //token不正确时，清除本地token并跳转至登录界面
          wx.removeStorageSync('server_token')
          wx.redirectTo({ url: '/pages/accountAuth/bind/index' })
          break
        }
        case "200": {
          if (typeof (_success) == 'function') { _success(res) }
          break
        }
        case "500":
        case "400": {
          wx.showModal({
            title: res.data.errorCode + '错误',
            content: res.data.errorMsg,
            showCancel: false
          })
          if (typeof (_fail) == 'function') { _fail(res) }
          break
        }
        default: {
          wx.showModal({ title: res.data.errorCode + '错误', content: res.data.errorMsg, showCancel: false })
          if (typeof (_fail) == 'function') { _fail(res) }
        }
      }
    },
    fail: function (res) {
      wx.hideLoading()
      wx.showModal({ title: 'fail错误', content: '请求失败,网络错误', showCancel: false })
      if (typeof (_fail) == 'function') { _fail(res) }
    }
  })
}

/**
 * 通用GET请求 By Isaac
 * @param {string} _url 请求API后缀
 * @param {json} _data 请求数据
 * @param {function} _success 成功回调(带数据)
 * @param {function} _fail 失败回调(带数据)
 */
function GET(_url, _data, _success, _fail) {
  request('GET', _url, _data, _success, _fail)
}

/**
 * 通用POST请求 By Isaac
 * @param {string} _url 请求API后缀
 * @param {json} _data 请求数据
 * @param {function} _success 成功回调(带数据)
 * @param {function} _fail 失败回调(带数据)
 */
function POST(_url, _data, _success, _fail) {
  request('POST', _url, _data, _success, _fail)
}

/**
 * 通用POST For JSON请求 By Isaac
 * @param {string} _url 请求API后缀
 * @param {json} _data 请求数据
 * @param {function} _success 成功回调(带数据)
 * @param {function} _fail 失败回调(带数据)
 */
function POST_json(_url, _data, _success, _fail) {
  request('POST', _url, _data, _success, _fail, true)
}

/**
 * 通用PUT For JSON请求 By Isaac
 * @param {string} _url 请求API后缀
 * @param {json} _data 请求数据
 * @param {function} _success 成功回调(带数据)
 * @param {function} _fail 失败回调(带数据)
 */
function PUT_json(_url, _data, _success, _fail) {
  request('PUT', _url, _data, _success, _fail, true)
}

/**
 * 通用DELETE请求 By Isaac
 * @param {string} _url 请求API后缀
 * @param {json} _data 请求数据
 * @param {function} _success 成功回调(带数据)
 * @param {function} _fail 失败回调(带数据)
 */
function DELETE(_url, _data, _success, _fail) {
  request('DELETE', _url, _data, _success, _fail)
}

/**
 * 通用PUT请求 By Isaac
 * @param {string} _url 请求API后缀
 * @param {json} _data 请求数据
 * @param {function} _success 成功回调(带数据)
 * @param {function} _fail 失败回调(带数据)
 */
function PUT(_url, _data, _success, _fail) {
  request('PUT', _url, _data, _success, _fail)
}


/**
 * 上传图片返回path
 */
function UPLOADIMG(callback) {

  wx.chooseImage({
    count: 1, //默认9
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      var filePath = res.tempFilePaths[0]
      var time = Date.parse(new Date())
      var stuId = getApp().globalData.userInfo.stuId
      console.log(stuId)

      if (stuId == undefined) {
        wx.showToast({ title: '账号信息获取失败', icon: "none", mask: true })
        return
      }
      var fileName = stuId + "-" + time + ".png"//命名规则

      wx.showLoading({ title: '正在上传', mask: true })
      wx.uploadFile({
        url: webAPI + '/common/aliyun',
        filePath: filePath,
        name: 'file',
        formData: { 'fileName': fileName },
        success: function (res) {
          wx.showToast({ title: '上传成功', mask: true })
          var tmpData = JSON.parse(res.data)
          console.log(tmpData)

          if (typeof (callback) == 'function') { callback(tmpData) }
        },
        fail: function (k) {
          wx.showToast({ title: '上传失败', mask: true })
        }
      })

    }
  })
}

function subscribeMsg(tmplIds, callback) {
  var _state = false
  wx.requestSubscribeMessage({
    tmplIds: [tmplIds],
    success: function (a) {
      if (a[tmplIds] == 'accept') { _state = true }
      if (_state) {
        wx.showToast({ title: '订阅成功', mask: true })
        if (typeof (callback) == 'function') { callback() }
      } else {
        wx.showToast({ title: '取消订阅', icon: "none", mask: true })
        if (typeof (callback) == 'function') { callback() }
      }
    },
  })
}

/**
 * 生成可扫描小程序码
 * @param {string} page 
 * @param {string} scene 
 */
function getShareImgCode(page, scene, _success, _fail) {
  wx.showLoading({ title: '请稍后', mask: true })
  if (scene.length > 32) {
    wx.hideLoading()
    wx.showModal({
      title: '内部错误',
      content: '[生成QRcode]scene参数长度超过限制\n当前长度：' + scene.length + '\n请截图报告开发者',
      showCancel: false
    })
    return
  }

  if (page == undefined || page == "" || page == null) {
    wx.hideLoading()
    wx.showModal({
      title: '内部错误',
      content: '[生成QRcode]page为空' + '\n请截图报告开发者',
      showCancel: false
    })
    return
  }

  POST(
    '/common/getShareImgCode',
    { page: page, scene: scene },
    function (g) {
      wx.hideLoading()
      if (typeof (_success) == 'function') { _success(g) }
    },
    function (g) {
      wx.hideLoading()
      if (typeof (_fail) == 'function') { _fail(g) }
    }
  )
}


module.exports = {
  GET: GET,

  POST: POST,
  POST_json: POST_json,

  DELETE: DELETE,

  PUT: PUT,
  PUT_json:PUT_json,

  UPLOADIMG: UPLOADIMG,
  
  subscribeMsg: subscribeMsg,
  getShareImgCode: getShareImgCode
}