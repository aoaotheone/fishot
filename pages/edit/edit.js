// pages/edit/edit.js
Component({

  /**
   * 页面的初始数据
   */
  properties: {
    chosed_pic: {
      type: String,
      value: '',
    },
    time_selecteda: {
      type: String,
      value: '',
    },
    time_selectedb: {
      type: String,
      value: '',
    },
    time_selectedc: {
      type: String,
      value: '',
    },
    thinking: {
      type: String,
      value: '',
    },
  },
  data: {
    default_chose_pic: "../fishot/img/edit/default.png",//默认图片
  },
  methods:{
    preview_pic:function(){
      this.triggerEvent("pre_pic", {})
    },
    clear_chosed_pic: function () {
      this.triggerEvent("clear_pic", {})
    },
    chose_pic: function () {
      this.triggerEvent("chose_pic", {})
    },
    set_position: function () {
      this.triggerEvent("set_position", {})
    },
    morning: function () {
      this.triggerEvent("morning", {})
    },
    noom: function () {
      this.triggerEvent("noom", {})
    },
    evening: function () {
      this.triggerEvent("evening", {})
    },
    get_thinking: function (event) {
      console.log(event)
      this.triggerEvent("get_thinking", { 'thinking':event.detail.value})
    },
    upload_story: function () {
      this.triggerEvent("upload_story", {})
    },
    back_to_fistory:function(){
      this.triggerEvent("back_to_fistory", {})
    }
  }
})