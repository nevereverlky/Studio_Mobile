Page({

  data: {
    detailList: [
      {
        version: "2.3.0!",
        time: "2020-08~2020~09",
        content: "超级超级多的更新！！By Beta2020"
      },
      {
        version: "2.2.8",
        time: "2019-12-9",
        content: "Added \n- 新增加管理员的功能"
      },
      {
        version: "2.2.7",
        time: "2019-11-18",
        content: "Fixed \n- 证书图片上传问题修复"
      },
      {
        version: "2.2.6",
        time: "2019-11-4",
        content: "Fixed \n- 本地时间与服务端时间同步"
      },
      {
        version: "2.2.5",
        time: "2019-10-16",
        content: "Added \n- 添加证书图片上传 \nFixed \n- 修复教室借用的相关问题"
      },
      {
        version: "2.2.4",
        time: "2019-10-12",
        content: "Changed \n- 学生社团职务显示调整"
      },
      {
        version: "2.2.3",
        time: "2019-10-9",
        content: "Changed \n- 个人信息界面排版修改"
      },
      {
        version: "2.2.2",
        time: "2019-10-7",
        content: "Added \n- 添加学生社团职务"
      },
      {
        version: "2.2.1",
        time: "2019-9-15",
        content: "Fixed \n- 修复财务管理社团列表的BUG"
      },
      {
        version: "2.2.0",
        time: "2019-8-28",
        content: "Added \n- 添加教室借用功能"
      },
      {
        version: "2.1.8",
        time: "2019-5-24",
        content: "Changed \n- 信息收集通道关闭 \nFixed \n- 修复证书录入的bug"
      },
      {
        version: "2.1.7",
        time: "2019-5-17",
        content: "Added \n- 新增证书录入模块"
      },
      {
        version: "2.1.6",
        time: "2019-5-6",
        content: "Fixed \n- 修复志愿活动时长显示"
      },
      {
        version: "2.1.5",
        time: "2019-5-5",
        content: "Added \n- 新增往期社会实践及志愿活动时长显示"
      },
      {
        version: "2.1.4",
        time: "2019-4-30",
        content: "Added \n- 新增往期活动章分配"
      },
      {
        version: "2.1.3",
        time: "2019-4-23",
        content: "Added \n- 新增信息收集，专业年级信息显示"
      },
      {
        version: "2.1.2",
        time: "2019-4-14",
        content: "Added \n- 新版本提示更新 \nChanged \n- 活动管理权限分离"
      },
      {
        version: "2.1.1",
        time: "2019-4-10",
        content: "Added \n- 新增“新学习”系列活动 \nChanged \n- 独立组织模块"
      },
      {
        version: "2.1.0",
        time: "2019-4-7",
        content: "Added \n- 新增动态二维码 \n- 新增物资借用归还功能 \n- 新增财务管理功能 \nChanged \n- 活动记录额外参数中添加扫码员姓名 \n- 组织模块与活动模块分离 \nFixed\n- 修复懒更新盖章员信息 \n- 修复日志结构 \n- 修复招新弹窗响应位置问题"
      },
      {
        version: "2.0.9",
        time: "2019-3-18",
        content: "Added \n- 活动管理下拉刷新，及时更新 \n- 招新弹窗 \nChanged \n- 修改查询活动接口根据多种状态进行分页查询"
      },
      {
        version: "2.0.8",
        time: "2019-1-15",
        content: "Added \n- 可以使用文件导入活动章了 \n-  新增活动记录统计 \nChanged \n- 修改活动名长度限制 \n- 过滤社会实践 \n- 活动模块格式修改 \nFixed \n- 修复了重复盖章问题 \n- 修复活动结束时盖章员保留"
      },
      {
        version: "2.0.7",
        time: "2018-12-08",
        content: "Added \n- 新增讲座类型活动 \nChanged \n- 调整配色，使用基于AntDesign的梯度配色"
      },
      {
        version: "2.0.0~6",
        time: "2018-12-03 ",
        content: "重构并开源。（https://github.com/BetaSummer/haetae） \nAdded \n- 二维码防截图功能 - 快乐小风车（灵感@苏前溢）。 \n- 志愿活动记录新增了选择时长功能。 \n- 义工活动现在可以选择时长和记录工作内容了。 \n- 社会实践新增了等第记录与查看。 \n- 新增登录状态机制，帐号现在不允许重复登录了。 \n- 活动创建时需要填写活动时间，现在活动可以自动结束了。 \n- 新增只有活动时间内盖章才生效的判断机制。 \n- 详细的日志记录，现在系统中的所有行为都将被详细记录，精确到IP。 \nChanged \n- 重建了权限模型 \n- 修整了代码规范 \n- 合并了个人页面与功能页 \n- 优化了基于MD5和salt的加密机制，密码现在更安全了。 \n- 修改了请求体，数据传输更加规范了。 \n- 二维码展示由点击二维码消失修改为点击阴影区域消失。 \nFixed \n- 修复了时长记录精度问题 \n- 优化了前端文字显示 \n- 修复了特定情况下活动无法下线的问题 \n- 修复了开发者们头发太多的问题"
      },
      {
        version: "1.2.0",
        time: "2018-11-12",
        content: "Added \n- 新增记录员后端验权限 \nChanged \n- 更新后端版本API版本"
      },
      {
        version: "1.1.1",
        time: "2018-10-24",
        content: "Added \n- 新增各类活动统计，志愿时长统计查看 \nChanged \n- 修改了小程序logo   设计鸣谢@学生会摄制部部长-楼锦裕 \nMore \n- 祝大家1024程序员节快乐 d(`･∀･)b"
      },
      {
        version: "1.1.0",
        time: "2018-10-15",
        content: "Added \n- 新增志愿时长查看功能 \nFixed \n- 修复了新建志愿活动可能返回服务器错误的问题 \n- 修复了iPhone某些页面查看时间会显示NaN的问题"
      },
      {
        version: "1.0.8",
        time: "2018-10-07",
        content: "Added \n- 新增logo和版本号显示 \nFixed \n- 优化了首屏响应时间 \n- 修复了志愿时长参数相关问题 \n- 修复了登录时密码不能输入符号的问题"
      },
      {
        version: "1.0.6",
        time: "2018-10-06",
        content: "Fixed \n- 修复了IOS下ActionSheet文字不显示的问题 \n- 修复了某些操作提示文字显示不正确的问题"
      },
      {
        version: "1.0.5",
        time: "2018-10-05",
        content: "Fixed \n- 修复了IOS时间戳不兼容的问题 \n- 修复了退出后的重定向以及缓存问题"
      },
      {
        version: "1.0.3",
        time: "2018-09-30",
        content: "Removed \n- 删除头像查看功能 \nFixed \n- 修复了月份不符合实际情况的问题"
      },
      {
        version: "1.0.2",
        time: "2018-09-25",
        content: "Added \n- 新增修改密码功能 \n- 新增退出登录功能 \nChanged \n- 后端重构，采用SpringBoot架构 \n- 前端重构，重新设计UI，配色"
      },
      {
        version: "1.0.1",
        time: "2018-09-10",
        content: "Added\n - 后端新增HTTPS访问，支持微信小程序"
      },
      {
        version: "1.0.0",
        time: "2018-08-06",
        content: "Added\n - 主体功能完成"
      },
    ],
  }

})