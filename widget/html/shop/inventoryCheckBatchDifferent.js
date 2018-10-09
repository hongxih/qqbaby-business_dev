define(function (require, exports, module) {
    var Http = require('U/http');
    var batch_id = api && api.pageParam.id;
    var audit_status=api && api.pageParam.audit_status;
    var vm = new Vue({
        el: '#inventoryCheckBatchDifferent',
        template: _g.getTemplate('shop/inventoryCheckBatchDifferent-body-V'),
        data: {
            isShow:false,
            isDifferent:true,
            isInput:false,
            audit_status:audit_status,
            noBatch:false,//判断是否有盘点单
            noDetail:false,//判断盘点单是否有明细
            isNull:0,//判断所有的盘点差异是否为0
            object:[],
            issales:_g.getLS('UserInfo').notes == "sales" ? true:false,//判断是否为营业员
        },
        created: function () {
            object=[];
        },
        methods: {
            onAddDifferent:function (i) {
                this.object[i].remarkShow = false;
                this.object[i].remarkAdd=true;
            },
            onChangeDifferent:function (i){
                this.object[i].remarkShow = false;
                this.object[i].remarkAdd=true;
            },
            onInput:function (i) {
                if(this.object[i].different_reason.length>0){
                    this.object[i].input = true;
                }else{
                    this.object[i].input = false;
                }
            },
            onFocus:function (i) {
                    this.isInput = true;
            },
            onBlur:function (i) {
                setTimeout(function () {
                    vm.isInput = false;
                },300)
            },
            onSelect:function(i){
                if(this.item[i].isSelect==false){
                    this.item[i].isSelect = true;
                }else{
                    this.item[i].isSelect = false;
                }
            },
            onAddBatch:function () {
                var _data={
                    title: '新增编辑盘点单',
                    searchInput:'',
                    placeholder:'条码/自编码/助记码',
                    mode:"search"
                };
                logger.log({"Type":"operation","action":"新增编辑盘点单","Win_name":api.winName,"data":_data})
                _g.openWin({
                       header: {
                           data: _data,
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
            remarkdDisplay:function(i,check_batch_id,check_different_id,message){
                this.object[i].remarkAdd=false;
                this.object[i].remark=this.object[i].different_reason;
                setTimeout(function () {
                    vm.isInput = false;
                },300)
                var _data={
                        check_batch_id:check_batch_id,
                        check_different_id:check_different_id,
                        different_reason:message
                    };
                var _url='/app/auth/erp/stock/saveErpCheckDifferentRemark.do';
                 Http.ajax({
                    data:_data,
                    url:_url,
                    api_versions:'v2',
                    success:function(ret){
                        logger.log({"Type":"operation","action":"保存盘点差异备注","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                        if(ret.success){
                           _g.toast(ret.message);
                        }else{
                          _g.toast(ret.message);
                        }

                    },
                    error:function(err){}
                });

            },
            onEndTap:function(){
                _g.confirm("确认登账？","登账后，盘点库存将被修改",function(){
                     logger.log({"Type":"operation","action":"点击确定盘点登账","Win_name":api.winName});
                     over();
                     getDifference();
                })
            },
        }
    });
    //结束盘点
    var over=function(){
        var _data={
            check_batch_id:batch_id
        };
        var _url='/app/auth/erp/stock/auditErpCheckBatch.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            success:function(ret){
                logger.log({"Type":"operation","action":"结束盘点","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.success){
                     _g.toast(ret.message);
                     api && api.closeWin();
                     api && api.sendEvent({
                        name:'shop-inventorycheckdetail-refresh'
                    });
                }else{
                     _g.toast(ret.message);
                }

            },
            error:function(err){}
        });
    }
    //盘点差异接口
    var getDifference=function(opts,callback){
        var opts=opts||{};
         var _data={
                check_batch_id:batch_id || '',
                displayRecord:10,
                page:opts.page||1
            };
        var _url='/app/auth/erp/stock/listCheckDifferent.do';
        Http.ajax({
            data:_data,
            // isSync:true,
            api_versions:'v2',
            url:_url,
            success:function(ret){
                logger.log({"Type":"operation","action":"获取盘点差异列表","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.success){
                    if(opts.page||opts.page>1){
                        setTimeout(function(){
                            callback && callback(ret.object);
                        },0)
                    }else{
                        setTimeout(function(){
                            for(var i = 0;i<ret.object.length;i++){
                            ret.object[i].remarkShow =true;
                            ret.object[i].remarkAdd =false;
                            ret.object[i].input =false;
                            vm.isNull=vm.isNull+ret.object[i].profit_amount;
                            }
                            vm.object=ret.object;
                            if(ret.object.length===0){
                                vm.isDifferent = false;
                            }else{
                                vm.isDifferent = true;
                            }
                        },0);
                    }
                }else{
                    setTimeout(function(){
                        callback && callback(ret.object);
                    },0)
                    _g.toast(ret.message);
                }
            },
            error:function(err){
                _g.hideProgress();
            }
        })
    }

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
                    vm.noDetail=ret.object.count_check_detail === 0 ? true : false;
                }
                    else{
                        _g.toast(ret.message);
                    }
            },
            error:function(err){

            }
        })
    }
    //
    var isCheck=function(){

    }
//盘点差异与漏盘分页
    var loadmore=new Loadmore({
        callback:function(page){
            getDifference({page:page.page},function(data){
                if(!data || _.isEmpty(data)){
                    return loadmore.loadend(false);
                }else{

                    vm.object=vm.object.concat(concatData(data));

                    loadmore.loadend(true);
                }
            });
        }
    });
    //盘点差异分页获取数据
    var concatData=function(data){
        return _.map(data,function(item){
            return{
                check_batch_id:item.check_batch_id,
                check_different_id:item.check_different_id,
                product_name:item.product_name,
                bar_code:item.bar_code,
                sku_name:item.sku_name,
                stock_amount:item.stock_amount,
                profit_amount:item.profit_amount,
                check_amount:item.check_amount,
                remark:item.remark,
                remarkShow :true,
                remarkAdd :false,
                input:false,
                different_reason:item.different_reason,
            }
        });
    }

     //向下拉动刷新数据
    if(audit_status==="00N"){
        _g.setPullDownRefresh(function () {
            setTimeout(function () {
                logger.log({"Type":"operation","action":"向下拉动刷新盘点差异数据","Win_name":api.winName});
                getData();
                getDifference();
                loadmore.reset();
                vm.isInput = false;
            },0)
        });
    }

     api && api.addEventListener({
        name:'shop-inventorycheckbatch-refresh'
    },function(ret){
          logger.log({"Type":"operation","action":"监听添加商品页面返回刷新","Win_name":api.winName});
        vm.isNull=0;
        getData();
        getDifference();
        loadmore.reset();
    });

    //接收shop-inventorychecklist返回刷新页面事件
    api && api.addEventListener({
        name: 'shop-inventorychecklist-refresh'
    }, function(ret, err) {
         logger.log({"Type":"operation","action":"监听盘点单页面返回刷新","Win_name":api.winName});
        vm.isNull=0;
        getData();
        getDifference();
        loadmore.reset();
    });

    getData();
    getDifference();
    module.exports = {};
});
