// miniprogram/pages/day/day.js
import wxCharts from '../../utils/wxcharts'
import util from '../../utils/util'
const app = getApp()

var ringChart = null
var lineChart = null
var startPos = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 320,
        todosCount: 0,
        todosUncompletedCount: 0,
        todosCompletedCount: 0,
    CompletedTodos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 // 获取系统消息
     try {
         var res = wx.getSystemInfoSync();
         this.data.windowWidth = res.windowWidth;
  console.log("windows",this.data)
       } catch (e) {
         console.error('err: getSystemInfoSync failed!');
       }
  this.syncData()
  this.updateChartsB()
  },

  syncData(){
    let that=this
    var todosCount=wx.getStorageSync('todosCount')
    that.setData({todosCount:todosCount})
    
    var todosUncompletedCount=wx.getStorageSync('todosUncompletedCount')
    that.setData({todosUncompletedCount:todosUncompletedCount})

    var todosCompletedCount=wx.getStorageSync('todosCompletedCount')
    that.setData({todosCompletedCount:todosCompletedCount})

    // var CompletedTodos=wx.getStorageSync('CompletedTodos')
    // console.log("CompletedTodos",CompletedTodos)
/**
   * todosCompletedCount已完成的data
   */
var user=wx.getStorageSync('user')
    wx.cloud.database().collection('todos').where({
         userid:user._id,
        checked:true
      }).get({
        success(res){
   
    wx.setStorageSync("CompletedTodos", res.data)
          console.log("获取已完成的todo",res.data)
            
            }
          })
    this.updateChartsB()
    console.log("this",this)
    
  },
//每日完成量
  updateChartsB: function () {

    console.log("任务完成率B",this)
    var chartsData = this.getChartsBData()
    console.log("........",chartsData)
    lineChart && lineChart.updateData({
      categories: chartsData.categories,
      series: [{
        name: '任务完成量',
        data: chartsData.data,
        format: function (val, name) {
          return [val, '个'].join('')
        }
      }]
    })
  },
  getChartsBData() {
    var categories = [];
    var data = [];
    console.log("hhhhhhhhhh",statistics)
    let statistics = this.getStatisticsByDate()
    console.log("hhhhhhhhhh",statistics)
    statistics.forEach((item) => {
      categories.push(item.completedAt)
      data.push(item.count)
      console.log("getChartsBData",item)
    })
    return {
      categories: categories,
      data: data
    }
  },
  getStatisticsByDate () {
    console.log("getStatisticsByDate",this)
    console.log("getStatisticsByDate",this.data.CompletedTodos)
 var CompletedTodos=wx.getStorageSync('CompletedTodos')
    console.log("user",CompletedTodos)
      let result = []
      let todos = CompletedTodos
      console.log("this.data.CompletedTodos",this.data.CompletedTodos)
      let temp = {}
     
      todos.forEach(function(item) {
        temp[item.date] = temp[item.date] ? temp[item.date] + 1 : 1
      })

      for (let key in temp) {
        result.push({
          completedAt: key,
          count: temp[key]
        })
      }
      result = result.sort((a, b) => (a.completedAt > b.completedAt))
      return result
    
  },
  onReady() {
   
    this.renderChartsB()
  },

  onShow () {
    this.syncData()
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  
  renderChartsB () {
    var chartsData = this.getChartsBData()
    lineChart = new wxCharts({
      canvasId: 'chartsB',
      type: 'line',
      categories: chartsData.categories,
      animation: true,
      series: [{
        name: '任务完成量',
        data: chartsData.data,
        format: function (val, name) {
          return [val, '个'].join('')
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '完成数量 (个)',
        format: function (val) {
          return val;
        },
        min: 0
      },
      width: this.data.windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();
  },
})