import{Base} from '../../utils/base.js';

class Cart extends Base{
  constructor(){
    super();
    this._storageKeyName = 'cart';
  }
  /**
   * 添加购物车
   *  有该商品 则对应数量+counts
   *  没有该商品，则添加一条新纪录
   *    （商品对象，商 品数目）
   */
  add(item,counts){
    var cartData = this.getCartDataFromLocal();
    var isHasInfo = this._isHasThatOne(item.id,cartData);
    if(isHasInfo.index == -1){
      item.counts = counts;
      item.selectStatus = true; //设置选中状态
      cartData.push(item);
    }else{
      cartData[isHasInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName, cartData)
  }
  /**
   * 从缓存读取购物车数据
   */
  getCartDataFromLocal(flag){
    var res = wx.getStorageSync(this._storageKeyName);
    if(!res){
      res = [];
    }

    if(flag){
      var newRes = [];
      for(let i=0;i<res.length;i++){
        if(res[i].selectStatus){
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }
    return res;
  }
  /**
   * 判断是否被添加到购物车
   */
  _isHasThatOne(id, arr) {
    var item,
      result = { index: -1 };
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        };
        break;
      }
    }
    return result;
  }

  /*
    *获得购物车商品总数目,包括分类和不分类
    * param:
    * flag - {bool} 是否区分选中和不选中
    * return
    * counts1 - {int} 不分类
    * counts2 -{int} 分类
    */
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal(),
      counts1 = 0,
      counts2 = 0;
    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts1 += data[i].counts;
          counts2++;
        }
      } else {
        counts1 += data[i].counts;
        counts2++;
      }
      //counts1 = counts1+data[i].counts;
    }
    // return {
    //   counts1: counts1,
    //   counts2: counts2
    // };
    return counts1;
  };
  
  /**
   * 修改商品数目
   * params:
   * id - {int} 商品id
   * counts -{int} 数目
   */
  _changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartData);
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts > 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);  //更新本地缓存
  };

 /**
  * 增加商品数目
  */
  addCounts(id) {
    this._changeCounts(id, 1);
  };

 /**
  * 减
  */
  cutCounts(id) {
    this._changeCounts(id, -1);
  };

  /**
   * 删除  一或多
   */
  delete(ids){
    if(!(ids instanceof Array)){
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);  //删除数组某一项
      }
    }
    this.execSetStorageSync(cartData);
  };


  /**
   * 更新缓存
   */
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  };
}

export{Cart};