// pages/cart/cart.js
import {Cart} from 'cart-model.js';
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 用户离开此页面
   */
  onHide:function(){
    cart.execSetStorageSync(this.data.cartData);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    var cartData = cart.getCartDataFromLocal();
    //var countsInfo = cart.getCartTotalCounts(true);
    var cal = this._calcTotalAccountAndCounts(cartData);
    this.setData({
      selectedCount: cal.selectedCounts,
      cartData:cartData,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
    });
  },

  _calcTotalAccountAndCounts:function(data){
    var len = data.length,
      //只包含选中的价格
      account = 0,
      //商品的总数量
      selectedCounts = 0,
      //商品的种类之和
      selectedTypeCounts = 0;
    let multiple = 100;
    for (let i = 0; i < len; i++) {
      //避免 0.05 + 0.01 = 0.060 000 000 000 000 005 的问题，乘以 100 *100
      if (data[i].selectStatus) {
        account += data[i].counts * multiple * Number(data[i].price) *  
        multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple * multiple)
    }
  },
  /**
   * 是否勾选
   */
  toggleSelect:function(event){
    var id = event.currentTarget.dataset.id;
    var status = event.currentTarget.dataset.status;
    var index = this._getProductIndexById(id);

    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  /**
   * 更新购物车商品数据
   */
  _resetCartData: function () {
    /*重新计算总金额和商品总数*/
    var newData = this._calcTotalAccountAndCounts(this.data.cartData); 
    this.setData({
      account: newData.account,
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      cartData: this.data.cartData
    });

  },

  /**
   * 根据商品id得到 商品所在下标
   */
  _getProductIndexById: function (id) {
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].id == id) {
        return i;
      }
    }
  },

  /**
   * 全选
   */
  toggleSelectAll:function(event){
    var status = event.currentTarget.dataset.status == 'true';
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },

  /**
   * 加减
   */
  changeCounts:function(event){
    var id = event.currentTarget.dataset.id;
    var type = event.currentTarget.dataset.type;
    var index = this._getProductIndexById(id);
    var counts = 1
    if(type == 'add'){
      cart.addCounts(id);
    }else{
      counts = -1;
      cart.cutCounts(id);
    }
    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  delete: function (event) {
    var id = event.currentTarget.dataset.id;
    var index = this._getProductIndexById(id);
    this.data.cartData.splice(index, 1);//删除某一项商品
    this._resetCartData();

    cart.delete(id);  //内存中删除该商品
  },
  
  /**
   * 去下单页面
   */
  submitOrder:function(event){
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    })
  }
})