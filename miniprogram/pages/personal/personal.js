// miniprogram/pages/personal/personal.js
import wxCharts from '../../utils/wxcharts'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID:"",
    todosCount: 0,
    todosUncompletedCount: 0,
    todosCompletedCount: 0,
    completedCount:0,
    UncompletedCount:0,
  },
  



  syncData () {
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
      wx.setStorageSync("todosCount", res.data.length)
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
    
          wx.setStorageSync("todosUncompletedCount", res.data.length)
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
      wx.setStorageSync("todosCompletedCount", res.data.length)
      wx.setStorageSync("CompletedTodos", res.data)
            console.log("获取已完成的todo",res.data.length)
              that.setData({
                todosCompletedCount:res.data.length
              })
              }
            })

    // update
    this.update()
  },
  update(data) {
    data = data || this.data
    this.setData(data)
    
  },
  onShow () {
    this.syncData()

    let user=wx.getStorageSync('user')
    if(user&&user.name){
      
      const db = wx.cloud.database();
      db.collection("user").where({
        _id:user._id
      }).get({
        success:res=>{
          console.log("rrrrrrrr",res)
          wx.setStorageSync('name', res.data[0].name)
          wx.setStorageSync('fileID', res.data[0].fileID)
          this.setData({
            name:res.data[0].name,
        fileID:res.data[0].fileID,
        _id:user._id
          })
        },fail:err=>{
          console.log(err)
        }
      })

    

    }

  },
  updataname:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/updataname/updataname?id='+id,
    })
 },
  toDiary(){
    wx.navigateTo({
      url: '/pages/note/index',
    })
  },
  toMbook(){
    wx.navigateTo({
      url: '/pages/mbook/mbook',
    })
  },
  
  toMytomato(){
  wx.navigateTo({
    url: '/pages/mytomato/mytomato',
  })
  },
  toDay(){
    wx.navigateTo({
      url: '/pages/day/day',
    })
    },
  toMission(){
      wx.navigateTo({
        url: '/pages/mission/mission',
      })
   },

   
  
  linkToTodos() {
    wx.switchTab({ url: '../todo/index' })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //退出登录
  tuichu(){
    wx.setStorageSync('user', null)
    let user=wx.getStorageSync('user')
    if(user&&user.name){
      this.setData({
        name:user.name,
        fileID:user.fileID
      })
    }else{
      wx.reLaunch({
        url: '../login/login',
      })
    }
  }
})