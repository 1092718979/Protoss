// pages/product/product.js
import {Product} from 'product-model.js';
import {Cart} from '../cart/cart-model.js'
var product = new Product();
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    countsArray:[1,2,3,4,5,6,7,8,9,10],
    productCounts:1,
    currentTabsIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },

  _loadData: function () {
    product.getDetailInfo(this.data.id, (res) => {
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        'product': res,
      });
    })
  },
  
  onCartTap: function (event) {
    //跳转Tap栏不能用navigationto
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },

  bindPickerChange:function(event){
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index];
    this.setData({
      'productCounts':selectedCount
    });
  },

  onTabsItemTap:function(event){
    var index = event.currentTarget.dataset.index;
    this.setData({
      currentTabsIndex:index,
    });
  },

  onAddingToCartTap:function(event){
    this.addToCart();
    var counts = this.data.cartTotalCounts + this.data.productCounts;
    this.setData({
      cartTotalCounts: cart.getCartTotalCounts(),
    });
  },

  addToCart: function () {
    var tempObj = {}, keys = ['id', 'name', 'main_img_url', 'price'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }
    cart.add(tempObj, this.data.productCounts);
  },

})