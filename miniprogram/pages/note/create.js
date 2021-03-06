// miniprogram/pages/note/create.js
var that
const db = wx.cloud.database();
var dateA = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    content: '',
    images: [],
    user: {},
    username:"",
    userfileID:"",
    max: 300,
    isLike: false,
  },
  getValueLength: function (e) {
    let value = e.detail.value
    let len = parseInt(value.length)
    
    //最多字数限制
    if (len > 300) return;
    this.setData({
      currentWordNumber: len //当前字数 
    })
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    that = this
    that.jugdeUser();
  },
  /**
   * 获取填写的内容
   */
  getTextAreaContent: function(event) {
    that.data.content = event.detail.value;
  },

  /**
   * 选择图片
   */
  chooseImage: function(event) {
    wx.chooseImage({
      count: 6,
      success: function(res) {
        // 设置图片
        that.setData({
          images: res.tempFilePaths,
        })
        that.data.images = []
        console.log(res.tempFilePaths)
        for (var i in res.tempFilePaths) {
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
            // 指定要上传的文件的小程序临时文件路径
            cloudPath: that.timetostr(new Date()),
            filePath: res.tempFilePaths[i],
            // 成功回调
            success: res => {
              that.data.images.push(res.fileID)
            },
          })
        }
      },
    })
  },
  /**
   * 图片路径格式化
   */
  timetostr(time){
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var str = randnum +"_"+ time.getMilliseconds() + ".png";
    return str;
  },

  /**
   * 保存
   */
  formSubmit: function(e) {
    console.log(that)
    console.log('图片：', that.data.images)

    this.data.content = e.detail.value['input-content'];
    if (this.data.canIUse) {
      if (this.data.images.length > 0) {
        this.saveDataToServer();
      } else if (this.data.content.trim() != '') {
        this.saveDataToServer();
      } else {
        wx.showToast({
          icon: 'none',
          title: '写点东西吧',
        })
      }
    } else {
      this.jugdeUser();
    }

  },
  /**
   * 保存到发布集合中
   */
  saveDataToServer: function(event) {
   
    db.collection('topic').add({
      // data 字段表示需新增的 JSON 数据
      
      data: {
        content: that.data.content,
        date: that.GetCurrentTime(),
        images: that.data.images,
        userid:that.data.user._id,
        username:that.data.user.name,
        userfileID:that.data.user.fileID,
        isLike: that.data.isLike,
      },
      success: function(res) {
        
        // 清空数据
        that.data.content = "";
        that.data.images = [];

        that.setData({
          textContent: '',
          images: [],
        })

        that.showTipAndSwitchTab();

      },
    })
  },

  GetCurrentTime:function(){
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
  /**
   * 添加成功添加提示，切换页面
   */
  showTipAndSwitchTab: function(event) {
    wx.showToast({
      title: '新增记录成功',
    })
    wx.redirectTo({
      url: '/pages/note/index'
    })
  },
  /**
   * 删除图片
   */
  removeImg: function(event) {
    var position = event.currentTarget.dataset.index;
    this.data.images.splice(position, 1);
    // 渲染图片
    this.setData({
      images: this.data.images,
    })
  },
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.images[index],
      //所有图片
      urls: this.data.images
    })
  },

  /**
   * 添加到发布集合中
   */
  


  /**
   * 判断用户是否登录
   */
  jugdeUser: function(event) {
 
    var user=wx.getStorageSync('user')
    console.log("user",user)
    this.setData({
      user:user,
      userid:user._id
    })

  },
 
 
})