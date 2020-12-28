//封装发送请求的公共函数
import config from "./config.js" //引入基地址

export default function(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    wx.request({
      // url: config.host + url,
      url: "https://yunyinyue.cn.utools.club" + url,
      data,
      method,
      header: {
        cookie: JSON.parse(wx.getStorageSync("cookies")||"[]" ).toString()
      },
      success: (res) => {
        if (data.isLogin) {
          // res.cookies  中只需要 MUSIC_U=  这一条 ，需要对cookies做一下处理，然后存入cookie
          let cookies = res.cookies.filter((item) => {
            return item.indexOf("MUSIC_U=") === 0
          })
          // console.log("res.cookies", res.cookies)
          let { isLogin } = data;
          if (isLogin){
            wx.setStorageSync("cookies", JSON.stringify(cookies));
          }
        }
        console.log("wx.request的返回值：", res.data)
        // console.log(res)
        resolve(res.data)
      }
    })
  })
}