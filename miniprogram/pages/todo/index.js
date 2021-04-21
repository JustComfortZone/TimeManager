// miniprogram/pages/todo/index.js
import util from '../../utils/util'
//获取应用实例
const app = getApp()

Page({
  data: {
    // todos
    todos: [],
    datasing:[],
    datased:[],
    checked:{
      type:Boolean,
      default:''
    },
    title:'',
    date:'',
    to:[],
    tip:'',
    // todo 计数
    uncompletedCount: 0,
    completedCount: 0,

    // 是否动画延迟
    delay: true
  },
  handleToggle (e) {
   
    // this.data.checked = !this.data.checked
    // this.setData(this.data)
    // console.log('checked', this.data.checked);

    console.log("handle",e)
     e.currentTarget.dataset.checked =!e.currentTarget.dataset.checked
    // this.setData({
    //   checked:e.currentTarget.dataset.checked
    // })
    
     const db = wx.cloud.database()
     db.collection("todos").doc(e.currentTarget.dataset.id).update({
       data: {
         checked:e.currentTarget.dataset.checked
       }, success: res => {
        
         this.onShow()
        
       }, fail: err => {
         wx.showToast({
           title: '修改失败',
         })
       }
     })

  },
   /**
   * 文字改变事件
   */
  handleTitleChange (e) {
   
    console.log('准备做什么', e.detail.value);
    console.log('准备', e);
    const db = wx.cloud.database()
   let to=e
    if(to.currentTarget.dataset.id!==""){//id等于空是新增数据
      this.update(db,to)  //新增记录
      }
 
  },
  // comfirm:function(e){
  //   console.log("e",e)
    // const db = wx.cloud.database()//打开数据库连接
    // let book = e.detail.value
    // if(book.id==""){//id等于空是新增数据
    //   this.add(db,book)  //新增记录
    // }else{
    //   this.update(db,book)  //修改记录
    // }
  // },
  /**
   * 同步数据
   */
  update: function (db, to) {
    db.collection("todos").doc(to.currentTarget.dataset.id).update({
      data: {
        title:to.detail.value
      }, success: res => {
        wx.showToast({
          title: '修改日程成功',
        })
        this.onShow()
       
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
  },
  /**
   * 时间选择器
   */
  handleDateChange (e) {
    console.log('picker发送选择改变，携带值为', e);
    const db = wx.cloud.database()
    db.collection("todos").doc(e.currentTarget.dataset.id).update({
      data: {
        date:e.detail.value
      }, success: res => {
        wx.showToast({
          title: '修改日期成功',
        })
        this.onShow()
       
      }, fail: err => {
        wx.showToast({
          title: '修改失败',
        })
      }
    })
 

  },

  syncData() {
    let that=this;
     var user=wx.getStorageSync('user')
    // console.log("user",user._id)
console.log("synthis",this)
    wx.cloud.database().collection('todos').where({
      userid:user._id
    }).orderBy('tip','asc').get({
      success(res){

        that.setData({
          todos:res.data
        })
            }})
            
  },
  /**
   * 获取未完成的 todos
   */
  getUncompletedTodos () {
    let that=this;
     var user=wx.getStorageSync('user')
    // console.log("user",user._id)
console.log("获取",that)
    wx.cloud.database().collection('todos').where({
       userid:user._id,
      checked:false
    }).get({
      success(res){
        console.log("获取未完成的todo",res.data.length)
        that.setData({
          uncompletedCount:res.data.length
        })
     
          }}
            )
            
  },
  /**
   * 获取已完成的 todos
   */
  getCompletedTodos() {
    let that=this;
     var user=wx.getStorageSync('user')
    // console.log("user",user._id)
console.log("获取已经",that)
    wx.cloud.database().collection('todos').where({
       userid:user._id,
      checked:true
    }).get({
      success(res){
        console.log("获取已完成的todo",res.data)
        that.setData({
          completedCount:res.data.length
        })
        wx.setStorageSync('completedCount', completedCount)
          }}
            )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

      // 为了新建后列表能更新，此逻辑必须写在 onShow 事件
      this.getUncompletedTodos() 
      this.getCompletedTodos()
      this.syncData()
    // 为了新建后列表能更新，此逻辑必须写在 onShow 事件
  },
  
  handleTodoLongclick(event) {
    // 获取 index
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这项任务吗？',
      success: (e) => {
        if (e.confirm) {
          var id = event.currentTarget.dataset.id;//获取删除的id
     console.log(id);
     if (id) {
       const db = wx.cloud.database()
       db.collection('todos').doc(id).remove({
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 分享
   */
  onShareAppMessage: function (options) {

  },


  handleTodoItemChange (e) {
    let index = e.currentTarget.dataset.index
    let todo = e.detail.data.todo
    let item = this.data.todos[index]
    Object.assign(item, todo)
    this.update()
  },

  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();
  },

  handleAddTodo (e) {
    wx.navigateTo({
      url: '../todo/create'
    })
  }
})
