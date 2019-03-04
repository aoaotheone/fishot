//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.checkSession({
      success: function () {
        var token = wx.getStorageSync('token');
        // console.log(token)
        if(!token){
          wx.login({
            success: function (res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: 'https://www.yiluzou.cn/Fishot/public/index.php/index',
                  method: "POST",
                  dataType: 'json',
                  header: { 'content-type': 'application/json' },
                  data: {
                    "token": "gettoken",
                    "type": "A001",
                    "data": {
                      "code": res.code
                    }
                  },
                  success: function (res) {
                    // console.log(res.data);
                    if (res.data.code == 200) {
                      wx.setStorageSync('token', res.data.msg.token)
                    }else{
                      console.log("登录失败")
                    }
                  },
                  fail: function () {
                    console.log("登陆失败");
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          });
        }
      },
      fail: function () {
        wx.login({
          success: function (res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://www.yiluzou.cn/Fishot/public/index.php/index',
                method: "POST",
                dataType: 'json',
                header: { 'content-type': 'application/json' },
                data: {
                  "token": "gettoken",
                  "type": "A001",
                  "data": {
                    "code": res.code
                  }
                },
                success: function (res) {
                  // console.log(res.data);
                  if (res.data.code == 200) {
                    wx.setStorageSync('token', res.data.msg.token)
                  } else {
                    console.log("登录失败")
                  }
                },
                fail:function(){
                  console.log("登陆失败");
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    })
    // if (!wx.getStorageSync("token")) {
    //   wx.login({
    //     success: function (res) {
    //       if (res.code) {
    //         //发起网络请求
    //         wx.request({
    //           url: 'https://www.yiluzou.cn/Fishot/public/index.php/index',
    //           method: "POST",
    //           dataType: 'json',
    //           header: { 'content-type': 'application/json' },
    //           data: {
    //             "token": "gettoken",
    //             "type": "A001",
    //             "data": {
    //               "code": res.code
    //             }
    //           },
    //           success: function (res) {
    //             // console.log(res.data);
    //             if (res.data.code == 200) {
    //               wx.setStorageSync('token', res.data.msg.token)
    //             } else {
    //               console.log("登录失败")
    //             }
    //           }
    //         })
    //       } else {
    //         console.log('获取用户登录态失败！' + res.errMsg)
    //       }
    //     }
    //   });
    // }
  },

  getUserInfo: function(cb) {
    var that = this
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        that.globalData.userInfo = res.userInfo
        typeof cb == "function" && cb(that.globalData.userInfo)
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,将无法正常使用小程序,点击确定重新获取授权。',
          success: function (res1) {
            if (res1.confirm) {
              wx.openSetting({
                success: (res2) => {
                  if (res2.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                    wx.getUserInfo({
                      withCredentials: false,
                      success: function (res3) {
                        that.globalData.userInfo = res3.userInfo
                        typeof cb == "function" && cb(that.globalData.userInfo)
                      }
                    })
                  }
                }, fail: function (res) {

                }
              })

            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null
  }
})
