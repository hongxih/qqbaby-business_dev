// define(function(require, exports, module) {
//     var audit_status = '00N';
//     var page = 0;
//     var next = true;
//     var Http = require('U/http');
//     var purchaseReceiptList = new Vue({
//         el: '#purchaseReceiptList',
//         template: _g.getTemplate('shop/purchaseReceiptList-list-V'),
//         data: {
//             noData: false,
//             tagList: [{
//                 text: '未审核',
//                 isSelect: 1
//             }, {
//                 text: '已审核',
//                 isSelect: 0
//             } ],
//             list: [{
//                 purchaseNo: 'P549674102101210',
//                 status: '未审核',
//
//                 supplier: '天河供应商',
//                 entrepot: '天河仓',
//                 money: 500000,
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 0,
//                 orderId: 1
//             }, {
//                 purchaseNo: 'P549674102101210',
//                 status: '已审核',
//                 supplier: '天河供应商',
//                 entrepot: '天河仓',
//                 money: 500000,
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 1,
//                 orderId: 1
//             }, {
//                 purchaseNo: 'P549674102101210',
//                 status: '未审核',
//                 supplier: '天河供应商',
//                 entrepot: '天河仓',
//                 money: 500000,
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 0,
//                 orderId: 1
//             }, {
//                 purchaseNo: 'P549674102101210',
//                 status: '已审核',
//                 supplier: '天河供应商',
//                 entrepot: '天河仓',
//                 money: 500000,
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 1,
//                 orderId: 1
//             }, ],
//         },
//         created: function() {
//             this.list = [];
//         },
//         methods: {
//             onChangeTap: function(index) {
//                 _.each(this.tagList, function(n, i) {
//                     if (index == i) {
//                         n.isSelect = 1;
//                         if (index == 0) {
//                             audit_status = '00N';
//                         } else if (index == 1) {
//                             audit_status = '00P';
//                         } else {
//                             audit_status = '';
//                         }
//                         page = 0;
//                         next = true;
//                         purchaseReceiptList.list = [];
//                         getData(audit_status);
//                     } else {
//                         n.isSelect = 0;
//                     }
//                 });
//             },
//             onDetailTap: function(orderId) {
//                 _g.openWin({
//                     header: {
//                         data: {
//                             title: '采购收货详情'
//                         }
//                     },
//                     name: 'shop-purchaseReceiptDetails',
//                     url: '../shop/purchaseReceiptDetail.html',
//                     bounces: false,
//                     slidBackEnabled: false,
//                     pageParam: {
//                         order_id: orderId
//                     }
//                 });
//             }
//         }
//     });
//
//     getData = function(audit_status) {
//         if(next){
//             _g.showProgress();
//             page ++;
//             Http.ajax({
//                 data: {
//                     audit_status: audit_status,
//                     displayRecord: 10,
//                     page: page
//                 },
//                 url: '/app/auth/page/erp/erpReceiptOrderList.do',
//                 success: function(ret) {
//                     if (ret.code == 200) {
//                         console.log(ret.object);
//                         setTimeout(function() {
//                             if (ret.object) {
//                                 if(ret.object.lists.length < 1 && page == 1){
//                                     purchaseReceiptList.noData = true;
//                                     next = false;
//                                 }else if(ret.object.lists.length > 0 && page >= 1){
//                                     purchaseReceiptList.noData = false;
//                                     next = true;
//                                     var list = getDataList(ret.object);
//                                     if(purchaseReceiptList.list){
//                                         purchaseReceiptList.list = purchaseReceiptList.list.concat(list);
//                                     }else{
//                                         purchaseReceiptList.list = list;
//                                     }
//                                 }else if(ret.object.lists.length < 1 && page > 1){
//                                     _g.toast('没有更多数据');
//                                     purchaseReceiptList.noData = false;
//                                     next = false;
//                                 }
//                             }
//                             _g.hideProgress();
//                         }, 0);
//                     } else {
//                         _g.hideProgress();
//                         _g.toast(ret.message);
//                     }
//                 },
//                 error: function(err) {
//                     _g.hideProgress();
//                 },
//             });
//         }else{
//
//         }
//     }
//     getDataList = function(result) {
//         var list = result ? result.lists : [];
//         return _.map(list, function(item) {
//             return {
//                 purchaseNo: item ? item.receipt_order_no : 0,
//                 status: item ? getStatus(item.audit_status) : '',
//                 supplier: item ? item.supplier_name : '',
//                 entrepot: item ? item.storehouse_name : '',
//                 money: item ? item.order_total_price : 000,
//                 time: item ? item.create_time : '',
//                 isCheck: item ? getCheck(item.audit_status) : 0,
//                 orderId: item ? item.receipt_order_id : 0
//             }
//         });
//     }
//     getStatus = function(result) {
//         switch (result) {
//             case '00N':
//                 return '未审核';
//                 break;
//             case '00P':
//                 return '已审核';
//                 break;
//         }
//     }
//     getCheck = function(result) {
//         switch (result) {
//             case '00P':
//                 return 1;
//                 break;
//             case '00N':
//                 return 0;
//                 break;
//         }
//     }
//     getData(audit_status);
//     //刷新采购列表
//     api && api.addEventListener({
//         name: 'refresh-purchaseReceiptList',
//     }, function(ret, err) {
//         // purchaseReceiptList.list = [];
//         // getData(audit_status);
//         purchaseReceiptList.onChangeTap(0);
//     });
//     api.addEventListener({
//         name: 'scrolltobottom',
//         extra: {
//             threshold: 200
//         }
//     }, function(ret, err) {
//         getData(audit_status);
//     });
//     module.exports = {};
// });
define(function(require, exports, module) {

    var Http = require('U/http');
    var isSeeBuyPrice = api.pageParam.isSeeBuyPrice

    var purchaseOrderList = new Vue({
        el: '#purchaseReceiptList',
        template: _g.getTemplate('shop/purchaseReceiptList-list-V'),
        data: {
            isSeeBuyPrice:isSeeBuyPrice,
            isFirstLoading:true,
            isNoResult:false,
            isSelect:false,
            supplierId:'',
            warehouseId:'',
            statusId:'',
            supplierName:'',
            warehouseName:'',
            isSearch:false,
            list:{
                "2017-03":[{
                    supplier_name:'供应商名称',
                    create_time:'2017-03-09 11:44:00',
                    order_total_price:'10000',
                    purchase_order_id:'1792',
                    purchase_order_no:'PO00501702271102590001',
                    supplier_name:'自采',
                    audit_status:'00N',
                },
                {
                    supplier_name:'供应商名称',
                    create_time:'2017-03-08 11:44:00',
                    order_total_price:'10000',
                    purchase_order_id:'1792',
                    purchase_order_no:'PO00501702271102590001',
                    supplier_name:'自采',
                    audit_status:'00P',
                },
              ],
                "2017-02":[{
                    supplier_name:'供应商名称',
                    create_time:'2017-02-27 11:44:00',
                    order_total_price:'10000',
                    purchase_order_id:'1792',
                    purchase_order_no:'PO00501702271102590001',
                    supplier_name:'自采',
                    audit_status:'00N',
                    purchase_order_id:'',
                },
                {
                    supplier_name:'供应商名称',
                    create_time:'2017-02-27 11:44:00',
                    order_total_price:'10000',
                    purchase_order_id:'1792',
                    purchase_order_no:'PO00501702271102590001',
                    supplier_name:'自采',
                    audit_status:'00N',
                    purchase_order_id:'',
                },
              ],
            },
        },
        created: function() {
            this.list = [];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        computed:{
            isNoResult: function () {
                if(this.isFirstLoading) return false
                var sta = this.list.length === 0 ? true : false
                return sta
            }
        },
        filters:{
             formatDate: function (val) {
                 if(val){
                     var month = val.split('-')[1];
                     var beforeM = new Date().getMonth()+1;
                     if(month == beforeM){
                         return '本月'
                     }else{
                         if(month == '01'){
                             return '一月';
                         }else if(month == '02'){
                             return '二月';
                         }else if(month == '03'){
                             return '三月';
                         }else if(month == '04'){
                             return '四月';
                         }else if(month == '05'){
                             return '五月';
                         }else if(month == '06'){
                             return '六月';
                         }else if(month == '07'){
                             return '七月';
                         }else if(month == '08'){
                             return '八月';
                         }else if(month == '09'){
                             return '九月';
                         }else if(month == '10'){
                             return '十月';
                         }else if(month == '11'){
                             return '十一月';
                         }else if(month == '12'){
                             return '十二月';
                         }
                     }
                 }
             },

             formatType : function(res){
                 if(res == "00P"){
                     return 0;
                 }else{
                     return 1;
                 }
             },
             formatTime : function(res){
                 if(res){
                     var data = parseInt(res.split(" ")[0].split('-')[2]);
                     var dateTime = new Date().getDate();
                     var beforeDay = new Date().getMonth()+1;
                     var yesterday = (new Date(new Date().Format('yyyy-MM-dd')).getTime()) - 60*60*1000*24;
                     var dataYesterday = new Date(res.split(' ')[0]).getTime();
                     if(res.split("-")[1]==beforeDay){
                         if(data == dateTime){
                             return '今天';
                         }if(yesterday == dataYesterday){
                             return '昨天';
                         }else{
                             var time = new Date(res.split(' ')[0]).getDay();
                             console.log(time)
                             switch(time){
                                 case 0:
                                     return '周日';
                                 case 1:
                                     return '周一';
                                 case 2:
                                     return '周二';
                                 case 3:
                                     return '周三';
                                 case 4:
                                     return '周四';
                                 case 5:
                                     return '周五';
                                 case 6:
                                     return '周六';
                             }
                         }
                     }else{
                         var time = new Date(res.split(' ')[0]).getDay();
                             switch(time){
                                 case 0:
                                     return '周日';
                                 case 1:
                                     return '周一';
                                 case 2:
                                     return '周二';
                                 case 3:
                                     return '周三';
                                 case 4:
                                     return '周四';
                                 case 5:
                                     return '周五';
                                 case 6:
                                     return '周六';
                             }
                     }

                 }
             },
             formatDay : function(res){
                 if(res){
                     var data = parseInt(res.split(" ")[0].split('-')[2]);
                     var dateTime = new Date().getDate();
                     var beforeDay = new Date().getMonth()+1;
                     var yesterday = (new Date(new Date().Format('yyyy-MM-dd')).getTime()) - 60*60*1000*24;
                     var dataYesterday = new Date(res.split(' ')[0]).getTime();
                     if(res.split("-")[1]==beforeDay){
                         if(data == dateTime || yesterday == dataYesterday){
                             var time =  res.split(' ')[1].split(':')[0] + ":" + res.split(' ')[1].split(':')[1];
                             return time;
                         }else{
                             var time2 = res.split(' ')[0].split('-')[1] + "-" + res.split(' ')[0].split('-')[2];
                             return time2;
                         }
                     }else{
                         var time3 = res.split(' ')[0].split('-')[1] + "-" + res.split(' ')[0].split('-')[2];
                         return time3;
                     }
                 }
             }
        },
        methods: {
            onDetailTap:function (orderId) {
                var _data={
                    title: '采购收货详情'
                };
                logger.log({"Type":"operation","action":"点击采购收货列表具体采购单","Win_name":api.winName,"data":_data});
                _g.openWin({
                    header: {
                        data: _data
                    },
                    name: 'shop-purchaseReceiptDetails',
                    url: '../shop/purchaseReceiptDetail.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        order_id: orderId
                    }
                });
            }
        }
    });
    var getData = function (opts,callback) {
        var opts = opts || {};

        var _data={
                displayRecord:10,
                page:opts.page || 1,
                audit_status:purchaseOrderList.statusId || '',
                storehouse_id:purchaseOrderList.warehouseId || '',
                supplier_id:purchaseOrderList.supplierId || '',
            };
        var _url='/app/auth/erp/listReceiptOrder.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success:function (res) {
                logger.log({"Type":"operation","action":"获取采购收货列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                purchaseOrderList.isFirstLoading = false
                _g.hideProgress();
                if(res.success){
                    purchaseOrderList.isSearch = false
                    if(opts.page && opts.page > 1){
                        setTimeout(function () {
                            callback && callback(res.object)
                        },0)
                    }else{
                        setTimeout(function () {
                            purchaseOrderList.list = res.object;
                            console.log(res.object);
                        },0)
                    }
                }else{
                    if(purchaseOrderList.isSearch){
                        purchaseOrderList.list = [];
                        purchaseOrderList.isSearch = false;
                    }
                    //_g.toast(res.message)
                    callback && callback(res.object)
                }
            },
            error:function (err) {
                purchaseOrderList.isFirstLoading = false
                _g.hideProgress();
            }
        })
    }

    var loadmore = new Loadmore({
        callback: function(page){



            getData({page: page.page}, function(data){
                if(!data || _.isEmpty(data)){
                    return loadmore.loadend(false);
                }else{
                    _.map(data,function (item,i) {
                        var length = purchaseOrderList.list.length-1;
                        console.log(purchaseOrderList.list)
                        if(item.month_time == purchaseOrderList.list[length].month_time){
                            purchaseOrderList.list[length].list = purchaseOrderList.list[length].list.concat(item.list);
                        }else{
                            purchaseOrderList.list = purchaseOrderList.list.concat(item);
                        }
                    })
                    loadmore.loadend(true);
                }
            });





        }
    });

    getData();
    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
            loadmore.reset();
        },0)
    });
    //接收头部发送信息，打开筛选侧边栏
    api.addEventListener({
        name: 'shop-purchaseReceiptList-openDrawerLayout'
    }, function(ret, err) {
        api.openDrawerPane({
            type: 'right'
        });
    });

    //接收搜索框信息，重新刷新页面
    api.addEventListener && api.addEventListener({
        name: 'shop-refresh'
    }, function(ret, err) {
        purchaseOrderList.isSearch = true;
        purchaseOrderList.supplierId = ret.value.supplierId;
        purchaseOrderList.statusId = ret.value.statusId;
        purchaseOrderList.warehouseId = ret.value.warehouseId;
        purchaseOrderList.supplierName = ret.value.supplierName ? ret.value.supplierName : '全部';
        purchaseOrderList.isSelect = ret.value.isSelect;
        purchaseOrderList.warehouseName = ret.value.warehouseName ? ret.value.warehouseName : '全部';
        getData();
        loadmore.reset();
    });
    //刷新采购列表
     api && api.addEventListener({
         name: 'refresh-purchaseReceiptList',
     }, function(ret, err) {
         getData();
         loadmore.reset();
     });
    module.exports = {};
});
