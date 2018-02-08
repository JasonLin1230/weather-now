//获取应用实例
const app = getApp()
var latitude;
var longitude;
var tip_arr = ['建议着轻棉织物制作的短衣、短裙、短裤等服装','建议着棉麻面料的衬衫、薄长裙、薄T恤等服装','建议穿薄外套或牛仔裤等服装。','建议着厚外套加毛衣等服装。','建议着棉衣加羊毛衫等冬季服装。','建议着厚羽绒服等隆冬服装。'];
var Url = "https://free-api.heweather.com/s6/weather/now"
var ForeUrl ="https://free-api.heweather.com/s6/weather/forecast"
var Key = "c8216c197e6049f3a4ff432524b06499"
Page({
  data: {
    motto: 'Copyright © 2018.JasonLin',
    userChoosedLocation:'手动选择位置',
    hasUserLocation: false,
  },
  // 获取天气数据
  getWeatherData: function (that, address,latitude,longitude){
    var that=that
    var address=address
    var latitude=latitude
    var longitude=longitude
    var all_ready=false
    var foreurl = ForeUrl + "?location=" + longitude + ',' + latitude + "&key=" + Key
    var url = Url + "?location=" + longitude + ',' + latitude + "&key=" + Key
    wx.request({
      url: foreurl,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.HeWeather6[0].status == 'ok') {
          var forecast = res.data.HeWeather6[0].daily_forecast
          var cond_code_tomo=forecast[1].cond_code_d
          var cond_code_after = forecast[2].cond_code_d
          var cond_txt_tomo = forecast[1].cond_txt_d
          var cond_txt_after = forecast[2].cond_txt_d
          var tmp_tomo_max = forecast[1].tmp_max
          var tmp_after_max = forecast[2].tmp_max
          var tmp_tomo_min = forecast[1].tmp_min
          var tmp_after_min = forecast[2].tmp_min
          var cond_icon_tomo = '../../images/' + cond_code_tomo + '.png'
          var cond_icon_after = '../../images/' + cond_code_after + '.png'
          var tmp_tomo = tmp_tomo_min + '~' + tmp_tomo_max + '℃'
          var tmp_after = tmp_after_min + '~' + tmp_after_max + '℃'
          that.setData({
            cond_icon_tomo: cond_icon_tomo,
            cond_icon_after: cond_icon_after,
            cond_txt_tomo: cond_txt_tomo,
            cond_txt_after: cond_txt_after,
            tmp_tomo: tmp_tomo,
            tmp_after: tmp_after
          })
        }
        if(all_ready==true){
          wx.hideLoading()
        }
        all_ready=true
      }
    })
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
          var admin_area = basic.admin_area
          var parent_city = basic.parent_city
          var city = basic.location
          var cond_code = now.cond_code
          var cond_txt = now.cond_txt
          var tmp = now.tmp
          var hum = now.hum + '%'
          var last_time_loc = update.loc
          var cond_icon = '../../images/' + cond_code + '.png'
          var tip
          if (tmp > 28) {
            tip = tip_arr[0]
          } else if (tmp > 22) {
            tip = tip_arr[1]
          } else if (tmp > 18) {
            tip = tip_arr[2]
          } else if (tmp > 10) {
            tip = tip_arr[3]
          } else if (tmp > 0) {
            tip = tip_arr[4]
          } else {
            tip = tip_arr[5]
          }
          tmp = tmp + '℃'
          that.setData({
            update_loc: last_time_loc,
            cond_icon: cond_icon,
            cond_txt: cond_txt,
            tmp: tmp,
            hum: hum,
            tip: tip
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
              userChoosedLocation: autoLocation
            })
          }
        }
        if (all_ready == true) {
          wx.hideLoading()
        }
        all_ready = true
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
        var name = res.name
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
  }
})
