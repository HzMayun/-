//封装发送请求的公共函数
import config from "./config.js" //引入基地址

export default function(url, data = {}, method = "GET", header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header,
      success: (res) => {
        if (data.isLogin) {
          // res.cookies  中只需要 MUSIC_U=  这一条 ，需啊哟对cookies做一下处理，然后存入cookie
          let cookie = res.cookies.find((item) => {
            return item.indexOf("MUSIC_U=") === 0
          })
          // console.log("cookie",cookie)
          wx.setStorageSync('cookie', cookie)
        }
        console.log("wx.request的返回值：", res.data)
        // console.log(res)
        resolve(res.data)
      }
    })
  })
}