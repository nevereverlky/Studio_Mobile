const HTTP = require('../../../utils/http.js')
Page({

  data: {

  },

  onLoad: function (options) {
    this.setData(JSON.parse(options.detail))

    var util = require('../../../utils/newutil.js')
    this.setData({ certificatePublishTime: util.timeStamp2Time(this.data.certificatePublishTime / 1000, 'Y年M月D日') })
    if (this.data.expirationTime) {
      this.setData({ expirationTime: util.timeStamp2Time(this.data.expirationTime / 1000, 'Y年M月D日') })
    }
  },

  // 证书缩略图
  showPicture: function (s) { wx.previewImage({ urls: [s.currentTarget.dataset.url] }) },

  // 修改证书
  toChange: function () {
    var that = this
    switch (that.data.certificateType) {

      case 'QUALIFICATIONS': {//国家职业资格证书
        wx.navigateTo({ url: '../update/qCert/index' })
        break
      }

      case 'SKILL': {//技能证书
        wx.navigateTo({ url: '../update/sCert/index' })
        break
      }

      case 'COMPETITION': {//学科竞赛证书
        wx.navigateTo({ url: '../update/cCert/index' })
        break
      }

      case 'CET_4_6': {//四六级成绩
        wx.navigateTo({ url: '../update/cetCert/index' })
        break
      }

      default: { wx.showToast({ title: '请求有误', icon: 'none' }) }

    }

  },

  // 删除证书
  toDelete: function (k) {
    var that = this

    wx.showModal({
      content: '确定删除证书记录？\n请注意一旦删除不可恢复哦~',
      success(res) {
        if (res.confirm) {
          HTTP.DELETE(
            '/certificate/delete',
            {
              certificateId: that.data.certificateId,
              certificateType: that.data.certificateType,
              teamId: that.data.teamId,
            },
            function () {

              var pageArr = getCurrentPages()
              var pageBefore = pageArr[pageArr.length - 2]


              // 删除本地证书
              var tmpType = that.data.certificateType
              var tmpId = that.data.certificateId


              if (tmpType == 'QUALIFICATIONS') {
                var tmpArray = pageBefore.data.itemList[0].data
                for (let i in tmpArray) {
                  if (tmpArray[i].certificateId == tmpId) {
                    tmpArray.splice(i, 1)
                    pageBefore.setData({ ['itemList[0].data']: tmpArray })
                    break
                  }
                }
              }

              if (tmpType == 'SKILL') {
                var tmpArray = pageBefore.data.itemList[1].data
                for (var i = 0; i < tmpArray.length; i++) {
                  if (tmpArray[i].certificateId == tmpId) {
                    tmpArray.splice(i, 1)
                    pageBefore.setData({ ['itemList[1].data']: tmpArray })
                    break
                  }
                }
              }

              if (tmpType == 'COMPETITION') {
                var tmpArray = pageBefore.data.itemList[2].data
                for (var i = 0; i < tmpArray.length; i++) {
                  if (tmpArray[i].certificateId == tmpId) {
                    tmpArray.splice(i, 1)
                    pageBefore.setData({ ['itemList[2].data']: tmpArray })
                    break
                  }
                }
              }

              if (tmpType == 'CET_4_6') {
                var tmpArray = pageBefore.data.itemList[3].data
                for (var i = 0; i < tmpArray.length; i++) {
                  if (tmpArray[i].certificateId == tmpId) {
                    tmpArray.splice(i, 1)
                    pageBefore.setData({ ['itemList[3].data']: tmpArray })
                    break
                  }
                }
              }

              wx.navigateBack()
              wx.showToast({ title: '删除成功' })

            },
            function () { }
          )
        }
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: "我的证书通过啦「" + this.data.certificateName + "」你也去试试吧",
      path: '/pages/index/index',
      imageUrl: this.data.pictureUrl
    }
  },

})