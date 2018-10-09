// define(function(require, exports, module) {
//     var audit_status = '00N';
//     var page = 0;
//     var next = true;
//     var Http = require('U/http');
//     var inventorychecklist = new Vue({
//         el: '#inventorychecklist',
//         template: _g.getTemplate('shop/inventorychecklist-list-V'),
//         data: {
//             noData: false,
//             tapList: [{
//                 text: '未审核',
//                 isSelect: 1
//             }, {
//                 text: '已审核',
//                 isSelect: 0
//             }],
//             list: [{
//                 checkOrderNo: 'P549674102101210',
//                 checkBatchNo: 'P549674102101210',
//                 status: '未审核',
//                 entrepot: '天河仓',
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 0,
//                 orderId: 1
//             }, {
//                 checkOrderNo: 'P549674102101210',
//                 checkBatchNo: 'P549674102101210',
//                 status: '已审核',
//                 entrepot: '天河仓',
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 1,
//                 orderId: 1
//             }, {
//                 checkOrderNo: 'P549674102101210',
//                 checkBatchNo: 'P549674102101210',
//                 status: '未审核',
//                 entrepot: '天河仓',
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 0,
//                 orderId: 1
//             }, {
//                 checkOrderNo: 'P549674102101210',
//                 checkBatchNo: 'P549674102101210',
//                 status: '已审核',
//                 entrepot: '天河仓',
//                 time: '2016-5-25 16:30:30',
//                 isCheck: 1,
//                 orderId: 1
//             }, ],
//         },
//         created: function() {
//            this.list = [];
//         },
//         methods: {
//             onChangeTap: function(index) {
//                 _.each(this.tapList, function(n, i) {
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
//                         getData(audit_status);
//                         inventorychecklist.list = [];
//                     } else {
//                         n.isSelect = 0;
//                     }
//                 });
//             },
//             onDetailTap: function(order_id, isCheck) {
//                 _g.openWin({
//                     header: {
//                         data: {
//                             title: isCheck ? '盘点单详情' : '编辑盘点单'
//                         }
//                     },
//                     name: isCheck ? 'shop-inventorycheckdetails' : 'shop-inventorycheckeditor',
//                     url: isCheck ? '../shop/inventorycheckdetails.html' : '../shop/inventorycheckeditor.html',
//                     bounces: false,
//                     slidBackEnabled: false,
//                     pageParam: {
//                         check_order_id: order_id
//                     }
//                 });
//             }
//         }
//     });
//     getData = function(audit_status) {
//         if (next) {
//             _g.showProgress();
//             page++;
//             Http.ajax({
//                 data: {
//                     audit_status: audit_status,
//                     displayRecord: 10,
//                     page: page
//                 },
//                 url: '/app/auth/page/erp/listCheckOrder.do',
//                 success: function(ret) {
//                     if (ret.code == 200) {
//                         setTimeout(function() {
//                             if (ret.object) {
//                                 if (ret.object.lists.length < 1 && page == 1) {
//                                     inventorychecklist.noData = true;
//                                     next = false;
//                                 } else if (ret.object.lists.length > 0 && page >= 1) {
//                                     inventorychecklist.noData = false;
//                                     next = true;
//                                     var list = getDataList(ret.object);
//                                     if (inventorychecklist.list) {
//                                         inventorychecklist.list = inventorychecklist.list.concat(list);
//                                         console.log(list);
//                                     } else {
//                                         inventorychecklist.list = list;
//                                     }
//                                 } else if (ret.object.lists.length < 1 && page > 1) {
//                                     _g.toast('没有更多数据');
//                                     next = false;
//                                     page = 1;
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
//         }
//     }
//     getDataList = function(result) {
//         var list = result ? result.lists : [];
//         return _.map(list, function(item) {
//             return {
//                 checkOrderNo: item ? item.check_order_no : 0,
//                 checkBatchNo: item ? item.check_batch_no : 0,
//                 status: item ? getStatus(item.audit_status) : '',
//                 entrepot: item ? item.storehouse_name : '',
//                 time: item ? item.create_time : '',
//                 isCheck: item ? getCheck(item.audit_status) : 0,
//                 orderId: item ? item.check_order_id : 0
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
//     // _g.setPullDownRefresh(function() {
//     //     next = true;
//     //     page = 0;
//     //     inventorychecklist.list = [];
//     //     getData(audit_status);
//     // });
//     api && api.addEventListener({
//         name: 'refresh-inventorychecklist'
//     }, function(ret, err) {
//         inventorychecklist.list = [];
//         inventorychecklist.onChangeTap(0);
//         // audit_status = '00N';
//         // getData(audit_status);
//     });
//     api.addEventListener({
//         name: 'scrolltobottom',
//         extra: {
//             threshold: 200 //设置距离底部多少距离时触发，默认值为0，数字类型
//         }
//     }, function(ret, err) {
//         getData(audit_status);
//     });
//     module.exports = {};
// });
define(function(require, exports, module) {
    var Http = require('U/http');
    var batch_id = api && api.pageParam.id;
    var vm = new Vue({
        el: '#inventorychecklist',
        template: _g.getTemplate('shop/inventorychecklist-list-V'),
        data:{
            isNull:false,
            isShow:true,
            isAdd:false,
            check_order_id:null,
            check_batch_no:'',
            storehouse_name:'',
            batch_type_name:'',
            batch_key_name:'',
            create_admin_name:'',
            create_time:'',
            remark:'',
            object:[]
        },
        created:function (){
            this.object=[];
        },
        methods:{
            onToggle:function () {
                this.isShow = !this.isShow;
            },
            onDetailTap: function(check_order_id) {
              var _id={
                id:check_order_id
              };
              logger.log({"Type":"operation","action":"打开盘点单详情页面","Win_name":api.winName,"id":_id})
                _g.openWin({
                    header: {
                        data: {
                            title:'盘点单详情',
                        }
                    },
                    pageParam:_id,
                    name: 'shop-inventorycheckdetails' ,
                    url: '../shop/inventorycheckdetails.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onAdd:function(){
                var _data={
                    title: '新增编辑盘点单',
                    searchInput:'',
                    placeholder:'条码/自编码/助记码',
                    mode:'search'
                };
                logger.log({"Type":"operation","action":"打开添加商品页面","Win_name":api.winName,"data":_data})
                _g.openWin({
                   header: {
                       data: _data,
                       template:'../html/header/header-addInventoryCheck-V'
                   },
                   name: 'shop-addInventoryCheck',
                   url: '../shop/addInventoryCheck.html',
                   bounces: false,
                   pageParam: {
                       check_batch_id:batch_id,
                   }
               });
            }
        },
    });
 var getData=function(){
    var _data={
                batch_type_attr_code:'ERP_CHECK_TYPE',
                check_batch_id:batch_id || ''
            };
    var _url='/app/auth/erp/stock/getErpCheckBatch.do';
        Http.ajax({
            data:_data,
            isSync:true,
            api_versions:'v2',
            url:_url,
            success:function(ret){
                logger.log({"Type":"operation","action":"盘点单列表页面获取盘点批号信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.code==200){
                    vm.check_batch_no=ret.object.check_batch_no;
                    vm.storehouse_name=ret.object.storehouse_name;
                    vm.batch_type_name=ret.object.batch_type_name
                    vm.batch_key_name=detailRange(ret.object.batch_type_name,ret.object.batch_key_name);
                    vm.create_admin_name=ret.object.create_admin_name;
                    vm.create_time=ret.object.create_time;
                    //vm.audit_admin_name=ret.object.audit_admin_name===null?"未审核":ret.object.audit_admin_name;
                    vm.remark=ret.object.remark;
                } else{
                        _g.toast(ret.message);
                }
            },
            error:function(err){}
        })
    }
    //具体范围显示
    var detailRange=function(all,detail){
       if(detail===null){
          if(all==="全盘盘点"){
            detail="全店";
          }
          else{
            detail="抽样";
          }
       }
       else{
        detail=detail;
       }
       return detail;
    }
    //盘点单列表接口
    var getDataList=function(opts,callback){
        var opts=opts||{};
        var _data={
                check_batch_id:batch_id || '',
                displayRecord:10,
                page:opts.page||1
            };
        var _url='/app/auth/erp/stock/listCheckOrder.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            isSync:true,
            success:function(ret){
                logger.log({"Type":"operation","action":"获取盘点单列表","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.success){
                  if(opts.page||opts.page>1){
                     setTimeout(function(){
                        callback && callback(ret.object);
                     },0);
                  }else{
                        if(ret.object.length===0){
                               vm.isAdd=true;
                        }else{
                         setTimeout(function(){
                            vm.isAdd=false;
                         },0);
                        }
                        vm.object=ret.object;
                  }
                }else{
                    _g.toast(ret.message);
                }
            },
            error:function(err){}
        });
    }
    //分页
    var loadmore=new Loadmore({
        callback:function(page){
            getDataList({page:page.page},function(data){
                if(!data || _.isEmpty(data)){
                    return loadmore.loadend(false);
                }else{
                    vm.object=vm.object.concat(concatData(data));
                    loadmore.loadend(true);
                }
            });
        }
    });
    //接口数据转换
    var concatData=function(data){
        return _.map(data,function(item){
          return {
            check_batch_id:item.check_batch_id,
            check_order_id:item.check_order_id,
            check_order_no:item.check_order_no,
            create_admin_name:item.create_admin_name,
            check_total_record:item.check_total_record,
            check_total_amount:item.check_total_amount,
            create_time:item.create_time
          }
        });
    }
    //添加商品
    api.addEventListener && api.addEventListener({
        name:'shop-addInventoryCheck__add'
    },function(ret,err){
        logger.log({"Type":"operation","action":"接收头部信息，打开添加商品页面","Win_name":api.winName});
             _g.openWin({
                    header: {
                        data: {
                            title: '新增编辑盘点单',
                            searchInput:'',
                            placeholder:'条码/自编码/助记码',
                            mode:'search',
                            type:1
                        },
                        template:'../html/header/header-addInventoryCheck-V'
                    },
                    name: 'shop-addInventoryCheck',
                    url: '../shop/addInventoryCheck.html',
                    bounces: false,
                    pageParam: {
                        check_batch_id:batch_id,
                    },
                    allowEdit:true,
            });
    })
    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            logger.log({"Type":"operation","action":"向下拉动刷新盘点单列表数据","Win_name":api.winName});
            getData();
            getDataList();
        },0)
        loadmore.reset();
    });
    //接收添加商品返回刷新
    api && api.addEventListener({
         name:'shop-inventorychecklist-refresh'
     },function(ret,err){
        logger.log({"Type":"operation","action":"接收添加商品返回刷新","Win_name":api.winName});
        getData();
        getDataList();
        loadmore.reset();
     });
    //接收盘点单详情页面返回刷新
    api && api.addEventListener({
         name:'shop-inventorychecklist1-refresh'
     },function(ret,err){
        logger.log({"Type":"operation","action":"接收盘点单详情页面返回刷新","Win_name":api.winName});
        getData();
        getDataList();
        loadmore.reset();
     });
    getData();
    getDataList();
    module.exports = {};
});
