// pages/fishot/fishot.js

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
// var bg_url;
var screenTime = wx.getSystemInfoSync().screenWidth / 750;

//时间轴相关变量
const time = wx.createCanvasContext('timebar');
var date = new Date();


var scroll_left = [];
var scroll_index = [];

var scrolled = false;
function isEmpty(value) {
  return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_add:false,
    userInfo:'',
    albums:'',//相册信息
    storys:'',
    hide_edit_pic: true,
    isScroll:true,//规定页面是否滚动
    hide_canvas: true,//绘图层
    // edit_url: '',//裁剪图片的路径
    show_edit:false,
    time_selected1: '',
    time_selected2: '',
    time_selected3:'',
    edit_modle:false,
    is_create_album:false,
    pic_id:'',//相册id
    editing:false,//编辑相册信息 
    fistory_text:"<",
    old_name: 'Fi-story',
    old_words: '我们\n灵魂有趣而不安分',
    old_pic_name: '',//相册名称
    old_pic_words: '',
    pic_name: '',//相册名称
    pic_words: '',
    pic_bg_url:'',
    pic_bg_default:'https://www.yiluzou.cn/Fishot/public/upload/album.png',//相册背景图片
  

    //颜色选择样式
    color_selected: ["", "", "", "", "", "", ""],
    color: 'color2',
    color_code: "#00a0e9",
    

    //时间轴相关
    timeBar_high:600,//时间轴长度
    pic_counts:1,//图片数量
    create_time: date.getMonth() < 10 ? date.getFullYear() + "/0" + date.getMonth() + "/" + date.getDay() : date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay(),//相册创建时间

    //图片编辑滚动相关变量
    start_info:{},
    moving_info:{},
    scroll_index:'',
    scroll_left:'',
    scroll_default_left: 0,
    scroll_default_index:0,
    scroll_to:'words-container',


    //选择图片与书写想法相关变量
    thinking:"",//想法
    old_position:'',
    position_text:'',//拍摄位置
    chosed_pic:'',//选择的图片
    // default_chose_pic:"../fishot/img/edit/default.png",//默认图片
    story_rank:'',//所编辑的故事顺序
    story_id:'',
    edit_active:false,


    //预览相关变量
    is_pre:false,
  },

    

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.get_token(options);
    
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
    setTimeout(function(){
      switch (that.data.albums.color) {
        case "#fe6e79":
          that.set_color0();
          break;
        case "#7329a2":
          that.set_color1();
          break;
        case "#00a0e9":
          that.set_color2();
          break;
        case "#00e362":
          that.set_color3();
          break;
        case "#fff45c":
          that.set_color4();
          break;
        case "#fd8930":
          that.set_color5();
          break;
        case "#fe303d":
          that.set_color6();
          break;
        default:
          break;
      }
    },500)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A038",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

        } else {

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    if (!this.data.is_create_album){
      wx.request({
        url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
        method: "POST",
        dataType: 'json',
        header: { 'content-type': 'application/json' },
        data: {
          type: "A018",
          token: wx.getStorageSync("token"),
          data: {
            id: this.data.pic_id,

          }
        },
        success: function (res) {

        }
      })
    }
    if (this.data.edit_modle){
      wx.request({
        url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
        method: "POST",
        dataType: 'json',
        header: { 'content-type': 'application/json' },
        data: {
          "token": wx.getStorageSync("token"),
          "type": "A036",
          "data": {
            "album_id": that.data.pic_id
          }
        },
        success: function (res) {

        }
      })
    }
  },
  back_to_index:function(){
    wx.navigateBack({
      delta: 1
    })
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
    if (e.from === 'button' && e.target.id === 'invite-bt') {
      return {
        title: this.data.userInfo.nickName+"邀请您一起编辑相册",
        path: "pages/invite/invite?albums_id=" + this.data.pic_id,
        success: function (res) {
          wx.showToast({
            title: '已发出邀请，等待好友加入',
            duration: 2000
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '邀请发送失败，请尝试重新邀请',
            duration: 2000
          })
        }
      }
    }
    
  },
  //获取token
  get_token: function (options) {
    var albums = JSON.parse(options.albums);
    var userInfo = JSON.parse(options.userInfo);
    var is_new = options.is_new||false;
    var that = this;
    var is_token = false;
    var edit_modle = false;    
    // console.log(albums);
    
    try {
      var token = wx.getStorageSync("token");
      if (token) {
        is_token = true;
       
        wx.request({
          url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
          method: "POST",
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          data: {
            "token": token,
            "type": "A028",
            "data": {
              "album_id": albums.album_id,
              "page": 0,
              "size": 0
            }
          },
          success: function (res) {
            // console.log(res.data);

            if (res.data.code == 200 && res.data.msg.length > 0) {
              for (var i = 0; i < res.data.msg.length; i++) {
                scroll_left.push(0);
                scroll_index.push(0);
              }
              setTimeout(function () {
                that.setData({
                  storys: res.data.msg,
                  is_create_album: true,
                  userInfo: userInfo,
                  albums: albums,
                  pic_id: albums.album_id,
                  pic_bg_url: albums.background,
                  pic_name: albums.album_name ? albums.album_name : that.data.old_name,
                  pic_words: albums.statement,
                  scroll_left: scroll_left,
                  scroll_index: scroll_index,
                  timeBar_high: 105 + res.data.msg.length * 435,
                })
                if (is_new) {
                  that.ask_for_edit()
                }
              }, 100)
             
            } else {
              that.setData({
                is_create_album: true,
                userInfo: userInfo,
                albums: albums,
                pic_id: albums.album_id,
                pic_bg_url: albums.background,
                pic_name: albums.album_name ? albums.album_name : that.data.old_name,
                pic_words: albums.statement,
              })
              if (is_new) {
                that.ask_for_edit()
              }
            }

          },
          fail: function () {
            // console.log("fail");
            that.setData({
              is_create_album: true,
              userInfo: userInfo,
              albums: albums,
              pic_id: albums.background,
              pic_bg_url: albums.background,
              pic_name: albums.album_name ? albums.album_name : this.data.old_name,
              pic_words: albums.statement,
              edit_modle: edit_modle
            })
            if (is_new) {
              that.ask_for_edit()
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
  //选择并将图片输出到canvas
  change_cover: function () {
    if (!this.data.is_create_album) {
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }
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
                hide_canvas: false,
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

        that.setData({
          hide_canvas: true,
        })
        // console.log(res.tempFilePath)
        try {
          var token = wx.getStorageSync("token");
          // console.log(token)
          if (token) {
            wx.uploadFile({
              url: 'https://www.yiluzou.cn/Fishot/public/index.php/index', //仅为示例，非真实的接口地址
              filePath: res.tempFilePath,
              name: 'photo',
              formData: {
                'token': token,
                'type': 'A019',
                'data': that.data.pic_id
              },
              success: function (res) {
                ctx.clearActions();
                // console.log(res);
                var data = JSON.parse(res.data);
                if (data.code == 200) {
                  that.setData({
                    pic_bg_url: data.msg
                  })
                  wx.showToast({
                    title: '背景设置成功',
                    duration: 2000
                  })

                } else {
                  wx.showToast({
                    title: '背景设置失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })

          }
        } catch (e) {

        }

      }
    })
  },
  //取消图片预览编辑
  cancel_croper: function () {
    ctx.clearActions();
    this.setData({
      hide_canvas: true,
      // edit_url: tempFilePath
    })
  },

  //开始编辑
  fi_story_edit_words: function () {
    this.setData({
      editing: true,
      old_pic_name: this.data.pic_name,//相册名称
      old_pic_words: this.data.pic_words,
    })
  },
  //记录正在编辑的相册名
  get_editing_name: function (event) {
    this.setData({
      pic_name: event.detail.value
    })
    // console.log(this.data.me_words)
  },//记录正在编辑的相册描述
  get_editing_describe: function (event) {
    this.setData({
      pic_words: event.detail.value
    })
    // console.log(this.data.me_words)
  },
  //保存签名
  me_save_words_submit: function () {
    this.setData({
      editing: false,
    })

    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A020",
        token: wx.getStorageSync("token"),
        data: {
          id: this.data.pic_id,
          name: this.data.pic_name,
          statement: this.data.pic_words
        }
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '保存成功',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '保存失败',
            duration: 2000
          })
          this.setData({
            pic_name: this.data.old_pic_name,
            pic_words: this.data.old_pic_words,
          })
        }
      }
    })



  },
  //取消签名编辑
  me_save_words_cancel: function () {
    this.setData({
      editing: false,
      pic_name: this.data.old_pic_name,
      pic_words: this.data.old_pic_words,
    })

    // console.log("cancel");

  },

  //选色板
  set_color0: function () {
    if(!this.data.is_create_album){
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }
    this.setData({
      color_selected: [true, "", "", "", "", "", ""],
      color: "color0",
      color_code: "#fe6e79"
    })
    this.draw_timebar();
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A031",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id,
          color: this.data.color_code
        }
      },
      success: function (res) {
        if (res.data.code == 200) {
          
        } else {
          
        }
      }
    })
  },
  set_color1: function () {
    if (!this.data.is_create_album) {
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }

    this.setData({
      color_selected: ["", true, "", "", "", "", ""],
      color: "color1",
      color_code: "#7329a2"
    })
    this.draw_timebar();
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A031",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id,
          color: this.data.color_code
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

        } else {

        }
      }
    })
  },
  set_color2: function () {
    if (!this.data.is_create_album) {
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }

    this.setData({
      color_selected: ["", "", true, "", "", "", ""],
      color: "color2",
      color_code: "#00a0e9"
    })
    this.draw_timebar();
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A031",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id,
          color: this.data.color_code
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

        } else {

        }
      }
    })
  },
  set_color3: function () {
    if (!this.data.is_create_album) {
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }
 
    this.setData({
      color_selected: ["", "", "", true, "", "", ""],
      color: "color3",
      color_code: "#00e362"
    })
    this.draw_timebar();
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A031",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id,
          color: this.data.color_code
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

        } else {

        }
      }
    })
  },
  set_color4: function () {
    if (!this.data.is_create_album) {
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }
   
    this.setData({
      color_selected: ["", "", "", "", true, "", ""],
      color: "color4",
      color_code: "#fff45c"
    })
    this.draw_timebar();
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A031",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id,
          color: this.data.color_code
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

        } else {

        }
      }
    })
  },
  set_color5: function () {
    if (!this.data.is_create_album) {
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }
 
    this.setData({
      color_selected: ["", "", "", "", "", true, ""],
      color: "color5",
      color_code: "#fd8930"
    })
    this.draw_timebar();
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A031",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id,
          color: this.data.color_code
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

        } else {

        }
      }
    })
  },
  set_color6: function () {
    if (!this.data.is_create_album) {
      wx.showToast({
        title: '请先创建相册',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return;
    }
    this.setData({
      color_selected: ["", "", "", "", "", "", true ],
      color: "color6",
      color_code: "#fe303d"
    })
    this.draw_timebar();
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A031",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.pic_id,
          color: this.data.color_code
        }
      },
      success: function (res) {
        if (res.data.code == 200) {

        } else {

        }
      }
    })
  },
//画时间轴
  draw_timebar:function(){
    time.clearActions();
    time.arc(38*screenTime,18*screenTime,12*screenTime,0,2*Math.PI);
    time.setFillStyle(this.data.color_code);
    time.fill();

    time.beginPath();    
    time.arc(38 * screenTime, 18 * screenTime, 15 * screenTime, 0, 2 * Math.PI);
    time.setLineWidth(5 * screenTime)
    time.setStrokeStyle('#cbd7dd')
    time.stroke()
  
    time.beginPath();
    time.moveTo(38 * screenTime, 36 * screenTime);
    time.lineTo(38 * screenTime, (this.data.timeBar_high - 150) * screenTime)
    time.setLineWidth(5 * screenTime)
    time.setStrokeStyle('#cbd7dd');
    time.stroke();

    var grd = ctx.createLinearGradient(38 * screenTime, (this.data.timeBar_high - 145) * screenTime, 38 * screenTime, (this.data.timeBar_high - 120) * screenTime)
    grd.addColorStop(0, '#cbd7dd')
    grd.addColorStop(1, '#f1f1f1')

    time.beginPath();
    time.moveTo(38 * screenTime, (this.data.timeBar_high - 145) * screenTime);
    time.lineTo(38 * screenTime, (this.data.timeBar_high - 140) * screenTime)
    time.setLineWidth(5 * screenTime)
    time.setStrokeStyle(grd);
    time.stroke();

    time.beginPath();
    time.moveTo(38 * screenTime, (this.data.timeBar_high - 135) * screenTime);
    time.lineTo(38 * screenTime, (this.data.timeBar_high - 130) * screenTime)
    time.setLineWidth(5 * screenTime)
    time.setStrokeStyle(grd);
    time.stroke();

    time.beginPath();
    time.moveTo(38 * screenTime, (this.data.timeBar_high - 125) * screenTime);
    time.lineTo(38 * screenTime, (this.data.timeBar_high - 120) * screenTime)
    time.setLineWidth(5 * screenTime)
    time.setStrokeStyle(grd);
    time.stroke();

    time.draw();
  },

//图片编辑滚动事件
  scroll_start:function(e){
    // console.log(e);
    this.setData({
      start_info: { x: e.touches[0].clientX, y: e.touches[0].clientY, timeStamp: e.timeStamp },
      isScroll:false,
    })
  },
  scrolling: function (e) {
    // console.log(e.currentTarget.dataset.rank);
    var change_x = e.touches[0].clientX - this.data.start_info.x;
    var change_y = e.touches[0].clientY - this.data.start_info.y;
    if (!scrolled && e.timeStamp - this.data.start_info.timeStamp > 100 && change_x > 50 && this.data.scroll_index[e.currentTarget.dataset.rank] == 1) {
      scrolled = true;
      scroll_left[e.currentTarget.dataset.rank] = 0;
      scroll_index[e.currentTarget.dataset.rank] = 0;
      this.setData({
        scroll_left: scroll_left,
        scroll_index: scroll_index,
        scroll_default_left: 0,
        scroll_default_index: 0,
      })
      // console.log(scroll_left)
    } else if (!scrolled && e.timeStamp - this.data.start_info.timeStamp > 100 && change_x < -50 && this.data.scroll_index[e.currentTarget.dataset.rank] == 0) {
      scrolled = true;

      scroll_left[e.currentTarget.dataset.rank] = -450;
      scroll_index[e.currentTarget.dataset.rank] = 1;
      this.setData({
        scroll_left: scroll_left,
        scroll_index: scroll_index,
        scroll_default_left: -450,
        scroll_default_index: 1,
      })
      // console.log(scroll_left)

    }
  },
  scrolling_default: function (e) {
    // console.log(this.data);    
    var change_x = e.touches[0].clientX - this.data.start_info.x;
    if (!scrolled && e.timeStamp - this.data.start_info.timeStamp > 100 && change_x > 5 && this.data.scroll_default_index == 1) {
      scrolled = true;
      this.setData({
        scroll_default_left: 0,
        scroll_default_index: 0,
      })
      // console.log(scroll_left)
    } else if (!scrolled && e.timeStamp - this.data.start_info.timeStamp > 100 && change_x < -5 && this.data.scroll_default_index == 0) {
      scrolled = true;
      this.setData({
        scroll_default_left: -450,
        scroll_default_index: 1,
      })
      // console.log(scroll_left)

    }
  },
  scroll_end:function(e){
    // console.log(e);
    scrolled = false;    
  },
  //开始编辑故事
  go_to_edit: function (event){
    // console.log(event.currentTarget.dataset.rank);
    // console.log(this.data.storys);
    if (!this.data.edit_modle && this.data.storys) {
      this.setData({
        hide_edit_pic: false,
        thinking: this.data.storys[event.currentTarget.dataset.rank].story,//想法
        old_position: this.data.storys[event.currentTarget.dataset.rank].photo_position,
        position_text: this.data.storys[event.currentTarget.dataset.rank].photo_position,//拍摄位置
        chosed_pic: this.data.storys[event.currentTarget.dataset.rank].photo_url[0],//选择的图片
        photo_time: this.data.storys[event.currentTarget.dataset.rank].shooting_time,
        story_rank: event.currentTarget.dataset.rank
      })
      this.preview_pic()
    } else if (!this.data.edit_modle) {
      wx.showToast({
        title: '请切换到编辑模式',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      var that = this;

      this.setData({
        show_edit: true
      })
      setTimeout(function () {
        that.setData({
          show_edit: false
        })
      }, 2000)
    } else if (this.data.storys) {
      this.setData({
        hide_edit_pic: false,
        thinking: this.data.storys[event.currentTarget.dataset.rank].story,//想法
        old_position: this.data.storys[event.currentTarget.dataset.rank].photo_position,
        position_text: this.data.storys[event.currentTarget.dataset.rank].photo_position,//拍摄位置
        chosed_pic: this.data.storys[event.currentTarget.dataset.rank].photo_url[0],//选择的图片
        photo_time: this.data.storys[event.currentTarget.dataset.rank].shooting_time,
        story_rank: event.currentTarget.dataset.rank
      })
    }else{
      this.setData({
        hide_edit_pic: false,
        thinking: '',//想法
        old_position: '',
        position_text: '',//拍摄位置
        chosed_pic: '',//选择的图片
        photo_time: '',
        story_rank: event.currentTarget.dataset.rank
      })
    }
  },
  edit_tips:function(){
    if (!this.data.edit_modle) {
      wx.showToast({
        title: '请切换到编辑模式',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      var that = this;

      this.setData({
        show_edit: true
      })
      setTimeout(function () {
        that.setData({
          show_edit: false
        })
      }, 2000)
    }
  },
  ask_for_edit:function(event){
    var that = this;
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        "token": wx.getStorageSync('token'),
        "type": "A035",
        "data": {
          album_id: this.data.pic_id
        }
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code == 200 && res.data.msg) {
          that.setData({
            edit_modle:true,
            timeBar_high: that.data.storys.length?185 + that.data.storys.length * 435:620,
          })
          setTimeout(function(){
            that.draw_timebar();
          },100)
        } else {
          wx.showToast({
            title: '你的小伙伴正在编辑相册，你不能编辑哦',
            icon: 'none',
            duration: 2000
          })
        }

      },
      fail: function () {
        // console.log("fail");
      }
    });
  },
  close_edit:function(){
    var that = this;
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        "token": wx.getStorageSync("token"),
        "type": "A036",
        "data": {
          "album_id": that.data.pic_id
        }
      },
      success: function (res) {
        if(res.data.code == 200){
          that.setData({
            edit_modle:false,
          })
        }
      }
    })
  },
  delete_albums:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
            method: "POST",
            dataType: 'json',
            header: { 'content-type': 'application/json' },
            data: {
              "token": wx.getStorageSync('token'),
              "type": "A018",
              "data": {
                id: that.data.albums.album_id
              }
            },
            success: function (res) {
              // console.log(res);
              if (res.data.code == 200 && res.data.msg) {
                wx.redirectTo({
                  url: '../index/index',
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 2000
                })
              }

            },
            fail: function () {
              // console.log("fail");
            }
          });        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
   
  },
  back_to_fistory:function(){
    this.setData({
      hide_edit_pic: true,
     
    })
  },
  chose_pic:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res0) {

        tempFilePath = res0.tempFilePaths[0];
        try {
          var token = wx.getStorageSync("token");
          wx.uploadFile({
            url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
            filePath: tempFilePath,
            name: 'photo',
            formData: {
              'token': token,
              'type': 'A023',
              'data': null,
            },
            success: function (res) {
              // console.log(res.data);
              var data = JSON.parse(res.data);
              if (data.code == 200) {
                that.setData({
                  chosed_pic: data.msg,
                })
              } else {
                wx.showToast({
                  title: '选择图片失败',
                  duration: 2000
                })
              }
            },
            error: function (res) {
              // console.log('失败!')
            }
          })
        } catch (e) {

        }
      }
    })
  },
  clear_chosed_pic:function(){
    this.setData({
      chosed_pic: '',
    })
  },
  //预览
  pre_off:function(){
    if(this.data.edit_modle){
      this.setData({
        is_pre: false,
      })
    }else{
      this.setData({
        is_pre: false,
        hide_edit_pic:true,
      })
    }
  },
  preview_pic:function(){
    if(this.data.chosed_pic){
      this.setData({
        is_pre: true,
      })
    }
    
  },
  //拍摄地点
  set_position:function(){
    this.setData({
      position_editing:true,
    })
  },
  get_editing_position:function(event){
    this.setData({
      position_text: event.detail.value,
    })
  },
  position_edit_cancel: function () {
    this.setData({
      position_text: this.data.old_position,
      position_editing: false,
    })
  },
  position_edit_sure: function () {
    this.setData({
      old_position: this.data.position_text,
      position_editing: false,
    })
  },
  //选择时间
  morning: function () {
    this.setData({
      photo_time: "早",
      time_selected1: "../fishot/img/edit/time-selected.png",
      time_selected2: "",
      time_selected3: "",
    })
  },
  //选择时间
  evening: function () {
    this.setData({
      photo_time: "晚",
      time_selected1: "",
      time_selected2: "",
      time_selected3:"../fishot/img/edit/time-selected.png",
    })
  },
  //选择时间
  noom: function () {
    this.setData({
      photo_time: "中",
      time_selected1: "",
      time_selected2: "../fishot/img/edit/time-selected.png",
      time_selected3: "",
    })
  },
  //记录想法
  get_thinking:function(event){
    console.log(event)
    this.setData({
      thinking: event.detail.thinking
    })
  },
  add_storys:function(){
    var that = this;
    var _storys = this.data.storys||[];
    if (isEmpty(_storys)){
      _storys = [{
        "user_id": '',
        "photo_url": [
          ""
        ],
        "story": "",
        "photo_position": "",
        "shooting_time": "",
        "published_time": ""
      },{
        "user_id": '',
        "photo_url": [
          ""
        ],
        "story": "",
        "photo_position": "",
        "shooting_time": "",
        "published_time": ""
      }];
    }else{
      _storys.push({
        "user_id": '',
        "photo_url": [
          ""
        ],
        "story": "",
        "photo_position": "",
        "shooting_time": "",
        "published_time": ""
      })
    }
    for (var i = 0; i < _storys.length; i++) {
      scroll_left.push(0);
      scroll_index.push(0);
    }
    // console.log(_storys)
    this.setData({
      storys: _storys,
      timeBar_high: 185+ this.data.storys.length * 435,
      scroll_left: scroll_left,
      scroll_index: scroll_index,
    })
    setTimeout(function(){

      that.draw_timebar();
    },100)
    // console.log(this.data.storys)
  },
  add_storys_test:function(e){
    this.setData({
      hide_edit_pic: false,
      thinking: '',//想法
      old_position: '',
      position_text: '',//拍摄位置
      chosed_pic: '',//选择的图片
      photo_time: '',
      story_rank: e.currentTarget.dataset.story_index,
      is_add:true
    })
  },
  //更新相册
  upload_story:function(){
    var that = this;
    var length = this.data.storys.length
    var storys;
    if(this.data.is_add){
      if (this.data.storys) {
        storys = this.data.storys.slice(0, this.data.story_rank + 1)
        storys.push({
          "user_id": '',
          "photo_url": [
            this.data.chosed_pic
          ],
          "story": this.data.thinking,
          "photo_position": this.data.old_position,
          "shooting_time": this.data.photo_time,
          "published_time": ""
        })

        
        if ((this.data.story_rank + 1) < length){
          var storys_end = this.data.storys.slice(this.data.story_rank + 1, length)
          storys.push(storys_end)
          console.log(storys)
        }

      } else {
        storys.push({
          "user_id": '',
          "photo_url": [
            this.data.chosed_pic
          ],
          "story": this.data.thinking,
          "photo_position": this.data.old_position,
          "shooting_time": this.data.photo_time,
          "published_time": ""
        })
      }
    }else{
      storys = this.data.storys
      storys[this.data.story_rank].photo_url[0] = this.data.chosed_pic
      storys[this.data.story_rank].story = this.data.thinking
      storys[this.data.story_rank].photo_position = this.data.old_position
      storys[this.data.story_rank].shooting_time = this.data.photo_time
    }
   
  

    try {
      var token = wx.getStorageSync("token");
          wx.request({
            url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
            method: "POST",
            dataType: 'json',
            header: { 'content-type': 'application/json' },
            data: {
              token: token,
              album_id:that.data.pic_id,
              type: "A034",
              data: storys
                
            },
            success: function (res) {
              // console.log(res)
              for (var i = 0; i < storys.length; i++) {
                scroll_left.push(0);
                scroll_index.push(0);
              }
              
              that.setData({
                storys: storys,
                hide_edit_pic: true,
                scroll_left: scroll_left,
                scroll_index: scroll_index,
                edit_modle:false
              })
              
             
            },
            fail: function () {
              // console.log("fail");
             
              
            }
          });
    } catch (e) {

    }
  },
  



  


  show_member:function(){
    wx.navigateTo({
      url: '../member/member?id=' + this.data.pic_id,
    })
  }
})





