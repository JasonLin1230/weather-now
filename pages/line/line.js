import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

let dates = [];
let tempMin = [];
let tempMax = [];

function initChart(canvas,width,height,dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  const option = { 
    animation: false,
    backgroundColor: "#fff",
    color: ["#FF6325", "#3880FE"],
    grid: {
      top: 45,
      left: '1%',
      right: '1%',
      bottom: 45
    },
    xAxis: {
      type: 'category',
      show: false,
      data: dates
    },
    yAxis: {
      show:false,
      type: 'value',
      min: 'dataMin'
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: tempMax,
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: "{c} °C"
          }
        }
      },
      {
        type: 'line',
        smooth: true,
        data: tempMin,
        label: {
          normal: {
              show: true,
              position: 'bottom',
              formatter: "{c} °C"
            }
        }
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

Page({
  onLoad: function (){
    if (app.globalData.daily_forecast) {
      let forecast = app.globalData.daily_forecast
      dates = [];
      tempMin = [];
      tempMax = [];
      forecast.forEach(function (item) {
        item.date = item.fxDate.slice(5)
        item.windScale = (item.windScaleDay.indexOf('风') === -1 ? item.windScaleDay + '级' : item.windScaleDay)
        dates.push(item.fxDate)
        tempMax.push(item.tempMax)
        tempMin.push(item.tempMin)
      })
      this.setData({
        forecast: forecast
      })
    } else {
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
  onReady: function () {
  },
  data: {
    ec: {
      onInit: initChart,
    },
    motto: 'Copyright © 2017-2020. Jason Lin'
  }
});
