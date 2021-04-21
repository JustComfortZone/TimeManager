// miniprogram/pages/login/login.js
Page({
  data:{
    account:'',
    password:''
  },
  //获取输入的用户账号
  getaccount(event){
    console.log('账号',event.detail.value)
    this.setData({
      account:event.detail.value
    })
  },
  //获取输入的用户密码
  getpassword(event){
    console.log('密码',event.detail.value)
    this.setData({
      password:event.detail.value
    })
  },
 
  //点击注册
  register(){
    wx.navigateTo({
      url: '../personal/personal',
    })
  },
   //点击登录
  login(){
    let account=this.data.account
    let password=this.data.password
    console.log('账号',account,'密码',password)
    //账号校验
    if(account.length<4){
      wx.showToast({
        icon:'none',
        title: '用户名至少4位',
      })
      return
    }
    //密码校验
    if(password.length<4){
      wx.showToast({
        icon:'none',
        title: '密码至少4位',
      })
      return
    }
    //登录
    wx.cloud.init()
    wx.cloud.database().collection('user').where({
      account:account
    }).get({
      success(res){
        console.log('获取数据成功',res)
        let user=res.data[0]
        console.log("user",user)
        if(res.data.length==0){
          console.log('用户不存在')
          wx.showToast({
            icon:'none',
            title: '账号不存在',
          })
        }
        
        if(password==user.password){
          console.log("登录成功")
          wx.showToast({
            title: '登录成功',
            
          })
          wx.reLaunch({
            url: '/pages/personal/personal',
          })
          // wx.navigateTo({
          //   url: '../home/home?name=' +user.name,
          // })
          
          //保存登录状态
          wx.setStorageSync('user', user)
        }else{
          console.log('登录失败')
          wx.showToast({
            icon:'none',
            title: '账号或密码不正确',
          })
        }
      },
      fail(res){
         console.log("获取数据失败",res)
      }
    })
  }

})