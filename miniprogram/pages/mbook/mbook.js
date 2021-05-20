// miniprogram/pages/mbook/mbook.js
var util = require('../../utils/util.js');

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    date:'',
    pageIndex: 0,
    list: {},
    yearmonth: util.formatYearMonth(new Date),
    yearmonthstr: util.formatDate(new Date),
    jieyu: "0.00",
    sumin: "0.00",
    sumout: "0.00",
    daysumin:'0.00',
    daysumout:'0.00',
    month:'',
    title_icon:'',
    title_text:'',
    imgList:[],
    list:[],
    
    
  },
  /**{}
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取当日的日期
    var DATE = util.formatDate(new Date());
      this.setData({
          date: DATE,
      });
    console.log("日期riqi",DATE)
    // 获取当月的月数
    var MONTH = util.formatYearMonth(new Date());
      this.setData({
          month: MONTH,
      });
    console.log(MONTH)


    console.log("页面初始化");
    var obj = this;
    console.log(this)
    let that=this //异步请求，所以let一个that
   wx.cloud.init()
   var user=wx.getStorageSync('user')
  
   console.log(wx.cloud.database().collection('zhangben'))
    wx.cloud.database().collection('zhangben').where({
      userid: user._id,
  })
    .get({
      success: res => {
        console.log("3333333",res.data)
        this.setData({
          date: res.data[0].date,
        })
        console.log(res.data[0].date)
        console.log(res.data.length)
        var sumin=0.00;
        var sumout=0.00;
        var daysumin='0.00';
         var daysumout='0.00';

        for(let i=0;i<res.data.length;i++){
          if(res.data[i].type=='收入' && res.data[i].date==DATE){
            //日收入：获取日期选择器的日期与数据库日期做对比，相同日期及类型是收入则相加
            daysumin=Number(daysumin) +  Number(res.data[i].money);
            console.log("daysumin",daysumin)
            this.setData({
              daysumin:daysumin
            })

         }
         if(res.data[i].type=='支出' && res.data[i].date==DATE){
          //日支出
          daysumout=Number(daysumout) +  Number(res.data[i].money);
          console.log("daysumout",daysumout)
          this.setData({
            daysumout:daysumout
          })

       }
          if(res.data[i].type=='收入'){
            //总收入：判断数据库中的信息如果类型是收入的就相加
            
             sumin=  Number(sumin) +  Number(res.data[i].money);
            console.log("sumin",sumin)
            this.setData({
              sumin:sumin
            })
            //月收入：获取当前月份数与数据库月份数做对比，相同月份及类型是收入则相加
            
            //日收入
            // if(yearmonthstr==res.data[i].date){

            // }

          }else{
            // 总支出：判断数据库中的信息如果类型是支出的就相加
            //日支出
            sumout=  Number(sumout) +  Number(res.data[i].money);
            console.log("sumout",sumout)
            this.setData({
              sumout:sumout
            })
          }
          // 总结余资金：总是收入减去总的支出

          this.setData({
            jieyu:Number(sumin)-Number(sumout)
          })
          console.log("结余",Number(sumin)-Number(sumout))

          
        }
      }
      
    })
  //  /////详细信息：种类，备注，金额等信息显示到页面
  var user=wx.getStorageSync('user')
    wx.cloud.database().collection("zhangben").where({
    userid: user._id,}).orderBy('date','desc')
    .get({ ///查询prize数据表中的数据（所有商品）
      success(res){       
        console.log("resres",res)
        that.setData({ //通过setData，将res中的数据存入到imgList数组当中
          imgList:res.data,
          list:res.data
        }),
        console.log("data",list.data[0].value)   ///打印看一下   
        this.handleTodoLongclick(_id)
      }
    })

  },

  touchdel: function (event){
    console.log("even",event)
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这项任务吗？',
      success: (e) => {
        if (e.confirm) {
          var id = event.currentTarget.dataset.id;//获取删除的id
     console.log(id);
     if (id) {
       const db = wx.cloud.database()
       db.collection('zhangben').doc(id).remove({
         success: function (res){
           wx.showToast({
             title: '删除成功',
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
        }
      }
    })
     
  },
  onPullDownRefresh: function () {
    
   
    this.onLoad();
    wx.stopPullDownRefresh();
  },



  // 添加
  addwater: function() {
    wx.redirectTo({
      url: '/pages/mbook/addwater'
    });
  },

  // 详情
  waterdetail: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/mbook/mdetail?id=' + e.currentTarget.dataset.id
    });
  },

})