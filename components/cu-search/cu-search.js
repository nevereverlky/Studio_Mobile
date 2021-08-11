const app = getApp()
const HTTP = require('../../utils/http.js')
Component({

  options: {
    addGlobalClass: true,
  },

  properties: {

    show: {//是否显示
      type: Boolean,
      value: false
    },

  },

  data: {

    organizeList: [
      // {
      //   show: true,
      //   name: '',
      // },{}
    ],


    keyWord: '',//仅用于长度判断(也有内容)

  },


  attached: function () {
    var that = this

    HTTP.GET(
      '/activity/organizers',
      {},
      function (res) {
        var resArray = res.data.data
        var tmpNewArray = []
        for (var i = 0; i < resArray.length; i++) {
          tmpNewArray.push({ show: true, name: resArray[i], })
        }
        that.setData({ organizeList: tmpNewArray })
      },
      function () { }
    )

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clearKeyWord: function () { this.setData({ keyWord: '' }) },

    hideModal: function () {
      var that = this
      console.log(that.data.organizeList)
      console.log(that.data.keyWord)
    },


    updateInput: function (k) {
      var that = this
      var key = k.detail.value
      var old = that.data.organizeList
      that.setData({ keyWord: k.detail.value }) // 用于标识长度是否存在

      for (var i = 0; i < old.length; i++) {
        if (old[i].name.search(key) != -1) {//如果找到了匹配字
          old[i].show = true
        } else {
          old[i].show = false
        }
      }

      that.setData({ organizeList: old })

    },

    // name直接传出去~
    select: function (k) { this.triggerEvent('selectEvent', k.currentTarget.dataset.name) },

  }
})