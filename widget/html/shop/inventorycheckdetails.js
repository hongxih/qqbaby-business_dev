// define(function(require, exports, module) {
//     var check_order_id = api && api.pageParam.check_order_id;
//     var Http = require('U/http');
//     var checkAmountCount = 0;
//     var retailPriceCount = 0;
//     var isSeeBuyPrice = null;
//     var inventorycheckdetails = new Vue({
//         el: '#inventorycheckdetails',
//         template: _g.getTemplate('shop/inventorycheckdetails-detail-V'),
//         data: {
//             isDetailList : false,
//         	detail:{
//                 checkOrderNo:'1CR00051606221406150002',
//                 checkBatchNo:'2PD00051606221406640001',
//                 storeHouseName:'总仓',
//                 batchType:'100',
//                 type : 102,
//                 batchValue:'雅培',
//                 auditStatus:'未审核',
//                 createAdminName:'吴先生',
//                 checkAdminName:'w先生',
//                 createTime:'2016-06-22 14:09:31',
//                 checkAmount:0,
//                 retailPrice:0,
//             },
//             list:[
//                 {
//                     productName:'棉花孕妇服',
//                     barCode:'55555556',
//                     detailList:[
//                         {
//                             checkDetailId:520,
//                             checkOrderId:315,
//                             skuCode:'545',
//                             skuName:'L码',
//                             skuOwnCode:'55555556-1',
//                             productId:441,
//                             checkAmount:0,
//                             retailPrice:4000,
//                             checkRetailPrice:0,
//                             remark:'',
//                         },
//                         {
//                             checkDetailId:520,
//                             checkOrderId:315,
//                             skuCode:'545',
//                             skuName:'L码',
//                             skuOwnCode:'55555556-1',
//                             productId:441,
//                             checkAmount:0,
//                             retailPrice:4000,
//                             checkRetailPrice:0,
//                             remark:'',
//                         },
//                     ],
//                 }
//             ],
//         },
//         created:function(){
//             this.detail = {};
//         },
//         methods:{
//             isClickDetail : function(){
//                 this.isDetailList = !this.isDetailList;
//             }
//         }
//     });
//     var getStrategy = function(dt){
//         Http.ajax({
//             data:{},
//             url:'/app/auth/page/ent/getChangePriceSettingSet.do',
//             success: function(ret) {
//                 if (ret.code == 200) {
//                     isSeeBuyPrice = ret.object.buy_price_check_set;
//                     setTimeout(function() {
//
//                         if(dt){
//                             var detail = getVueDetail(dt);
//
//                             inventorycheckdetails.detail = detail;
//
//                             var list = getVueList(dt);
//                             inventorycheckdetails.list = list;
//                             inventorycheckdetails.detail.checkAmount = checkAmountCount || 0;
//                             inventorycheckdetails.detail.retailPrice = retailPriceCount || 0;
//                             inventorycheckdetails.detail.isSeeBuyPrice = isSeeBuyPrice || 0;
//                         }
//                         _g.hideProgress();
//                     }, 0);
//                 } else {
//                     _g.toast(ret.message);
//                 }
//             }
//         });
//     }
//     var getData = function(check_order_id){
//         _g.showProgress();
//         Http.ajax({
//             data: {
//                 check_order_id:check_order_id
//             },
//             url: '/app/auth/page/erp/erpCheckOrderGetForDetail.do',
//
//             success: function(ret) {
//
//                 if (ret.code == 200) {
//                     var dt = ret.object;
//                     getStrategy(dt);
//                 } else {
//                     _g.toast(ret.message);
//                 }
//             },
//             error: function(err) {},
//         });
//     }
//     var getVueDetail = function(result){
//         var erpCheckOrder = result.erpCheckOrder?result.erpCheckOrder:{};
//         return {
//             checkOrderNo:erpCheckOrder.check_order_no?erpCheckOrder.check_order_no:'',
//             checkBatchNo:erpCheckOrder.check_batch_no?erpCheckOrder.check_batch_no:'',
//             storeHouseName:erpCheckOrder.storehouse_name?erpCheckOrder.storehouse_name:'',
//             batchType:erpCheckOrder.batch_type?erpCheckOrder.batch_name:'',
//             type : erpCheckOrder.batch_type?erpCheckOrder.batch_type:'',
//             batchValue:erpCheckOrder.batch_value?erpCheckOrder.batch_value:'',
//             auditStatus:erpCheckOrder.audit_status?getStatus(erpCheckOrder.audit_status):'',
//             createAdminName:erpCheckOrder.create_admin_name?erpCheckOrder.create_admin_name:'',
//             checkAdminName:erpCheckOrder.create_admin_name?erpCheckOrder.audit_admin_name:'',
//             createTime:erpCheckOrder.create_time?erpCheckOrder.audit_time:'',
//             orderRemark:erpCheckOrder.remark?erpCheckOrder.remark:''
//         }
//     }
//     var getVueList = function(result){
//         var list = result.erpCheckDetailList || [];
//         return _.map(list,function(item){
//             return {
//                 productName:item.product_name?item.product_name:'',
//                 barCode:item.bar_code?item.bar_code:'',
//                 detailList:_.map(item.lists,function(goods){
//                     checkAmountCount += goods.check_amount || 0;
//                     retailPriceCount += (goods.retail_price || 0)*(goods.check_amount || 0);
//                     return {
//                         checkDetailId:goods.check_detail_id || 0,
//                         checkOrderId:goods.check_order_id || 0,
//                         skuCode:goods.sku_code || '',
//                         skuName:goods.sku_name || '',
//                         skuOwnCode:goods.sku_own_code || '',
//                         productId:goods.product_id || 0,
//                         checkAmount:goods.check_amount || 0,
//                         retailPrice:goods.retail_price || 4000,
//                         checkRetailPrice:goods.check_retail_price || 0,
//                         remark:'',
//                     }
//                 })
//             }
//         });
//     }
//     // getData(check_order_id);
//     var getStatus = function(result){
//         switch(result){
//             case '00P':
//                 return '已审核';
//                 break;
//             case '00N':
//                 return '未审核';
//                 break;
//             default:
//                 return '';
//                 break;
//         }
//     }
//     var getText = function(result){
//         switch(Number(result)){
//             case 100:
//                 return '全盘盘点';
//                 break;
//             case 101:
//                 return '分类盘点';
//                 break;
//             case 102:
//                 return '品牌盘点';
//                 break;
//             case 103:
//                 return '单品盘点';
//                 break;
//             case 104:
//                 return '动态盘点';
//                 break;
//         }
//     }
//     module.exports = {};
// });


define(function(require, exports, module) {
    var Http = require('U/http');
    var order_id = api && api.pageParam.id;
    var vm = new Vue({
        el: '#inventorycheckdetails',
        template: _g.getTemplate('shop/inventorycheckdetails-detail-V'),
        data:{
            check_batch_id:null,
            check_order_id:null,
            check_order_no:"",
            create_time:"",
            create_admin_name:"",
            order_total_amount:0,
            order_total_retail_price_amount:0,
            audit_status:"",
            remark:'',
            list:[
                // {
                //     shopName:'婴儿奶瓶',
                //     shopBar:'1234567890',
                //     shopSku:'白色；500ml；规格3',
                //     count:'4000',
                //     price:'300',
                //     remark:'备注内容'
                // },
                // {
                //     shopName:'婴儿奶瓶',
                //     shopBar:'1234567890',
                //     shopSku:'白色；500ml；规格3',
                //     count:'4000',
                //     price:'300',
                //     remark:'备注内容'
                // },
                // {
                //     shopName:'婴儿奶瓶',
                //     shopBar:'1234567890',
                //     shopSku:'白色；500ml；规格3',
                //     count:'4000',
                //     price:'300',
                //     remark:'备注内容'
                // },
            ]
        },
        methods:{
            onDeleteTap:function (check_detail_id,check_order_id){
                _g.confirm("确认删除？","是否删除该条记录？",function(){
                    logger.log({"Type":"operation","action":"确认删除","Win_name":api.winName,"data":_data});
                    var _data={
                        check_detail_id:check_detail_id,
                        check_order_id:check_order_id
                    };
                    var _url='/app/auth/erp/stock/deleteErpCheckDetail.do';
                    Http.ajax({
                        data:_data,
                        url:_url,
                        api_versions:'v2',
                        success:function(ret){
                            logger.log({"Type":"operation","action":"盘点单详情删除盘点记录","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                            _g.toast(ret.message);
                            getData();
                            getDetail();
                            // api && api.closeWin();
                            // api && api.sendEvent({
                            //     name:'shop-inventorycheckdetail-refresh'
                            // });
                        },
                        error:function(err){}
                    });
                })
            },
            onAddTap:function (check_batch_id,check_order_id) {
                var _data={
                    title: '新增编辑盘点单',
                    searchInput:'',
                    placeholder:'条码/自编码/助记码',
                    mode:"search"
                };
                logger.log({"Type":"operation","action":"新增编辑盘点单","Win_name":api.winName,"data":_data})
                _g.openWin({
                    header: {
                        data:_data,
                        template:'../html/header/header-addInventoryCheck-V'
                    },
                    pageParam:{
                        check_batch_id:check_batch_id,
                        check_order_id:check_order_id

                    },
                    name: 'shop-addInventoryCheck',
                    url: '../shop/addInventoryCheck.html',
                    bounces: false,
                    allowEdit:true,
                });
            },
            save:function(remark,check_batch_id,check_order_id){
                var _data={
                    check_batch_id:check_batch_id,
                    check_order_id:check_order_id,
                    remark:remark
                };
                var _url='/app/auth/erp/stock/saveErpCheckOrderRemark.do';
                if(!remark){
                    return false;
                }else{
                    Http.ajax({
                        data:_data,
                        url:_url,
                        api_versions:'v2',
                        success:function(ret){
                            logger.log({"Type":"operation","action":"盘点单详情保存备注","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                          _g.toast(ret.message);
                        },
                        error:function(err){}
                    });
                }
            }

        },
        created:function () {

        },
    });
   var getDetail=function(){
        var _data={
            check_order_id:order_id
        };
        var _url="/app/auth/erp/stock/getCheckOrder.do";
        Http.ajax({
        data:_data,
        url:_url,
        api_versions:'v2',
        success:function(ret){
            logger.log({"Type":"operation","action":"盘点单详情页面获取盘点单信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
            if(ret.success){
                setTimeout(function(){
                   vm.check_batch_id=ret.object.check_batch_id;
                   vm.check_order_no=ret.object.check_order_no;
                   vm.check_order_id=ret.object.check_order_id;
                   vm.create_time=ret.object.create_time;
                   vm.create_admin_name=ret.object.create_admin_name;
                   vm.order_total_amount=ret.object.order_total_amount;
                   vm.order_total_retail_price_amount=ret.object.order_total_retail_price_amount;
                   vm.audit_status=ret.object.audit_status;
                   vm.remark=ret.object.remark;
                },0);

            }else{
                _g.toast(ret.message);
            }
        },
        error:function(err){}
       });
   }

    var getData=function(opts,callback){
        var opts=opts || {};
        var _data={
            check_order_id:order_id,
            displayRecord:10,
            page:opts.page||1
        };  
        var _url='/app/auth/erp/stock/listCheckDetail.do';      
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            success:function(ret){
                logger.log({"Type":"operation","action":"盘点单详情页面获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.success){
                    if(opts.page||opts.page>1){
                        setTimeout(function(){
                            callback && callback(ret.object);
                        },0)
                    }else{
                        setTimeout(function(){
                            vm.list=ret.object;
                        },0);
                    }

                }else{
                    setTimeout(function(){
                        callback && callback(ret.object);
                    },0)
                    _g.toast(ret.message);
                }
            },
            error:function(err){}
        })
    }
    //分页
    var loadmore=new Loadmore({
        callback:function(page){
            getData({page:page.page},function(data){
                if(!data || _.isEmpty(data)){
                    return loadmore.loadend(false);
                }else{
                    vm.list=vm.list.concat(data);
                    loadmore.loadend(true);
                }
            });
        }
    });

    //接收添加商品返回键发送事件刷新页面
    api && api.addEventListener({
        name: 'shop-inventorycheckdetails-refresh'
    }, function(ret, err) {
        logger.log({"Type":"operation","action":"接收添加商品返回键发送事件刷新页面","Win_name":api.winName});
        setTimeout(function () {
            getData();
        },0)
        loadmore.reset();
    });

 _g.setPullDownRefresh(function () {
        setTimeout(function () {
            logger.log({"Type":"operation","action":"向下拉动刷新盘点单数据","Win_name":api.winName});
            getData();
            getDetail();
        },0)
        loadmore.reset();
    });
    getDetail();
    getData();
    module.exports = {};
});
