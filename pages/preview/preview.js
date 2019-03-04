// pages/preview/preview.js
Component({
  properties: {

    chosed_pic: {
      type: String,
      value: '',
    },
    story: {
      type: String,
      value: '',
    },
    position_text: {
      type: String,
      value: '',
    },
    photo_time: {
      type: String,
      value: '',
    },
    userInfo: {
      type: Object,
      value: {},
    },
  },

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  methods:{
    pre_off:function(){
      this.triggerEvent('off_pre',{})
    }
  }

})