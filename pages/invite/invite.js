// pages/invite/invite.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    albums_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.albums_id);
    this.setData({
      albums_id: options.albums_id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      // console.log(userInfo)
    })
    this.accept();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  accept: function () {
    var that = this;
    var is_token = false;
    try {
      var token = wx.getStorageSync("token");
      if (token) {
       
        is_token=true,
       
        wx.request({
          url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
          method: "POST",
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          data: {
            "token": token,
            "type": "A008",
            "data": {
              album_id:this.data.albums_id
            }
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 200 && res.data.msg) {
              wx.showToast({
                title: '成功接受邀请',
                duration: 2000
              })
              wx.redirectTo({
                url: '../index/index'
              })
            } else {
              wx.showToast({
                title: '无法接受邀请，请重试',
                duration: 2000
              })
            }
          }
        });
      }
    } catch (e) {

    }

    setTimeout(
      function () {
        if (!is_token) {
          that.get_token();
        }
      }, 1000
    )
    // console.log(wx.getStorageSync("token"));
  },
})