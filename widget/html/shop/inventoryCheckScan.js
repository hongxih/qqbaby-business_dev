define(function (require, exports, module) {
    var Http = require('U/http');
    // var FNScanner = require('U/scanner');
    var batchId = api && api.pageParam.batchId;
    var orderId = api && api.pageParam.orderId;
    var style='cumulative';
    var vm = new Vue({
        el: '#inventoryCheckScan',
        template: _g.getTemplate('shop/inventoryCheckScan-body-V'),
        data: {
              type:0,
              searchInput:'',
              product_name:"",
              bar_code:"",
              check_amount:"",
              product_id:null,
              sku_code:"",
              sku_name:"",
              unit:"",
              item:[]

        },
        created: function () {
        },
        methods: {
            onBackTap:function () {
                api && api.closeWin();
            },
            onChange:function(i){
                 this.type=i;
                  if(i===1){
                    style="replace";
                }else{
                    style="cumulative";
                }
            },
            resetInput:function(){
              this.searchInput='';
            },
            search:function(){
                if(this.searchInput==""){
                    _g.toast("请输入搜索内容");
                }
                getGoods();
            },
            change:function(){
                 api.sendEvent && api.sendEvent({
                    name: 'shop-addInventoryCheck-closeScanner',
                });
                api && api.closeFrame();
            }
        }
    });
//搜索框查询商品
   var getGoods=function(){
    var _data={
                check_batch_id:batchId,
                check_order_id:orderId,
                query_name:vm.searchInput
            };
    var _url='/app/auth/erp/stock/listScanQueryGoods.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            isSync:true,
            success:function(ret){
              logger.log({"Type":"operation","action":"扫码页面搜索框查询商品","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
               if(ret.success){
                  for(var i=0;i<ret.object.length;i++){
                     vm.item[i]={};
                     vm.item[i].value=null;
                  }
                  vm.item=ret.object;
                  setTimeout(function(){
                        api && api.openFrame({
                            name: 'shop-scanSide',
                            url: '../shop/scanSide.html',
                            pageParam:{
                                  batchId:batchId,
                                  orderId:orderId,
                                  style:style,
                                  item:ret.object
                            },
                            rect: {
                                x: 0,
                                y: 0,
                                w: 'auto',
                                h: 'auto',
                            }
                        })
                  },0)

                   // vm.item=dataChange(ret.object);
                  // vm.product_name=ret.object.product_name,
                  // vm.bar_code=ret.object.bar_code,
                  // vm.check_amount=ret.object.check_amount,
                  // vm.product_id=ret.object.product_id,
                  // vm.sku_code=ret.object.sku_code,
                  // vm.sku_name=ret.object.sku_name,
                  // vm.unit=ret.object.unit

               }else{
                  _g.toast(ret.message);
               }
            },
            error:function(err){}
        });
    }


    api && api.addEventListener({
        name: 'shop-inventoryCheckScan-openAlert'
    }, function(ret, err) {
        setTimeout(function () {
            api && api.openFrame({
                name: 'shop-scanSide',
                url: '../shop/scanSide.html',
                pageParam:{
                      batchId:ret.value.batchId,
                      orderId:ret.value.orderId,
                      style:style,
                      item:ret.value.item
                },
                rect: {
                    x: 0,
                    y: 0,
                    w: 'auto',
                    h: 'auto',
                }
            });
        },100)
    });
    module.exports = {};
});
