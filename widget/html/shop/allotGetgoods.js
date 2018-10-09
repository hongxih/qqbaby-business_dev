define(function(require, exports, module) {

    var allot_order_id = api && api.pageParam.allot_order_id;
    var vo_remark = ''; 

    var Http = require('U/http');
    var checkAmountCount = 0;
    var totalPriceCount = 0;

    var allotGetgood = new Vue({
        el: '#allotGetgoods',
        template: _g.getTemplate('shop/allotGetgoods-body-V'),
        data: {
            inputamount: 0,
            detail: {
                isCheck: false,
                allotOrderId: 0,
                allotOrderNo: 'P54011101210687',
                outStorehouseName: '珠海总仓',
                inStorehouseName: '天河分仓',
                auditStatus: '未审核',
                orderStatus: '待发货',
                remark: '紧急补货',
                totalPrice: 000,
                checkAmount: 0,
                isInputMatch: false,
                isDisable: true,
                isAmountInput: false,

            },
            detailVOList: [{
                barCode: '(1112233)',
                productName: 'test',
                receiptDetailList: [{
                    allotDetailId: 0,
                    allotOrderId: 0,
                    productId: 0,
                    skuName: '蓝色',
                    skuCode: '',
                    skuId: 0,
                    allotAmount: 1,
                    outAmount: 0,
                    inAmount: 0,
                    unit: '',
                    amount: 0,
                    amountMax: 10,
                    price: 1,
                    checkAmount: 1000,
                }, ],
            }, ],
        },
        methods: {
            inputAmount: function(itemIndex, detailIndex, bitem) {
                var count = 0;
                var total = 0;
                var amountReg = /^[0-9]{0,999}$/;
                this.detail.isAmountInput = true;
                if (amountReg.test(this.inputamount)) {
                    if (this.inputamount <= bitem.amountMax) {
                        bitem.inAmount = this.inputamount;
                        _.each(this.detailVOList, function(n, i) {

                            _.each(n.receiptDetailList, function(m, j) {

                                count += Number(m.inAmount);
                                total += Number(m.price) * Number(m.inAmount);

                            })
                        });
                    }

                    allotGetgood.detail.totalPrice = total;
                    allotGetgood.detail.checkAmount = count;
                    console.log(allotGetgood.detail)

                    this.detail.isInputMatch = true;
                } else {
                    this.detail.isInputMatch = false;
                }
                if (this.detail.isInputMatch) {
                    this.detail.isDisable = false;
                } else {
                    this.detail.isDisable = true;
                }
                // return outAmount;

            },
            onsubmit: function() {
                var detailListJsonString = getPostDetailList();
                var orderJsonString = getPostList();
                var _data= {
                        detailListJsonString: _g.j2s(detailListJsonString),
                        orderJsonString: _g.j2s(orderJsonString),
                    };
                var _url='/app/auth/page/erp/receipt.do';
                Http.ajax({
                    data:_data,
                    isSync: true,
                    url:_url,
                    success: function(ret) {
                        logger.log({"Type":"operation","action":"采购发货单确认收货","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                        if (ret.code == 200) {

                            _g.openWin({
                                header: {
                                    data: {
                                        title: '采购收货单列表',
                                    }
                                },
                                name: 'sho-purchaseReceiptList',
                                url: '../shop/purchaseReceiptList.html',
                                bounces: false,
                            });

                        } else {
                            _g.toast(ret.message);
                        }

                    },
                    error: function(err) {},

                });

            },
        }
    });
    var getData = function(allot_order_id) {
        var _data= {
                allot_order_id: allot_order_id,
            };
        var _url='/app/auth/page/erp/getReceipts.do';
        Http.ajax({
            data:_data,
            isSync: true,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"调拨单获取商品数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    setTimeout(function() {
                        var dt = ret.object;
                        receiveGetData(dt);
                        console.log(allotGetgood.detail);
                        var dl = ret.object;
                        allotGetgood.detailVOList = receiveGetDetailData(dl);

                        // allotGetgood.detail.totalPrice = totalPriceCount || 0;
                        // allotGetgood.detail.checkAmount = checkAmountCount || 0;
                    }, 0);
                } else {
                    _g.toast(ret.message);
                }

            },
            error: function(err) {},

        });

    };

    var getPostDetailList = function() {
        var postDetailList = [];
        // _.each
        _.each(allotGetgood.detailVOList, function(detail) {

            _.each(detail.receiptDetailList, function(item) {
                postDetailList.push({
                    allot_detail_id: item.allotDetailId,
                    bar_code: detail.barCode,
                    product_name: detail.productName,
                    sku_own_code: 00,
                    sku_name: item.skuName,
                    unit: item.unit,
                    allot_amount: item.allotAmount,
                    out_amount: item.outAmount,
                    in_amount: item.inAmount,
                    price: item.price,
                    out_total_price: item.totalPrice,
                    allot_total_price: item.totalPriceCount,
                    remark: item.remark,
                    product_id: item.productId,
                    sku_id: item.skuId,
                    sku_code: item.skuCode
                })
            })
        })
        console.log(_g.j2s(postDetailList));
        return postDetailList;
    }


    //     return _.map(allotGetgood.detailVOList, function(item) {
    //         item === {
    //             barCode: '(1112233)',
    //             productName: 'test',
    //             receiptDetailList: [{
    //                 allotDetailId: 0,
    //                 allotOrderId: 0,
    //                 productId: 0,
    //                 skuName: '蓝色',
    //                 skuCode: '',
    //                 skuId: 0,
    //                 allotAmount: 1,
    //                 outAmount: 0,
    //                 unit: '',
    //                 amount: 0,
    //                 amountMax: 10,
    //                 price: 1,
    //                 checkAmount: 1000,
    //             }]
    //         }

    //         return {
    //             "allot_detail_id": "252",
    //             "bar_code": "999332",
    //             "product_name": "舒心纸尿布",
    //             "sku_own_code": "999332-1",
    //             "sku_name": "小码",
    //             "unit": "件",
    //             "allot_amount": "10",
    //             "out_amount": "5",
    //             "price": "50.00",
    //             "out_total_price": "250.00",
    //             "allot_total_price": "500.00",
    //             "remark": "",
    //             "product_id": 382,
    //             "sku_id": 1489,
    //             "sku_code": 531
    //         }
    //     })
    // }

    var getPostList = function() {
        var postList = {};
        position = {
            allot_order_id: allotGetgood.detail.allotOrderId,
            remark: allotGetgood.detail.remark,

        };
        console.log(_g.j2s(position));
        return position;
    }

    var receiveGetData = function(result) {
        var list = result.vo ? result.vo : {};
        allotGetgood.detail.allotOrderNo = list.allot_order_no || '';
        allotGetgood.detail.outStorehouseName = list.out_storehouse_name || '';
        allotGetgood.detail.inStorehouseName = list.in_storehouse_name || '';
        allotGetgood.detail.auditStatus = list.audit_status || '';
        allotGetgood.detail.orderStatus = list.status_name || '';
        allotGetgood.detail.allotOrderId = list.allot_order_id || 0;
        vo_remark = list.remark || '';

    }

    var receiveGetDetailData = function(result) {
        var listDetail = result.productVOList ? result.productVOList : [];
        return _.map(listDetail, function(item) {
            return {
                productName: item.product_name || '',
                barCode: item.bar_code || '',
                receiptDetailList: _.map(item.detailVOList, function(itemDetial) {
                    checkAmountCount += itemDetial.allot_amount || 0;
                    totalPriceCount += (itemDetial.price || 0) * (itemDetial.allot_amount || 0);
                    return {
                        allotDetailId: itemDetial.allot_detail_id || 0,
                        allotOrderId: itemDetial.allot_order_id || 0,
                        skuName: itemDetial.sku_name || '',
                        skuCode: itemDetial.sku_code || '',
                        skuId: itemDetial.sku_id || 0,
                        productId: itemDetial.product_id || 0,
                        allotAmount: itemDetial.allot_amount || 0,
                        unit: itemDetial.unit || '',
                        outAmount: itemDetial.out_amount || 0,
                        inAmount: itemDetial.in_amount || 0,
                        price: itemDetial.price || 0,
                        amount: itemDetial.allot_amount || 0,
                        amountMax: itemDetial.allot_amount || 0,
                        remark: vo_remark
                    }
                }),

            }


        });
    }


    getData(allot_order_id);


    module.exports = {};
});
