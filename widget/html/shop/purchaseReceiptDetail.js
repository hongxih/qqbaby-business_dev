define(function(require, exports, module) {

    var order_id = api && api.pageParam.order_id;
    var Amount = 0;
    var totalPrice = 0;
    var isSeeBuyPrice = null;
    var Http = require('U/http');

    var purchaseReceiptDetail = new Vue({
        el: '#purchaseReceiptDetail',
        template: _g.getTemplate('shop/purchaseReceiptDetail-detail-V'),
        data: {
        	isCheckShow:false,
            isDetailList : false,
            isSeeBuyPrice:null,
            detail:{
                isCheck:false,
                purchaseOrderNo:'P90678100028668',
                supplierName:'雅培供应商',
                storehouseName:'广州仓库',
                receiptOrderNo:'P90678100028668',
                createTime:'',
                auditStatus:'未审核',
                createAdminName:'吴先生',
                checkAdminName:'wx',
                paymentTerm:'2015-5-01 12:00:00',
                orderId:1,
                total_price:0,
                amount:Amount,
                orderRemark: 'xxxxx'
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
                            retail_price:1000000,
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
                    var _data={
                        audit_status:'00P',
                        receipt_order_id :Number(order_id)
                    };
                    var _url='/app/auth/page/erp/erpReceiptOrderAudit.do';
                    logger.log({"Type":"operation","action":"点击了采购收货单审核按钮","Win_name":api.winName});
                    Http.ajax({
                        data:_data,
                        url:_url,
                        success: function(ret) {
                            logger.log({"Type":"operation","action":"审核采购收货单","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                            if (ret.code == 200) {
                                var dt = ret.object;
                                _g.toast(ret.message);
                                console.log(dt);
                                setTimeout(function() {
                                    api && api.sendEvent({
                                        name:'refresh-purchaseReceiptList'
                                    });
                                    api.closeWin && api.closeWin();
                                }, 1000);
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
    var getStrategy = function(dt){
        var _url='/app/auth/page/ent/getChangePriceSettingSet.do';
        Http.ajax({
            data:{},
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"采购收货详情页面获取价格策略","Win_name":api.winName,"message":ret,"requireURL":_url})
                    if (ret.code == 200) {
                        isSeeBuyPrice = ret.object.buy_price_check_set;
                        setTimeout(function() {
                            if(dt){
                                var detail = toVueDetail(dt);
                                var list = toVueList(dt);
                                console.log(detail);
                                console.log(list);
                                console.log(purchaseReceiptDetail);
                                purchaseReceiptDetail.detail = detail;
                                purchaseReceiptDetail.listReturn = list;
                                purchaseReceiptDetail.detail.total_price = totalPrice;
                                purchaseReceiptDetail.detail.amount = Amount;
                                purchaseReceiptDetail.isSeeBuyPrice = isSeeBuyPrice;
                                if(dt.businessAppErpReceiptOrder.audit_status){
                                    purchaseReceiptDetail.isCheckShow = dt.businessAppErpReceiptOrder?getCheckShow(dt.businessAppErpReceiptOrder.audit_status):true;
                                }
                            }
                            _g.hideProgress();
                        }, 0);
                    } else {
                        _g.toast(ret.message);
                    }
            }
        });
    }
    getData = function(order_id){
        var _data= {
                receipt_order_id :Number(order_id)
            };
        var _url='/app/auth/page/erp/erpReceiptOrder.do';
        Http.ajax({
            data:_data,
            url:_url,
            success: function(ret) {
               logger.log({"Type":"operation","action":"采购收货详情页面获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
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
        var businessAppErpReceiptOrder = result?result.businessAppErpReceiptOrder:{};
        var listReturn = result?result.listReceiptDetail:[];
        return {
                isCheck:false,
                purchaseOrderNo:businessAppErpReceiptOrder?businessAppErpReceiptOrder.purchase_order_no:'',
                supplierName:businessAppErpReceiptOrder?businessAppErpReceiptOrder.supplier_name:'',
                storehouseName:businessAppErpReceiptOrder?businessAppErpReceiptOrder.storehouse_name:'',
                receiptOrderNo:businessAppErpReceiptOrder?businessAppErpReceiptOrder.receipt_order_no:'',
                createTime:businessAppErpReceiptOrder?businessAppErpReceiptOrder.audit_time:'', //更改审核时间
                auditStatus:businessAppErpReceiptOrder?getCheckTex(businessAppErpReceiptOrder.audit_status):'',
                createAdminName:businessAppErpReceiptOrder?businessAppErpReceiptOrder.create_admin_name:'',
                checkAdminName:businessAppErpReceiptOrder.audit_admin_name?businessAppErpReceiptOrder.audit_admin_name:'未审核',
                paymentTerm:businessAppErpReceiptOrder?businessAppErpReceiptOrder.payment_term:'',
                orderId:businessAppErpReceiptOrder?businessAppErpReceiptOrder.receipt_order_id:0,
                orderRemark: businessAppErpReceiptOrder?businessAppErpReceiptOrder.remark : ''
            }
    }

    toVueList = function(result){
        var listReturn = result?result.listReceiptDetail:[];
        return _.map(listReturn,function(item){
                return {
                    productName:item?item.product_name:'',
                    barCode:item?item.bar_code:'',
                    returnDetailList:_.map(item.receiptDetailList,function(itemDetial){
                        totalPrice += itemDetial.total_price;
                        Amount += itemDetial.amount;
                        return {
                            amount:itemDetial?itemDetial.amount:0,
                            buyAmount:itemDetial?itemDetial.buy_amount:0,
                            giveAmount:itemDetial?itemDetial.give_amount:0,
                            price:itemDetial?itemDetial.price:0,
                            retail_price:itemDetial?itemDetial.retail_price:0,
                            receiptDetailId:itemDetial?itemDetial.receipt_detail_id:0,
                            remark:itemDetial?itemDetial.remark:'',
                            skuName:itemDetial?itemDetial.sku_name:'',
                            totalPrice:itemDetial?itemDetial.total_price:0,
                        }
                    })
                }
            })
    };

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
