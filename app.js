//app.js
const app = getApp()

const util = require('./utils/util')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        let { code } = res;
        this.getUserInfo(code);
        
      }
    })
    // 获取用户信息
    
  },
  getUserInfo: function (code) {
    
    var that = this
    wx.getSetting({
      success: res => {
        
        console.log(res)
        // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              let { encryptedData, iv} = res
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              let loginObj = {
                code,
                encryptedData,
                iv
              }
              console.log(loginObj)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // 调试先关掉login接口
              that.userInfoReadyCallback(loginObj)
              
            }
          })
        // } else {
          // wx.getUserInfo({
          //   success: res => {
          //     console.log(res);
          //     app.globalData.userInfo = res.userInfo
          //     this.setData({
          //       userInfo: res.userInfo,
          //       hasUserInfo: true
          //     })
          //     util.todoLogin(res)
          //   }
          // })
        // }
      }
    })
  },
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    token: null
  }
})