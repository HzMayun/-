// pages/video/video.js
import request from '../../utils/request.js';
Page({
  data: {
    navList: [], //视频列表数据
    videoList: [], //视频详细数据
    currentId: null, // 列表id 发送视频详细时 的参数
    scrollId: "",
    triggered: true, //下拉刷新 当他是false 的时候。下拉动画会被关闭
    videoId: ""
  },
  // 获取id(发送请求) scrollId(视频导航标题滚动)
  async changeId(event) {
    let {
      id
    } = event.target.dataset;
    let scrollId = event.target.id;
    this.setData({
      currentId: id,
      scrollId
    })
    /*
       1.请求当前id最新数据
       2.弹出加载中的弹窗
       3.数据没回来期间,将列表重置为空(将videoList数组清空即可)
     */
    wx.showLoading({
      title: "加载中,请稍后"
    })
    await this.getVideoList()
    wx.hideLoading();
  },
  // 专门用于请求videolist数据
  async getVideoList() {
    let videoListData = await request('/video/group', {
      id: this.data.currentId
    })
    if (videoListData.code === 200) {
      // console.log(videoListData)
      let videoList = videoListData.datas.map((item) => {
        return item.data
      })
      // console.log(videoList)
      this.setData({
        videoList
      })
    }

  },
  //下拉刷新数据
  async handlePullDown() {
    console.log("下拉触发")
    await this.getVideoList();
    //等待数据回来后，将triggered 改为false ，关闭下拉动画
    this.setData({
      triggered: false
    })
  },
  //滚动到底部的时候，再发送请求，加载更多数据
  handleScrollTolower() {
    console.log("滚动到底部了")
    if (this.flag) return; // this.flag = true 表示正在发送请求
    //发送请求
    this.flag = true;
    setTimeout(() => {
      //网易没有这个接口··所以这里是直接用了videoList 中的数据，就是数据都是一样的，就是再重复一分 （深拷贝）
      let data = JSON.parse(JSON.stringify(this.data.videoList)) //（深拷贝）
      this.setData({
        videoList: [...this.data.videoList, ...data] //先把以前的数据放进去，在放进去data ，保证之前的还在，也可以用push
      })
      this.flag = false;
    }, 3000)
  },
  //视频点击播放时
  /*
    需求:当当前视频开始播放时,停止上个视频的播放

        1.如何知道视频什么时候开始播放时
		        绑定事件监听->事件名称:play
        2.如何停止视频播放
		        通过js代码控制视频播放
              1)通过wx.createVideoContext方法得到对应的video组件
              2)通过视频上下文对象(VideoContext),调用它的pause方法可以暂停视频播放
        3.如何知道上个视频是哪个
		        在当前视频播放的时候,将他的id保存起来,留作下次使用

        问题:一个视频播放两次,上一个视频的id就是当前的id
        原因:上次和当前的id相同
	      解决:多进行一个判断,如果当前id和上次相同,不暂停
   */
  handlePlay(event) {
    console.log("播放时触发")
    let oldVid = this.oldVid //上个视频的ID
    //当前视频的id  要个vedio 添加id属性，值为{{item.vid}}
    let {
      id
    } = event.currentTarget;
    //由于第一个视频开始播放时，没有上一个视频oldVid有可能是undifined 
    if (oldVid && oldVid != id) {
      //获得对应video标签的额视频上下文对象
      //VideoContext 通过 id 跟一个 video 组件绑定，操作对应的 video 组件
      let videoContext = wx.createVideoContext(oldVid);
      //调用pause方法,暂停视频播放
      videoContext.pause();
      // console.log("停止播放")
      //停止视频
      // videoContext.stop()
    }
    this.oldVid = id; //oldVid 等于当前id，下一个视频播放时，当前id就是oldVid 了
    // console.log("oldVid = id ························································")
  },
  showVideo(event) {
    // 获取被点击图片的id
    let {
      id
    } = event.currentTarget
    //更新video的id
    //让页面中的image和video组件进行切换,显示出对应的video
    /*
    image标签绑定的是：wx:if="{{item.vid!==videoId}}" 当这两个id 相等搞得时候，video标签就会显示出来
      
     */
    // console.log("点击了图片")
    this.setData({
      videoId: id
    })
    // console.log("更新了数据")
    //然后 生成上下文，控制视频的播放
    setTimeout(() => {
      let videoContext = wx.createVideoContext(id);
      videoContext.play();
      // console.log("生成上下文，播放视频")
    })

  },
  //用户点击右上角分享按钮
  /* 
    实现转发功能的方法：
      1、通过右上角转发按钮
      2、通过button组件的open-type属性设置share
    业务场景： 
      1.如果是右上角的转发按钮,转发内容是当前小程序页面截图
      2.如果是视频的分享button,转发内容是当前视频截图
    
    实现区分的方法:通过onShareAppMessage传入的实参中的from可以判断
          如果是menu,就代表是右上角转发触发的
          如果是button,就代表是button组件触发的

    实现自定义分享内容的方法:
          通过return 一个对象来控制
    
   */

  onShareAppMessage: function({
    from,
    target
  }) {
    // console.log("触发了onShareAppMessage事件")
    // console.log("from", from)
    // console.log("target", target)
    if (from === "button") {
      // console.log("target", target)
      //缺少标题跟图片
      //注意!!!自定义属性名称全小写,即便是写了大写,也会自动转为小写
      let {
        title,
        imageurl
      } = target.dataset;
      return {
        title,
        path: "/pages/video/video", //分享的页面
        imageUrl: imageurl
      }
    } else if (from === "menu") {
      return {
        title: "硅谷云音乐",
        path: "/pages/index/index",
        imageUrl: "/static/images/nvsheng.jpg"
      }
    }
  },
  onLoad: async function(options) {},
  onShow: async function() {
    
    //如果当前用户没有登录，展示模块对话框，让用户回到首页或者去登录
    // 这里的cookies 是哪儿来的 ？？？

    let cookies = wx.getStorageInfoSync("cookies")
    console.log("cookies:", cookies)
    // cookies = JSON.parse(cookies)
    // console.log("cookies:", cookies)

    if (!cookies) { //没有cookies表示没登录
    console.log("没有登录")
      wx.showModal({
        title: '请先登录',
        content: '该功能需要登录账号',
        cancelText: "回到首页",
        confirmText: "去登陆",
        success: ({
          confirm
        }) => {
          //showModal中的回调函数 success(confirm,cancel)
          /*
              confirm  为 true 时，表示用户点击了确定按钮
              cancel  为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）

                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
          */
           //可以通过data中的cancel或者confirm判断当前是点击了取消还是确定
          // console.log('success', confirm)
          if (confirm) {
            //如果用户点解呢去登陆
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })

          }
        }
      })
    }

    //发送视频分类列表请求
    let result = await request("/video/group/list")
    let navList = result.data.slice(0, 14);
    this.setData({
      navList,
      currentId: navList[0].id
    })
    // 发送视频详细信息请求 要携带cookie
    this.getVideoList();
  },



})