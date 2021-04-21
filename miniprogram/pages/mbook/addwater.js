// miniprogram/pages/mbook/addwater.js
var util = require('../../utils/util.js');

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mark:'',
    _id: '',
    nav_color1: '',
    nav_color2: '',
    money: '',
    tag_action_color: "",
    remark: '',
    type:'',
    iconlist: {},
    date: util.formatDate(new Date),
    tag_action_id: 0,
    tag_action_color: "",

    iconArr:[
      {
        icon: 'chihe',
        text: '吃喝'
      },
      {
        icon: 'yiliao',
        text: '医疗'
      },
      {
        icon: 'fushi',
        text: '服饰'
      },
      {
        icon: 'meirong',
        text: '美容'
      },
      
      {
        icon: 'yule',
        text: '娱乐'
      },
      {
        icon: 'riyong',
        text: '日用'
      },
      {
        icon: 'fangzu',
        text: '房租'
      },
      {
        icon: 'jiaotong',
        text: '交通'
      },
      {
        icon: 'hongbao',
        text: '红包'
      },
      {
        icon: 'licai',
        text: '理财'
      },
      {
        icon: 'gongzi',
        text: '工资'
      },{
        icon: 'qita',
        text: '其他'
      }
    ],
    title_icon:'',
    title_text:''
  },

//请求id


  clickIcon:function(e){
    
    console.log(e)
    var i=e.currentTarget.dataset.index;
    console.log(i)
    console.log(this)
    console.log(this.data.iconArr[i].icon)
     this.setData({
      title_icon:this.data.iconArr[i].icon,
      title_text:this.data.iconArr[i].text
     })
    
    
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  
  },
  // 点击菜单
  jizhangmenu: function (e) {
    var obj = this;
    console.log("e",e)
    console.log("this",this)
    var item = e.target.dataset.item;
    console.log(item)
    if (item == 1) {
      obj.setData({
        nav_color1: '',
        nav_color2: 'nav-active',
        type:'收入',
        mark:'+'
      })
    } else {
      obj.setData({
        nav_color1: 'nav-active',
        nav_color2: '',
        type:'支出',
        mark:'-'
      })
    }
    console.log('选择菜单', item)
    //console.log(type)
  },
  



  // 保存
  formSubmit: function (e) {
   
    var obj = this;
  
    // 参数
    console.log("obj",obj)
    console.log("title_text",obj.data.title_text)
    var info = e.detail.value;
    var bool = true;
    
    // 按钮属性
   // var _btnsive = e.detail.target.dataset.btn;
   // var formid = e.detail.formId;
    var money=e.detail.value.money;
    var remark=e.detail.value.remark;
    var date=e.detail.value.date;
    var title_text=obj.data.title_text;
    var title_icon=obj.data.title_icon;
    var type=obj.data.type;
    var mark=obj.data.mark;

    //console.log("formid",formid);
    if (info.money == "") {
      bool = false;
      wx.showToast({
        icon:'none',
        title: '请记录金额',
        duration: 2000
      });
      return
    }
    if(obj.data.title_text == ""){
      bool = false;
      wx.showToast({
        icon:'none',
        title: '请选择类型',
      });
      return
    }
    if (bool) {

      // ///////////////////////
      console.log("value",e.detail.value);
      wx.cloud.init()
      var user=wx.getStorageSync('user')
      wx.cloud.database().collection('zhangben').add({
        data:{
          date:date,
          title_text:title_text,
          title_icon:title_icon,
          money:money,
          remark:remark,
          type:type,
          mark:mark,
          userid:user._id,
          user:user
        },
        success(res){
          console.log('保存成功',res)
          wx.showToast({
            title: '保存成功',
          })
          wx.redirectTo({
            url: '../mbook/mbook',
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

    }
         
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


})