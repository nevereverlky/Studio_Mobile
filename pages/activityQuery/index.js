const app = getApp()
const HTTP = require('../../utils/http.js')

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
        title: '状态',
        show: false,
        current: 0,
        data: ['进行中', '已报名', '已过期'],
        more: ['PUBLISHED', 'REGISTERED', 'FINISHED'],
        addr: ['/activityEntry', '/user/registeredActivityEntry', '/activityEntry']//请求地址不同(见 this.initLoad() )
      }
    ],

    refreshState: false,//下拉刷新状态
    currentPage: 0,//分页加载
    totalPages: 0,//请求得到的总页数


    showDetail: {//报名详情弹窗控制
      show: false,
      data: []
    },

    showConfirm: {//报名确认弹窗控制
      show: false,
      content: []
    },

    isLoading: false,//是否在加载中

    listData: [],//数据暂存

    userInfo: {},//活动详情需要显示报名人信息

    qrActivityEntry: {
      id: '',
      data: {},
    },
  },

  onLoad: function (op) {
    var that = this
    that.setData({ userInfo: app.globalData.userInfo })//活动详情需要显示报名人信息

    that.data.qrActivityEntry.id = op.activityEntryId

    if (that.data.qrActivityEntry.id != undefined && that.data.qrActivityEntry.id != '') {
      HTTP.GET(
        '/activityEntry/singleActivityEntry', { activityEntryId: that.data.qrActivityEntry.id },
        function (s) {
          var newOne = s.data.data

          // 判断活动
          if (newOne.status == "REGISTERED") {
            wx.showModal({ content: '您已报名该活动', showCancel: false })
            that.setData({ ["tabSelectHead[1].current"]: 1, ["qrActivityEntry.data"]: newOne })
            that.initLoad()//加载!
          } else if (newOne.status == "FINISHED") {
            wx.showModal({ content: '该活动已过期', showCancel: false })
            that.setData({ ["tabSelectHead[1].current"]: 2, ["qrActivityEntry.data"]: newOne })
            that.initLoad()//加载!
          } else {
            that.setData({ ["tabSelectHead[1].current"]: 0, ["qrActivityEntry.data"]: newOne })
            that.initLoad()//加载!
          }

        }
      )
    } else {
      that.initLoad()
    }


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

    // 手动操作后清除小程序码入口参数
    that.setData({ qrActivityEntry: { id: '', data: {} } })

    // 初始化加载
    that.initLoad()
  },

  // 下拉刷新事件
  freshEvent: function () {
    // 手动操作后清除小程序码入口参数
    this.setData({ qrActivityEntry: { id: '', data: {} } })
    this.initLoad(() => { this.setData({ refreshState: false }) })
  },

  /**
   * 初始化加载
   * (根据Tab的 类型 和 状态 加载第0页内容)
   */
  initLoad: function (callback) {
    var that = this

    that.setData({ listData: [], isLoading: true })
    that.data.currentPage = 0//重置页数为0

    HTTP.GET(
      that.data.tabSelectHead[1].addr[that.data.tabSelectHead[1].current],
      {
        activityType: that.data.tabSelectHead[0].more[that.data.tabSelectHead[0].current],
        state: that.data.tabSelectHead[1].more[that.data.tabSelectHead[1].current],
        page: 0,// 注意此处页数从 /0/ 开始
        limit: 5
      },
      function (res) {
        var tmpListData = res.data.data.content

        // 预处理数据
        tmpListData = that.parseData(tmpListData)

        console.log('请求页数：' + (++that.data.currentPage) + '/' + res.data.data.totalPages)// !!!勿删!!! (!!!此处不做setData())
        that.setData({ listData: tmpListData, totalPages: res.data.data.totalPages, isLoading: false })
        if (typeof (callback) == 'function') { callback() }
      },
      function () { if (typeof (callback) == 'function') { callback() } }
    )
  },

  // 预处理数据
  parseData: function (tmpListData) {
    var that = this

    // 删除已报名活动
    var delIndexArray = []
    for (let i in tmpListData) {
      if (that.data.tabSelectHead[1].more[that.data.tabSelectHead[1].current] == 'PUBLISHED') { //删除已报名活动
        if (tmpListData[i].status == 'REGISTERED' || tmpListData[i].status == 'CANCEL_REGISTERED') {
          // console.group('删除已报名索引 ' + i)
          // console.log(tmpListData[i])
          // console.groupEnd()
          tmpListData.splice(i--, 1)//i--是因为要改变原数组下标
        }
      }
    }


    if (that.data.qrActivityEntry.id != undefined && that.data.qrActivityEntry.id != '') {
      that.setData({ showDetail: { show: true, data: that.data.qrActivityEntry.data } })

      if (that.data.tabSelectHead[1].more[that.data.tabSelectHead[1].current] == that.data.qrActivityEntry.data.status) {
        // 如果第0项不是参数ID,插入并显示
        if (tmpListData[0].activityEntryId != that.data.qrActivityEntry.id) {
          tmpListData.unshift(that.data.qrActivityEntry.data)
        }
      }
    }


    // 翻译活动类型
    for (let i in tmpListData) {
      tmpListData[i].activityType = that.translate2CN(tmpListData[i].activityType)
    }

    return tmpListData
  },

  reachEnd: function () { this.loadNextPage() },// 加载下一页
  /**
   * 加载下一页
   */
  loadNextPage: function () {
    var that = this

    // 手动操作后清除小程序码入口参数
    that.setData({ qrActivityEntry: { id: '', data: {} } })

    that.setData({ isLoading: true })

    if (that.data.totalPages <= that.data.currentPage) {
      this.setData({ isLoading: false })
      wx.showToast({ title: '没有更多了哦~', icon: "none", duration: 2000 })
      return
    }

    console.log('请求页数：' + (that.data.currentPage + 1) + '/' + that.data.totalPages)
    HTTP.GET(
      that.data.tabSelectHead[1].addr[that.data.tabSelectHead[1].current],
      {
        activityType: that.data.tabSelectHead[0].more[that.data.tabSelectHead[0].current],
        state: that.data.tabSelectHead[1].more[that.data.tabSelectHead[1].current],
        page: that.data.currentPage++,// initLoad()之后第一次currentPage为/1/ (!!!首页为/0/) (!!!此处不做setData())
        limit: 5
      },
      function (res) {

        if (res.data.data.content.length == 0) {
          that.setData({ isLoading: false })
          wx.showToast({ title: '没有更多了哦~', icon: "none", duration: 2000 })
          return
        }

        var tmpListData = res.data.data.content

        // 预处理数据
        tmpListData = that.parseData(tmpListData)

        // 拼接
        tmpListData = that.data.listData.concat(tmpListData)
        that.setData({ listData: tmpListData, isLoading: false })
      },
      function () { }
    )
  },


  /**
   * 翻译活动类型→中文
   * @param {string} putin 要翻译的活动类型英文
   * @return {string} 返回中文
   */
  translate2CN: function (putin) {
    switch (putin) {
      case 'schoolActivity': { return '校园活动' }
      case 'volunteerActivity': { return '志愿活动' }
      case 'practiceActivity': { return '实践活动' }
      case 'lectureActivity': { return '讲座活动' }
    }
  },

  /**
   * 确认报名弹窗
   */
  showConfirm: function (k) {
    var that = this
    if (k.currentTarget.dataset.type == 'close') {//点击关闭
      that.setData({ ['showConfirm.show']: false })
      return
    } else if (k.currentTarget.dataset.type == 'confirm') {//点击报名

      that.submitSign(k.currentTarget.dataset.detail)
      that.setData({ ['showConfirm.show']: false })
      return

    } else {

      that.setData({
        ['showConfirm.show']: true,
        ['showConfirm.content']: k.currentTarget.dataset.detail
      })

    }

  },

  /**
   * 提交报名信息
   */
  submitSign: function (k) {
    var that = this
    wx.showLoading({ title: '报名中...', mask: true })

    HTTP.POST(
      '/user/signUp',
      { activityEntryId: k.activityEntryId },
      function (res) {
        console.log(res.data.data)
        switch (res.data.errorCode) {
          case "200": {

            k.activityEntryRecordId = res.data.data.activityEntryRecordId
            that.goSubscribeMsg(k)

            that.setData({ ['tabSelectHead[1].current']: 1 })// 切换到已报名
            wx.showToast({ title: res.data.errorMsg })
            // 初始化Tab对应的页面数据
            setTimeout(function () { that.initLoad() }, 1000)
            break
          }
        }
      },
      function () { }
    )

  },


  /**
   * 查看报名详情
   */
  showDetail: function (k) {
    var that = this
    if (k.currentTarget.dataset.type == 'close') {
      that.setData({ ['showDetail.show']: false })
      return
    }

    var detailList = that.data.listData[k.currentTarget.dataset.index]
    that.setData({
      ['showDetail.show']: true,
      ['showDetail.data']: detailList
    })

    // HTTP.GET(
    //   '/user/getActivityEntryRecord',
    //   {
    //     userId: app.globalData.userInfo.userId,
    //     activityEntryId: detailList.activityEntryId,
    //   },
    //   function (k) {
    //     console.log(k)
    //   },
    //   function () { }
    // )
  },

  /**
   * 订阅消息 - 提醒
   */
  goSubscribeMsg: function (k) {
    console.log(k)
    var tmplIds = ['nwxzBKgDlu7j_zBN1Mq0TTDqux_7-QjFHUhcqZYe_ZA']

    HTTP.subscribeMsg(
      'nwxzBKgDlu7j_zBN1Mq0TTDqux_7-QjFHUhcqZYe_ZA',
      function (s) {
        wx.login({
          success: function ({ code }) {
            HTTP.POST(
              '/user/Subscribe',
              {
                userId: getApp().globalData.userInfo.userId,
                code: code,//用户的code
                subscribeId: k.activityEntryRecordId,//当前订阅记录id 传adtivityEntryRecordId

                activityTime: '活动时间',
                start: k.start.replace(/年/, '-').replace(/月/, '-').replace(/日/, ''),//活动开始时间 2020-08-29 01:56:15
                advanceTime: 0,//提前发送订阅分钟数

                note: '您报名的活动即将开始，请做好准备',//活动 温馨提示
                location: k.location == null ? '暂无' : k.location,//活动地点

                activityName: k.activityName,//活动名称
                // page: '',
              },
              function (g) {
                console.log(g.data)
                // wx.showToast({ title: '订阅成功' })
              },
              function () { }
            )

          }
        })
      }
    )


  },

  /** 
   * 取消报名
   */
  goCancelSign: function (k) {
    var that = this

    HTTP.DELETE(
      '/user/undoSignUp',
      { activityEntryId: k.currentTarget.dataset.id },
      function (res) {
        switch (res.data.errorCode) {
          case "200": {
            wx.showToast({ title: '取消成功', mask: true })
            that.setData({ ['tabSelectHead[1].current']: 0 })
            that.initLoad()
            break
          }
        }
      },
      function () {
        // 取消报名失败
        console.log(res)
      }
    )


  },


})