// miniprogram/pages/note/index.js
const app = getApp()
var that
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 5,
    totalCount: 0,
    topics: {},
    _button:"",
    notename:"",
    notefileID:""

  },
  Topublish:function(){
    wx.redirectTo({
      url: '/pages/note/create'
    })
  },
  delete_content: function (event){
    var id = event.currentTarget.dataset.topicid;//获取删除的id
    console.log(id);
    if (id) {
      const db = wx.cloud.database()
      db.collection('topic').doc(id).remove({
        success: function (res){
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
            count: null,
          })
        },
        fail: function (res){
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.getData(that.data.page);
    console.log(that.data.page)

  },
  /**
   * 获取列表数据
   * 
   */
  getData: function (page) {
    // 获取总数
    db.collection('topic').count({
      success: function (res) {
        that.data.totalCount = res.total;
       
     
      }
    })
    // 获取数据
    try {
      var user=wx.getStorageSync('user')
      that.setData({
        notefileID:user.fileID,
        notename:user.name
      })
      // that.data.notefileID=user.fileID
      // that.data.notename=user.name
      console.log("notemenenne",that)
      db.collection('topic')
        .where({
          userid: user._id, // 填入当前用户 openid
        })

        .orderBy('date', 'desc')
        .get({
          success: function (res) {
            that.data.topics = res.data;
           
            for(var i=0;i<res.data.length;i++){
              if (res.data[i].isDelete) {
                console.log(res.data[i].isDelete)
                that.setData({
                  _button: "已被删除"
                })
              } else {
                that.setData({
                  _button: "删 除"

                })
              }

            }
            that.setData({
              topics: that.data.topics,
            })
            
            
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();

          },
          fail: function (event) {
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading();//隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
   
  },
  /**
   * item 点击
   */
  onItemClick: function (event) {
    var id = event.currentTarget.dataset.topicid;
    console.log(id);
    wx.navigateTo({
      url: "../note/detail?id=" + id
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log('pulldown');
    that.getData(that.data.page);
  },


 
})