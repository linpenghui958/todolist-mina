//index.js
//获取应用实例
const app = getApp()

const util = require('../../utils/util.js')
const config = require('../../utils/config.js')
const NOW_DAY = util.startDate()

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
    isShowTimeWrapper: false,
    showWeekDay: 'Today',
    indexPageIsInit: false
  },
  //事件处理函数
  onShareAppMessage: function () {
    return {
      title: '转发ToDo它喵的',
      path: '/pages/index/index',
      imageUrl: '/assets/shareImg.png'
    }
  },
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
  onShow: function () {
    wx.showLoading({
      title: '玩命加载中',
    })
    if (this.data.indexPageIsInit) {
      this.getDate()    
      this.getTodoList()
    }
    this.setData({
      indexPageIsInit: true
    })
  },
  getTodoList: function () {
    util.getTodoList(this.data.date,(res) => {
      let data = res.data.data
      if (res.data.data.legnth == 0) {
         data = []
      }
      this.setData({
        list: data
      })
      wx.hideLoading()
    })
  },
  getDate: function () {
    const globalDate = app.globalData.date;
    console.log(globalDate)
    if (!!globalDate) {
      let time = app.globalData.dateArr;
      var formDate = `${util.monthList[time[0].month - 1]}.${time[0].day}.${time[0].year}`
      var startDate = app.globalData.date
      var endDate = util.endDate(globalDate)
    } else {
      var date = new Date()
      var startDate = util.startDate()
      var endDate = util.endDate(globalDate)
      var formDate = util.formatTopBarTime(date)
    }
    this._getWeekShow(startDate)
    this.setData({
      showDate: formDate,
      startDate: startDate,
      endDate: endDate,
      date: startDate
    })
  },
  _getWeekShow: function (date) {
    if (date == NOW_DAY) {
      this.setData({
        showWeekDay: 'Today'
      })
    } else {
      let dayNum = new Date(date).getDay()
      let str = util.weekList[dayNum]
      this.setData({
        showWeekDay: str
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindDateChange: function(e) {
    var tmpArr = e.detail.value.split('-')
    var showDate = `${util.monthList[Number(tmpArr[1]) - 1]}.${tmpArr[2]}.${tmpArr[0]}`
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
        showEditIndex: null,
        showDetailIndex: null
      })
    } else {
      this.setData({
        showEditIndex: id,
        showDetailIndex: id
      })
    }
  },
  // 短按原点显示完成样式
  overdueItem: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let id = e.target.dataset.id
    util.overDueItem(id, () => {
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
      this.data.list[index].status = this.data.list[index].status==1?0:1;
      this.setData({
        list: this.data.list
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
    let index = e.currentTarget.dataset.index
    var that = this
    wx.showModal({
      title: 'confirm',
      content: `确认删除该ToDo`,
      success: function (res) {
         util.delTodoItem(id, () => {
           that.data.list.splice(index, 1);
           that.setData({
             list: that.data.list
           })
           wx.showToast({
              title: '删除成功',
              icon: 'success'
           })
         })
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
    let obj = {
      title: this.data.dialogContent,
      is_notice: this.data.dialogIsNotice || 0,
      notice_time: this.data.notice_time || ''
    }
    console.log(this.data.notice_time);return false;
    util.addTodoItem(obj,() => {
      this.setData({
        dialogContent: null,
        isShowDialog: false
      })
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      })
    })
    console.log(this)
    
  },
  // 输入文本事件
  inputChange: function (e) {
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
      obj.addtime = this.data.date
      util.addTodoItem(obj, (res) => {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        this.closeDialog()
        this.getTodoList()
      })
    } else {
      obj.task_id = this.data.taskId
      util.editTodoItem(obj, (res) => {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        this.closeDialog()
        this.getTodoList()
      })
    }
    this.setData({
      dialogContent: null,
      formId: '',
      is_notice: 0,
      notice_time: ''
    })
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
      remindDate: e.detail.value.trim()
    })
  },
  remindTimeChange: function (e) {
    this.setData({
      remindTime: e.detail.value.trim()
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
