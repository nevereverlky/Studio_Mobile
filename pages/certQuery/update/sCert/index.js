const HTTP = require('../../../../utils/http.js')

Page({
  data: {
    stepList: {
      current: 0,
      names: ['基本信息', '证书上传', '证书信息', '补充信息']
    },

    submitData: {
      certificateType: 'SKILL',
      certificatePublishDate: '2020-08',              //发证时间(Y-M)
      expirationDate: '2020-08',                      //有效时间(Y-M)

      //***-------------- STEP1 --------------****//
      certificateName: '',                            //证书名称
      rank: '',                                       //证书等级
      certificatePublishTime: '',                     //发证时间戳(ms)

      //***-------------- STEP2 --------------****//
      pictureUrl: '',                                 //证书图片

      //***-------------- STEP3 --------------****//
      certificateNumber: '',                          //证书编号
      expirationTime: '',                             //有效时间戳(ms)

      extInfo: {
        //***-------------- STEP4 --------------****//
        description: '',                              //全部信息
      }
    },
  },

  onLoad: function () {
    var that = this

    var nowPage = getCurrentPages()
    var backPage = nowPage[nowPage.length - 2]

    // var oldData = JSON.parse(options.detail)
    var oldData = backPage.data
    var submitData = that.data.submitData


    that.setData({
      submitData: {
        certificateId: oldData.certificateId,

        certificateType: oldData.certificateType,              //证书类型(主)
        certificatePublishDate: '2020-08',              //发证时间(Y-M)
        expirationDate: '2020-08',                      //有效时间(Y-M)

        //***-------------- STEP1 --------------****//
        certificateName: oldData.certificateName,                            //证书名称
        certificatePublishTime: oldData.certificatePublishTime,                     //发证时间戳(ms)        
        rank: oldData.rank,                                       //证书等级

        //***-------------- STEP2 --------------****//
        pictureUrl: oldData.pictureUrl,                                 //证书图片

        //***-------------- STEP3 --------------****//
        certificateNumber: oldData.certificateNumber,                          //证书编号
        expirationTime: '',                             //有效时间戳(ms)

        extInfo: oldData.extInfo,
      }
    })


    // 同步发证时间
    var dateArr = oldData.certificatePublishTime.replace('年', '-').replace('月', '-').replace('日', '-').split('-')
    var tmpTimestamp = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]).getTime()

    var dateArr2 = oldData.expirationTime.replace('年', '-').replace('月', '-').replace('日', '-').split('-')
    var tmpTimestamp2 = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]).getTime()
    var util = require('../../../../utils/newutil.js')
    that.setData({
      ["submitData.certificatePublishTime"]: tmpTimestamp,
      ["submitData.certificatePublishDate"]: util.timeStamp2Time(tmpTimestamp / 1000, 'Y-M'),

      ["submitData.expirationTime"]: tmpTimestamp2,
      ["submitData.expirationDate"]: util.timeStamp2Time(tmpTimestamp2 / 1000, 'Y-M')
    })

  },
  // 手动滑动
  changeByHand: function (s) { this.setData({ ["stepList.current"]: s.detail.current }) },

  // 步骤切换
  changeStep: function (kk) {
    var that = this
    var resPage = that.data.stepList.current

    if (kk.currentTarget.dataset.type == "back") {
      resPage--
    } else {
      if (resPage == that.data.stepList.names.length - 1) {
        that.checkItems()
        return
      } else { resPage++ }
    }
    that.setData({ ['stepList.current']: resPage })
  },

  /**
   * ****---------------------------- STEP1 ----------------------------****
   */
  // 更新证书名称
  updateCertName: function (s) { this.setData({ ['submitData.certificateName']: s.detail.value }) },
  // 更新证书等级
  updateCertRank: function (s) { this.setData({ ['submitData.rank']: s.detail.value }) },
  // 选择发证时间
  updateDate: function (s) {
    var that = this
    var certDate = that.data.submitData.certificatePublishDate.split("-")
    var certTime = new Date(certDate[0], certDate[1] - 1).getTime()
    that.setData({ ['submitData.certificatePublishDate']: s.detail.value, ['submitData.certificatePublishTime']: certTime })
  },
  /**
   * ****---------------------------- STEP2 ----------------------------****
   */
  // 选择图片
  chooseImage() {
    var that = this
    HTTP.UPLOADIMG(function (s) { that.setData({ ['submitData.pictureUrl']: s.data.path }) })
  },
  // 删除图片
  delImg: function () {
    var that = this
    wx.showModal({ content: '确定要删除吗？', success: res => { if (res.confirm) { that.setData({ ['submitData.pictureUrl']: null }) } } })
  },

  /**
   * ****---------------------------- STEP3 ----------------------------****
   */
  // 更新证书编号
  updateCertNum: function (s) { this.setData({ ['submitData.certificateNumber']: s.detail.value }) },
  // 选择有效时间
  updateEndDate: function (s) {
    var that = this
    var certDate = that.data.submitData.expirationDate.split("-")
    var certTime = new Date(certDate[0], certDate[1] - 1).getTime()
    that.setData({ ['submitData.expirationDate']: s.detail.value, ['submitData.expirationTime']: certTime })
  },

  /**
   * ****---------------------------- STEP4 ----------------------------****
   */
  // 更新证书详情
  updateTextarea: function (s) { this.setData({ ['submitData.extInfo.description']: s.detail.value }) },


  // 检查是否填写完整
  checkItems: function () {
    var that = this
    var submitData = that.data.submitData

    // 检测字符是否有问题
    if (
      submitData.certificateName == "" ||
      submitData.rank == "" ||
      submitData.certificatePublishTime == ""
    ) {
      wx.showToast({ title: '1.请检查第一步必填项\n2.请检查是否出现特殊字符', icon: "none" })
      that.setData({ ['stepList.current']: 0 })
      return
    } 
     if (
      submitData.pictureUrl == "" ||
      submitData.pictureUrl == null
    ) {
      wx.showToast({ title: '1.请检查第二页证书图片\n2.请检查是否出现特殊字符', icon: "none" })
      that.setData({ ['stepList.current']: 1 })
      return
    } 
     if (
      submitData.certificateNumber == "" ||
      submitData.expirationTime == ""
    ) {
      wx.showToast({ title: '1.请检查第三步必填项\n2.请检查是否出现特殊字符', icon: "none" })
      that.setData({ ['stepList.current']: 2 })
      return
    } 
     if (
      // submitData.extInfo.description == ""
      0
    ) {
      wx.showToast({ title: '1.请检查第四步必填项\n2.请检查是否出现特殊字符', icon: "none" })
      that.setData({ ['stepList.current']: 3 })
      return
    } 
    
      that.confirmSubmit()
  },

  // 提交数据(检测通过)
  confirmSubmit: function () {
    var that = this

    wx.showLoading({ title: '请稍后', mask: true })

    HTTP.PUT_json(
      '/certificate/modify',
      that.data.submitData,
      function (res) {
        wx.showToast({ title: '修改成功', mask: true })

        const nowPage = getCurrentPages()
        const backPage = nowPage[nowPage.length - 3]
        backPage.data.refreshState = true

        HTTP.subscribeMsg('i6pErfUiZ1p4iycqGuHTBfbgMd3LtT9_oObbXS_-faI', function (s) { setTimeout(function () { wx.navigateBack({ delta: 2 }) }, 1000) })
      },
      function () { }
    )

  },

})