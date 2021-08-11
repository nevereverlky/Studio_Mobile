const utils = require('../../utils/newutil.js')
const HTTP = require('../../utils/http.js')
Page({

  data: {
    itemList: [
      {
        name: "国家职业资格证书",
        type: "QUALIFICATIONS",
        data: [
          // {
          //   imageUrl: "/images/ceshi.png",
          //   name: "营业执照营业执照",
          //   state: "已审核",
          // }, {}
        ],
      },
      {
        name: "技能证书",
        type: "SKILL",
        data: [],
      },
      {
        name: "学科竞赛证书",
        type: "COMPETITION",
        data: [],
      },
      {
        name: "四六级成绩",
        type: "CET_4_6",
        data: [],
      },
    ],

    isLoading: true,//是否正在加载数据
    refreshState: false,

  },

  onLoad: function () { this.initData(() => { }) },
  onShow: function () { if (this.data.refreshState) { this.freshEvent() } },

  freshEvent: function () { this.initData(() => { this.setData({ refreshState: false }) }) },

  //初始化
  initData: function (callback) {
    var that = this

    that.setData({ isLoading: true })

    HTTP.GET(
      '/certificate/certificates',
      {},
      function (res) {
        // console.log(res.data.data)
        that.setData({
          ['itemList[0].data']: res.data.data.QUALIFICATIONS,
          ['itemList[1].data']: res.data.data.SKILL,
          ['itemList[2].data']: res.data.data.COMPETITION,
          ['itemList[3].data']: res.data.data.CET_4_6,
          isLoading: false,
        })
        callback()
      },
      function () { }
    )
  },


  // 录入
  toAdd: function (k) {
    var tmpType = k.currentTarget.dataset.type
    // QUALIFICATIONS 国家职业资格证书
    // SKILL 技能证书
    // COMPETITION 学科竞赛证书
    // CET_4_6 四六级成绩

    switch (tmpType) {
      case 'QUALIFICATIONS': {
        wx.navigateTo({ url: 'add/qCert/index' })
        break
      }
      case 'SKILL': {
        wx.navigateTo({ url: 'add/sCert/index' })
        break
      }
      case 'COMPETITION': {
        wx.navigateTo({ url: 'add/cCert/index' })
        break
      }
      case 'CET_4_6': {
        wx.navigateTo({ url: 'add/cetCert/index' })
        break
      }
    }

  },

  toDetail: function (k) {
    var tmpData = k.currentTarget.dataset.detail
    
    wx.navigateTo({ url: 'detail/index?detail=' + JSON.stringify(tmpData) })

    // 该接口弃用 (重复请求)
    // HTTP.GET(
    //   '/certificate/details',
    //   {
    //     certificateId: k.currentTarget.dataset.id,
    //     certificateType: k.currentTarget.dataset.type
    //   },
    //   function (res) {
    //     var tmpData = res.data.data
    //     tmpData = that.translate2CN(tmpData)
    //     that.setData({ ['certDetail.show']: true, ['certDetail.data']: res.data.data })
    //   },
    //   function () { }
    // )


  },



  // 加工详情数据(翻译)
  translate2CN: function (tmpData) {
    tmpData.certificatePublishTime = utils.timeStamp2Time(tmpData.certificatePublishTime / 1000, 'Y年M月')

    if (tmpData.type != 'CET_4_6')
      switch (tmpData.type) {
        case 'Normal': {
          tmpData.type = '常规证书'
          break
        }
        case 'Teacher': {
          tmpData.type = '教师资格证'
          break
        }
        case 'International': {
          tmpData.type = 'ACCA/CFA'
          break
        }
      }
    // console.log(tmpData)
    return tmpData
  },


})