//获取应用实例
const app = getApp()
var latitude, longitude, address;
var baseUrl = "https://devapi.heweather.net/v7/weather/"
var lifeUrl = "https://devapi.heweather.net/v7/indices/"
var Key = "c8216c197e6049f3a4ff432524b06499"
Page({
  data: {
    userChoosedLocation: '手动选择位置',
    hasUserLocation: false,
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
  // 获取天气数据
  getWeatherData: function (that, address, latitude, longitude) {
    var that = that
    var address = address
    var latitude = latitude
    var longitude = longitude
    var url = baseUrl + "now?location=" + longitude + ',' + latitude + "&key=" + Key
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          var data = res.data
          var now = data.now
          // 更新时间
          var last_time_loc = data.updateTime
          let timeZone = last_time_loc.indexOf("+")
          last_time_loc = last_time_loc.replace("T"," ").slice(0,timeZone);
          // 风力级别
          if (now.windScale.indexOf('风') === -1) {
            now.windScale = now.windScale + '级'
          }
          // var basic = res.data.HeWeather6[0].basic
          // var update = res.data.HeWeather6[0].update
          // var lifestyle = res.data.HeWeather6[0].lifestyle
          // var hourly = res.data.HeWeather6[0].hourly
          // var forecast = res.data.HeWeather6[0].daily_forecast
          // var admin_area = basic.admin_area
          // var parent_city = basic.parent_city
          // var city = basic.location
          // now
          // var now_format = []
          // now_format.push(now)
          // if (now_format[0].wind_sc.indexOf('风') === -1) {
          //   now_format[0].wind_sc = now_format[0].wind_sc + '级'
          // }
          // // forecast
          // forecast[0].day = "今天"
          // forecast[1].day = "明天"
          // forecast[2].day = "后天"
          // // hourly
          // hourly = JSON.parse(JSON.stringify(hourly))
          // var hourly_format = [];
          // hourly.forEach(function (item) {
          //   hourly_format.push({
          //     'time': item.time.substring(11),
          //     'cond_code': item.cond_code,
          //     'tmp': item.tmp,
          //     'wind_dir': item.wind_dir,
          //     'wind_sc': (item.wind_sc.indexOf('风') === -1 ? item.wind_sc + '级' : item.wind_sc)
          //   })
          // })
          that.setData({
            update_loc: last_time_loc,
            now: now,
            // forecast: forecast,
            // hourly: hourly_format,
            // lifestyle: lifestyle,
            motto: 'Copyright © 2017-2020. Jason Lin'
          })
          // global
          // app.globalData.daily_forecast = forecast
          // app.globalData.lifestyle = lifestyle
          // if (address === null) {
          //   var autoLocation = city
          //   if (parent_city != city) {
          //     autoLocation = parent_city + '-' + autoLocation
          //   }
          //   if (admin_area != parent_city && admin_area != city) {
          //     autoLocation = admin_area + '-' + autoLocation
          //   }
          //   that.setData({
          //     userChoosedLocation: autoLocation,
          //     hasUserLocation: true
          //   })
          // }
        }else{
          wx.showToast({
            title: '数据请求失败',
            icon: 'loading',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      fail: function(){
        wx.showToast({
          title: '异常，请重启',
          icon: 'loading',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }
    }),
    wx.request({
      url: lifeUrl+"1d?location=" + longitude + ',' + latitude + "&key=" + Key+"&type=0",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code == '200'){
          let lifestyle = res.data.daily
          that.setData({
            lifestyle: lifestyle
          })
        }else{
          wx.showToast({
            title: '数据请求失败',
            icon: 'loading',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
      },
      fail: function(){
        wx.showToast({
          title: '异常，请重启',
          icon: 'loading',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      }
    })
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: 'Loading...',
    })
    if (app.globalData.userChoosedLocation && app.globalData.userChoosedLocation != '手动选择位置') {
      this.setData({
        userChoosedLocation: app.globalData.userChoosedLocation,
        hasUserLocation: true
      })
      this.getWeatherData(this, address, latitude, longitude)
    } else {
      wx.getLocation({
        success: res => {
          latitude = res.latitude
          longitude = res.longitude;
          address = null
          this.getWeatherData(that, address, latitude, longitude)
        },
        fail: function (res) {
          wx.showToast({
            title: '请授权位置',
            icon: 'loading',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
      })
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    if (app.globalData.hasUserLocation) {
      this.getWeatherData(this, address, latitude, longitude)
    } else {
      wx.getLocation({
        success: res => {
          latitude = res.latitude
          longitude = res.longitude;
          address = null
          this.getWeatherData(this, address, latitude, longitude)
        },
        fail: function (res) {
          wx.showToast({
            title: '请授权位置',
            icon: 'loading',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
      })
    }
  },
  bindLocation: function () {
    var that = this
    wx.chooseLocation({
      success: res => {
        latitude = res.latitude
        longitude = res.longitude
        address = res.address
        if (address.length > 18) {
          address = address.substring(0, 18)
          address = address + "..."
        }
        wx.showLoading({
          title: 'Loading...',
        })
        that.getWeatherData(that, address, latitude, longitude)
        that.setData({
          userChoosedLocation: address,
          hasUserLocation: true
        })
        app.globalData.userChoosedLocation=address
        app.globalData.hasUserLocation= true
      }
    })
  },
  week_forecast: function () {
    wx.navigateTo({
      url: '/pages/forecast/forecast'
    })
  },
  lifestyle: function () {
    wx.navigateTo({
      url: '/pages/lifestyle/lifestyle'
    })
  }
})