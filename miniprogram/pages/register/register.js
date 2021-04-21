// miniprogram/pages/register/register.js
Page({
  data:{
    name:'',
    account:'',
    password:'',
    fileID:''
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
        let fileID=res.fileID
        console.log("fileID",fileID)
        //获取文件路径
        console.log("",fileID)
        wx.setStorageSync('fileID',fileID)
        this.setData({
          fileID:fileID,
        })
      },
      fail: console.error
    })
  },

  //获取用户名
  getName(event){
    console.log('获取输入的用户名',event.detail.value)
    this.setData({
      name:event.detail.value
    })
  },
  //获取用户账户
  getaccount(event){
    console.log('获取输入的账户',event.detail.value)
    this.setData({
      account:event.detail.value
    })
  },
  //获取用户密码
  getpassword(event){
    console.log('获取输入的密码',event.detail.value)
    this.setData({
      password:event.detail.value
    })
  },
  //注册
  register(){
    let name=this.data.name
    let account=this.data.account
    let password=this.data.password
    let fileID=this.data.fileID
    console.log("点击了注册")
    //校验用户名
    if(name.length<4){
      wx.showToast({
        icon:'none',
        title: '用户名至少4位',
      })
      return
    }
    if(name.length>10){
      wx.showToast({
        icon:'none',
        title: '用户名最多10位',
      })
      return
    }
     //校验密码
     if(password.length<4){
      wx.showToast({
        icon:'none',
        title: '密码至少4位',
      })
      return
    }

    //注册功能的实现
    wx.cloud.database().collection('user').add({
      data:{
        name:name,
        account:account,
        password:password,
        fileID:fileID
      },
      success(res){
        console.log('注册成功',res)
        wx.showToast({
          title: '注册成功',
        })
        wx.navigateTo({
          url: '../login/login',
        })
      },
      fail(res){
        console.log('注册失败',res)
        wx.showToast({
                  icon:'none',
                  title: '账号已存在',
                })
        
      }
    })
  }
})