//index.js
//获取应用实例

//图片裁剪相关变量
const ctx = wx.createCanvasContext('cover-preview');
var start_position = {};//移动图片时手指起始坐标
var tempFilePath;//图片路径
var tempWidth;//图片初始宽度
var tempHeight;//图片初始高度
var old_x = 0;//图片初始x坐标
var old_y = 0;//图片初始y坐标
var _touches = 1;//触屏的手指数
var old_scale = 1;//原始放大倍数
var new_scale = 1;//新的放大倍数
var is_move = false;//是否移动
var bg_url;



var v_width = wx.getSystemInfoSync().screenWidth;
var v_height = wx.getSystemInfoSync().screenHeight;
var rect_bottom = 0;

var userInfo = {};
var app = getApp();
function isEmpty(value) {
  return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}
Page({
  data: {
    userInfo: {},//用户信息
    is_token: false,//token是否存在
    hide_canvas:true,//绘图层
    edit_url:'',//裁剪图片的路径


//轮播图相关
    imgUrls: [],
    banner_diary:[],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,


//页面显示时的相关变量
    index_img:"images/index_chosed.png",
    me_img: "images/me.png",
    index_hide: false,
    me_hide:true,

//我的页面相关变量
    me_words:'',//个性签名
    editing:false,//是否在编辑
    editing_words:'',
    old_words:'',//编辑前的签名
    picture_selected:true,
    me_top:0,
    botton_top: 426,
    z_index:600,
    me_text_color:"#ffffff",

//相册容器相关变
    fi_story_hide:false,
    isBottom:false,//是否到底了
    albums:'',//遍历相册
    all_albums:'',//所有相册

  },
  getRect: function () {
    var that = this;
    wx.createSelectorQuery().select('.main').boundingClientRect(function (rect) {

      rect_bottom = rect.bottom
      if (rect.bottom - v_height <= 10){
        var now_length = that.data.albums.length;
        that.setData({
          albums: that.data.all_albums.slice(0, now_length + 5)
        })
      }
    }).exec()
  },
  onPullDownRefresh: function () {
    this.get_token();
    
  },
  onLoad: function () {
  
  },
  onPageScroll: function (e) {
    this.getRect();    
    // console.log(rect_bottom);    
    var that = this
    if (this.data.botton_top == 426 && this.data.index_hide){
      this.setData({
        botton_top:0,
        me_top:-426,
        z_index:100,
        me_text_color:"#333333"
      })
      return false;      
    }
    if (e.scrollTop == 0 && this.data.botton_top == 0 && this.data.index_hide && rect_bottom>550) {
      this.setData({
        botton_top: 426,
        me_top: 0,
        z_index: 600,
        me_text_color: "#ffffff"
      })
      return false;
    }
  },
  onShow: function () {
    var that = this;
    app.getUserInfo(function (res) {
      //更新数据
      // //console.log.log(res)
        userInfo = res;
        that.get_token();
  
    })
   
  },
  onShareAppMessage: function (e) {
    var token = wx.getStorageInfoSync('token')
    if (e.from === 'button' && e.target.id === 'diary-share') {
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
  onHide:function (){
    // wx.showModal({
    //   title: '提示',
    //   content: '是否要推出',
    // })
  },
  //获取token
  get_token:function(){
    var that = this;
    var is_token = false;
    var me_words='';
    var bg_url='';
    var banner_diary = '';
    var imgurl = [];
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
            "type": "A014",
            "data": null
          },
          success: function (res) {
            // //console.log.log(res);
            if (res.data.code == 200 && res.data.msg) {
              me_words= res.data.msg
              
              // that.setData({
              //   me_words: res.data.msg,
              //   old_words: res.data.msg,
              // })
            } else {
              // //console.log.log(res.data)
            }
          }
          });
        wx.request({
          url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
          method: "POST",
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          data: {
            "token": token,
            "type": "A015",
            "data": null
          },
          success: function (res) {

            // //console.log.log(res.data);
            if (res.data.code == 200 && res.data.msg) {
              bg_url = res.data.msg

              // that.setData({
              //   bg_url: res.data.msg
              // })
            } else {
              // //console.log.log(res.data)
            }
          }
        });
        wx.request({
          url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
          method: "POST",
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          data: {
            "token": token,
            "type": "A039",
            "data": null
          },
          success: function (res) {

            // //console.log.log(res.data);
            if (res.data.code == 200 && res.data.msg) {
              banner_diary = res.data.msg;
              // that.setData({
              //   bg_url: res.data.msg
              // })
            } else {
              //console.log.log(res.data)
            }
          }
        });
        // //console.log.log(userInfo)
        wx.request({
          url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
          method: "POST",
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          data: {
            "token": token,
            "type": "A033",
            "data": {
              'url': userInfo.avatarUrl,
              'name': userInfo.nickName
            }
          },
          success: function (res) {
            // console.log(res)
        
            if (res.data.code) {
              

              // that.setData({
              //   bg_url: res.data.msg
              // })
            } else {
              // //console.log.log(res.data)
            }
          },
          fail:function(res){
            //console.log.log(res);
          }
        });
        wx.request({
          url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
          method: "POST",
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          data: {
            "token": token,
            "type": "A024",
            "data": {
              page:0,
              size:0
            }
          },
          success: function (res) {
            // console.log(res.data.msg);
            setTimeout(function(){
              if (res.data.code == 200 && !isEmpty(res.data.msg)) {
                // //console.log.log(Boolean(res.data.msg))
                that.setData({
                  me_words: me_words,
                  old_words: me_words,
                  bg_url: bg_url,
                  all_albums: res.data.msg,
                  albums: res.data.msg.slice(0, 5),
                  userInfo: userInfo,
                  banner_diary: banner_diary
                })
              } else {
                that.setData({
                  me_words: me_words,
                  old_words: me_words,
                  bg_url: bg_url,
                  userInfo: userInfo,
                  banner_diary: banner_diary
                })
              }
            },100)
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
      },1000
    )
    // //console.log.log(wx.getStorageSync("token"));
  },
  //跳转到我的页面
  jump_to_me: function(){
    this.setData({
      index_hide: true,
      me_hide: false,
      index_img: "images/index.png",
      me_img: "images/me_chosed.png"
    })
  },
  //跳转到首页
  jump_to_index: function () {
    this.setData({
      index_hide: false,
      me_hide: true,
      index_img: "images/index_chosed.png",
      me_img: "images/me.png"
    })
  },
  //跳转到相册编辑页面
  jump_to_pic: function(){
    wx.navigateTo({
      url: '../create_album/create_album',
    })
  },
  //选择并将图片输出到canvas
  change_cover:function(){
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
                  // //console.log.log(res.width)
                  // //console.log.log(res.height)
                  tempWidth = res.width;
                  tempHeight = res.height;
                  ctx.drawImage(tempFilePath,0, 0, 375,res.height/res.width*375);
                  ctx.draw();
                }
              })
              
            }
          })
        } else if (res.cancel) {
          //console.log.log('用户点击取消')
        }
      }
    })
  },
  //监听手指触摸事件，并判断是移动还是缩放，并记录初始状态
  canvas_start:function(e){
    // //console.log.log(e);
    var touches = e.touches.length;
    if(touches == 1){
      _touches = 1;
      start_position = { x: e.touches[0].x, y: e.touches[0].y, timeStamp:e.timeStamp}
    }else if(touches == 2){
      _touches = 2;
      start_position = { x: e.touches[0].x, y: e.touches[0].y,x1: e.touches[1].x, y1: e.touches[1].y, timeStamp: e.timeStamp }

    }else{
      _touches = 1;
    }
  },
  //监听手指移动事件，并做出相应调整
  canvas_move: function (e) {
    ctx.clearActions();
    // //console.log.log(e);
    var touches = e.touches.length;
    if (_touches == 1 && e.timeStamp - start_position.timeStamp > 150) {
      ctx.drawImage(tempFilePath, old_x + e.touches[0].x - start_position.x, old_y + e.touches[0].y - start_position.y, 375 * new_scale, tempHeight / tempWidth * 375 * new_scale);
      ctx.draw();
      is_move = true;
    } else if (_touches == 2 && e.timeStamp - start_position.timeStamp > 150) {
      var change_x = Math.abs(Math.abs(e.touches[0].x - e.touches[1].x) - Math.abs(start_position.x - start_position.x1));
      var change_y = Math.abs(Math.abs(e.touches[0].y - e.touches[1].y) - Math.abs(start_position.y - start_position.y1));
      if(change_x - change_y > 10){
        old_scale = Math.abs(e.touches[0].x - e.touches[1].x) / Math.abs(start_position.x - start_position.x1);
      }else{
        old_scale = Math.abs(e.touches[0].y - e.touches[1].y) / Math.abs(start_position.y - start_position.y1);
      }
      ctx.drawImage(tempFilePath, old_x, old_y, 375 * old_scale * new_scale, tempHeight / tempWidth * 375 * old_scale * new_scale);
      ctx.draw();
      is_move = true;
    }else{
      is_move = false;
    }
  },
  //监听手指离开动作，并保存当前状态数据
  canvas_end: function (e) {
    // //console.log.log(e);
    if (_touches == 1 && is_move) {
      old_x = old_x + e.changedTouches[0].x - start_position.x;
      old_y = old_y + e.changedTouches[0].y - start_position.y;
    } else if (_touches == 2 && is_move) {
      new_scale = old_scale * new_scale;
    }
    
  },
  //确定并上传背景图
  upload_bg:function(){
    var that = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    // //console.log.log(screenWidth);
    wx.canvasToTempFilePath({
      x: 0,
      y: screenWidth / 750 * 400,
      width: screenWidth + 2,
      height: screenWidth / 750 * 526 + 2,
      destWidth: screenWidth,
      screenHeight: screenWidth / 750 * 526,
      quality:1,
      canvasId: 'cover-preview',
      success: function (res) {
        ctx.clearActions();
        
        that.setData({
          hide_canvas: true,
        })
        //console.log.log(res.tempFilePath)
        try {
          var token = wx.getStorageSync("token");
          //console.log.log(token)
          if (token) {
            wx.uploadFile({
              url: 'https://www.yiluzou.cn/Fishot/public/index.php/index', //仅为示例，非真实的接口地址
              filePath: res.tempFilePath,
              name: 'photo',
              formData: {
                'token': token,
                'type': 'A016',
                'data': null
              },
              success: function (res) {
                ctx.clearActions();
                //console.log.log(res);
                var data = JSON.parse(res.data);
                if (data.code == 200) {
                  that.setData({
                    bg_url:data.msg
                  })
                  wx.showToast({
                    title: '背景设置成功',
                    duration: 2000
                  })
               
                } else {
                  wx.showToast({
                    title: '背景设置失败',
                    icon:'none',
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
  cancel_croper:function(){
    ctx.clearActions();
    this.setData({
      hide_canvas: true,
      // edit_url: tempFilePath
    })
  },
  //开始编辑签名
  me_edit_words: function(){
    this.setData({
      editing: true,
    })
  },
  //记录正在编辑的签名
  get_editing_words: function(event){
    this.setData({
      me_words:event.detail.value
    })
    //console.log.log(this.data.me_words)
  },
  //保存签名
  me_save_words_submit: function () {
    this.setData({
      editing: false,
    })
  
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method:"POST",
      dataType:'json',
      header: { 'content-type': 'application/json' },
      data:{
        type:"A013",
        token: wx.getStorageSync("token"),
        data:{
          personality_signature:this.data.me_words
        }
      },
      success:function(res){
        if(res.data.code == 200){
          wx.showToast({
            title: '签名已更新',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '设置签名失败',
            duration: 2000
          })
          this.setData({
            me_words: this.data.old_words,
          })
        }
      }
    })
    
    
   
  },
  //取消签名编辑
  me_save_words_cancel: function () {
    this.setData({
      editing: false,
      me_words:this.data.old_words,
    })
    
    // //console.log.log("cancel");
   
  },
  //切换到群相册
  fi_story_click: function(){
    this.setData({
      picture_selected:true,
      fi_story_hide:false
    })
  },
  //切换到我的相册
  my_pic_click: function () {
    this.setData({
      picture_selected: false,
      fi_story_hide: true
    })
  },
  //查看相册详细信息
  album_detail_page:function(event){
    // //console.log.log(event);
    wx.navigateTo({
      url: '../fishot/fishot?userInfo=' + JSON.stringify(this.data.userInfo) + '&albums=' + JSON.stringify(this.data.albums[event.currentTarget.dataset.albumIndex]),
    })
  },
  secreting:function(e){
    console.log(this.data.albums)
    var _albums = this.data.albums;
    _albums[e.currentTarget.dataset.secret].state = _albums[e.currentTarget.dataset.secret].state == 1?0:1
    this.setData({
      albums:_albums
    })
    wx.request({
      url: "https://www.yiluzou.cn/Fishot/public/index.php/index",
      method: "POST",
      dataType: 'json',
      header: { 'content-type': 'application/json' },
      data: {
        type: "A045",
        token: wx.getStorageSync("token"),
        data: {
          album_id: this.data.albums[e.currentTarget.dataset.secret].album_id
        }
      },
    })
  }
  
})