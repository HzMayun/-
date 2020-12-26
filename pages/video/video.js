// pages/video/video.js
import request from '../../utils/request.js';
Page({
  data: {
    videoList: [],
    currentId: null
  },
  // 获取id
  changeId(event) {
    let {
      id
    } = event.target.dataset;
    this.setData({
      currentId: id
    })
  },

  onLoad: async function(options) {
    //发送视频分类列表请求
    request("/video/group/list").then((res) => {
      // console.log(res)
      this.setData({
        videoList: res.data.slice(0, 10)
      })
      console.log("videoList:", this.data.videoList)
    })
    // 发送视频详细信息请求 要携带cookie
    console.log( wx.getStorageInfoSync("cookie"))
    let videoList = await request(
        '/video/group', 
        {id: 58100 }, 
        {
          cookie:wx.getStorageInfoSync("cookie")
        },
    )
},


})