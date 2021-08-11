const app = getApp()
const HTTP = require('../../../utils/http.js')

Page({
  data: {
    pickerType: { current: 0, data: [], code: [] },// 活动类型
    pickerTerm: { current: 0, data: [], code: [] },// 活动学期

    seachShow: false,// 选择器显示状态

    // date: '2000-01-15',

    activityName: '',//活动名称
    organizationMessage: '',//举办单位
    location: '',//活动地点

    activityType: '',//活动类型
    activityTerm: '',//活动学期

    activitystartDay: '',//开始日期
    activityStartTime: '',//开始时间
    activityendDay: '',//结束日期
    activityEndTime: '',//结束时间

    description: '',//备注

  },

  // 打开选择器
  openSelector: function () { this.setData({ seachShow: true }) },

  // 选择器反馈事件
  selectEvent: function (s) { this.setData({ seachShow: false, organizationMessage: s.detail }) },


  // 活动类型
  updatePickerType: function (e) {
    var tmpString = "pickerType.current"
    this.setData({ [tmpString]: e.detail.value, activityType: this.data.pickerType.code[e.detail.value] })
  },
  // 活动学期
  updatePickerTerm: function (e) {
    var tmpString = "pickerTerm.current"
    console.log(e)
    this.setData({ [tmpString]: e.detail.value, activityTerm: this.data.pickerTerm.code[e.detail.value] })
  },

  // 更新Input
  updateInput: function (k) {
    var that = this
    switch (k.currentTarget.dataset.name) {
      case 'activityName': {
        that.setData({ activityName: k.detail.value })
        break
      }
      case 'organizationMessage': {
        that.setData({ organizationMessage: k.detail.value })
        break
      }
      case 'description': {
        that.setData({ description: k.detail.value })
        break
      }
      case 'location': {
        that.setData({ location: k.detail.value })
        break
      }

    }
  },


  onLoad: function (options) {
    var that = this
    var roleInfo = app.globalData.roleInfo
    // roleInfo = ["CERTIFICATE_CONFIRM", "CERTIFICATE_MANAGER", "ACTIVITY_MANAGER", "NOT_STUDENT", "ASSET_MANAGER"]//测试用！！！！！！

    // 初始化 活动学期
    var now = new Date()
    var nowYear = now.getFullYear()
    var nowMonth = now.getMonth() + 1
    var tmpPickerTerm = { current: (nowMonth >= 2 && nowMonth <= 7) ? 2 : 3, data: [], code: [] }
    for (var i = -2; i < 2; i++) {
      tmpPickerTerm.data.push((nowYear + i) + '-' + (Number(nowYear) + i + 1) + ' ' + '第一学期')
      tmpPickerTerm.code.push((nowYear + i) + 'A')
      tmpPickerTerm.data.push((nowYear + i) + '-' + (Number(nowYear) + i + 1) + ' ' + '第二学期')
      tmpPickerTerm.code.push((nowYear + i) + 'B')
    }
    that.setData({ pickerTerm: tmpPickerTerm })



    // 初始化 活动类型
    var tmpPickerType = {
      current: 0,
      data: [],
      code: []
    }
    var status = 0//是否已经全部赋值(性能优化)
    for (var i = 0; i < roleInfo.length; i++) {
      if (roleInfo[i] == 'ACTIVITY_MANAGER') {
        tmpPickerType.data = ['校园活动', '志愿活动', '实践活动', '讲座活动']
        tmpPickerType.code = ['schoolActivity', 'volunteerActivity', 'practiceActivity', 'lectureActivity']
        status = 1
        that.setData({ pickerType: tmpPickerType })
      }
      if (!status && roleInfo[i] == 'VOLUNTEER_ACTIVITY_MANAGER') {
        tmpPickerType.data.push('志愿活动')
        tmpPickerType.code.push('volunteerActivity')
        that.setData({ pickerType: tmpPickerType })
      }
      if (!status && roleInfo[i] == 'PRACTICE_ACTIVITY_MANAGER') {
        tmpPickerType.data.push('实践活动')
        tmpPickerType.code.push('practiceActivity')
        that.setData({ pickerType: tmpPickerType })
      }
    }


    // 初始化 活动类型/活动学期
    that.setData({ activityType: tmpPickerType.code[tmpPickerType.current] })
    that.setData({ activityTerm: tmpPickerTerm.code[tmpPickerTerm.current] })


    // 初始化活动时间及日期
    var now = new Date()
    var util = require('../../../utils/newutil.js')
    that.setData({
      'activityStartTime': util.getHM(now),
      'activityEndTime': util.getHM(now),
      'activitystartDay': util.getYMD(now),
      'activityendDay': util.getYMD(now),
    })

  },

  // 设置活动开始时间
  setStartTime: function (e) {
    var that = this
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString()
    that.setData({ 'activityStartTime': e.detail.value })
  },
  // 设置活动结束时间
  setEndTime: function (e) {
    var that = this
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString()
    that.setData({ 'activityEndTime': e.detail.value })
  },
  // 设置开始日期
  startDateChange: function (e) {
    this.setData({ activitystartDay: e.detail.value })
  },
  // 设置结束日期
  endDateChange: function (e) {
    this.setData({ activityendDay: e.detail.value })
  },


  // 预提交检测
  preSubmit: function () {
    var that = this;
    if (that.data.activityName == '' || that.data.activityType == '' || that.data.term == '' || that.data.organizationMessage == '') {
      wx.showToast({ title: '必填信息未填写完整', icon: "none" })
      return;
    }
    wx.showModal({ content: '确认提交？', success: function (res) { if (!res.cancel) { that.submit() } } })
  },


  // 提交
  submit: function () {
    var task = this.data
    var startdayArray = []
    var enddayArray = []
    var starttimeArray = []
    var endtimeArray = []

    startdayArray = task.activitystartDay.split("-")
    enddayArray = task.activityendDay.split("-")
    starttimeArray = task.activityStartTime.split(":")
    endtimeArray = task.activityEndTime.split(":")

    var startdate = new Date(startdayArray[0], startdayArray[1] - 1, startdayArray[2], starttimeArray[0], starttimeArray[1]);
    var enddate = new Date(enddayArray[0], enddayArray[1] - 1, enddayArray[2], endtimeArray[0], endtimeArray[1]);

    if (startdate.getTime() == enddate.getTime()) { wx.showToast({ title: '开始和结束时间不能相同', icon: "none" }) }
    else if (startdate.getTime() > enddate.getTime()) { wx.showToast({ title: '活动结束时间不能早于开始时间', icon: "none" }) }
    else if (task.location.length == 0) { wx.showToast({ title: '请填写活动地点', icon: "none", duration: 1000, mask: true }); return; }
    else {

      HTTP.POST(
        '/activity',
        {
          activityName: task.activityName,//活动名称
          organizationMessage: task.organizationMessage,//举办单位
          location: task.location,//活动地点

          activityType: task.activityType,//活动类型
          term: task.activityTerm,//活动学期(2019A/2020B)

          activityStartTime: startdate.getTime(),//时间戳(ms)
          activityEndTime: enddate.getTime(),//时间戳(ms)

          description: task.description,//详细信息
        },
        function (res) {
          wx.redirectTo({ url: '../manage/index' })
        },
        function () { }
      )

    }
  },


})