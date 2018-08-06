import{Config} from '../utils/config.js';
import{Token} from 'token.js';
class Base{
  constructor(){
    this.baseRequestUrl = Config.restUrl;
  }
  //noRefetch为true时不做重复调用
  request(params,noRefetch){
    var that = this;
    var url = this.baseRequestUrl + params.url;
    if(!params.type){
      params.type = 'GET';
    }
    wx.request({
      url: url,
      data: params.data,
      header: {
        'content-type':'application/json',
        'token':wx.getStorageSync('token'),
      },
      method: params.type,
      success: function(res) {
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if(startChar == '2'){
          params.sCallback && params.sCallback(res.data);
        }
        else{
          if(code == '401'){
            if(!noRefetch){
              that._refetch(params);
            }
          }
          //noRefetch无值表示可以进行重发，不需要调用错误回掉
          if(noRefetch){
            params.eCallback && params.eCallback(res.data);
          } 
        }
      },
      fail: function(res) {
        // 这个函数标识调用本身是失败的
        // 当服务器本身调用成功，但是返回错误信息时，还是会走success
        console.log(res);
      },
    })     
  }

  /**
   * 处理token错误
   *    重新获取Token 并再次发送请求
   */
  _refetch(params){
    var token = new Token();
    token.getTokenFromServer((token)=>{
      //箭头函数可以保持当前环境变量  所以还可以用this
      this.request(params,true);
    });
  }

};

export{Base};