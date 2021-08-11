const HTTP = require('../../../utils/http.js')
const utils = require('../../../utils/newutil.js')

Page({

  data: {

    tabSelectHead: [
      {
        title: '类型',
        show: false,
        current: 0,
        data: ['不限', '校园活动', '社会实践', '志愿活动', '义工活动', '讲座活动'],
        more: [' ', 'schoolActivity', 'practiceActivity', 'volunteerActivity', 'volunteerWork', 'lectureActivity']
      },
      {
        title: '学期',
        show: false,
        current: 0,
        data: [],
        more: []
      },
      // {
      //   title: '排序',
      //   show: false,
      //   current: 0,
      //   data: ['顺序', '逆序'],
      // }
    ],

    tabSelectState: {
      current: 0,
      data: ['已上线', '准备中', '已下线', '重启中'],
      icon: ['roundcheck', 'loading', 'roundclose', 'loading'],
      more: ['PUBLISHED', 'APPROVED', 'FINISHED', 'RESTARTED'],
    },

    showDetail: {//活动详情弹窗控制
      show: false,
      data: []
    },

    currentPage: 0,//分页加载
    totalPages: 0,//请求得到的总页数

    isLoading: false,//是否在加载中

    listData: [],//数据暂存

    refreshState: false,//刷新状态

  },


  onLoad: function () {
    var that = this

    // 初始化 活动学期
    var now = new Date()
    var nowYear = now.getFullYear()
    var nowMonth = now.getMonth() + 1

    var tmpPickerTerm = {
      title: '学期',
      show: false,
      current: (nowMonth <= 2 && nowMonth >= 9) ? 3 : 4,
      data: [],
      more: []
    }
    tmpPickerTerm.data.push('不限')
    tmpPickerTerm.more.push('')
    for (var i = -2; i < 2; i++) {
      tmpPickerTerm.data.push((nowYear + i) + '第1学期')
      tmpPickerTerm.more.push((nowYear + i) + 'A')
      tmpPickerTerm.data.push((nowYear + i) + '第2学期')
      tmpPickerTerm.more.push((nowYear + i) + 'B')
    }
    that.setData({ ["tabSelectHead[1]"]: tmpPickerTerm })

    // that.init()
  },

  onShow: function () { this.init() },


  init: function (callback) {
    var that = this

    that.data.currentPage = 0//重置页数为0
    that.setData({ listData: [], totalPages: 0, isLoading: true })

    HTTP.GET(
      '/activity',
      {
        limit: 15,
        page: 0,
        state: that.data.tabSelectState.more[that.data.tabSelectState.current],
        term: that.data.tabSelectHead[1].more[that.data.tabSelectHead[1].current],
        activityType: that.data.tabSelectHead[0].more[that.data.tabSelectHead[0].current]
      },
      function (res) {
        var resData = res.data.data.content
        for (var i = 0; i < resData.length; i++) {
          resData[i].start = utils.timeStamp2Time(resData[i].start / 1000, 'Y年M月D日 h:m')
          resData[i].end = utils.timeStamp2Time(resData[i].end / 1000, 'Y年M月D日 h:m')

          if (resData[i].location == null) { resData[i].location = '暂无' }

          resData[i].termCN = resData[i].term.substring(0, 4) + '年' + (resData[i].term.substring(4, 4) == 'A' ? '第一学期' : '第二学期')

          switch (resData[i].type) {
            case 'schoolActivity': {
              resData[i].typeCN = '校园活动'
              break
            }
            case 'volunteerActivity': {
              resData[i].typeCN = '志愿活动'
              break
            }
            case 'practiceActivity': {
              resData[i].typeCN = '实践活动'
              break
            }
            case 'lectureActivity': {
              resData[i].typeCN = '讲座活动'
              break
            }
          }
          switch (resData[i].state) {
            case 'PUBLISHED': {
              resData[i].stateCN = '已上线'
              break
            }
            case 'APPROVED': {
              resData[i].stateCN = '准备中'
              break
            }
            case 'FINISHED': {
              resData[i].stateCN = '已下线'
              break
            }
            case 'RESTARTED': {
              resData[i].stateCN = '重启中'
              break
            }
          }
        }
        console.log('请求页数：' + (++that.data.currentPage) + '/' + res.data.data.totalPages)// !!!勿删!!! (!!!此处不做setData())
        that.setData({ listData: resData, totalPages: res.data.data.totalPages, isLoading: false })
        if (typeof (callback) == 'function') { callback() }
      },
      function () { }
    )
  },


  // 导航头
  tabNav: function (k) {
    var that = this

    var tmpList = that.data.tabSelectHead
    var index = k.currentTarget.dataset.index

    if (index == 0) {
      if (tmpList[0].show == false) {
        tmpList[0].show = true
        tmpList[1].show = false
      } else {
        tmpList[0].show = false
        tmpList[1].show = false
      }
    } else if (index == 1) {
      if (tmpList[1].show == false) {
        tmpList[1].show = true
        tmpList[0].show = false
      } else {
        tmpList[1].show = false
        tmpList[0].show = false
      }
    }
    that.setData({ tabSelectHead: tmpList })

  },

  // 子菜单
  tabSelectTap: function (k) {
    var that = this

    // 切换子菜单
    var tmpString = "tabSelectHead[" + k.currentTarget.dataset.index + "].current"
    that.setData({ [tmpString]: k.currentTarget.dataset.current })

    // 更改子菜单显示状态
    var tmpString2 = "tabSelectHead[" + k.currentTarget.dataset.index + "].show"
    that.setData({ [tmpString2]: !that.data.tabSelectHead[k.currentTarget.dataset.index].show })

    // 初始化加载
    that.init()
  },

  // 头部筛选框2
  tabSelectState: function (k) {
    if (k.currentTarget.dataset.id == this.data.tabSelectState.current) { return }
    var tmpString = "tabSelectState.current"
    this.setData({ [tmpString]: k.currentTarget.dataset.id })
    this.init()
  },

  // 下拉刷新
  freshEvent: function () {
    this.init(() => { this.setData({ refreshState: false }) })
  },

  // 弹出菜单
  showAction: function (g) {
    var that = this
    var ActionItemList = []
    var tmpData = g.currentTarget.dataset.detail
    that.setData({ ["showDetail.data"]: tmpData, ["showDetail.show"]: true })

    // console.log(tmpData)

    // 根据当前选择状态确定菜单项目
    switch (that.data.tabSelectState.current) {
      case 0: {//已上线
        ActionItemList = ['详细信息', '下线活动', '分配记录员']
        break
      }
      case 1: {//准备中
        ActionItemList = ['详细信息', '上线活动', '分配记录员', '取消活动']
        break
      }
      case 2: {//已下线
        ActionItemList = ['详细信息', '重启活动']
        break
      }
      case 3: {//重启中
        ActionItemList = ['详细信息', '下线活动', '分配记录员']
        break
      }
    }

  },

  reachEnd: function () { this.loadNextPage() },

  /**
   * 加载下一页
   */
  loadNextPage: function () {
    var that = this
    that.setData({ isLoading: true })

    if (that.data.totalPages <= that.data.currentPage) {
      that.setData({ isLoading: false })
      wx.showToast({ title: '没有更多了哦~', icon: "none", duration: 2000 })
      return
    }

    console.log('请求页数：' + (that.data.currentPage + 1) + '/' + that.data.totalPages)
    HTTP.GET(
      '/activity',
      {
        limit: 15,
        page: that.data.currentPage++,// init()之后第一次currentPage为/1/ (!!!首页为/0/) (!!!此处不做setData())
        state: that.data.tabSelectState.more[that.data.tabSelectState.current],
        term: that.data.tabSelectHead[1].more[that.data.tabSelectHead[1].current],
        activityType: that.data.tabSelectHead[0].more[that.data.tabSelectHead[0].current]
      },
      function (res) {
        var resData = res.data.data.content

        if (resData.length == 0) {
          wx.showToast({ title: '没有更多了哦~', icon: "none", duration: 2000 })
          that.setData({ isLoading: false })
          return
        }

        for (var i = 0; i < resData.length; i++) {
          resData[i].start = utils.timeStamp2Time(resData[i].start / 1000, 'Y年M月D日 h:m')
        }
        // 拼接
        var tmpListData = resData

        tmpListData = that.data.listData.concat(tmpListData)
        that.setData({ listData: tmpListData, isLoading: false })
      },
      function () { }
    )
  },


})