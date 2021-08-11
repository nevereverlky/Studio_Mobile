const util = require("../../utils/newutil.js")
const HTTP = require("../../utils/http.js")

Page({
  data: {
    listData: [],

    isLoading: true,
    refreshState: false,
  },

  onLoad: function () {
    this.showTasks()
  },

  freshEvent: function () {
    this.showTasks(() => { this.setData({ refreshState: false, isLoading: false }) })
  },

  showTasks: function (callback) {
    var that = this

    that.setData({ listData: [], isLoading: true })

    HTTP.GET(
      '/activityStamp/mission',
      {},
      function (res) {
        var temp = res.data.data
        for (var i = 0; i < temp.length; i++) {
          switch (temp[i].type) {
            case 'schoolActivity': temp[i].typeCN = '校园活动'; break;
            case 'practiceActivity': temp[i].typeCN = '社会实践'; break;
            case 'volunteerActivity': temp[i].typeCN = '志愿活动'; break;
            case 'volunteerWork': temp[i].typeCN = '义工活动'; break;
            case 'lectureActivity': temp[i].typeCN = '讲座活动'; break;
            case 'partyActivity': temp[i].typeCN = '党建活动'; break;
            case 'partyTimeActivity': temp[i].typeCN = '交换一小时'; break;
          }

          //转换学期
          var tmpTerm = temp[i].term
          temp[i].term = tmpTerm.substring(0, 4) + '-' + (Number(tmpTerm.substring(0, 4)) + 1) + (tmpTerm.substring(4, 5) == 'A' ? '第一学期' : '第二学期')

          //转换时间
          temp[i].start = util.timeStamp2Time((temp[i].start) / 1000, 'Y年M月D日 h:m')
          temp[i].end = util.timeStamp2Time((temp[i].end) / 1000, 'Y年M月D日 h:m')
        }
        that.setData({ listData: temp })
        if (typeof (callback) == 'function') { callback() }
      },
      function (res) { if (typeof (callback) == 'function') { callback() } }
    )


  },


  goScan: function (e) {
    var dataset = e.currentTarget.dataset
    var acName = dataset.name
    var acId = dataset.id
    var acType = dataset.type

    wx.navigateTo({ url: 'scan/index?acName=' + acName + '&acId=' + acId + '&acType=' + acType })
  }

})