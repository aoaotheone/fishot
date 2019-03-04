// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    button_color1: 'button-color',
    button_color2: 'button-color',
    button_color3:'button-color',
    feedback_type:'',
    phone:'',
    text:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  onShareAppMessage: function () {
  
  },
  button1: function () {
    this.setData({
      button_color1: 'button-color-selected',
      button_color2: 'button-color',
      button_color3: 'button-color',
      feedback_type: '产品建议'
    })
  },
  button2: function () {
    this.setData({
      button_color1: 'button-color',
      button_color2: 'button-color-selected',
      button_color3: 'button-color',
      feedback_type: '功能异常'
    })
  },
  button3: function () {
    this.setData({
      button_color1: 'button-color',
      button_color2: 'button-color',
      button_color3: 'button-color-selected',
      feedback_type: '其他'
    })
  },
  get_text: function (event) {
    this.setData({
      text: event.detail.value
    })
  },
  get_phone: function (event) {
    this.setData({
      phone: event.detail.value
    })
  },
  send:function(){
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        'type': "A041",
        'token': wx.getStorageSync("token"),
        'text': this.data.text,
        'feedback_type': this.data.feedback_type,
        'phone': this.data.phone,
        'data':null
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '已提交意见',
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack()
          },2000)
        } else {
         
        }
      }
    })
  }
})