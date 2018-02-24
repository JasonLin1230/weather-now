//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Copyright © 2018. Jason Lin'
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
  //事件处理函数
  onLoad: function () {
    if (app.globalData.lifestyle) {
      this.setData({
        lifestyle: app.globalData.lifestyle
      })
    } else {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
})