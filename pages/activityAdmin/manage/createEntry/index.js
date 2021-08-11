const app = getApp()
const HTTP = require('../../../../utils/http.js')

Page({
  data: {
    activityId: '',
    activityStartTime: '',
    dateDetail: '',

    title: '',
    number: '',
    linkman: '',
    contact: '',
    choose: '',

    // start: '',
    // end: '',

    note: '',
    top: 1,

    startDay: '',//开始日期
    startTime: '',//开始时间
    endDay: '',//结束日期
    endTime: '',//结束时间
  },

  // 更新Input
  updateInput: function (k) {
    var that = this

    switch (k.currentTarget.dataset.name) {
      case 'title': {
        that.setData({ title: k.detail.value })
        break
      }
      case 'number': {
        that.setData({ number: k.detail.value })
        break
      }
      case 'linkman': {
        that.setData({ linkman: k.detail.value })
        break
      }
      case 'contact': {
        that.setData({ contact: k.detail.value })
        break
      }
      case 'choose': {
        var tmp = k.detail.value
        tmp = tmp.replace(/，/g, ',')
        tmp = tmp.replace(/。/g, ',')
        tmp = tmp.replace(/./g, ',')
        that.setData({ choose: tmp })
        break
      }
      case 'note': {
        that.setData({ note: k.detail.value })
        break
      }

    }
  },


  onLoad: function (options) {
    var that = this

    if (options.activityId == undefined) {
      wx.showToast({ title: '非法请求，请重试', icon: "none", mask: true })
      setTimeout(() => { wx.navigateBack() }, 1000)
    } else {

      // 计算活动的时间开始结束(非报名)
      var util = require('../../../../utils/newutil.js')
      var startDate = options.activityStartTime
      var endDate = options.activityEndTime

      // 转换为timestamp
      var startTimeStamp = new Date(startDate.replace('年', '-').replace('月', '-').replace('日', '')).getTime()
      var endTimeStamp = new Date(endDate.replace('年', '-').replace('月', '-').replace('日', '')).getTime()

      // 获取中文时间 分割"|"
      var startTimeStr = util.timeStamp2Time(startTimeStamp / 1000, 'Y-M-D h:m:s|W|N').split('|')
      var endTimeStr = util.timeStamp2Time(endTimeStamp / 1000, 'Y-M-D h:m:s|W|N').split('|')

      // timestamp计算相差天数
      var startLong = util.calcTimeStampLong(new Date().getTime(), startTimeStamp)
      var endLong = util.calcTimeStampLong(new Date().getTime(), endTimeStamp)

      // 翻译
      if (startLong == 0) {
        startLong = "今天" + startLong[2]
      } else if (startLong > 0) {
        startLong = startLong + "天后" + " " + startTimeStr[1] + " " + startTimeStr[2]
      } else {
        startLong = (-startLong) + "天前" + " " + startTimeStr[1] + " " + startTimeStr[2]
      }
      if (endLong == 0) {
        endLong = "今天" + endTimeStr[2]
      } else if (endLong > 0) {
        endLong = endLong + "天后" + " " + endTimeStr[1] + " " + endTimeStr[2]
      } else {
        endLong = (-endLong) + "天前" + " " + endTimeStr[1] + " " + endTimeStr[2]
      }


      that.setData({
        activityId: options.activityId,
        activityStartTime: startTimeStr[0] + '\n' + startLong,
        activityEndTime: endTimeStr[0] + '\n' + endLong,
      })
    }

    // 初始化活动时间及日期
    var now = new Date()
    var util = require('../../../../utils/newutil.js')
    that.setData({
      'startTime': util.getHM(now),
      'endTime': util.getHM(now),
      'startDay': util.getYMD(now),
      'endDay': util.getYMD(now),
    })

  },

  // 设置开始时间
  setStartTime: function (e) {
    var that = this
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString()
    that.setData({ 'startTime': e.detail.value })
  },
  // 设置结束时间
  setEndTime: function (e) {
    var that = this
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString()
    that.setData({ 'endTime': e.detail.value })
  },
  // 设置开始日期
  startDateChange: function (e) {
    this.setData({ startDay: e.detail.value })
  },
  // 设置结束日期
  endDateChange: function (e) {
    this.setData({ endDay: e.detail.value })
  },


  // 预提交检测
  preSubmit: function () {
    var that = this
    if (that.data.title == '' || that.data.number == '' || that.data.linkman == '' || that.data.contact.length != 11 || that.data.note == '') {
      wx.showToast({ title: '必填信息未填写完整', icon: "none" })
      return
    }
    wx.showModal({ content: '确认提交？', success: function (res) { if (!res.cancel) { that.submit() } } })
  },


  // 提交
  submit: function () {
    var that = this
    var task = this.data
    var startdayArray = []
    var enddayArray = []
    var starttimeArray = []
    var endtimeArray = []

    startdayArray = task.startDay.split("-")
    enddayArray = task.endDay.split("-")
    starttimeArray = task.startTime.split(":")
    endtimeArray = task.endTime.split(":")

    var startdate = new Date(startdayArray[0], startdayArray[1] - 1, startdayArray[2], starttimeArray[0], starttimeArray[1]);
    var enddate = new Date(enddayArray[0], enddayArray[1] - 1, enddayArray[2], endtimeArray[0], endtimeArray[1]);

    if (startdate.getTime() == enddate.getTime()) { wx.showToast({ title: '开始和结束时间不能相同', icon: "none" }) }
    else if (startdate.getTime() > enddate.getTime()) { wx.showToast({ title: '结束时间不能早于开始时间', icon: "none" }) }
    else {

      HTTP.POST(
        '/activityEntry',
        {
          activityId: task.activityId,

          title: task.title,
          number: task.number,
          linkman: task.linkman,
          contact: task.contact,
          choose: task.choose,

          start: task.startDay + ' ' + task.startTime + ':00',
          end: task.endDay + ' ' + task.endTime + ':00',

          note: task.note,
          top: 1

        },
        function (res) {
          wx.showToast({ title: '创建成功', mask: true })
          setTimeout(() => { wx.navigateBack() }, 1500)
          // wx.redirectTo({ url: '../../activityQuery/index?type=' + task.activityType })
        },
        function () { }
      )

    }
  },


})