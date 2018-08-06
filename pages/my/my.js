// pages/my/my.js
import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';
const app = getApp();
var address = new Address();
var order = new Order();
var my = new My();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageIndex:1,
    orderArr:[],
    isLoadedAll:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
    this._getOrders();
  },

  /**
   * 滑动到底部触发
   */
  onReachBottom:function(){
    if(!this.data.isLoadedAll){
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  /**
   * 加载订单数据
   */
  _getOrders(){
    order.getOrders(this.data.pageIndex,(res)=>{
      var data = res.data;
      if(data.length>0){
        this.data.orderArr.push.apply(this.data.orderArr,data);
        this.setData({
          orderArr: this.data.orderArr
        });
      }else{
        this.data.isLoadedAll = true;
      }
      
    }); 
  },

  /**
   * 初始化用户地址信息
   */
  _getAddressInfo(){
    address.getAddress((data) => {
      this._bindAddressInfo(data);
    });
  },

  /**
   * 绑定数据信息
   */
  _bindAddressInfo:function(data){
    this.setData({
      addressInfo:data
    });
  },

  /**
   * 调用授权
   */
  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo;
    if (!e.detail.userInfo){
      userInfo = {
        avatarUrl: '../../imgs/icon/user@default.png',
        nickName: '疾风'
      };
    }
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
  },

  _loadData:function(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },  


  rePay: function (event) {
    var id = event.currentTarget.dataset.id,
      index = event.currentTarget.dataset.index;

    //online 上线实例，屏蔽支付功能
    if (order.onPay) {
      this._execPay(id, index);
    } else {
      this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽');
    }
  },

  editAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };

          that._bindAddressInfo(addressInfo);
          //保存地址
          address.submitAddress(res, (flag) => {
            if (!flag) {
              that.showTips('操作提示', '地址信息更新失败！');
            }
          });
      }
    })
  },

  showOrderDetailInfo:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/order?from=order&id='+id,
    });
  },

  showTips: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
      }
    });
  },
})