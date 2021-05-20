// miniprogram/pages/updataname/updataname.js
Page({
  data:{
    name:'',
    account:'',
    password:'',
    _fileID:'',
    _id:'',
    users:{}
  },
  //获取用户头像
  upload(){
    //把this赋值给that，就相当于that的作用域是全局的。
    let that = this;
    console.log("jaj");
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log("成功",res);
        
        that.uploadImage(res.tempFilePaths[0]);
      }
    })
  },
  uploadImage(fileURL) {
    wx.cloud.uploadFile({
      cloudPath:"user/"+new Date().getTime()+'.png', // 上传至云端的路径
      filePath: fileURL, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log("上传成功",res)
        this.data.users.fileID=res.fileID
        
        let fileID=res.fileID
        wx.setStorageSync('fileID',fileID)
        this.setData({
          fileID:fileID,
        })
        console.log("fileID",this)
        //获取文件路径
        console.log("",fileID)
        wx.setStorageSync('fileID',fileID)
        
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("userssss",this)
    console.log("this.data",this.data.users)
    if(options.id){
      const db = wx.cloud.database();
      db.collection("user").where({
        _id:options.id
      }).get({
        success:res=>{
          this.setData({
            users:res.data[0]//返回的是一个数组，取第一个
          })
        },fail:err=>{
          console.log(err)
        }
      })
    }
  },
//获取用户名
getName(event){
  console.log('获取输入的用户名',event.detail.value)

  this.data.users.name=event.detail.value
},
//获取用户账户
getaccount(event){
  console.log('获取输入的账户',event.detail.value)
  
  this.data.users.account=event.detail.value
},
//获取用户密码
getpassword(event){
  console.log('获取输入的密码',event.detail.value)
  this.data.users.password=event.detail.value
 
},
save(e){
  console.log("save",this)
  console.log("save",e)
  wx.setStorageSync('save', this.data)
  var save=wx.getStorageSync('save')
  console.log("saveee",save)
  const db = wx.cloud.database()
  db.collection("user").doc(save.users._id).update({
    data: {
      name:save.users.name,
        account:save.users.account,
        password:save.users.password,
        fileID:save.users.fileID
      
    }, success: res => {
      wx.showToast({
        title: '修改记录成功',
      })
      wx.reLaunch({
        url: '../login/login',
      })
    }, fail: err => {
      wx.showToast({
        title: '修改失败',
      })
    }
  })
  this.update()
},
update(){
 
  wx.setStorageSync('save', this.data)
  var save=wx.getStorageSync('save')
  var noteid=wx.getStorageSync('noteid')
  const db = wx.cloud.database()
  db.collection("topic").doc('noteid').update({
    data: {
      username:save.users.name,
        userfileID:save.users.fileID
      
    }, success: res => {
     
     
    }, fail: err => {
      wx.showToast({
        title: '修改失败',
      })
    }
  })
},
  
  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();


  },

})