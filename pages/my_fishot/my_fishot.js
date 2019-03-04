// pages/my_fishot/my_fishot.js

Component({
  properties: {
    //我的收藏发型id
    userInfo: {
      type: Object,
      value: {}
    },

  },
  /**
   * 页面的初始数据
   */
  data: {
    //我的页面相关变量
    me_words: '',//个性签名
    editing: false,//是否在编辑
    editing_words: '',
    old_words: '',//编辑前的签名
    picture_selected: true,

    //相册容器相关变
    fi_story_hide: false,
    isBottom: false,//是否到底了
    albums: '',//遍历相册
    all_albums: '',//所有相册

  },
  onPageScroll: function () {
    this.getRect();
  },
  methods:{
    getRect: function () {
      var that = this;
      wx.createSelectorQuery().select('.main').boundingClientRect(function (rect) {
        // //console.log.log(rect);
        // //console.log.log(v_height);
        if (rect.bottom - v_height <= 10) {
          var now_length = that.data.albums.length;
          // //console.log.log(now_length);
          that.setData({
            albums: that.data.all_albums.slice(0, now_length + 5)
          })
        }
      }).exec()
    },
  }

})