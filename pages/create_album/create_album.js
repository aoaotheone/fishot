// pages/create_album/create_album.js
//图片裁剪相关变量
const ctx = wx.createCanvasContext('cover-preview');
var start_position = {};//移动图片时手指起始坐标
var tempFilePath;//图片路径
var tempWidth;//图片初始宽度
var tempHeight;//图片初始高度
var old_x = 0;//图片初始x坐标F
var old_y = 0;//图片初始y坐标
var _touches = 1;//触屏的手指数
var old_scale = 1;//原始放大倍数
var new_scale = 1;//新的放大倍数
var is_move = false;//是否移动
var screenTime = wx.getSystemInfoSync().screenWidth / 750;

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    pic_bg_url:'',
    pic_bg_default:'https://www.yiluzou.cn/Fishot/public/upload/album.png',
    is_private:0,
    chosing_bg:false,
    album_name:'',
    album_state:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (res) {
      that.setData({
        userInfo:res
      })

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

    var that = this;
    wx.getStorage({
      key: 'create_album',
      success: function (res) {
        console.log(res.data)
        that.setData({
          album_name: res.data.album_name,
          album_state: res.data.album_state,
          pic_bg_url: res.data.album_bg,
          is_private: res.data.is_private
        })
      },
    })
  },

  set_private:function(){
    this.setData({
      is_private: this.data.is_private?0:1
    })

    var that = this;
    wx.setStorage({
      key: 'create_album',
      data: {
        album_name: that.data.album_name,
        album_state: that.data.album_state,
        album_bg: that.data.pic_bg_url,
        is_private: that.data.is_private
      }
    })
  },
  //选择并将图片输出到canvas
  change_cover: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '更改我的封面',
      confirmColor: '#39bae8',
      success: function (res) {
        if (res.confirm) {


          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res0) {

              tempFilePath = res0.tempFilePaths[0];
              that.setData({
                chosing_bg: true,
                // edit_url: tempFilePath
              })
              wx.getImageInfo({
                src: tempFilePath,
                success: function (res) {
                  // console.log(res.width)
                  // console.log(res.height)
                  tempWidth = res.width;
                  tempHeight = res.height;
                  ctx.drawImage(tempFilePath, 0, 0, 375, res.height / res.width * 375);
                  ctx.draw();
                }
              })

            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //监听手指触摸事件，并判断是移动还是缩放，并记录初始状态
  canvas_start: function (e) {
    // console.log(e);
    var touches = e.touches.length;
    if (touches == 1) {
      _touches = 1;
      start_position = { x: e.touches[0].x, y: e.touches[0].y, timeStamp: e.timeStamp }
    } else if (touches == 2) {
      _touches = 2;
      start_position = { x: e.touches[0].x, y: e.touches[0].y, x1: e.touches[1].x, y1: e.touches[1].y, timeStamp: e.timeStamp }

    } else {
      _touches = 1;
    }
  },
  //监听手指移动事件，并做出相应调整
  canvas_move: function (e) {
    // console.log(e);
    var touches = e.touches.length;
    if (_touches == 1 && e.timeStamp - start_position.timeStamp > 150) {
      ctx.drawImage(tempFilePath, old_x + e.touches[0].x - start_position.x, old_y + e.touches[0].y - start_position.y, 375 * new_scale, tempHeight / tempWidth * 375 * new_scale);
      ctx.draw();
      is_move = true;
    } else if (_touches == 2 && e.timeStamp - start_position.timeStamp > 150) {
      var change_x = Math.abs(Math.abs(e.touches[0].x - e.touches[1].x) - Math.abs(start_position.x - start_position.x1));
      var change_y = Math.abs(Math.abs(e.touches[0].y - e.touches[1].y) - Math.abs(start_position.y - start_position.y1));
      if (change_x - change_y > 10) {
        old_scale = Math.abs(e.touches[0].x - e.touches[1].x) / Math.abs(start_position.x - start_position.x1);
      } else {
        old_scale = Math.abs(e.touches[0].y - e.touches[1].y) / Math.abs(start_position.y - start_position.y1);
      }
      ctx.drawImage(tempFilePath, old_x, old_y, 375 * old_scale * new_scale, tempHeight / tempWidth * 375 * old_scale * new_scale);
      ctx.draw();
      is_move = true;
    } else {
      is_move = false;
    }
  },
  //监听手指离开动作，并保存当前状态数据
  canvas_end: function (e) {
    // console.log(e);
    if (_touches == 1 && is_move) {
      old_x = old_x + e.changedTouches[0].x - start_position.x;
      old_y = old_y + e.changedTouches[0].y - start_position.y;
    } else if (_touches == 2 && is_move) {
      new_scale = old_scale * new_scale;
    }

  },
  //确定并上传背景图
  upload_bg: function () {
    var that = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    // console.log(screenWidth);
    wx.canvasToTempFilePath({
      x: 0,
      y: screenWidth / 750 * 400,
      width: screenWidth + 2,
      height: screenWidth / 750 * 526 + 2,
      destWidth: screenWidth,
      screenHeight: screenWidth / 750 * 526,
      quality: 1,
      canvasId: 'cover-preview',
      success: function (res) {
        wx.setStorage({
          key: 'create_album',
          data: {
            album_name: that.data.album_name,
            album_state: that.data.album_state,
            album_bg: res.tempFilePath,
            is_private: that.data.is_private
          }
        })
        that.setData({
          chosing_bg: false,
          pic_bg_url: res.tempFilePath
        })
        

      }
    })
  },
  //取消图片预览编辑
  cancel_croper: function () {
    ctx.clearActions();
    this.setData({
      chosing_bg: false,
      // edit_url: tempFilePath
    })
  },
  get_name:function(e){
    var that = this;
    wx.setStorage({
      key: 'create_album',
      data: {
        album_name: e.detail.value,
        album_state: that.data.album_state,
        album_bg: that.data.pic_bg_url,
        is_private: that.data.is_private
      }
    })
    this.setData({
      album_name: e.detail .value
    })
  },
  get_state: function (e) {
    var that = this;
    wx.setStorage({
      key: 'create_album',
      data: {
        album_name: that.data.album_name,
        album_state: e.detail.value,
        album_bg: that.data.pic_bg_url,
        is_private: that.data.is_private
      }
    })
    this.setData({
      album_state: e.detail.value
    })
  },
  create_album:function(){
    var that = this
    if (!that.data.pic_bg_url){
      wx.showToast({
        title: '请先选择相册封面',
        icon:'none'
      })
      return false
    }
    var that = this
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.uploadFile({
          url: 'https://www.yiluzou.cn/Fishot/public/index.php/index', //仅为示例，非真实的接口地址
          filePath: that.data.pic_bg_url,
          name: 'photo',
          formData: {
            'token': res.data,
            'type': 'A017',
            'name': that.data.album_name,
            'description': that.data.album_state,
            'is_secret': that.data.is_private,
            'data': ''
          },
          success: function (res) {
            console.log(res);
            var res0 = JSON.parse(res.data)
            console.log(res0.msg)
            wx.removeStorage({
              key: 'create_album'
            })
            wx.redirectTo({
              url: '../fishot/fishot?userInfo=' + JSON.stringify(that.data.userInfo) + '&albums=' + JSON.stringify(res0.msg) + '&is_new=true',
            })
          },
          fail: function () {
            console.log("fail");
          }
        });
      },
    })
  },
  back_to_index:function(){
    wx.navigateBack()
  }
})