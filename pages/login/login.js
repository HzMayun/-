// pages/login/login.js
import request from '../../utils/request.js';
Page({

  data: {
    phone: "",
    password: "",
  },

  handleInput(e) {
    // console.log(e)
    // data - type="phone"  也可以自定义事件来获取，因为这里刚好id就是其对应的名字
    // 重点: 区分到底是哪个组件触发的change
    // 实现: 通过标签属性配合event中的target或者currentTarget实现传参
    //target 和 currentTarget 的区别 ： 事件委托，在小程序中，currentTarget可以获取到事件源
    // target是触发者，最内层的子元素  event.target 
    let type = e.currentTarget.id;
    let value = e.detail.value;
    this.setData({
      [type]: value
    })
  },
  //登录 需要将返回的cookie存入localstory，以便小视频的时候发送请求使用
  login() {
    request("/login/cellphone", {
      phone: this.data.phone,
      password: this.data.password,
      isLogin:true, //多携带一个 判断是不是登录，是的话，在封装的request函数中将cookie存入
      //因为request中是 返回的 res.data  res.cookie是没有返回的，所以需要这么处理一下
    }).then((res) => {
      if (res.code === 400) {
        wx.showToast({
          title: '手机号错误',
          icon: "none"
        })
        return;
      }
      if (res.code === 502) {
        wx.showToast({
          title: '密码错误',
          icon: 'none',
        })
        return;
      }
      if (res.code === 200) {
        wx.showToast({
          title: '登陆成功',
          icon: "success",
          success() {
            wx.setStorageSync('userinfo', JSON.stringify(res.profile))
            // wx.setStorage({
            //   key: 'userinfo',
            //   data: JSON.stringify(res.profile),
            // })
            // navigateTo :保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
            //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
            wx.switchTab({ //这里是往tabBar页面跳转
              url: '/pages/personal/personal',
            })
          }
        })
      }



    })




  },

  onLoad: function(options) {

  },



})