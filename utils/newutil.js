function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function getYM(data) {

  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  return [year, month].map(formatNumber).join('-');
}

function getYMD(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function getHM(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}




function getW(date) {
  var d = date.getDay();
  var arr = ['日', '一', '二', '三', '四', '五', '六']

  return '星期' + arr[d];
}

/**
 * 转化为字符串，不足2位前面补0
 */
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为Y年M月D日h时m分s秒 星期W 上/下午N By Isaac
 * number: 传入时间戳(s)
 * format：返回格式，支持自定义，但参数必须与YMDhmsWN保持一致 
*/
function timeStamp2Time(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's', 'W', 'N']
  var returnArr = []

  var date = new Date(number * 1000)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))


  var arr = ['日', '一', '二', '三', '四', '五', '六']
  returnArr.push('星期' + arr[date.getDay()])

  returnArr.push(date.getHours() <= 12 ? '上午' : '下午')

  for (var i in returnArr) { format = format.replace(formateArr[i], returnArr[i]) }
  return format
}

function calcTimeStampLong(start, end) {
  return parseInt(((end - start) / (1000 * 60 * 60 * 24)))
}

/**
 * 保存base64图片到相册
 * @param {string} imgSrc 
 */
function saveImgSrcToAlbum(imgSrc, name, callback) {
  var savePath = ''
  if (name != undefined) {
    savePath = wx.env.USER_DATA_PATH + '/' + name + '.png'
  } else {
    savePath = wx.env.USER_DATA_PATH + '/qrcode.png'
  }

  if (imgSrc == '' || !imgSrc) {
    wx.showToast({ title: '图片编码不存在', icon: "none", mask: true, duration: 1000 })
    return
  }
  var wxFile = wx.getFileSystemManager()
  wxFile.writeFile({
    filePath: savePath,
    data: imgSrc.slice(22),
    encoding: 'base64',
    success: function (s) {
      if (s.errMsg != 'writeFile:ok') {
        wx.showToast({ title: '文件写出失败', icon: "none", mask: true })
      } else {

        wx.saveImageToPhotosAlbum({
          filePath: savePath,
          success: function (j) {
            if (typeof (callback) == 'function') {
              callback(j)
            }
            if (j.errMsg != 'saveImageToPhotosAlbum:ok') {
              wx.showToast({ title: '保存到相册失败', icon: "none", mask: true })
            } else {

              wx.showToast({ title: '保存成功', mask: true })
            }
          },
          fail: function (s) {
            if (s.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
              wx.showToast({ title: '取消保存', icon: "none", mask: true })
            } else {
              wx.showToast({ title: '用户拒绝授权', icon: "none", mask: true })
            }
            if (typeof (callback) == 'function') {
              callback(s)
            }
          }
        })

      }
    },
    fail: function (k) {
      wx.showToast({ title: '写出文件失败', icon: "none", mask: true })
      if (typeof (callback) == 'function') {
        callback(k)
      }
    }
  })
}

function parseUserCode(timecheck, success, cancel) {
  wx.scanCode({
    onlyFromCamera: true,
    success: function (res) {

      if (res.scanType != "QR_CODE") {
        wx.showToast({ title: '该码不是二维码', icon: "none" })
        return
      }

      var base64 = require('../func/base64.js')

      //解密base64加密的字符串
      var Participant_Mes_Encrypted = res.result
      var Participant_Mes_Str = base64.baseDecode(Participant_Mes_Encrypted)

      //如果json字符串第一个是怪异字符，则去掉
      let firstCode = Participant_Mes_Str.charCodeAt(0)
      if (firstCode < 0x20 || firstCode > 0x7f) {
        Participant_Mes_Str = Participant_Mes_Str.substring(1)
      }

      //转成json对象
      try {
        var Participant_Mes = JSON.parse(Participant_Mes_Str)
      } catch (e) {
        wx.showToast({ title: '该二维码有误', icon: "none" })
        if (typeof (cancel) == 'function') { cancel() }
      }

      // console.group('解析用户二维码结果')
      // console.log(Participant_Mes)
      // console.groupEnd()

      // 确定当前时间
      var currentTime = new Date().getTime()
      // if (app.globalData.timeTure == false) {
      //   currentTime = app.globalData.localSetTime
      // }

      // 时间检测  20秒内都行(2w ms)
      if (timecheck) {
        if (currentTime >= Participant_Mes.timestamp && (currentTime - Participant_Mes.timestamp) >= 20000) {
          wx.showToast({ title: '二维码已过期', icon: "none" })
          return
        }
      }

      // 简单校验
      if (Participant_Mes.legal != "No2Class") {
        wx.showToast({ title: '非法二维码', icon: "none" })
        if (typeof (cancel) == 'function') { cancel() }
        return
      }

      if (typeof (success) != 'function') {
        console.log('错误：必须回调为非函数')
        if (typeof (cancel) == 'function') { cancel() }
      } else {
        success(Participant_Mes)
      }

    },
    fail: function (s) {
      if (s.errMsg == 'scanCode:fail') {
        wx.showToast({ title: '扫码失败', icon: "none" })
      }
      if (s.errMsg == 'scanCode:fail cancel') {
        wx.showToast({ title: '取消扫码', icon: "none" })
      }
      if (typeof (cancel) == 'function') { cancel() }
    }
  })

}


module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  getYMD: getYMD,
  getYM: getYM,
  getHM: getHM,
  getW: getW,
  timeStamp2Time: timeStamp2Time,
  calcTimeStampLong: calcTimeStampLong,
  saveImgSrcToAlbum: saveImgSrcToAlbum,
  parseUserCode: parseUserCode
}
