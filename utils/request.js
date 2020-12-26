//封装发送请求的公共函数
import config from "./config.js"  //引入基地址

export default function (url, data = {}, method = "GET"){
  return new Promise((resolve, reject)=>{
    wx.request({
      url:config.host+url,
      data,
      method,
      success:(res)=>{
        if(data.isLogin){
          console.log(res.cookie)
          console.log(res)
          wx.setStorageSync('cookie', res.cookie)
        }
        console.log("wx.request的返回值：",res.data)
        // console.log(res)
        resolve(res.data)
      }
    })
  })
}