define(function(require, exports, module) {

    var Http = require('U/http');

    var header = _g.addHeader({
        data: {
            title: '调拨单'
        }
    });

    var page = 1;

    var sendUrl = '/app/auth/page/erp/listDeliverys.do';

    var inUrl = '/app/auth/page/erp/listReceipts.do';

    var status = '';

    var allotNote = new Vue({
        el: '#allotNote',
        template: _g.getTemplate('shop/allotNote-body-V'),
        data: {

            tagList: [{
                text: '调拨发货',
                isSelect: 1
            }, {
                text: '调拨收货',
                isSelect: 0
            }, ],
            lists: [{
                    allotOrderId: 0,
                    allotOrderNo: 'P549674102101210',
                    outStorehouseName: '天河供应商',
                    inStorehouseName: '天河仓',
                    totalPrice: '5000',
                    createTime: '2016-5-25 16:30:30',
                    allot_order_id: 1,
                    // isCheck: 0,                   
                },

            ],
        },
        created: function() {
            this.lists = [];
        },
        methods: {
            onChangeTap: function(index) {
                _.each(this.tagList, function(n, i) {
                    if (index == i) {
                        n.isSelect = 1;
                        if (index == 0) {
                            status = sendUrl;
                        } else if (index == 1) {
                            status = inUrl;
                        } else {
                            status = '';
                        }
                        getData(sendUrl);
                    } else
                        n.isSelect = 0;
                });

            },
            onDetailTap: function(allotOrderId) {
                var turnUrl = '';
                var winName = '';
                var titleTo = '';
                if (status == sendUrl) {
                    winName = 'shop-allotsendgoods';
                    turnUrl = '../shop/allotsendgoods.html';
                    titleTo = '调拨发货';
                } else if (status == inUrl) {
                    winName = 'shop-allotGetgoods';
                    turnUrl = '../shop/allotGetgoods.html';
                    titleTo = '调拨收货';
                } else {
                    winName = 'shop-allotsendgoods';
                    turnUrl = '../shop/allotsendgoods.html';
                    titleTo = '调拨发货';
                }
                // alert(winName+','+turnUrl);
                _g.openWin({
                    header: {
                        data: {
                            title: titleTo,
                        }
                    },
                    name: winName,
                    url: turnUrl,
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        allot_order_id: allotOrderId,
                    }
                });
            }


        }
    });
    var getData = function(status) {

        Http.ajax({
            data: {

                displayRecord: 10,
                page: page,

            },
            isSync: true,
            url: status,

            success: function(ret) {

                if (ret.code == 200) {

                    setTimeout(function() {

                        var dt = ret.object;
                        if (status == sendUrl) {

                            var list = getSendDataList(dt);
                            allotNote.lists = list;
                            console.log(dt);
                        } else if (status == inUrl) {
                            var list = getInDataList(dt);
                            allotNote.lists = list;
                            console.log(dt);

                        }

                    }, 0);
                } else {
                    _g.toast(ret.message);
                }
            },
            error: function(err) {},

        });

    }

    var getSendDataList = function(result) {
        var list = result ? result.lists : [];
        return _.map(list, function(item) {
            return {
                allotOrderId: item.allot_order_id || 0,
                allotOrderNo: item.allot_order_no || '000',
                outStorehouseName: item.out_storehouse_name || '',
                inStorehouseName: item.in_storehouse_name || '',
                totalPrice: item.total_price || 00,
                createTime: item.create_time || 000
            }
        });
    }
    var getInDataList = function(result) {
        var list = result ? result.lists : [];
        return _.map(list, function(item) {
            return {
                allotOrderId: item.allot_order_id || 0,
                allotOrderNo: item.allot_order_no || '000',
                outStorehouseName: item.out_storehouse_name || '',
                inStorehouseName: item.in_storehouse_name || '',
                totalPrice: item.total_price || 0,
                createTime: item.create_time || 000,
            }
        });
    }

    getData(sendUrl);

    module.exports = {};
});
