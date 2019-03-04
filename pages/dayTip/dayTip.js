// pages/dayTip/dayTip.js
const timebar = wx.createCanvasContext('timebar1');
var screenTime = wx.getSystemInfoSync().screenWidth / 750;
var rect_info =  [];//往期日签dom树信息
var rect_top = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diary:[],
    timebar_height:0,
    rect_info:[],
    rect_top:[],
    screenTime:screenTime
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_token();
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
    rect_info = [];
    rect_top = [];
    var that = this;
    setTimeout(function () {
      that.getAllRects();
    }, 400)

    setTimeout(function () {
      that.draw_timebar();
    }, 600)
    setTimeout(function () {
      that.setData({
        timebar_height: rect_info[rect_info.length - 1]-80,
        rect_info: rect_info,
        rect_top: rect_top
      });
    }, 1000)
    setTimeout(function () {
      that.setData({
        timebar_height: rect_info[rect_info.length - 1]-80,
        rect_info: rect_info,
        rect_top: rect_top
      });
      that.draw_timebar();
    }, 3000)

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

  get_token: function () {
    var that = this;
    var is_token = false;
    try {
      var token = wx.getStorageSync("token");
      if (token) {

        is_token = true,

          wx.request({
            url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
            method: "POST",
            dataType: 'json',
            header: { 'content-type': 'application/json' },
            data: {
              "token": token,
              "type": "A040",
              "data": {
                page: 1,
                size: 7
              }
            },
            success: function (res) {
              if (res.data.code == 200) {
                that.setData({
                  diary: res.data.msg
                })
              } else {

              }
              // setTimeout(function () {
              //   if (res.data.code == 200) {
              //     that.setData({
              //       diary: res.data.msg
              //     })
              //   } else {

              //   }
              // }, 100)
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
  getAllRects: function () {
    var that = this;
    wx.createSelectorQuery().selectAll('.time1').boundingClientRect(function (rects) {
      // console.log(rects);
      rects.forEach(function (rect) {
        // rect.id      // 节点的ID
        // rect.dataset // 节点的dataset
        // rect.left    // 节点的左边界坐标
        // rect.right   // 节点的右边界坐标
        // rect.top     // 节点的上边界坐标
        // rect.bottom  // 节点的下边界坐标
        // rect.width   // 节点的宽度
        // rect.height  // 节点的高度
        rect_info.push(parseInt(rect.bottom));
        rect_top.push(parseInt(rect.top));

      })
      
    }).exec()
  },
  draw_timebar:function(){
    timebar.clearActions();
    // console.log(rect_info);
    // timebar.arc(75 * screenTime, 30 * screenTime, 25 * screenTime, 0, 2 * Math.PI)
    // // timebar.setFillStyle('#f7f7f7')
    // timebar.setStrokeStyle('#8cd1f4')
    // timebar.setLineWidth(7*screenTime)
    // timebar.stroke()

    timebar.beginPath()
    timebar.arc(75 * screenTime, 30 * screenTime, 28 * screenTime, 0, 2 * Math.PI)
    timebar.setFillStyle('#8cd1f4')
    // timebar.setStrokeStyle('#8cd1f4')
    timebar.fill()

    timebar.beginPath()
    timebar.moveTo(75 * screenTime, 58 * screenTime);
    timebar.lineTo(75 * screenTime, 90 * screenTime)
    timebar.setLineWidth(7 * screenTime)
    timebar.setStrokeStyle('#8cd1f4')
    timebar.stroke()

    for (let i= 0;i < rect_top.length;i++){
      // console.log(i)
      timebar.beginPath()
      timebar.arc(75 * screenTime, (rect_top[i] - 22) , 46 * screenTime, 0, 2 * Math.PI)
      timebar.setFillStyle('#8cd1f4')
      timebar.fill()

      timebar.beginPath()
      timebar.moveTo(75 * screenTime, rect_top[i] + 5)
      timebar.lineTo(75 * screenTime, rect_info[i] - 5)
      timebar.setLineWidth(7 * screenTime)
      timebar.setStrokeStyle('#8cd1f4')
      timebar.stroke()
    }
    timebar.draw()
  },
  canvas_err:function(e){
    console.error(e.detail.errMsg)
  }
})