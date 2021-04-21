// miniprogram/pages/note/detail.js
var that
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    id: '',
    openid: '',
    isLike: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    that = this;
    that.data.id = options.id;
    that.data.openid = options.openid;
    // 获取日记信息
    db.collection('topic').doc(that.data.id).get({
      success: function(res) {
        that.data.topics = res.data;
        that.setData({
          topic: that.data.topics,
        })
      }
    })

    

  },

  onShow: function() {
  
  },


 
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;

    wx.previewImage({
      //当前显示图片
      current: this.data.topic.images[index],
      //所有图片
      urls: this.data.topic.images
    })
  },

  GetCurrentTime: function () {
    var now = new Date();
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();            //秒  
    dateA = year + "年";
    if (month < 10) dateA += "0";
    dateA += month + "月";
    if (day < 10) dateA += "0";
    dateA += day + "日 ";
    if (hh < 10) dateA += "0";
    dateA += hh + ":";
    if (mm < 10) dateA += '0';
    dateA += mm + ":";
    if (ss < 10) dateA += '0';
    dateA += ss;
    return (dateA);
  },






})