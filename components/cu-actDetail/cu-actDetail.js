const app = getApp()
const HTTP = require('../../utils/http.js')

Component({

  options: {
    addGlobalClass: true
  },
  properties: {

    show: {
      type: Boolean,
      value: false,
    },

    scannerPage: {
      type: String,
      value: '',
    },
    entryPage: {
      type: String,
      value: '',
    },

    activityDetail: {//活动详情输入处理器
      type: Object,
      value: {},
      observer: function (newVal) {
        if (this.data.firstTimeLanuch++ == 0) { return }//阻止第一次空数据报错

        console.group('== cu-actDetail IN component == ')
        console.log('数据刷新次数：' + this.data.firstTimeLanuch)
        console.log(newVal)
        console.groupEnd()

        this.setData({ tmpActDetail: newVal })

        // var oldTimeStamp = new Date(newVal.end.replace('年', '-').replace('月', '-').replace('日', '')).getTime()

        // var resDate = util.timeStamp2Time(oldTimeStamp / 1000, 'Y年M月D日 h:m:s|W|N').split('|')
        // var howLongDay = util.calcTimeStampLong(new Date().getTime(), oldTimeStamp)

        // var dateDetail = ''
        // if (howLongDay == 0) {
        //   dateDetail = "今天" + resDate[2]
        // } else if (howLongDay > 0) {
        //   dateDetail = howLongDay + "天后结束" + " " + resDate[1] + " " + resDate[2]
        // } else {
        //   dateDetail = "已过期" + (-howLongDay) + "天" + " " + resDate[1] + " " + resDate[2]
        // }
        // this.setData({ dateDetail: dateDetail })

        // 翻译活动类型

      }
    },

  },
  data: {
    firstTimeLanuch: 0,

    // StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // Custom: app.globalData.Custom

    tmpActDetail: {},

    dateDetail: '',

  },
  attached: function () {

  },
  methods: {
    toEntry: function () { wx.navigateTo({ url: this.data.entryPage + '?activityId=' + this.data.tmpActDetail.activityId + '&activityStartTime=' + this.data.tmpActDetail.start+ '&activityEndTime=' + this.data.tmpActDetail.end }) },
    toScanner: function () { wx.navigateTo({ url: this.data.scannerPage + '?activityId=' + this.data.tmpActDetail.activityId }) },

    closeIt: function () { this.setData({ show: false }) },

    // 更改活动状态
    changeActState: function (k) {
      var that = this

      if (k.currentTarget.dataset.type == 'cancel') {
        wx.showModal({
          content: '确定取消活动？',
          success(g) {
            if (g.confirm) {
              confirmRequest()
            }
          }
        })
      } else {
        confirmRequest()
      }

      // 请求简单封装
      function confirmRequest() {
        wx.showLoading({ title: '请稍后...', mask: true })
        HTTP.PUT(
          '/activity',
          {
            activityId: that.data.tmpActDetail.activityId,
            operation: k.currentTarget.dataset.type
          },
          function () {
            wx.showToast({ title: '状态更改成功', mask: true })
            that.closeIt()
            that.triggerEvent('freshList')
          },
          function () { that.closeIt() }
        )
      }

    }

    // confirmSign: function () {
    // this.triggerEvent('signEvent', { id: this.data.activityDetail.activityEntryId })
    // console.log(this.activityDetail)
    // },

  }
})