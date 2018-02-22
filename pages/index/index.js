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
          var admin_area = basic.admin_area
          var parent_city = basic.parent_city
          var city = basic.location
          // now
          var cond_code = now.cond_code
          var cond_txt = now.cond_txt
          var tmp = now.tmp + '℃'
          var hum = now.hum + '%'
          var wind_dir = now.wind_dir
          var wind_sc = now.wind_sc
          if(wind_sc.indexOf('风')===-1){
            wind_sc = wind_sc + '级'
          }
          var fl = now.fl + '℃'
          var vis = now.vis + 'km'
          var pres = now.pres + 'mb'

          var last_time_loc = update.loc
          var cond_icon = '../../images/' + cond_code + '.png'
          var forecast = res.data.HeWeather6[0].daily_forecast
          // forecast
          var cond_code_today = forecast[0].cond_code_d
          var cond_code_tomo = forecast[1].cond_code_d
          var cond_code_after = forecast[2].cond_code_d
          var cond_txt_today = forecast[0].cond_txt_d
          var cond_txt_tomo = forecast[1].cond_txt_d
          var cond_txt_after = forecast[2].cond_txt_d
          var tmp_today_max = forecast[0].tmp_max
          var tmp_tomo_max = forecast[1].tmp_max
          var tmp_after_max = forecast[2].tmp_max
          var tmp_today_min = forecast[0].tmp_min
          var tmp_tomo_min = forecast[1].tmp_min
          var tmp_after_min = forecast[2].tmp_min
          var cond_icon_today = '../../images/' + cond_code_today + '.png'
          var cond_icon_tomo = '../../images/' + cond_code_tomo + '.png'
          var cond_icon_after = '../../images/' + cond_code_after + '.png'
          var tmp_today = tmp_today_min + '~' + tmp_today_max + '℃'
          var tmp_tomo = tmp_tomo_min + '~' + tmp_tomo_max + '℃'
          var tmp_after = tmp_after_min + '~' + tmp_after_max + '℃'
          // lifestyle
          var comf = lifestyle[0].brf
          var drsg = lifestyle[1].brf
          var flu = lifestyle[2].brf
          var sport = lifestyle[3].brf
          var trav = lifestyle[4].brf
          var uv = lifestyle[5].brf
          var cw = lifestyle[6].brf
          var air = lifestyle[7].brf
          that.setData({
            update_loc: last_time_loc,
            cond_icon: cond_icon,
            cond_txt: cond_txt,
            tmp: tmp,
            hum: hum,
            wind_dir: wind_dir,
            wind_sc: wind_sc,
            fl: fl,
            vis: vis,
            pres: pres,

            cond_icon_today: cond_icon_today,
            cond_icon_tomo: cond_icon_tomo,
            cond_icon_after: cond_icon_after,
            cond_txt_today: cond_txt_today,
            cond_txt_tomo: cond_txt_tomo,
            cond_txt_after: cond_txt_after,
            tmp_today: tmp_today,
            tmp_tomo: tmp_tomo,
            tmp_after: tmp_after,

            comf: comf,
            drsg: drsg,
            flu: flu,
            sport: sport,
            trav: trav,
            uv: uv,
            cw: cw,
            air: air
          })
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
    wx.showToast({
      title: '本功能将在小程序支持echarts后上线',
      icon: 'none',
      duration: 2000
    })
  },
  lifestyle: function(){
    wx.navigateTo({
      url: '/pages/lifestyle/lifestyle'
    })
  }
})