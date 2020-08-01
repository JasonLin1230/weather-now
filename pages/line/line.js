import * as echarts from '../../ec-canvas/echarts.min';

let chart = null;

const app = getApp();

let dates = [];
let tempMin = [];
let tempMax = [];

function setOption(chart) {

  const option = {
    backgroundColor: "#fff",
    color: ["#C23531", "#2F4554"],

    grid: {
      top: 40,
      left: '1%',
      right: '2%',
      bottom: 40
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
}

Page({
  onLoad: function (){
    if (app.globalData.daily_forecast) {
      let forecast = app.globalData.daily_forecast
      if(dates.length == 0){
        forecast.forEach(function (item) {
          dates.push(item.fxDate.slice(5))
          tempMax.push(item.tempMax)
          tempMin.push(item.tempMin)
        })
      }
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
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });
    });
  },

  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    isLoaded: false,
    isDisposed: false
  },

  dispose: function () {
    if (this.chart) {
      this.chart.dispose();
    }

    this.setData({
      isDisposed: true
    });
  }
});
