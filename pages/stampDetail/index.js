var app = getApp()
const HTTP = require('../../utils/http.js')

Page({

  data: {
    pageInfo: {
      title: '加载中...',
      detail: '加载中...',
      more: false,
    },
    isLoading: false,//加载状态
    listData: [],
  },

  onLoad: function (options) {
    var that = this
    var tmpPageInfo = {}

    switch (options.type) {
      case 'schoolActivity': {
        tmpPageInfo.title = "校园活动章"
        tmpPageInfo.detail = "校园"
        break
      }
      case 'lectureActivity': {
        tmpPageInfo.title = "讲座活动章"
        tmpPageInfo.detail = "讲座"
        break
      }
      case 'practiceActivity': {
        tmpPageInfo.title = "社会实践次数"
        tmpPageInfo.detail = "社会实践"
        break
      }
      case 'partyActivity': {
        tmpPageInfo.title = "\"新学习\"系列活动"
        tmpPageInfo.detail = "\"新学习\"系列"
        break
      }
      case 'partyTimeActivity': {
        tmpPageInfo.title = "交换一小时"
        tmpPageInfo.detail = "交换一小时"
        tmpPageInfo.more = true
        break
      }
      case 'volunteerActivity': {
        tmpPageInfo.title = "志愿时长"
        tmpPageInfo.detail = "志愿"
        tmpPageInfo.more = true
        break
      }
      case 'volunteerWork': {
        tmpPageInfo.title = "义工时长"
        tmpPageInfo.detail = "义工"
        tmpPageInfo.more = true
        break
      }
      default: {
        wx.showToast({ title: '请求异常，请重试', icon: "none" })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    }

    if (options.type == '' || options.type == null) {
    } else {
      that.setData({ pageInfo: tmpPageInfo })
      that.showSeals(options.type);
    }
  },

  showSeals: function (_type) {
    var that = this

    that.setData({ isLoading: true })

    HTTP.GET(
      '/user/activityStamp?activityType=' + _type,
      {},
      function (res) {
        wx.hideLoading()

        var timestr, newTimeStr;
        for (var i = 0; i < res.data.data.activityStamps.length; i++) {
          //将数据库时间字符串转为视图时间字符串
          timestr = res.data.data.activityStamps[i].createTime;
          newTimeStr = app.getDateStrByTimeStr(timestr);
          res.data.data.activityStamps[i].createTime = newTimeStr;

          //转换学期
          var tmpTerm = res.data.data.activityStamps[i].term
          res.data.data.activityStamps[i].term = tmpTerm.substring(0, 4) + '-' + (Number(tmpTerm.substring(0, 4)) + 1) + (tmpTerm.substring(4, 5) == 'A' ? '第一学期' : '第二学期')
        }

        //更新视图
        that.setData({
          listData: res.data.data.activityStamps,
          totalTime: res.data.data.totalTime,
        })

        that.setData({ isLoading: false })

      },
      function () { that.setData({ isLoading: false }) }
    )
  }

})