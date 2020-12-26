import request from '../../utils/request.js';
Page({
  data: {
    banners: [],
    scroll: [],
    topList: []
  },
  async onLoad() {

    //轮播图
    request('/banner', {
      type: 1
    }).then((res) => {
      this.setData({
        banners: res.banners
      })

    })
    //推荐区域
    request('/personalized').then((res) => {
      this.setData({
        scroll: res.result
      })
    })

    //排行榜
    let ids = [1, 2, 3, 4, 5, 6, 7, 8]; //idx ： 1-37 ,每一个对应一个榜单，
    let index = 0;
    let topList = [];
    while (index < ids.length) {
      // console.log(123)
      let res = await request("/top/list", {
        idx: ids[index++]
      });
      let topData = {};
      topData.name = res.playlist.name;
      topData.musicList = res.playlist.tracks;
      topList.push(topData)
      this.setData({
        topList
      })
    }
  },
})