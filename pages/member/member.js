// pages/member/member.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    member:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (res) {
      that.setData({
        userInfo: res
      })

    })
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.request({
          url: 'https://www.yiluzou.cn/Fishot/public/index.php/index', method: "POST",
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          data: {
            type: "A043",
            token: res.data,
            data: {
              album_id: options.id,
            }
          },
          success: function (res) {
            console.log(res)
            that.setData({
              member:res.data.msg,
              pic_id: options.id
            })
          }
        })
      },
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
  onShareAppMessage: function (e) {
    var token = wx.getStorageInfoSync('token')
    if (e.from === 'button' && e.target.id === 'album-menber') {
      return {
        title: "来自" + this.data.userInfo.nickName + "的分享",
        path: "pages/invite/invite?albums_id=" + this.data.pic_id,
        success: function (res) {
          wx.showToast({
            title: '分享成功',
            duration: 2000
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '分享失败',
            duration: 2000
          })
        }
      }
    }

  },
  back_to_fishot:function(){
    wx.navigateBack()
  }
})