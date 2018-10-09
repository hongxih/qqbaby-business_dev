define(function(require, exports, module) {

    var order_id = api && api.pageParam.order_id;
    var totalPrice = 0;
    var amount = 0;
    var isSeeBuyPrice = null;
    var config = {};

    var Http = require('U/http');
    var canvas = require('U/canvas');
    var share = require('U/share.js');

    var purchaseOrderDetail = new Vue({
        el: '#purchaseOrderDetail',
        template: _g.getTemplate('shop/purchaseOrderDetail-detail-V'),
        data: {
            role:_g.getLS("UserInfo").notes === "sales" ? false : true,
            isCheckShow: true,
            amount: 00,
            isSeeBuyPrice:null,
            isDetailList : false,
            detail: {
                isCheck: false,
                purchaseOrderNo: 'P90678100028668',
                supplierName: '雅培供应商',
                storehouseName: '广州仓库',
                receiptOrderNo: 'P90678100028668',
                createTime: '2015-5-11 00：00：00',
                auditStatus: '未审核',
                createAdminName: '吴先生',
                checkAdminName:'WX',
                paymentTerm: '2015-5-01 12:00:00',
                orderId: 1,
                total_price: 0,
                orderRemark: '',
            },
            listReturn: [{
                productName: 'test',
                barCode: '(1112233)',
                returnDetailList: [{
                    amount: 1,
                    buyAmount: 1,
                    giveAmount: 100,
                    price: 1000,
                    retail_price:1000000,
                    receiptDetailId: 123,
                    remark: '',
                    skuName: '',
                    totalPrice: 1000
                }, {
                    amount: 1,
                    buyAmount: 1,
                    giveAmount: 1,
                    price: 1000,
                    retail_price:1000000,
                    receiptDetailId: 123,
                    remark: 'haohenhaosss',
                    skuName: '',
                    totalPrice: 1000
                }, {
                    amount: 1,
                    buyAmount: 1,
                    giveAmount: 1,
                    price: 1000,
                    retail_price:1000000,
                    receiptDetailId: 123,
                    remark: 'haohenhaoxxxxx',
                    skuName: '',
                    totalPrice: 1000
                } ],
            }, ],
        },
        created: function() {
            this.isCheckShow = false;
            this.detail = {};
            this.listReturn = [];
        },
        methods: {
            onAuditTap: function(order_id) {
                var title = '确认审核？';
                var message = '是否确认审核';
                var _data={
                    audit_status: '00P',
                    purchase_order_id: Number(order_id)
                };
                var _url='/app/auth/page/erp/auditErpPurchaseOrder.do';
                _g.confirm(title,message,function () {
                    logger.log({"Type":"operation","action":"确认审核","Win_name":api.winName,"data":_data});
                    Http.ajax({
                        data:_data,
                        url:_url,
                        success: function(ret) {
                            logger.log({"Type":"operation","action":"采购订单详情页面点击确认审核","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                            if (ret.code == 200) {
                                var dt = ret.object;
                                // _g.toast(ret.message);
                                setTimeout(function() {
                                    api && api.sendEvent({
                                        name: 'refresh-purchaseOrderList'
                                    });
                                    api.closeWin && api.closeWin();
                                }, 1000);
                            } else {
                                _g.toast(ret.message);
                            }
                        },
                        error: function(err) {
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
                logger.log({"Type":"operation","action":"采购订单详情页面获取价格策略","Win_name":api.winName,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    isSeeBuyPrice = ret.object.buy_price_check_set
                    setTimeout(function() {
                        if (dt) {
                            var detail = toVueDetail(dt);
                            var list = toVueList(dt);
                            purchaseOrderDetail.amount = amount;
                            purchaseOrderDetail.detail = detail;
                            purchaseOrderDetail.listReturn = list;
                            purchaseOrderDetail.isSeeBuyPrice = isSeeBuyPrice;
                            purchaseOrderDetail.detail.total_price = totalPrice;
                            if (dt.erpPurchaseOrder.audit_status) {
                                purchaseOrderDetail.isCheckShow = dt.erpPurchaseOrder ? getCheckShow(dt.erpPurchaseOrder.audit_status) : false;
                            }
                        }
                    }, 0);
                } else {
                    _g.toast(ret.message);
                }
            },
            error:function(err){
                _g.hideProgress();
            }
        });
    }
    getData = function(order_id) {
        var _data= {
                purchase_order_id: Number(order_id)
            };
        var _url='/app/auth/page/erp/erpPurchaseOrderGetForDetail.do';
        Http.ajax({
            data:_data,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"采购订单详情页面获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    getStrategy(dt);
                } else {
                    _g.toast(ret.message);
                }
            },
            error: function(err) {
                _g.hideProgress();
            },
        });
    };

    toVueDetail = function(result) {
        var erpPurchaseOrder = result ? result.erpPurchaseOrder : {};
        var listReturn = result ? result.listReceiptDetail : [];
        return {
            isCheck: false,
            purchaseOrderNo: erpPurchaseOrder ? erpPurchaseOrder.purchase_order_no : '',
            supplierName: erpPurchaseOrder ? erpPurchaseOrder.supplier_name : '',
            storehouseName: erpPurchaseOrder ? erpPurchaseOrder.storehouse_name : '',
            receiptOrderNo: erpPurchaseOrder ? erpPurchaseOrder.receipt_order_no : '',
            createTime: erpPurchaseOrder ? erpPurchaseOrder.audit_time : '', //更改审核时间
            auditStatus: erpPurchaseOrder ? getCheckTex(erpPurchaseOrder.audit_status) : '',
            createAdminName: erpPurchaseOrder ? erpPurchaseOrder.create_admin_name : '',
            checkAdminName:erpPurchaseOrder.audit_admin_name ? erpPurchaseOrder.audit_admin_name : '未审核',
            paymentTerm: erpPurchaseOrder ? erpPurchaseOrder.payment_term : '',
            orderId: erpPurchaseOrder ? erpPurchaseOrder.purchase_order_id : 0,
            orderRemark: erpPurchaseOrder ? erpPurchaseOrder.purchase_desc : ''
        }
    }

    toVueList = function(result) {
        var listReturn = result ? result.lists : [];
        return _.map(listReturn, function(item) {
            return {
                productName: item ? item.product_name : '',
                barCode: item ? item.bar_code : '',
                returnDetailList: _.map(item.detailList, function(itemDetial) {
                    totalPrice += itemDetial.total_price;
                    amount += Number( itemDetial.amount) || 0;
                    // amount += itemDetial.buy_amount + itemDetial.give_amount;
                    return {
                        amount: itemDetial ? itemDetial.amount : 0,
                        buyAmount: itemDetial ? itemDetial.buy_amount : 0,
                        giveAmount: itemDetial ? itemDetial.give_amount : 0,
                        price: itemDetial ? itemDetial.price : 0,
                        retail_price:itemDetial?itemDetial.retail_price:0,
                        receiptDetailId: itemDetial ? itemDetial.receipt_detail_id : 0,
                        remark: itemDetial ? itemDetial.remark : '',
                        skuName: itemDetial ? itemDetial.sku_name : '',
                        totalPrice: itemDetial ? itemDetial.total_price : 0,
                    }
                })
            }
        })
    };
    getData(order_id);

    getCheckTex = function(result) {
        switch (result) {
            case '00P':
                return '已审核';
                break;
            case '00N':
                return '未审核';
                break;
        }
    };

    getCheckShow = function(result) {
        switch (result) {
            case '00P':
                return false;
                break;
            case '00N':
                return true;
                break;
        }
    };

    var config = {};
    function getShareData(){
        var _data={
                purchase_order_id: Number(order_id)
            };
        var _url='/app/auth/erp/getPurchaseDetail.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions: 'v2',
            success: function(ret) {
                logger.log({"Type":"operation","action":"采购订单详情页面获取分享数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.success) {
                    config = transformData(ret.object);
                }else{
                    _g.toast(ret.message);
                }
            },
            error:function () {
                _g.hideProgress();
            }
        });
    }

    function transformData(pram){
        config.goods = [];
        pram.purchaseDetailList = pram.purchaseDetailList || [];
        config.title = "订货单-"+pram.purchaseOrderOutVO.short_name || "订货单-"+pram.purchaseOrderOutVO.company_name;
        config.orderType = {
            'orderType': pram.purchaseOrderOutVO.audit_status == "00P" ? '已审核':'未审核',
            'orderNumber': pram.purchaseOrderOutVO.purchase_order_no || '',
            'orderTime': pram.purchaseOrderOutVO.create_time || '',
            'orderNo': (pram.purchaseOrderOutVO.order_total_amount).toString() || '',
            'orderPrice': (pram.purchaseOrderOutVO.order_total_price/100).toFixed(2) || ''
        };
        config.contact = {
            'addr': pram.purchaseOrderOutVO.delivery_addresss || '',
            'name': pram.purchaseOrderOutVO.delivery_contact || '',
            'phone': pram.purchaseOrderOutVO.delivery_contact_phone || '',
        };
        config.supplier = {
            'contact': pram.supperlierOutVO.contact || '',
            'supplier_name': pram.supperlierOutVO.supplier_name || '',
            'contact_address': pram.supperlierOutVO.contact_address || '',
            'contact_phone': pram.supperlierOutVO.contact_phone || '',
        };
        for(var i=0; i<pram.purchaseDetailList.length; i++){
            config.goods.push({
                product_name: pram.purchaseDetailList[i].product_name,
                bar_code: pram.purchaseDetailList[i].bar_code,
                sku_name: pram.purchaseDetailList[i].sku_name,
                buy_amount: pram.purchaseDetailList[i].buy_amount,
                unit:pram.purchaseDetailList[i].unit,
                give_amount: pram.purchaseDetailList[i].give_amount,
                retail_price: (pram.purchaseDetailList[i].price/100).toFixed(2),
                total_retail_price: (pram.purchaseDetailList[i].total_price/100).toFixed(2),
                remark: pram.purchaseDetailList[i].remark || ''
            });
        }
        config.maker = pram.purchaseOrderOutVO.senders_name;
        return config;
    }

    setTimeout(function(){
        getShareData();
    });
    api.addEventListener && api.addEventListener({
        name: 'share-purchaseOrder'
    }, function(){
        share.init();
        canvas.init(config,0);//分享图片的初始化
        canvas.init(config,1);//缩略图的初始化
    });

    module.exports = {};
});
