define(function(require, exports, module) {

    var order_id = api.pageParam.order_id || api.pageParam.orderId
    var isSeeBuyPrice = null;
    var Http = require('U/http');

    var totalPrice = 00;
    var amount = 0;
    var purchaseReturnDetail = new Vue({
        el: '#purchaseReturnDetail',
        template: _g.getTemplate('shop/purchaseReturnDetail-body-V'),
        data: {
            isCheckShow:false,
            isDetailList : false,
            totalPrice: 000,
            isSeeBuyPrice:null,
            amount: 0,
        	detail:{
                isCheck:false,
                // orderTotalPrice: 0,
                purchaseOrderNo:'P90678100028668',
                supplierName:'雅培供应商',
                storehouseName:'广州仓库',
                receiptOrderNo:'P90678100028668',
                createTime:'2015-5-11 00：00：00',
                auditStatus:'未审核',
                createAdminName:'吴先生',
                checkAdminName:'w先生',
                receivTerm: '2019-4-2 00:11: 11',
                orderId:1,
                orderRemark: 'sssssss',
            },
            listReturn:[
                {
                    productName:'test',
                    barCode:'(1112233)',
                    returnDetailList:[
                        {
                            amount:1,
                            buyAmount:1,
                            giveAmount:1,
                            price:1000,
                            retail_price:1000000,
                            receiptDetailId:123,
                            remark:'',
                            skuName:'',
                            totalPrice:1000
                        },
                        {
                            amount:1,
                            buyAmount:1,
                            giveAmount:1,
                            price:1000,
                            retail_price:10,
                            receiptDetailId:123,
                            remark:'',
                            skuName:'',
                            totalPrice:1000
                        },
                        {
                            amount:1,
                            buyAmount:1,
                            giveAmount:1,
                            price:1000,
                            retail_price:10,
                            receiptDetailId:123,
                            remark:'',
                            skuName:'',
                            totalPrice:1000
                        },
                    ],
                },
            ],
        },
        created: function() {
            this.isCheckShow = false;
            this.detail = {};
            this.listReturn = [];
        },
        methods:{
        	onAuditTap:function(order_id){
                var title = '确认审核？';
                var message = '是否确认审核'
                _g.confirm(title,message,function () {
                    logger.log({"Type":"operation","action":"采购退货单详情页面审核","Win_name":api.winName,"data":_data});
                    var _data={
                        audit_status:'00P',
                        return_order_id :Number(order_id)
                    };
                    var _url='/app/auth/page/erp/erpReturnOrderAudit.do';
                    Http.ajax({
                        data: _data,
                        url:_url,
                        success: function(ret) {
                            logger.log({"Type":"operation","action":"采购退货单详情","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                            if (ret.code == 200) {
                               _g.toast(ret.message);
                                setTimeout(function() {
                                    api && api.sendEvent({
                                        name:'refresh-purchaseReturnList'
                                    });
                                    _g.closeWins(['shop-purchaseReturnDetail-win']);

                                }, 0);
                            } else {
                                _g.toast(ret.message);
                            }
                        },
                        error: function(err) {
                            _g.hideProgress();
                        },
                    });
                });
            },
            onClickDetail : function(){
                this.isDetailList = !this.isDetailList;
            }
        }
    });
    getStrategy = function(dt){
        var _url='/app/auth/page/ent/getChangePriceSettingSet.do';
        Http.ajax({
            data:{},
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"采购退货单详情获取价格策略","Win_name":api.winName,"message":ret,"requireURL":_url})
                setTimeout(function(){
                    if (ret.code == 200) {
                        isSeeBuyPrice = ret.object.buy_price_check_set;
                        if(dt){
                            var detail = toVueDetail(dt);
                            var list = toVueList(dt);
                            purchaseReturnDetail.totalPrice = totalPrice;
                            purchaseReturnDetail.amount = amount;
                            purchaseReturnDetail.isSeeBuyPrice = isSeeBuyPrice;
                            console.log(detail);
                            console.log(list);
                            console.log(purchaseReturnDetail);
                            purchaseReturnDetail.detail = detail;
                            purchaseReturnDetail.listReturn = list;
                            if(dt.businessAppErpReturnOrder.audit_status){
                                purchaseReturnDetail.isCheckShow = dt.businessAppErpReturnOrder?getCheckShow(dt.businessAppErpReturnOrder.audit_status):true;
                            }
                        }
                        
                    } else {
                        _g.toast(ret.message);
                    }
                    _g.hideProgress();
                },0)
            }
        });
    }
    getData = function(order_id){
        var _data={
                return_order_id :order_id
            };
        var _url='/app/auth/page/erp/erpReturnOrderGetForDetail.do';
        Http.ajax({
            data:_data,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"采购退货单详情页面获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    getStrategy(dt);
                } else {
                    _g.toast(ret.message);
                }
            },
            error: function(err) {},
        });
    }

    toVueDetail = function(result){
        var businessAppErpReturnOrder = result?result.businessAppErpReturnOrder:{};
        var listReturn = result?result.listReturn:[];
        return {
                isCheck:false,
                purchaseOrderNo:businessAppErpReturnOrder?businessAppErpReturnOrder.return_order_no:'',
                supplierName:businessAppErpReturnOrder?businessAppErpReturnOrder.supplier_name:'',
                storehouseName:businessAppErpReturnOrder?businessAppErpReturnOrder.storehouse_name:'',
                receiptOrderNo:businessAppErpReturnOrder?businessAppErpReturnOrder.receipt_order_no:'',
                createTime:businessAppErpReturnOrder?businessAppErpReturnOrder.audit_time:'',
                auditStatus:businessAppErpReturnOrder?getCheckTex(businessAppErpReturnOrder.audit_status):'',
                createAdminName:businessAppErpReturnOrder?businessAppErpReturnOrder.create_admin_name:'',
                checkAdminName:businessAppErpReturnOrder.audit_admin_name?businessAppErpReturnOrder.audit_admin_name:'未审核',
                orderId:businessAppErpReturnOrder?businessAppErpReturnOrder.return_order_id:0,
                orderRemark:businessAppErpReturnOrder?businessAppErpReturnOrder.remark:"",
                receivTerm: businessAppErpReturnOrder?businessAppErpReturnOrder.receiv_term:"",
            }
    }

    toVueList = function(result){
        var listReturn = result?result.listReturn:[];
        console.log('a');
        return _.map(listReturn,function(item){
                return {
                    productName:item?item.product_name:'',
                    barCode:item?item.bar_code:'',
                    returnDetailList:_.map(item.returnDetailList,function(itemDetial){
                        totalPrice += Number(itemDetial.total_price || 0) ;
                        amount += Number(itemDetial.amount || 0);
                        return {
                            amount:itemDetial?itemDetial.amount:0,
                            buyAmount:itemDetial?itemDetial.buy_amount:0,
                            giveAmount:itemDetial?itemDetial.give_amount:0,
                            price:itemDetial?itemDetial.price:0,
                            receiptDetailId:itemDetial?itemDetial.receipt_detail_id:0,
                            remark:itemDetial?itemDetial.remark:'',
                            skuName:itemDetial?itemDetial.sku_name:'',
                            retail_price:itemDetial?itemDetial.retail_price:0,
                            totalPrice:itemDetial?itemDetial.total_price:0,
                        }
                    })
                }
            })
    }

    getData(order_id);

    getCheckTex = function(result){
        switch(result){
            case '00P':
                return '已审核';
                break;
            case '00N':
                return '未审核';
                break;
        }
    }

    getCheckShow = function(result){
        switch(result){
            case '00P':
                return false;
                break;
            case '00N':
                return true;
                break;
        }
    }

    module.exports = {};
});
