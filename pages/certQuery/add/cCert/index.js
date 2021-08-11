const HTTP = require('../../../../utils/http.js')

Page({
  data: {
    stepList: {
      current: 0,
      names: ['基本信息', '证书上传', '证书信息', '补充信息']
    },

    certType: {//证书类型
      current: 0,
      names: ['个人竞赛', '团队竞赛'],
      code: ['Personal', 'Team']
    },

    submitData: {
      certificateType: "COMPETITION",              //证书类型(主)
      certificatePublishDate: '2020-08',              //发证时间(Y-M)

      //***-------------- STEP1 --------------****//
      competitionName: '',                            //竞赛名称
      rank: '',                                       //证书等级
      certificatePublishTime: '',                     //发证时间戳(ms)
      type: '',                                       //证书类型(附属)

      //***-------------- STEP2 --------------****//
      pictureUrl: '',                                 //证书图片

      //***-------------- STEP3 --------------****//
      teamName: '',                                      //队伍/作品名称
      ////////////[self,1,'2','3','4','5','6','7','8']
      workUserId: ['', ''],   //队员

      teacher: [
        {
          teacherNumber: '',                //第一个指导老师工号
          teacherName: '',                  //第一个指导老师姓名
        },
        // {
        //   teacherNumber: '',                //第二个指导老师工号
        //   teacherName: '',                  //第二个指导老师姓名
        // }
      ],

      extInfo: {
        //***-------------- STEP4 --------------****//
        description: '',                              //全部信息
      }
    }
  },

  onLoad: function (options) {
    var that = this
    var tmpData = that.data
    var submitData = that.data.submitData
    var nowTime = new Date()
    var nowYear = nowTime.getFullYear()
    var nowMonth = (nowTime.getMonth() + 1) < 10 ? '0' + (nowTime.getMonth() + 1).toString() : (nowTime.getMonth() + 1).toString()

    // 默认发证时间
    submitData.certificatePublishDate = nowYear + '-' + nowMonth
    submitData.certificatePublishTime = (new Date(nowTime.getFullYear(), nowTime.getMonth())).getTime()
    that.setData({ ['submitData.certificatePublishDate']: tmpData.submitData.certificatePublishDate })

    // 默认证书类型
    submitData.type = tmpData.certType.code[tmpData.certType.current]

    // 自己学号
    that.setData({ ['submitData.workUserId[0]']: (getApp().globalData.userInfo.stuId) ? getApp().globalData.userInfo.stuId : '06' })
  },
  // 手动滑动
  changeByHand: function (s) { this.setData({ ["stepList.current"]: s.detail.current }) },

  // 步骤切换
  changeStep: function (kk) {
    var that = this
    var resPage = that.data.stepList.current

    if (kk.currentTarget.dataset.type == "back") {
      resPage--
    } else {
      if (resPage == that.data.stepList.names.length - 1) {
        that.checkItems()
        return
      } else { resPage++ }
    }
    that.setData({ ['stepList.current']: resPage })
  },

  /**
   * ****---------------------------- STEP1 ----------------------------****
   */
  // 更新竞赛名称
  updateCertName: function (s) { this.setData({ ['submitData.competitionName']: s.detail.value }) },

  // 更新证书等级
  updateCertRank: function (s) { this.setData({ ['submitData.rank']: s.detail.value }) },

  // 选择发证时间
  updateDate: function (s) {
    var that = this
    var certDate = that.data.submitData.certificatePublishDate.split("-")
    var certTime = new Date(certDate[0], certDate[1] - 1).getTime()
    that.setData({ ['submitData.certificatePublishDate']: s.detail.value, ['submitData.certificatePublishTime']: certTime })
  },

  // 证书类型更改
  typeChange: function (s) {
    var that = this
    var tmpTypeCode = that.data.certType.code[s.detail.value]
    that.setData({ ['certType.current']: s.detail.value, ['submitData.type']: tmpTypeCode })
  },

  /**
   * ****---------------------------- STEP2 ----------------------------****
   */
  // 选择图片
  chooseImage() {
    var that = this
    HTTP.UPLOADIMG(function (s) { that.setData({ ['submitData.pictureUrl']: s.data.path }) })
  },
  // 删除图片
  delImg: function () {
    var that = this
    wx.showModal({ content: '确定要删除吗？', success: res => { if (res.confirm) { that.setData({ ['submitData.pictureUrl']: null }) } } })
  },


  /**
  * ****---------------------------- STEP3 ----------------------------****
  */
  // 更新队伍/作品名称
  updateTeam: function (s) { this.setData({ ['submitData.teamName']: s.detail.value }) },

  // 增加队员
  addTeamer: function () {
    var oldData = this.data.submitData.workUserId
    oldData.push('')
    this.setData({ ["submitData.workUserId"]: oldData })
  },
  // 删除队员
  delTeamer: function () {
    var oldData = this.data.submitData.workUserId
    oldData.pop()
    this.setData({ ["submitData.workUserId"]: oldData })
  },
  // 更新队员学号
  updateTeamMember: function (s) { this.setData({ ["submitData.workUserId[" + s.target.dataset.index + "]"]: s.detail.value }) },


  // 增加老师
  addTeacher: function () {
    var oldData = this.data.submitData.teacher
    oldData.push({ teacherNumber: '', teacherName: '' })
    this.setData({ ["submitData.teacher"]: oldData })
  },
  // 删除老师
  delTeacher: function () {
    var oldData = this.data.submitData.teacher
    oldData.pop()
    this.setData({ ["submitData.teacher"]: oldData })
  },
  // 更新指导老师工号
  updateTeacherId: function (s) { this.setData({ ["submitData.teacher[" + s.target.dataset.index + "].teacherNumber"]: s.detail.value }) },
  // 更新指导老师姓名
  updateTeacherName: function (s) { this.setData({ ["submitData.teacher[" + s.target.dataset.index + "].teacherName"]: s.detail.value }) },



  /**
* ****---------------------------- STEP4 ----------------------------****
*/
  // 更新证书详情
  updateTextarea: function (s) { this.setData({ ['submitData.extInfo.description']: s.detail.value }) },


  // 检查是否填写完整
  checkItems: function () {
    var that = this
    var submitData = that.data.submitData

    // 预处理(删除空数组)
    for (let kk in submitData.workUserId) {
      if (submitData.workUserId[kk].length == 0) {
        submitData.workUserId.splice(kk--, 1)
      }
    }
    for (let bb in submitData.teacher) {
      if (submitData.teacher[bb].teacherNumber.length == 0 || submitData.teacher[bb].teacherName.length == 0) {
        submitData.teacher.splice(bb--, 1)
      }
    }
    that.setData({ submitData: submitData })

    // if (that.data.certType.current == 0) {//如果是个人竞赛
    //   that.data.submitData.workUserId.splice(1, 4)
    // }

    // if (submitData.type != 'Team') {
    //   submitData.teamName == ""
    //   submitData.workUserId[1] == ""
    //   submitData.workUserId[2] == ""
    //   submitData.workUserId[3] == ""
    //   submitData.workUserId[4] == ""
    //   submitData.teacher[0].teacherOneNumber == ""
    //   submitData.teacher[0].teacherOneName == ""
    //   submitData.teacher[1].teacherTwoNumber == ""
    //   submitData.teacher[1].teacherTwoName == ""
    // }

    if (
      submitData.competitionName == "" ||
      submitData.rank == "" ||
      submitData.certificatePublishTime == "" ||
      submitData.type == ""
    ) {
      wx.showToast({ title: '1.请检查第一步必填项\n2.请检查是否出现特殊字符', icon: "none" })
      that.setData({ ['stepList.current']: 0 })
      return
    }
    if (
      submitData.pictureUrl == "" ||
      submitData.pictureUrl == null
    ) {
      wx.showToast({ title: '请检查第二页证书图片', icon: "none" })
      that.setData({ ['stepList.current']: 1 })
      return
    }
    if (
      submitData.type == 'Team' && (
        submitData.teamName == "" ||
        submitData.workUserId[1] == "" ||
        submitData.workUserId[2] == "" ||
        submitData.workUserId[3] == "" ||
        submitData.workUserId[4] == "")
      // 检测字符是否有问题
      // submitData.certificateNumber
      // submitData.rank
    ) {
      wx.showToast({ title: '1.请检查第三步必填项\n2.请检查是否出现特殊字符', icon: "none" })
      that.setData({ ['stepList.current']: 2 })
      return
    }
    if (
      // submitData.extInfo.description == ""
      0
    ) {
      wx.showToast({ title: '1.请检查第四步必填项\n2.请检查是否出现特殊字符', icon: "none" })
      that.setData({ ['stepList.current']: 3 })
      return
    }

    that.confirmSubmit()
  },

  // 提交数据(检测通过)
  confirmSubmit: function () {
    var that = this
    that.data.submitData.extInfo.realName = getApp().globalData.userInfo.realName

    wx.showLoading({ title: '请稍后', mask: true })

    HTTP.POST_json(
      '/certificate/create',
      that.data.submitData,
      function (res) {
        wx.showToast({ title: '创建成功', mask: true })

        const nowPage = getCurrentPages()
        const backPage = nowPage[nowPage.length - 2]
        backPage.data.refreshState = true


        HTTP.subscribeMsg(
          'i6pErfUiZ1p4iycqGuHTBfbgMd3LtT9_oObbXS_-faI',
          function (s) {
            setTimeout(function () { wx.navigateBack() }, 1000)
          }
        )
      },
      function () {
        wx.showToast({ title: '创建失败', icon: 'none', mask: true })
      }
    )
  },

})