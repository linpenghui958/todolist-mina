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
    overdueIndex: null,
    list: [
      {id: 1, title: '1今天晚上十点邀请zzz一起去图书馆借叔叔叔叔叔叔叔叔叔叔叔叔1'},
      {id: 2, title: '2今天晚上十点邀请zzz一起去图书馆借叔叔叔叔叔叔叔叔叔叔叔叔1'},
      {id: 3, title: '3今天晚上十点邀请zzz一起去图书馆借叔叔叔叔叔叔叔叔叔叔叔叔1'}
    ],
    dialogContent: '',
    startDate: null,
    endDate: null
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
          // console.log(that)
          util.getTodoList(that.data.date, function (res) {
            console.log(res)
          })
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
  getDate: function () {
    var date = new Date()
    var endDate = util.endDate()
    var formDate = util.formatTopBarTime(date)
    this.setData({
      showDate: formDate,
      startDate: date,
      endDate: endDate
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
    if (this.data.overdueIndex === id) {
      this.setData({
        overdueIndex: null
      })
    } else {
      this.setData({
        overdueIndex: id
      })
    }
  },
  // 短按编辑item
  editItem: function (e) {
    let {title, id} = e.target.dataset
    this.setData({
      dialogContent: title
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
      dialogContent: null,
      isShowDialog: true
    })
  }
})
