// miniprogram/pages/mytomato/mytomato.js
const util = require('../../utils/util1.js')

Page({
  data: {
    logs: [],
    activeIndex:0,
    dayList:[],
    list:[],
    datebaseList:[],
    hisList:[],
    length:'',
    sum:[
      {
        title:'今日番茄次数',
        val:'0'
      },
      {
        title:'累计番茄次数',
        val:'0'
      },
      {
        title:'今日专注时长',
        val:'0分钟'
      },
      {
        title:'累计专注时长',
        val:'0分钟'
      }
    ],
    cateArr:[
      {
        icon: 'work',
        text: '工作'
      },
      {
        icon: 'study',
        text: '学习'
      },
      {
        icon: 'think',
        text: '思考'
      },
      {
        icon: 'write',
        text: '写作'
      },
      {
        icon: 'sport',
        text: '运动'
      },
      {
        icon: 'read',
        text: '阅读'
      }
    ],
  },
  onShow: function () {
    let that=this //异步请求，所以let一个that
    wx.cloud.init()
    var user=wx.getStorageSync('user')
   
    console.log(wx.cloud.database().collection('logs'))
     wx.cloud.database().collection('logs').where({
       userid: user._id,
   })
     .get({
       success: res => {
        console.log("res",res)
        var day = 0;
        var total = res.data.length;
        var dayTime = 0;
        var totalTime = 0;
        var dayList = [];
        var hisList = [];
        if(res.data.length > 0){
          for(var i = 0;i < res.data.length;i++){
            if(res.data[i].date.substr(0,10) == util.formatTime(new Date).substr(0,10)){
              day = day + 1;
              dayTime = dayTime + parseInt(res.data[i].time);
              dayList.push(res.data[i]);
              this.setData({
                dayList:dayList,
                list:dayList
              })
            }else{
              hisList.push(res.data[i]);
              this.setData({
                hisList:hisList,
                list:hisList
              })
            }
            totalTime = totalTime + parseInt(res.data[i].time);
          }
          this.setData({
            'sum[0].val':day,
            'sum[1].val':total,
            'sum[2].val':dayTime+'分钟',
            'sum[3].val':totalTime+'分钟'
          })
        }
        
       }

      })

    //显示用户的番茄钟数据
    

    var user=wx.getStorageSync('user')
    var _this=this;
    // res.data[i].date.substr(0,10) == util.formatTime(new Date).substr(0,10)
    wx.cloud.database().collection("logs").where({
    userid: user._id,

  
  }).orderBy('date','desc')
    .get({
      success(res){       
       
        _this.setData({ //通过setData，将res中的数据存入到imgList数组当中
          datebaseList:res.data,
         
        })
      }
    })


//页面显示数据
   

  },
  
  //历史统计记录
  changeType:function(e){
    var index = e.currentTarget.dataset.index;
    // 今日
    if(index == 1){

      this.setData({
        datebaseList:this.data.dayList
      })
      console.log("daylist",this)
 
      
    }else if(index == 2){
      // 历史
      this.setData({
        datebaseList:this.data.hisList
      })
    }

    if(index==0){
      var user=wx.getStorageSync('user')
    var _this=this;
    // res.data[i].date.substr(0,10) == util.formatTime(new Date).substr(0,10)
    wx.cloud.database().collection("logs").where({
    userid: user._id,

  
  }).orderBy('date','desc')
    .get({
      success(res){       
       
        _this.setData({ //通过setData，将res中的数据存入到imgList数组当中
          datebaseList:res.data,
         
        })
      }
    })
    }
    this.setData({
      activeIndex:index
    })
  }
})