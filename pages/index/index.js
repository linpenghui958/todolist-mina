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
    date: '2018-03-28',
    showDate: '',
    isShowDialog: false,
    showEditIndex: null,
    list: [
      {id: 1, title: '1今天晚上十点邀请zzz一起去图书馆借叔叔叔叔叔叔叔叔叔叔叔叔1'},
      {id: 2, title: '2今天晚上十点邀请zzz一起去图书馆借叔叔叔叔叔叔叔叔叔叔叔叔1'},
      {id: 3, title: '3今天晚上十点邀请zzz一起去图书馆借叔叔叔叔叔叔叔叔叔叔叔叔1'}
    ],
    animationData: {}
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
          app.globalData.token = res.data.token
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          util.todoLogin(res)
        }
      })
    }
    this.getDate()
  },
  getDate: function () {
    var date = new Date()
    date = util.formatTopBarTime(date)
    this.setData({
      showDate: date
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
  tabEdit: function (e) {
    let id = e.target.dataset.id
    if (this.data.showEditIndex === id) {
      var animation = wx.createAnimation({
        duration: 600,
        timingFunction: "ease",
        delay: 0
      })
      animation.height(90)
      this.setData({
        animationData:animation.export()
      })
      this.setData({
        showEditIndex: null
      })
    } else {
      this.setData({
        showEditIndex: id
      })
    }
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
  }
})
