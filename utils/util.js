const app = getApp()

const prefix = 'https://todo.linph.cc';
const config = require('./config');

const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Noc', 'Dec']
const weekList = [ '星期日', '星期一', '星期二', '星期三','星期四', '星期五','星期六']

const month_days = (year) => {
  //  1月     2月                 3月  4月 5月 6月 7月 8月 9月 10月11月12月
  return [31, 28 + _isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}

// 是否闰年
const _isLeapYear = (year) => {
  return (((year % 4) === 0 ) && ((year % 100) !== 0)) || (((year % 100) === 0) && ((year % 400) === 0))
}

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

  return `${monthList[month - 1]}.${day}.${year}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const todoLogin = (params, fn) => {
  wx.request({
    url: prefix + '/api/login',
    method: 'POST',
    data: params,
    dataType: 'json',
    success: function (res) {
      fn(res)
    }
  })
}

const getTodoList = (date, fn) => {
  wx.request({
    url: prefix + '/api/' + date,
    header: {
      'Authorization': `Bearer ${getApp().globalData.token}`
    },
    method: 'GET',
    success: function (res) {
      if (res.data.code === config.ERR_NODATA) {
        wx.showToast({
          title: '当天好像没数据~',
          icon: 'none'
        })
        fn(res)
      } else if (res.data.code === config.ERR_OK) {
        fn(res)
      } else if (res.data.code === config.ERR_SERVER) {
        wx.showToast({
          title: '服务器好像开小差了~',
          icon: 'none'
        })
      }
    }
  })
}

const endDate = (date) => {
  if (!!date) {
    var arr = date.split('-')
    var year = parseInt(arr[0])
    var month = parseInt(arr[1])
    var days = parseInt(arr[2])
    var monthLength = month_days(year)[month - 1]
    var sevenDayLater = days + 7
    
    // 判断7天后是否超出当年，超出当年
  } else {
    let newDate = new Date()
    var year = newDate.getFullYear()
    var month = newDate.getMonth() + 1
    var days = newDate.getDate()
    var monthLength = month_days(year)[month - 1]
    var sevenDayLater = days - 0 + 7
    // if (sevenDayLater > monthLength) {
    //   let nextMonthDay = sevenDayLater - monthLength
    //   if (month == 12) {
    //     return `${year + 1}-1-${nextMonthDay}`
    //   }
    //   return `${year}-${month + 1}-${nextMonthDay}`
    // } 

    // return `${year}-${month}-${sevenDayLater}`
  }
  if (sevenDayLater > monthLength) {
    let nextMonthDay = sevenDayLater - monthLength
    if (month == 12) {
      return `${year + 1}-1-${nextMonthDay}`
    }
    return `${year}-${month + 1}-${nextMonthDay}`
  } 

  return `${year}-${month}-${sevenDayLater}`
}
const startDate = () => {
  var date = new Date()
  var year = date.getFullYear()
  var month = formatNumber(date.getMonth() + 1)
  var day = formatNumber(date.getDate())
  return `${year}-${month}-${day}`
}

const addTodoItem = (params, fn) => {
  let obj = {}
  for (var i in params) {
    if (params[i] == null) {
      continue;
    }
    obj[i] = params[i]
  }
  wx.request({
    url: prefix + '/api/task/add',
    data: obj,
    header: {
      'Authorization': `Bearer ${getApp().globalData.token}`
    },
    method: 'POST',
    success: function (res) {
      if (res.data.code === config.ERR_NODATA) {
        wx.showToast({
          title: '当天好像没数据~',
          icon: 'none'
        })
        fn(res)
      } else if (res.data.code === config.ERR_OK) {
        fn(res)
      } else if (res.data.code === config.ERR_SERVER) {
        wx.showToast({
          title: '服务器好像开小差了~',
          icon: 'none'
        })
      }
    }
  })
}
const editTodoItem = (params, fn) => {
  let obj = {}
  for (var i in params) {
    if (params[i] == null) {
      continue;
    }
    obj[i] = params[i]
  }
  wx.request({
    url: prefix + '/api/task/edit',
    data: obj,
    header: {
      'Authorization': `Bearer ${getApp().globalData.token}`
    },
    method: 'POST',
    success: function (res) {
      if (res.data.code === config.ERR_NODATA) {
        wx.showToast({
          title: '当天好像没数据~',
          icon: 'none'
        })
        fn(res)
      } else if (res.data.code === config.ERR_OK) {
        fn(res)
      } else if (res.data.code === config.ERR_SERVER) {
        wx.showToast({
          title: '服务器好像开小差了~',
          icon: 'none'
        })
      }
    }
  })
}

const delTodoItem = (id, fn) => {
  wx.request({
    url: prefix + '/api/task/del',
    data: {
      task_id: id
    },
    header: {
      'Authorization': `Bearer ${getApp().globalData.token}`
    },
    method: 'POST',
    success: function (res) {
      if (res.data.code === config.ERR_NODATA) {
        wx.showToast({
          title: '当天好像没数据~'
        })
        fn(res)
      } else if (res.data.code === config.ERR_OK) {
        fn(res)
      } else if (res.data.code === config.ERR_SERVER) {
        wx.showToast({
          title: '服务器好像开小差了~'
        })
      }
    }
  })
}

const overDueItem = (id, fn) => {
  wx.request({
    url: prefix + '/api/task/do/' + id,
    header: {
      'Authorization': `Bearer ${getApp().globalData.token}`
    },
    method: 'POST',
    success: function (res) {
      fn(res)
    }
  })
}

const getUserInfo = () => {
  wx.getUserInfo({
    success: res => {
      console.log(res);
      app.globalData.userInfo = res.userInfo
      app.globalData.hasUserInfo = true
    }
  })
}

module.exports = {
  formatTime: formatTime,
  todoLogin: todoLogin,
  formatTopBarTime: formatTopBarTime,
  monthList,
  getTodoList,
  endDate,
  startDate,
  addTodoItem,
  overDueItem,
  editTodoItem,
  delTodoItem,
  formatNumber,
  weekList
}
