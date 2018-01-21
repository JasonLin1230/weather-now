//获取应用实例
const app = getApp()
var latitude;
var longitude;
var tip_arr = ['建议着轻棉织物制作的短衣、短裙、短裤等服装','建议着棉麻面料的衬衫、薄长裙、薄T恤等服装','建议穿薄外套或牛仔裤等服装。','建议着厚外套加毛衣等服装。','建议着棉衣加羊毛衫等冬季服装。','建议着厚羽绒服等隆冬服装。'];
var Url = "https://free-api.heweather.com/s6/weather/now"
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
          tmp = tmp + '°C'
          that.setData({
            update_loc: last_time_loc,
            cond_icon: cond_icon,
            cond_txt: cond_txt,
            tmp: tmp,
            hum: hum,
            tip: tip
          })
          if (address===null) {
            that.setData({
              userChoosedLocation: parent_city + '，' + city
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
          console.log(latitude+','+longitude)
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
        console.log(latitude + ',' + longitude)
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
