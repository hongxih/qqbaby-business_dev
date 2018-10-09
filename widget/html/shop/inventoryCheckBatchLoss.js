define(function (require, exports, module) {
    var Http = require('U/http');
    var batch_id = api && api.pageParam.id;
    var audit_status=api && api.pageParam.audit_status;
    var start = false;
    var vm = new Vue({
        el: '#inventoryCheckBatchLoss',
        template: _g.getTemplate('shop/inventoryCheckBatchLoss-body-V'),
        data: {
            isLoading:false,
            isClick:false,
            isLoss:true,
            isclick:false,
            isInput:false,
            audit_status:audit_status,
            noBatch:null,
            item:[]
        },
        created: function () {
        },
        methods: {
            onCreateLoss:function () {
                logger.log({"Type":"operation","action":"点击生成漏盘按钮","Win_name":api.winName});
                var check_miss_time=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                generatorCheckMiss(check_miss_time);
                this.isClick=true;
            },
            onSelect:function(i){
                if(this.item[i].isSelect==false){
                    this.item[i].isSelect = true;
                }else{
                    this.item[i].isSelect = false;
                }
            },
            onBlur:function (i) {
                setTimeout(function () {
                    vm.isInput=false;
                },300)
            },
            onFocus:function () {
                this.isInput=true;
            },
            onAddBatch:function () {
                _g.openWin({
                       header: {
                           data: {
                               title: '新增编辑盘点单',
                               searchInput:'',
                               placeholder:'条码/自编码/助记码',
                               mode:"search",
                               type:1
                           },
                           template:'../html/header/header-addInventoryCheck-V'
                       },
                       name: 'shop-addInventoryCheck',
                       url: '../shop/addInventoryCheck.html',
                       bounces: false,
                       pageParam: {
                           check_batch_id:batch_id,
                       }
               });
                // api &&　api.closeFrameGroup({
                //     name:'shop-inventoryCheckBatchDetail',
                // });
            },
            onRestartLoss:function () {
                logger.log({"Type":"operation","action":"点击重新生成漏盘按钮","Win_name":api.winName});
                if(start==true){
                    return false;

                }else{
                    var check_miss_time=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                    generatorCheckMiss(check_miss_time);
                    this.item=[];
                    this.isClick=true;
                    loadmore.reset();
                    //getLoss();
                }
            },
        }
    });
    //倒计时60秒
    var Count=function(){
        start=true;
        // document.getElementById("button").disabled=true;
         // $("#button").attr('disabled',true);
        var seconds=59;
        var timer=setInterval(function(){
            document.getElementsByClassName("ui-inventoryCheckBatchDetail_footerRight")[0].innerHTML="距离再次查询漏盘结果还剩"+seconds+"秒";
            seconds=seconds-1;
        },1000);
        setTimeout(function(){
            start=false;
            clearInterval(timer);
            vm.isclick=false;
            document.getElementsByClassName("ui-inventoryCheckBatchDetail_footerRight")[0].innerHTML="重新生成漏盘信息";
            var check_miss_time=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
            isComplete(check_miss_time);
        },60000);
    }
//手动生成漏盘信息
var generatorCheckMiss = function (check_miss_time) {
    vm.isLoss=true;
    var _data={
            check_batch_id:batch_id,
            check_miss_time:check_miss_time
        };
    var _url='/app/auth/erp/stock/generatorCheckMiss.do';
    Http.ajax({
        data:_data,
        url:_url,
        api_versions:'v2',
        success:function(ret){
            logger.log({"Type":"operation","action":"手动生成漏盘信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
            // _g.hideProgress();
           if(ret.success){
                  isComplete(check_miss_time);
           }else{
              _g.toast(ret.message);
              vm.isclick=true;
              vm.isLoading=true;
              Count();
           }
        },
        error:function(err){
            // _g.hideProgress();
        }
    });
};

//判断漏盘是否已经生成
var isComplete=function(check_miss_time){
    var _data={
            check_batch_id:batch_id,
            miss_create_time:check_miss_time
        };
    var _url='/app/auth/erp/stock/getCheckMissRecord.do';
    Http.ajax({
        data:_data,
        url:_url,
        api_versions:'v2',
        success:function(ret){
            logger.log({"Type":"operation","action":"判断漏盘是否已经生成","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
           if(ret.success===true){
               vm.isLoading=false;
               getLoss();
               clearTimeout(int);
           }else{
                vm.isLoading=true;
                //var check_miss_time=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
               var int=setTimeout(function(){
                    isComplete(check_miss_time);
                },10000);
           }
        },
        error:function(err){}
    });
}

    //漏盘接口
    var getLoss=function(opts,callback){
        vm.isLoading=false;
        var opts=opts||{};
         var _data={
                check_batch_id:batch_id || '',
                displayRecord:10,
                page:opts.page||1
            };
        var _url='/app/auth/erp/stock/listCheckMiss.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            // isSync:true,
            success:function(ret){
                logger.log({"Type":"operation","action":"获取漏盘列表","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                vm.isLoading=false;
               if(ret.success){
                    if(opts.page || opts.page>1){
                        setTimeout(function(){
                            callback && callback(ret.object);
                        },0);
                    }else{
                        setTimeout(function(){
                            for(var i=0;i<ret.object.length;i++){
                                ret.object[i].isSelect=true;
                                ret.object[i].count = 2;
                            }
                            vm.item=ret.object;
                            if(ret.object.length===0){
                                vm.isLoss=false;
                            }else{
                                vm.isLoss=true;
                            }
                        },0);
                    }
               }else{
                   _g.toast(ret.message);
               }
            },
            error:function(err){
                _g.hideProgress();
            }
        })
    }
  //漏盘分页获取数据
     var lossData=function(data){
         return _.map(data,function(item){
               return {
                    product_name:item.product_name,
                    bar_code:item.bar_code,
                    sku_name:item.sku_name,
                    stock_amount:item.stock_amount,
                    unit:item.unit,
                    isSelect:true,
                    count : 2
                }
         });
     }
     //盘点差异与漏盘分页
         var loadmore=new Loadmore({
             callback:function(page){
                  getLoss({page:page.page},function(data){
                     if(!data || _.isEmpty(data)){
                         return loadmore.loadend(false);
                     }else{
                        vm.item=vm.item.concat(lossData(data));
                        loadmore.loadend(true);
                     }
                 });
             }
         });
     //获取盘点单数量接口
    var getData=function(){
        var _data={
                batch_type_attr_code:'ERP_CHECK_TYPE',
                check_batch_id:batch_id || '',
            };
        var _url='/app/auth/erp/stock/getErpCheckBatch.do';
        Http.ajax({
            data:_data,
            // isSync:true,
            api_versions:'v2',
            url:_url,
            success:function(ret){
                logger.log({"Type":"operation","action":"获取盘点单数量接口","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.success){
                    vm.noBatch = ret.object.count_check_order === 0 ? true : false;
                }
                    else{
                        _g.toast(ret.message);
                    }
            },
            error:function(err){

            }
        })
    }
     //向上拉动刷新数据
     _g.setPullDownRefresh(function () {
        logger.log({"Type":"operation","action":"向下拉动刷新漏盘数据","Win_name":api.winName});
            getData();
            getLoss();
            loadmore.reset();
    });
     //接收盘点单列表返回事件，刷新
     api && api.addEventListener({
        name:'shop-inventorycheckbatch-refresh'
    },function(ret,err){
        logger.log({"Type":"operation","action":"接收盘点单列表返回事件，刷新","Win_name":api.winName});
         getData();
         getLoss();
         loadmore.reset();
    });
    getData();
    getLoss();
    // isComplete();
    module.exports = {};
});
