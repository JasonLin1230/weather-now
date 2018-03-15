import * as echarts from '../../ec-canvas/echarts.min';

let chart = null;

const app = getApp();

let dates = [];
let tmp_min = [];
let tmp_max = [];

function setOption(chart) {

  const option = {
    backgroundColor: "#fff",
    color: ["#C23531", "#2F4554"],

    legend: {
      top: 20,
      selectedMode: true,
      data: ['最高气温', '最低气温']
    },
    grid: {
      top: 100,
      left: '3%',
      right: '5%',
      containLabel: true
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} °C'
      }
    },
    series: [
      {
        name: '最高气温',
        type: 'line',
        data: tmp_max,
        markPoint: {
          data: [
            { type: 'max', name: '最大值' }
          ]
        }
      },
      {
        name: '最低气温',
        type: 'line',
        data: tmp_min,
        markPoint: {
          data: [
            { type: 'min', name: '最小值' }
          ]
        }
      }
    ]
  };
  chart.setOption(option);
}

Page({
  onLoad: function (){
    if (app.globalData.daily_forecast) {
      var forecast = JSON.parse(JSON.stringify(app.globalData.daily_forecast))
      if(dates == ''){
        forecast.forEach(function (item) {
          dates.push(item.date.substring(5))
          tmp_max.push(item.tmp_max)
          tmp_min.push(item.tmp_min)
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
