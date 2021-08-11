const app = getApp()
const HTTP = require('../../utils/http.js')
const util = require('../../utils/newutil.js')
Component({

  options: {
    addGlobalClass: true
  },
  properties: {

    show: {
      type: Boolean,
      value: false,
    },
    activityDetail: {//活动内容
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (this.data.firstTimeLanuch++ == 0) { return }//阻止第一次空数据报错


        this.setData({ qrCodeSrc: '' })

        // console.group('== cu-entryDetail IN component == ')
        // console.log('数据刷新次数：' + this.data.firstTimeLanuch)
        // console.log(newVal)
        // console.groupEnd()

        var oldTimeStamp = new Date(newVal.start.replace('年', '-').replace('月', '-').replace('日', '')).getTime()

        var resDate = util.timeStamp2Time(oldTimeStamp / 1000, 'Y年M月D日 h:m:s|W|N').split('|')
        var howLongDay = util.calcTimeStampLong(new Date().getTime(), oldTimeStamp)

        var dateDetail = ''
        if (howLongDay == 0) {
          dateDetail = "今天" + resDate[2]
        } else if (howLongDay > 0) {
          dateDetail = howLongDay + "天后" + " " + resDate[1] + " " + resDate[2]
        } else {
          dateDetail = "已过期" + (-howLongDay) + "天" + " " + resDate[1] + " " + resDate[2]
        }
        this.setData({ dateDetail: dateDetail })
      }
    },

  },
  data: {
    firstTimeLanuch: 0,
    // StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // Custom: app.globalData.Custom

    dateDetail: '',

    qrCodeSrc: '',

  },
  attached: function () {
    this.setData({ qrCodeSrc: '' })
    // this.setData({
    //   activityDetail: {
    //     activityEntryEnd: "2020年10月25日 14:29:13",
    //     activityEntryId: "202008241430321512499310062020",
    //     activityEntryStart: "2020年05月07日 14:29:13",
    //     activityId: "202008232333562169544810012020",
    //     activityName: "创建活动名称",
    //     activityType: "实践活动",
    //     choose: "选项~",
    //     contact: "18780725156",
    //     description: "测试进行中活动详情描述",
    //     end: null,
    //     linkman: "张山",
    //     location: null,
    //     number: 2,
    //     second: -10368890,
    //     start: "2020年08月23日 23:33:00",
    //     status: "REGISTERED",
    //     title: "义工招募报名",
    //     top: 1,
    //   }
    // })
  },
  methods: {

    closeIt: function () { this.setData({ show: false }) },

    // confirmSign: function () {
    // this.triggerEvent('signEvent', { id: this.data.activityDetail.activityEntryId })
    // console.log(this.activityDetail)
    // },

    makePhoneCall: function (s) {
      wx.showModal({
        content: "确定要打电话给「" + s.currentTarget.dataset.phone + "」吗?",
        success: res => { if (res.confirm) { wx.makePhoneCall({ phoneNumber: s.currentTarget.dataset.phone }) } }
      })
    },

    createQRCode: function () {
      var that = this
      HTTP.getShareImgCode('pages/home/index/index', 'e=' + that.data.activityDetail.activityEntryId, function (g) {
        that.setData({ qrCodeSrc: g.data.data })
        wx.showToast({ title: '点击图片保存' })
      })
    },
    saveToAlbum: function () {
      wx.showToast({ title: '请允许授权以保存', icon: 'none', duration: 1000 })
      util.saveImgSrcToAlbum(this.data.qrCodeSrc, this.data.activityDetail.title)
    },


  }
})