
define(function(require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var allDetails = new Vue({
        el: '#managerUncheckBill',
        template: _g.getTemplate('manager/managerUncheckBill-list-V'),
        data: {
            totalNum: 0,
            type: '',
            page: 1,
            list:[
            {
                title:"采购订单",
                type: 'erpPurchaseOrder',
                num:1,
                isShow:false,
                items:[
                {
                    un_audit_name:"天河供应商",
                    create_time:"2016-12-21 00:00:00",
                    id:0,
                }
                ],
            },
            {
                title:"采购收货单",
                num:1,
                type: 'erpReceiptOrder',
                isShow:false,
                items:[
                {
                    un_audit_name:"天河供应商",
                    create_time:"2016-12-21 00:00:00",
                    id:0,
                }
                ],
            },
            {
                title:"采购退货单",
                num:1,
                type: 'erpReturnOrder',
                isShow:false,
                items:[
                {
                    un_audit_name:"天河供应商",
                    create_time:"2016-12-21 00:00:00",
                    id:0,
                    range:0,
                }
                ],
            },
            {
                title:"盘点单",
                num:1,
                type: 'erpCheckOrder',
                isShow:false,
                items:[
                {
                    un_audit_name:"天河供应商",
                    create_time:"2016-12-21 00:00:00",
                    id:0,
                    range:103,
                }
                ],
            },

            {
                title:"新客户开发",
                num:1,
                type: 'erpCheckOrder',
                isShow:false,
                items:[
                {
                    customer_name:"聪聪",
                    customer_phone:17511111111,
                    customer_time:"2016-12-21 00:00:00",
                    id:0,
                    range:0,
                    order_no:'1111111111-1111111111-1111'
                }
                ],
            },
            ],
        },
        created: function(){
            // _.each(this.list, function(el, index){
            //     el.items = [];
            // });
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
                    // getData({ type: type });
                    self.list[index].isShow = !self.list[index].isShow;  
                }
                // loadmore.reset();
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
                }
                if(type === 'erpCheckOrder'){
                    _g.openWin({
                        header:{
                            data:{
                                title:'盘点单详情'
                            }
                        },
                        name:'shop-inventorycheckeditor',
                        url:'../shop/inventorycheckeditor.html',
                        bounces:false,
                        pageParam:{
                            check_order_id:id
                        }
                    })
                }
            }       
        }
    });

    // 获取数据
    // function getData(opts, callback){
    //     opts = opts || {};
    //     !opts.page && _g.showProgress();
    //     Http.ajax({
    //         url: '/app/auth/page/retail/listUnAudit.do',
    //         data: {
    //             displayRecord: 10,
    //             page: opts.page || 1,
    //             un_audit_type: opts.type || ''
    //         },
    //         success: function(res){
    //             // console.log(res);
    //             _g.hideProgress();
    //             if(res.success){                    
    //                 allDetails.totalNum = res.object.total_num;
    //                 api.sendEvent && api.sendEvent({
    //                     name: 'uncheckBillNum',
    //                     extra: {
    //                         key: allDetails.totalNum
    //                     }
    //                 });    
    //                 _.each(allDetails.list, function(item, index){
    //                     var type_num= item.type + '_num';  
    //                     item.num = res.object[type_num];                
    //                     if(opts.type && item.type === res.object.unAuditOrder.un_audit_type){
    //                         if(opts.page && opts.page > 1){
    //                             callback && callback(res.object.unAuditOrder.list,index);
    //                         }else{
    //                             allDetails.list[index].items = res.object.unAuditOrder.list;
    //                         }
    //                     }
    //                 }); 
    //             }else{
    //                 _g.hideProgress();
    //                 _g.toast(res.message);
    //             }
    //         },
    //         error: function(err){ }
    //     });
    // };

    // var loadmore = new Loadmore({
    //     callback: function(page){
    //         getData({page: page.page,type:allDetails.type}, function(data,index){
    //             if(!data || data.length === 0){
    //                 console.log(data);
    //                 return loadmore.loadend(false);
    //             }else{
    //                 allDetails.list[index].items = allDetails.list[index].items.concat(data);
    //                 console.log(data);
    //                 loadmore.loadend(true);                         
    //             }
    //         });
    //     }   
    // });

    function closeList(){
        _.each(allDetails.list,function(value, key){
            value.isShow = false;
        });
    }


    // getData();

    // api.addEventListener && api.addEventListener({
    //     name: 'refresh-purchaseOrderList'
    // }, function(ret, err) {
    //     getData();
    //     closeList();
    // });
    // api.addEventListener && api.addEventListener({
    //     name: 'refresh-purchaseReceiptList'
    // }, function(ret, err) {
    //     getData();
    //     closeList();
    // });
    // api.addEventListener && api.addEventListener({
    //     name: 'refresh-purchaseReturnList'
    // }, function(ret, err) {
    //     getData();
    //     closeList();
    // });







    window.app = allDetails;
    module.exports = {};
});