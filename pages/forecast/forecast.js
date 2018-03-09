// pages/forecast/forecast.js
const app = getApp()
Page({
  data: {
    motto: 'Copyright © 2018. Jason Lin'
  },
  onLoad: function () {
    if (app.globalData.daily_forecast) {
      var forecast = JSON.parse(JSON.stringify(app.globalData.daily_forecast))
      var forecast_format = [];
      forecast.forEach(function (item) {
        forecast_format.push({
          'date': item.date.substring(5),
          'cond_code_d': item.cond_code_d,
          'cond_code_n': item.cond_code_n,
          'cond_txt_d': item.cond_txt_d,
          'cond_txt_n': item.cond_txt_n,
          'tmp_max': item.tmp_max,
          'tmp_min': item.tmp_min,
          'wind_dir': item.wind_dir,
          'wind_sc': (item.wind_sc.indexOf('风') === -1 ? item.wind_sc + '级' : item.wind_sc)
        })
      })
      this.setData({
        forecast: forecast_format
      })
    }else{
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '实况天气',
      path: '/pages/index/index',
      imageUrl: '../../images/icon.png',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },
  temperature_line: function () {
    wx.navigateTo({
      url: '/pages/line/line'
    })
  },
})