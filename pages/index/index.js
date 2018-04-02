//index.js
//获取应用实例
const app = getApp()

const util = require('../../utils/util')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: null,
    showDate: '',
    isShowDialog: false,
    showEditIndex: null,
    showDetailIndex: null,
    list: [],
    dialogContent: '',
    is_notice: 0,
    notice_time: null,
    taskId: null,
    startDate: null,
    endDate: null,
    isNewTodo: true,
    remindDate: '',
    remindTime:'',
    isShowTimeWrapper: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  pressFun: function () {
    console.log('longpress')
  },
  onLoad: function () {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.getDate()
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = params => {
        util.todoLogin(params, function (res) {
          app.globalData.token = res.data.data.token
          that.getTodoList()
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          util.todoLogin(res)
        }
      })
    }
    
  },
  getTodoList: function () {
    util.getTodoList(this.data.date,(res) => {
      console.log(res)
      this.setData({
        list: res.data.data
      })
      wx.hideLoading()
    })
  },
  getDate: function () {
    var date = new Date()
    var startDate = util.startDate()
    var endDate = util.endDate()
    var formDate = util.formatTopBarTime(date)
    this.setData({
      showDate: formDate,
      startDate: startDate,
      endDate: endDate,
      date: startDate
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var tmpArr = e.detail.value.split('-')
    var showDate = `${util.monthList[Number(tmpArr[1])]}.${tmpArr[2]}.${tmpArr[0]}`
    this.setData({
      date: e.detail.value,
      showDate: showDate
    })
    this.getTodoList()
  },
  // 长按显示编辑框
  tabEdit: function (e) {
    let id = e.target.dataset.id
    if (this.data.showEditIndex === id) {
      this.setData({
        showEditIndex: null
      })
    } else {
      this.setData({
        showEditIndex: id
      })
    }
  },
  // 短按显示具体内容
  showItemText: function (e) {
    let id = e.target.dataset.id
    if (this.data.showDetailIndex === id) {
      this.setData({
        showDetailIndex: null
      })
    } else {
      this.setData({
        showDetailIndex: id
      })
    }
  },
  // 短按原点显示完成样式
  overdueItem: function (e) {
    let id = e.target.dataset.id
    console.log(id)
    util.overDueItem(id, () => {
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
      this.getTodoList()
    })
  },
  // 短按编辑item
  editItem: function (e) {
    let title = e.target.dataset.title ? e.target.dataset.title : e.currentTarget.dataset.title
    let id = e.target.dataset.id ? e.target.dataset.id : e.currentTarget.dataset.id
    console.log(e)
    this.setData({
      dialogContent: title,
      isNewTodo: false,
      taskId: id
    })
    this.openDialog()
  },
  // 短按删除item
  delItem: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(e)
    wx.showModal({
      title: 'confirm',
      content: `确认删除id为${id}`,
      success: function (res) {
         console.log(res) 
      },
    })
  },
  closeDialog: function () {
    this.setData({
      isShowDialog: false
    })
  },
  openDialog: function () {
    this.setData({
      isShowDialog: true
    })
  },
  formatter: function (date) {
    return '时间是'+date;
  },
  // 新增todo
  addTodoItem: function () {
    this.setData({
      dialogContent: '',
      isShowDialog: true,
      isNewTodo: true
    })
  },
  // 短按确认添加新的todo
  confirmAdd: function (e) {
    console.log(e)
    if (this.data.dialogContent.length <= 0) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return;
    }
    let obj = {
      title: this.data.dialogContent,
      is_notice: this.data.is_notice || 0,
      notice_time: this.data.notice_time || '',
      form_id: e.detail.formId || ''
    }
    if (this.data.isNewTodo) {
      util.addTodoItem(obj, (res) => {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        this.closeDialog()
        this.getTodoList()
      })
    } else {
      util.addTodoItem(obj, (res) => {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        this.closeDialog()
        this.getTodoList()
      })
    }
  },
  // 输入框事件
  inputChange: function (e) {
    this.setData({
      dialogContent: e.detail.value
    })
  },
  // 提醒框选择时间
  remindDayChange: function (e) {
    this.setData({
      remindDate: e.detail.value
    })
  },
  remindTimeChange: function (e) {
    this.setData({
      remindTime: e.detail.value
    })
  },
  closeTimeWrapper: function () {
    let day = this.data.remindDate
    let time = this.data.remindTime
    var date = new Date(`${day} ${time}`)
    date = date.getTime()
    this.setData({
      isShowTimeWrapper: false,
      notice_time: day + ' ' + time,
      is_notice: 1
    })
  },
  openTimerWrapper: function () {
    this.setData({
      isShowTimeWrapper: true
    })
  }
})
