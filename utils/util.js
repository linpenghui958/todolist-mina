const prefix = 'https://todo.linph.cc';

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Noc', 'Dec']

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTopBarTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${monthList[month]}.${day}.${year}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const todoLogin = () => {
  wx.request({
    url: prefix + '/api/v1/auth',
    method: 'POST',
    success: function (data, statusCode) {
      console.log(data)
    }
  })
}

const getUserInfo = () => {
  wx.getUserInfo({
    success: res => {
      app.globalData.userInfo = res.userInfo
      app.globalData.hasUserInfo = true
    }
  })
}

module.exports = {
  formatTime: formatTime,
  todoLogin: todoLogin,
  formatTopBarTime: formatTopBarTime,
  monthList
}
