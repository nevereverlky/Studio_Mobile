const HTTP = require('../../utils/http.js')
Page({

  data: {
    tabSelectHead: {
      current: 0,
      data: ['未审核', '已通过', '已驳回'],
      more: ['UNREVIEWED', 'APPROVED', 'REJECTED'],
      icon: ['message', 'check', 'close']
    },

    tabSelectState: {
      current: 0,
      data: ['资格证书', '技能证书', '竞赛证书', '四六级证书'],
      more: ['QUALIFICATIONS', 'SKILL', 'COMPETITION', 'CET_4_6'],
    },

    listData: [],


    refreshState: false,
    isLoading: true,

    subEmpty: false,
  },

  onLoad: function () {
    // that.init()
    // setTimeout(()=>{ })
  },

  onShow: function () { this.init() },

  // 头部筛选框1
  tabSelectHead: function (k) {
    if (k.currentTarget.dataset.id == this.data.tabSelectHead.current) { return }
    this.setData({ ["tabSelectHead.current"]: k.currentTarget.dataset.id })

    this.freshView()
  },

  // 头部筛选框2
  tabSelectState: function (k) {
    if (k.currentTarget.dataset.id == this.data.tabSelectState.current) { return }
    this.setData({ ["tabSelectState.current"]: k.currentTarget.dataset.id })

    this.freshView()
  },

  // 下拉刷新
  freshEvent: function () {
    this.init(() => { this.setData({ refreshState: false }) })
  },

  // 初始化数据
  init: function (callback) {
    var that = this
    that.setData({ listData: [], isLoading: true })

    HTTP.GET(
      '/certificateManager/certificate/list',
      {},
      function (s) {
        that.setData({ listData: s.data.data, isLoading: false })

        that.freshView()

        if (typeof (callback) == 'function') { callback() }
      },
      function () {
        that.setData({ isLoading: false })
        if (typeof (callback) == 'function') { callback() }
      }
    )
  },

  // 更新视图数据时检测是否有数据存在
  freshView: function () {
    var query = wx.createSelectorQuery()
    var itemNum = query.selectAll('#itemNum').boundingClientRect()
    query.exec(e => { if (e[0].length == 0) { this.setData({ subEmpty: true }) } else { this.setData({ subEmpty: false }) } })
  },

  // 查看详情并操作
  showDetail: function (s) { wx.navigateTo({ url: 'detail/index?certificateId=' + s.currentTarget.dataset.certificateid }) },

})