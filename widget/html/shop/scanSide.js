define(function (require, exports, module) {
  var Http = require('U/http');
  var batchId=api && api.pageParam.batchId;
  var orderId=api && api.pageParam.orderId;
  var check_strategy=api && api.pageParam.style;
  var item=api && api.pageParam.item;
   function keyevent(e){
        keyCode=e.keyCode;
     }
    document.onkeydown = keyevent;

    var scanSide = new Vue({
        el: '#scanSide',
        template: _g.getTemplate('shop/scanSide-body-V'),
        data: {
        	  item:item
        },
        methods:{
        	save:function(value,product_id,sku_code){
        		  setTimeout(function(){
                     if(_g.isAndroid && keyCode===9){
                            if(!value){
                                _g.toast("请输入盘点数量");
                                return false;
                            }else{
                                saveData(value,product_id,sku_code);
                            }
                     }
                     if(_g.isIOS && keyCode===13){
                             if(!value){
                                _g.toast("请输入盘点数量");
                                return false;
                            }else{
                                saveData(value,product_id,sku_code);
                            }
                    }
                  },0);

        	}

        }

    });
     var saveData=function(value,product_id,sku_code){
      var _data={
                check_amount:value,
                check_batch_id:batchId,
                check_order_id:orderId,
                product_id:product_id,
                sku_code:sku_code,
                check_strategy:check_strategy
            };
      var  _url='/app/auth/erp/stock/saveErpCheckOrder.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            success:function(ret){
              logger.log({"Type":"operation","action":"扫码弹出框保存数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                _g.toast(ret.message);
                api && api.closeFrame();
            },
            error:function(){}
        });
    }

    })
