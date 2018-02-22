//获取应用实例
const app = getApp()
var latitude;
var longitude;
Page({
  data: {
    motto: 'Copyright © 2018. Jason Lin'
  },
  onShareAppMessage: function (res) {
    return {
      title: '实况天气',
      path: '/page/index',
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
  //事件处理函数
  onLoad: function () {
    var that=this
    // wx.showLoading({
    //   title: 'Loading...',
    // })
    if (app.globalData.userChoosedLocation) {
      this.setData({
        
      })
    } else {
      wx.getLocation({
        success: res => {
          latitude=res.latitude
          longitude = res.longitude;
        }
      })
    }
  }
})