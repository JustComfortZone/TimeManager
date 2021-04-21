// miniprogram/pages/todo/create.js
import util from '../../utils/util'
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levels: ['紧急且重要', '紧急不重要', '重要不紧急', '不紧急不重要'],
    level:'紧急且重要',
    tip:'0',
    checked:false,
    title:'',
    desc:'',
    date: util.formatDate(new Date),
    // title:'',
    // desc:'',
    // checked:''
  },
 /**
   * checked改变事件
   */
  handleToggle (e) {
   
    this.data.checked = !this.data.checked
    this.setData(this.data)
    console.log('checked', this.data.checked);
   
  },
  /**
   * 文字改变事件
   */
  handleTitleChange (e) {
   
    console.log('准备做什么', e.detail.value);
    this.setData({
      title: e.detail.value
    })
  },
  
  /**
   * 日期点击
   */
  handleDateClick (e) {
    console.info(e)
  },
/**
   * 时间选择器
   */
  handleDateChange (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      date: e.detail.value
    })
  },
/**
   * 级别改变事件
   */
  handleLevelChange(e) {
    console.log('picker级别选择改变，携带值为', this.data.levels[e.detail.value]);
    this.setData({
      level: this.data.levels[e.detail.value],
      tip:e.detail.value
    })
  },
/**
   * 描述输入事件
   */
  handleDescChange (e) {
    console.log('任务描述', e.detail.value);
    this.setData({
      desc: e.detail.value
    })
  },
/**
   * 取消按钮点击事件
   */
  handleCancelTap (e) {
    wx.navigateBack({
            
    })
  },
  /**
   * 保存按钮点击事件
   */
  handleSaveTap(e) {
    console.log("eee",this)
  
    if(this.data.title==''){
      wx.showToast({
        icon:'none',
        title: '请输入要做的事情',
        duration: 2000
      })
      return
    }
    var user=wx.getStorageSync('user')
    wx.cloud.init()
    var title=this.data.title;
    // var desc=this.data.desc;
    var date=this.data.date;
    var level=this.data.level;
    var checked=this.data.checked;
    var tip=this.data.tip;

    const db = wx.cloud.database()
        db.collection('todos').add({
          data:{
            title:title,
            // desc:desc,
            date:date,
            level:level,
            checked:checked,
            tip:tip,
            user:user,
            userid:user._id,
         
     
          },
          success(res){
            console.log('保存成功',res)
            wx.showToast({
              title: '保存成功',
            })
            wx.navigateBack({
            
            })
          },
          fail(res){
            console.log('保存失败',res)
            wx.showToast({
                      icon:'none',
                      title: '保存失败',
                    })
          }
        })
    
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
  onShow: function () {

  },

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

  }
})