// miniprogram/pages/mission/mission.js
import wxCharts from '../../utils/wxcharts'
import util from '../../utils/util'
const app = getApp()

var ringChart = null
var lineChart = null
var startPos = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 320,
    todosCount: 0,
    todosUncompletedCount: 0,
    todosCompletedCount: 0,

  },
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取系统消息
     try {
       var res = wx.getSystemInfoSync();
       this.data.windowWidth = res.windowWidth;
     } catch (e) {
       console.error('err: getSystemInfoSync failed!');
     }
     this.syncData()
      this.updateChartsA()


   },
 /**
   * 获取
   * todosCount总长度
   * todosUncompletedCount未完成的长度
   * todosCompletedCount已完成的长度check=true
   * 
   */
  syncData(){
    let that=this;
     var user=wx.getStorageSync('user')
    // console.log("user",user._id)
console.log("获取",that)
/**
   * todosCount总长度
   */
  wx.cloud.database().collection('todos').where({
    userid:user._id
  }).get({
    success(res){

      console.log("获取所有todo",res.data.length)
   
        that.setData({
          todosCount:res.data.length

        })
        }
      })
/**
   * todosUncompletedCount未完成的长度
   */
  wx.cloud.database().collection('todos').where({
     userid:user._id,
    checked:false
  }).get({
    success(res){
      console.log("获取未完成的todo",res.data.length)

        that.setData({
          todosUncompletedCount:res.data.length
        })
        }
      })
/**
   * todosCompletedCount已完成的长度
   */
    wx.cloud.database().collection('todos').where({
       userid:user._id,
      checked:true
    }).get({
      success(res){

        console.log("获取已完成的todo",res.data.length)
          that.setData({
            todosCompletedCount:res.data.length
          })
          }
        })
        this.updateChartsA()
  },

  // 任务完成率
  updateChartsA: function () {
  var todosCount=wx.getStorageSync('todosCount')
  var todosUncompletedCount=wx.getStorageSync('todosUncompletedCount')
  var todosCompletedCount=wx.getStorageSync('todosCompletedCount')
  console.log("全，未，已",todosCount,todosUncompletedCount,todosCompletedCount)
 
    ringChart && ringChart.updateData({
      title: {
        name: [Math.round((todosCompletedCount / todosCount) * 100), '%'].join('')
      },
      series: [{
        name: '进行中',
        data: todosUncompletedCount,
        stroke: false
      }, {
        name: '已完成',
        data: todosCompletedCount,
        stroke: false
      }]
    })
  },

  onReady() {
    this.renderChartsA()
  
  },

  onShow () {
    this.syncData()
  },

  renderChartsA() {
  var todosCount=wx.getStorageSync('todosCount')
  var todosUncompletedCount=wx.getStorageSync('todosUncompletedCount')
  var todosCompletedCount=wx.getStorageSync('todosCompletedCount')
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'chartsA',
      type: 'ring',
      extra: {
        ringWidth: 25,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: [Math.round((todosCompletedCount / todosCount) * 100), '%'].join(''),
        color: '#7cb5ec',
        fontSize: 25
      },
      subtitle: {
        name: '完成率',
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '进行中',
        data: todosUncompletedCount,
        stroke: false
      }, {
        name: '已完成',
        data: todosCompletedCount,
        stroke: false
      }],
      disablePieStroke: true,
      width: this.data.windowWidth,
      height: 200,
      dataLabel: false,
      legend: true,
      background: '#f5f5f5',
      padding: 0
    })
  },
onPullDownRefresh: function () {
  this.onShow();
  wx.stopPullDownRefresh();
},
})