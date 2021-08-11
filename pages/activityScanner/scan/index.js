var util = require('../../../func/base64.js')
var HTTP = require('../../../utils/http.js')

Page({
  data: {
    testMode: getApp().globalData.testMode,//测试模式

    deleteConfirm: {//确认删除
      state: false,
      index: 0,
    },

    keepScan: false,//连续扫码


    activityName: '',

    scannerList: [
      // {
      //   avatarUrl: 'https://image.weilanwl.com/img/square-1.jpg',
      //   realName: '哆啦A梦',
      //   stuId: '123',
      // },
    ],

    workTime: 0,//工作时长
    workContent: '',//工作内容

    workGrade: {//工作等级
      current: -1,
      data: ['优秀', '通过', '不合格'],
      more: ['E', 'P', 'F']
    },

  },

  onLoad: function (options) {
    var that = this

    if (that.data.testMode) {
      that.setData({
        scannerList: [{
          avatarUrl: 'https://image.weilanwl.com/img/square-1.jpg',
          realName: '哆啦A梦',
          stuId: '123',
        },
        {
          avatarUrl: 'https://image.weilanwl.com/img/square-2.jpg',
          realName: '静香',
          stuId: '1234',
        },
        {
          avatarUrl: 'https://image.weilanwl.com/img/square-3.jpg',
          realName: '大雄',
          stuId: '12345',
        }]
      })
    }

    if (options.acId == undefined) {
      wx.showToast({ title: '非法请求，请重试', icon: "none", mask: true })
      setTimeout(() => { wx.navigateBack() }, 1000)
    } else {
      that.setData({ activityName: options.acName, activityId: options.acId, activityType: options.acType })
    }

    // this.setData({
    //   activityName: "测试活动233",
    //   activityId: "202008140103340368798810012020",
    //   activityType: "practiceActivity"
    // })

  },
  // 选择实践等级
  showSheet: function () {
    var that = this
    wx.showActionSheet({
      itemList: that.data.workGrade.data,
      success: function (m) { that.setData({ ['workGrade.current']: m.tapIndex }) }
    })
  },

  // 更新工作内容
  updateContent: function (s) { this.setData({ workContent: s.detail.value }) },

  //更新工作时长
  updateTime: function (s) {
    // console.log(s.detail.value)
    if (this.data.workTime == 0) { return }
    if (s.currentTarget.dataset.type == '+') {
      this.setData({ workTime: this.data.workTime + 1 })
    } else if (s.currentTarget.dataset.type == '-') {
      this.setData({ workTime: this.data.workTime - 1 })
    } else {
      this.setData({ workTime: s.detail.value })
    }
  },


  scanCode: function () {
    var that = this

    var tmpList = that.data.scannerList

    if (tmpList.length == 5) {
      that.checkSubmit()
      return
    }

    var util = require('../../../utils/newutil.js')
    util.parseUserCode(
      false,
      function (s) {
        // s.stuId   s.stuName

        //去重
        var ifadd = true
        for (let mm in tmpList) {
          if (tmpList[mm].stuId == s.stuId || tmpList[mm].stuName == s.stuName) {
            ifadd = false
            break
          }
        }
        if (ifadd) {
          tmpList.push({ avatarUrl: '../../../images/default-avatar.png', realName: s.stuName, stuId: s.stuId })
          that.setData({ scannerList: tmpList })
        } else {
          wx.showToast({ title: '已添加过该用户', icon: "none" })
        }

        if (that.data.keepScan == true) { that.scanCode() }

      },
      function () { that.setData({ keepScan: false }) }
    )
  },

  // 连续扫码
  keepScan: function () { this.setData({ keepScan: !this.data.keepScan }) },

  // 删除已扫
  deleteScanner: function (s) {
    var that = this
    var currentTapIndex = s.currentTarget.dataset.index
    if (that.data.deleteConfirm.state == true && currentTapIndex == that.data.deleteConfirm.index) {
      var tmpList = that.data.scannerList
      tmpList.splice(currentTapIndex, 1)
      that.setData({ scannerList: tmpList, deleteConfirm: { state: false, index: -1 } })
    } else {
      wx.showToast({
        title: '再按一次删除',
        icon: 'none',
        duration: 500,
        success: function () { that.setData({ deleteConfirm: { state: true, index: currentTapIndex } }) }
      })
    }
  },

  // 提交校验
  checkSubmit: function () {
    var that = this
    var tmpData = that.data

    if (tmpData.scannerList.length == 0) {
      wx.showToast({ title: '请先扫码录入人员', icon: 'none' })
      return
    }

    if (tmpData.activityType == 'volunteerActivity') {
      if (tmpData.workTime == 0) {
        wx.showToast({ title: '工作时长不能为0', icon: 'none' })
        return
      } else { that.submitRoster() }
    }

    if (tmpData.activityType == 'practiceActivity') {
      if (tmpData.workGrade.current == -1) {
        wx.showToast({ title: '请选择实践等级', icon: 'none' })
        return
      } else { that.submitRoster() }
    }

    if (tmpData.activityType == 'volunteerWork') {
      if (tmpData.workTime == 0) {
        wx.showToast({ title: '工作时长不能为0', icon: 'none' })
        return
      } else if (tmpData.workContent == '') {
        wx.showToast({ title: '输入工作内容', icon: 'none' })
        return
      } else { that.submitRoster() }
    }

    if (tmpData.activityType == 'partyTimeActivity') {
      if (tmpData.workTime == 0) {
        wx.showToast({ title: '工作时长不能为0', icon: 'none' })
        return
      } else { that.submitRoster() }
    }

    if (tmpData.activityType == 'lectureActivity') {
      that.submitRoster()
    }

  },

  // 提交名单
  submitRoster: function () {
    var that = this

    // 学号数组to字符串(,)
    var stuIdArr = ''
    for (let k in that.data.scannerList) {
      stuIdArr += that.data.scannerList[k].stuId
      if (k != that.data.scannerList.length - 1) { stuIdArr += ',' }
    }

    wx.showLoading({ title: '提交中' })

    HTTP.POST(
      '/activityStamp',
      {
        activityId: that.data.activityId,//活动编号
        participants: stuIdArr,//学号

        time: that.data.workTime,//时长
        grades: that.data.workGrade.more[that.data.workGrade.current],//等级
        volunteerWorkName: that.data.workContent,//工作内容
      },
      function (res) {
        wx.showToast({ title: '提交成功' })

        console.log(res.data.errorCode)
        console.log(res.data)

        that.setData({ scannerList: [] })
        if (that.data.keepScan == true) { that.scanCode() }

      },
      function () {
        wx.showToast({ title: '提交失败，测试连续扫码', icon: 'none' })
        that.setData({ scannerList: [] })
        if (that.data.keepScan == true) { that.scanCode() }
      },
    )

  },


})