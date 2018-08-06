import{Base} from '../../utils/base.js'

class Home extends Base{
  /**
   * 构造函数
   */
  constructor(){
    super();
  }
  /**
   * 获取Banner数据列表
   */
  getBannerData(id,callback){
    var params = {
      url:'banner/' + id,
      sCallback:function(res){
        callback && callback(res.items);
      },
    }
    this.request(params);
  }
  /**
   * 获取theme标题
   */
  getThemeData(callback){
    var params ={
      url:'theme?ids=1,2,3',
      sCallback: function (res) {
        callback && callback(res);
      },
    }
    this.request(params);
  }
  /**
   * 获取最新商品
   */
  getProductsDate(callback){
    var params = {
      url: 'product/recent',
      sCallback: function (res) {
        callback && callback(res);
      },
    }
    this.request(params);
  }

}

export {Home};