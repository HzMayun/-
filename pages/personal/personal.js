// pages/personal/personal.js
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    relY: 0,
    time: "",
    userinfo: {},
    listenData: [],
  },


  handleTouchStart(e) {
    console.log(e)
    this.startY = e.touches[0].pageY
  },
  handleTouchMove(e) {
    let moveY = e.touches[0].pageY
    let relY = moveY - this.startY
    if (relY < 0 || relY > 120) return;
    this.setData({
      relY,
      time: ""
    })
  },
  handleTouchEnd(e) {
    this.setData({
      relY: 0,
      time: "500ms"
    })
  },
  //点击跳转到登录界面
  toLogin() {
    /*
      wx.navigateTo
        保留当前页面实例,相当于自带keep-alive
      wx.redirectTo
        卸载当前页面实例
    */
    wx.navigateTo({
      url: '/pages/login/login',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 网易云这个接口，当设置 个人主页隐私设置->我的听歌排行->所有人可见时，type=0 (全部听歌记录) 
    //才会响应，不然会返回400 没有权限 。type=1(一周内的听歌排行 )
    // let userinfo = JSON.parse(wx.getStorageSync("userinfo") || "{}");
    // this.setData({
    //   userinfo,
    // })
    // let userId = userinfo.userId
    // request('/user/record', {
    //   uid: userId,
    //   type: 1
    // }).then((res) => {
    //   if (res.code === 200) {
    //     console.log("请求历史记录成功")
    //     console.log(res)
    //     let listenData = res.weekData  //一周的历史记录weekData
    //     this.setData({
    //       listenData
    //     })
    //   }
    // })

    let userinfo = (wx.getStorageSync("userinfo"))
    if (userinfo) {
      userinfo = (JSON.parse(userinfo))
      console.log(userinfo)
      console.log(111)
      this.setData({
        userinfo,
      });
      let userId = userinfo.userId
      request('/user/record', {
        uid: userId,
        type: 0 //所有的历史记录
      }).then((res) => {
        if (res.code === 200) {
          console.log("请求历史记录成功")
          let listenData = res.allData //所有的历史记录 allData
          this.setData({
            listenData
          })
        } else {
          wx.showToast({
            title: res.message,
          })
        }
      })
    }


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})