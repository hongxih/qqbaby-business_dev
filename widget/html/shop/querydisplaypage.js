define(function(require, exports, module) {
    var detail = api && api.pageParam.detail;
    var list = api && api.pageParam.list;
    var productId = api && api.pageParam.productId;
    var storehouseId = api && api.pageParam.storehouseId;
    var Http = require('U/http');
 
    var querydisplaypage = new Vue({
        el: '#querydisplaypage',
        template: _g.getTemplate('shop/querydisplaypage-detail-V'),
        data: {
            detail: {
                //productId: 450,
                //barCode: 'TEST12345',
                //productName: 'test12345',
                //storehouseName: '门店',
                //className: '母婴类',
                //brandName: '安踏',
                //totalStock : 100
            },
            list: [{
                //stockChangeId: 0,
                //orderType: "xxx",
                //orderName: "1111",
                //orderNo: "qweqw",
                //skuName: "wqeqw",
                //changeType: "qweqw",
                //amount: 0,
                //changeAfter: 0,
                //createTime: "20165-81238",
            }]
        },
        created: function() {
            this.detail = {};
            this.list = [];
        },
        methods: {

        }
    });
    var getData = function(detail, list) {
        var _data= {
                skucodeList: _g.j2s(list),
                stockChangeJsonString: _g.j2s(detail)
            };
        var _url='/app/auth/page/erp/erpStoreStockChangeList.do';
        Http.ajax({
            data:_data,
            isSync: true,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"库存查询商品流水详情获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    setTimeout(function() {
                        var dt = ret.object;
                        if (dt) {
                            var detail = getDetailVue(dt);
                            querydisplaypage.detail = detail;
                            var list = getListVue(dt);
                            querydisplaypage.list = list;
                            // alert("11:"+_g.j2s(querydisplaypage.list))
                            _.each(querydisplaypage.list, function(n, i){
                                if(n.orderName == 'POS零售退货' || n.orderName == '采购收货') {
                                    n.isOut = false;
                                    
                                    // alert(n.orderName);
                                } else {
                                    n.isOut = true;
                                   
                                }

                            });
                            api && api.sendEvent({
                                name: 'refresh-commodityflowquery',
                                extra: {
                                    item: {
                                        productId: productId
                                    }
                                }
                            });
                        } else {
                            _g.toast(ret.message);
                            api && api.sendEvent({
                                name: 'refresh-commodityflowquery',
                                extra: {
                                    item: {
                                        productId: productId
                                    }
                                }
                            });
                            setTimeout(function() {
                                _g.closeWins(['shop-querydisplaypage-win']);
                            }, 1000);
                        }
                    }, 0);
                } else {
                    _g.toast(ret.message);
                    api && api.sendEvent({
                        name: 'refresh-commodityflowquery',
                        extra: {
                            item: {
                                productId: productId
                            }
                        }
                    });
                    setTimeout(function() {
                        api && api.closeWin();
                    }, 1000);
                    // _g.toast(ret.message);
                }
            },
            error: function(err) {},
        });
    }
    var getDetailVue = function(result) {
        var detail = result ? result.appErpStockChange : {};
        return {
            productId: detail ? detail.product_id : 0,
            barCode: detail ? detail.bar_code : '',
            productName: detail ? detail.product_name : '',
            storehouseName: detail ? detail.storehouse_name : '',
            className: detail ? detail.class_name : '',
            brandName: detail ? detail.brand_name : '',
            totalStock: detail ? detail.total_stock_amonut : '',
        }
    }
    var getListVue = function(result) {
        var list = result ? result.lists : [];
        return _.map(list, function(item) {
            return {
                stockChangeId: item ? item.stock_change_id : 0,
                orderType: item ? item.order_type : "",
                orderName: item ? item.order_name : "",
                orderNo: item ? item.order_no : "",
                skuName: item ? item.sku_name : "",
                amount: item ? item.amount : 0,
                changeAfter: item ? item.change_after : 0,
                createTime: item ? item.create_time : "",
                changeType: item ? getChangeType(item.change_type) : '',
            }
        });
    }

    var getChangeType = function(change_type) {
        switch (change_type){
            case 'DEL':
                return '出库';
                break;
            case 'ADD':
                return '入库';
                break; 
        }
            


    }

    getData(detail, list);
    module.exports = {};
});
