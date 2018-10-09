
define(function(require, exports, module) {
    var Http = require('U/http');
    var allDetails = new Vue({
        el: '#uncheckBill',
        template: _g.getTemplate('statistics/uncheckBill-body-V'),
        data: {
            isNoResult:false,
            totalNum: 0,
            type: '',
            page: 1,
            list:[
            {
                title:"采购订单",
                type: 'erpPurchaseOrder',
                num:0,
                isShow:false,
                items:[
                {
                    supply:"天河供应商",
                    time:"2016-12-21 00:00:00",
                    id:0
                }
                ]
            },
            {
                title:"采购收货单",
                num:0,
                type: 'erpReceiptOrder',
                isShow:false,
                items:[
                {
                    supply:"天河供应商",
                    time:"2016-12-21 00:00:00",
                    id:0
                }
                ]
            },
            {
                title:"采购退货单",
                num:0,
                type: 'erpReturnOrder',
                isShow:false,
                items:[
                {
                    supply:"天河供应商",
                    time:"2016-12-21 00:00:00",
                    id:0,
                    range:0
                }
                ]
            },
            {
                title:"盘点批号",
                num:0,
                type: 'erpCheckBatch',
                isShow:false,
                items:[
                {
                    supply:"天河供应商",
                    time:"2016-12-21 00:00:00",
                    id:0,
                    range:0
                }
                ]
            },
            ]
        },
        created: function(){
            _.each(this.list, function(el, index){
               el.items = [];
            });
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height;
            document.getElementById('noResultWrap').style.height = h + 'px';
       },
        filters: {
            transRange: function(value){
                if(!value) return;
                var map = {
                    100: '全场盘点',
                    101: '类别盘点',
                    102: '品牌盘点',
                    103: '单品盘点',
                    104: '动态盘点'
                };
                return map[value];
            }
        },
        methods: {
            onToggleShow:function (index, type) {
                var self = this;
                if(self.list[index].isShow){
                    self.list[index].isShow = !self.list[index].isShow;
                    self.type = '';
                }else{
                    self.type = self.list[index].type;
                    _.each(self.list, function(el){
                        el.isShow = false;
                        // el.items = [];
                    });
                    getData({ type: type });
                    self.list[index].isShow = !self.list[index].isShow;
                }
                loadmore.reset();
            },
            onClickTap: function(type, id){
                console.log(type);
                if(type === 'erpPurchaseOrder'){
                    _g.openWin({
                        header: {
                            data: {
                                title: '采购订单详细'
                            }
                        },
                        name: 'shop-purchaseOrderDetail',
                        url: '../shop/purchaseOrderDetail.html',
                        bounces: false,
                        pageParam: {
                            order_id: id
                        }
                    });
                    var _data=id;
                    logger.log({"Type":"operation","action":"在未审核列表页面点击打开采购订单详情页面","Win_name":api.winName,"data":_data});
                }
                if(type === 'erpReceiptOrder'){
                    _g.openWin({
                        header: {
                            data: {
                                title: '采购收货详情'
                            }
                        },
                        name: 'shop-purchaseReceiptDetail',
                        url: '../shop/purchaseReceiptDetail.html',
                        bounces: false,
                        pageParam: {
                            order_id: id
                        }
                    });
                    logger.log({"Type":"operation","action":"在未审核列表页面点击打开采购收货详情页面","Win_name":api.winName,"data":id});
                }
                if(type === 'erpReturnOrder'){
                    _g.openWin({
                        header:{
                            data:{
                                title: '采购退货详情'
                            }
                        },
                        name: 'shop-purchaseReturnDetail',
                        url: '../shop/purchaseReturnDetail.html',
                        bounces: false,
                        pageParam:{
                            orderId:id
                        }
                    })
                    logger.log({"Type":"operation","action":"在未审核列表页面点击打开采购退货详情页面","Win_name":api.winName,"data":id});
                }
                if(type === 'erpCheckBatch'){
                    _g.openWin({
                    header:{
                        data:{
                            title:'盘点批号详情',
                            rightText:'查看盘点单',
                        },
                        template:'../html/header/header-base2-V',
                    },
                    pageParam:{
                        id:id,
                        audit_status:"00N"
                    },
                    bounces:false,
                    name:'shop-inventoryCheckBatchDetail',
                    url:'../shop/inventoryCheckBatchDetail.html',
                });
                    logger.log({"Type":"operation","action":"在未审核列表页面点击打开盘点批号详情页面","Win_name":api.winName,"data":id});
                }
            }
        }



    });

    // 获取数据
    function getData(opts, callback){
        opts = opts || {};
        !opts.page && _g.showProgress();
        var _data= {
                displayRecord: 10,
                page: opts.page || 1,
                un_audit_type: opts.type || ''
            };
        var _url='/app/auth/page/retail/listUnAuditV2.do';
        Http.ajax({
            url:_url,
            data:_data,
            api_versions:'v2',
            success: function(res){
                logger.log({"Type":"operation","action":"获取未审核列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                // console.log(res);
                _g.hideProgress();
                if(res.success){
                    allDetails.totalNum = res.object.total_num;
                    if(allDetails.totalNum == 0){
                        allDetails.isNoResult = true;
                    }
                    api.sendEvent && api.sendEvent({
                        name: 'uncheckBillNum',
                        extra: {
                            key: allDetails.totalNum
                        }
                    });
                    _.each(allDetails.list, function(item, index){
                        var type_num= item.type + '_num';
                        item.num = res.object[type_num];
                        if(opts.type && item.type === res.object.unAuditOrder.un_audit_type){
                            if(opts.page && opts.page > 1){
                                setTimeout(function () {
                                    callback && callback(res.object.unAuditOrder.list,index);
                                },0)
                            }else{
                                allDetails.list[index].items = res.object.unAuditOrder.list;
                            }
                        }
                    });
                }else{
                    _g.hideProgress();
                    _g.toast(res.message);
                }
            },
            error: function(err){ }
        });
    };

    var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page,type:allDetails.type}, function(data,index){
                if(!data || data.length === 0){
                    // console.log(data);
                    return loadmore.loadend(false);
                }else{
                    allDetails.list[index].items = allDetails.list[index].items.concat(data);
                    console.log(data);
                    loadmore.loadend(true);
                }
            });
        }
    });

    function closeList(){
        _.each(allDetails.list,function(value, key){
            value.isShow = false;
        });
    }


    getData();

    api.addEventListener && api.addEventListener({
        name: 'refresh-purchaseOrderList'
    }, function(ret, err) {
        getData();
        closeList();
    });
    api.addEventListener && api.addEventListener({
        name: 'refresh-purchaseReceiptList'
    }, function(ret, err) {
        getData();
        closeList();
    });
    api.addEventListener && api.addEventListener({
        name: 'refresh-purchaseReturnList'
    }, function(ret, err) {
        getData();
        closeList();
    });
    api && api.addEventListener({
       name:'shop-inventorycheckdetail-refresh'
   },function(ret,err){
        getData();
        closeList();
   });
    window.app = allDetails;
    module.exports = {};
});
