//获取应用实例
const app = getApp()
// const echarts = require("../../utils/echarts.simple.min.js");
var latitude;
var longitude;
var Url = "https://free-api.heweather.com/s6/weather"
var Key = "c8216c197e6049f3a4ff432524b06499"
Page({
  data: {
    motto: 'Copyright © 2018. Jason Lin',
    userChoosedLocation:'手动选择位置',
    hasUserLocation: false,
  },
  onShareAppMessage: function (res) {
    return {
      title: '实况天气',
      path: '/pages/index',
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
  // 获取天气数据
  getWeatherData: function (that, address,latitude,longitude){
    var that=that
    var address=address
    var latitude=latitude
    var longitude=longitude
    var url = Url + "?location=" + longitude + ',' + latitude + "&key=" + Key
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.HeWeather6[0].status == 'ok') {
          var basic = res.data.HeWeather6[0].basic
          var now = res.data.HeWeather6[0].now
          var update = res.data.HeWeather6[0].update
          var lifestyle = res.data.HeWeather6[0].lifestyle
          var hourly = res.data.HeWeather6[0].hourly
          var forecast = res.data.HeWeather6[0].daily_forecast
          var admin_area = basic.admin_area
          var parent_city = basic.parent_city
          var city = basic.location
          var last_time_loc = update.loc
          // now
          var now_format=[]
          now_format.push(now)
          if(now_format[0].wind_sc.indexOf('风')===-1){
            now_format[0].wind_sc = now_format[0].wind_sc + '级'
          }
          // forecast
          forecast[0].day = "今天"
          forecast[1].day = "明天"
          forecast[2].day = "后天"
          // hourly
          hourly = JSON.parse(JSON.stringify(hourly))
          var hourly_format = [];
          hourly.forEach(function (item) {
            hourly_format.push({
              'time': item.time.substring(11),
              'cond_code': item.cond_code,
              'tmp': item.tmp,
              'wind_dir': item.wind_dir,
              'wind_sc': (item.wind_sc.indexOf('风') === -1 ? item.wind_sc + '级' : item.wind_sc)
            })
          })
          that.setData({
            update_loc: last_time_loc,
            now: now_format,
            forecast: forecast,
            hourly: hourly_format,
            lifestyle: lifestyle
          })
          // global
          app.globalData.daily_forecast = forecast
          app.globalData.lifestyle = lifestyle
          if (address===null) {
            var autoLocation=city
            if(parent_city!=city){
              autoLocation=parent_city+'-'+autoLocation
            }
            if (admin_area != parent_city && admin_area!=city){
              autoLocation = admin_area+'-'+autoLocation
            }
            that.setData({
              userChoosedLocation: autoLocation,
              hasUserLocation: true
            })
          }
        }
        wx.hideLoading()
      }
    })
  },
  //事件处理函数
  onLoad: function () {
    var that=this
    wx.showLoading({
      title: 'Loading...',
    })
    if (app.globalData.userChoosedLocation && app.globalData.userChoosedLocation!='手动选择位置') {
      this.setData({
        userChoosedLocation: app.globalData.userChoosedLocation,
        hasUserLocation: true
      })
    } else {
      wx.getLocation({
        success: res => {
          latitude=res.latitude
          longitude = res.longitude;
          var address=null
          this.getWeatherData(that,address,latitude,longitude)
        },
        fail:function(res){
          wx.showToast({
            title: '请授权位置',
            icon: 'loading',
            duration: 2000
          })
        }
      })
    }
  },
  bindLocation: function () {
    var that = this
    wx.chooseLocation({
      success: res => {
        var latitude = res.latitude
        var longitude = res.longitude
        var address = res.address
        if (address.length > 18) {
          address = address.substring(0, 18)
          address = address + "..."
        }
        that.getWeatherData(that,address,latitude,longitude)
        that.setData({
          userChoosedLocation: address,
          hasUserLocation: true
        })
      }
    })
  },
  week_forecast: function(){
    wx.navigateTo({
      url: '/pages/forecast/forecast'
    })
  },
  lifestyle: function(){
    wx.navigateTo({
      url: '/pages/lifestyle/lifestyle'
    })
  }
})