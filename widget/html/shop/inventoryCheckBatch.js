define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#inventoryCheckBatch',
        template: _g.getTemplate('shop/inventoryCheckBatch-body-V'),
        data: {
            //接口参数
            statusId:null,
            rangeId:null,
            warehouseId:null,
            isFirstLoading:true,
            isNoResult:false,
            warehouseName:'仓库名称',
            rangeName:'盘点范围',
            month_time:'本月',
            isSelect:false,
            item:[
                // {
                //     range:'单品',
                //     rangeName:'分类名称',
                //     create_time1:'今天',
                //     create_time2:'10-15',
                //     storeName:'仓库名称',
                //     orderNumber:'CR25946106128410120',
                //     status:'doing'
                // },
                // {
                //     range:'单品',
                //     rangeName:'分类名称',
                //     create_time1:'今天',
                //     create_time2:'10-15',
                //     storeName:'仓库名称',
                //     orderNumber:'CR25946106128410120',
                //     status:'end'
                // },
                // {
                //     range:'单品',
                //     rangeName:'分类名称',
                //     create_time1:'今天',
                //     create_time2:'10-15',
                //     storeName:'仓库名称',
                //     orderNumber:'CR25946106128410120',
                //     status:'end'
                // },
            ]
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'

        },
        computed:{
            isNoResult: function () {
                if(this.isFirstLoading) return false;
                var sta = this.item === null ? true : false;
                return sta;
            }
        },
        created: function () {
            this.item = [];
        },
        filters:{
            formatType:function (val) {
                if(val){
                    switch(val){
                        case "100":
                            return "全盘";
                            break;
                        case "101":
                            return "分类";
                            break;
                        case "102":
                            return "品牌";
                            break;
                        case "103":
                            return "抽样";
                            break;
                        case "104":
                            return "动态";
                            break;
                    }
                }else{
                    return;
                }
            },
           formatTypeName:function(val){
                if(val=="单品盘点"){
                    val='抽样盘点'
                    return val;
                }else{
                    return val;
                }
           }
        },
        methods: {
            onItemTap:function (check_batch_id,audit_status){
                _g.openWin({
                    header:{
                        data:{
                            title:'盘点批号详情',
                            rightText:'查看盘点单',
                        },
                        template:'../html/header/header-base2-V',
                    },
                    pageParam:{
                        id:check_batch_id,
                        audit_status:audit_status
                    },
                    bounces:false,
                    name:'shop-inventoryCheckBatchDetail',
                    url:'../shop/inventoryCheckBatchDetail.html',
                });
            }
        }
    });

    var getData=function(opts,callback){
        var opts = opts || {};
        var _data={
                audit_status:vm.statusId,
                batch_type:vm.rangeId,
                batch_type_attr_code:'ERP_CHECK_TYPE',
                displayRecord:10 ,
                page: opts.page || 1,
                storehouse_id:vm.warehouseId,
            };
        var _url='/app/auth/erp/stock/listErpCheckBatch.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            isSync: true,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"获取盘点批号列表","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                vm.isFirstLoading = false;
                if(ret.success){
                    if(opts.page && opts.page > 1){
                        setTimeout(function () {
                            callback && callback(ret.object);
                        })
                    }else{
                        setTimeout(function () {
                            vm.item = ret.object;
                            // console.log(vm.item)
                        },0);
                    }
                }else{
                    _g.toast(ret.message)
                }
            },
            error:function () {

            }
        });
    };

    getData();

    var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data || _.isEmpty(data)){
                    return loadmore.loadend(false);
                }else{
                    _.map(data,function (list,i) {
                        var length = vm.item.length-1;
                        console.log(data)
                        // console.log(purchaseOrderList.list[purchaseOrderList.list.length-1].month_time)
                        if(list.month_time == vm.item[length].month_time){
                            vm.item[length].list = vm.item[length].list.concat(list.list);
                        }else{
                            vm.item = vm.item.concat(list);
                        }
                    })
                    loadmore.loadend(true);
                }
            });
        }
    });

    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        },0)
        loadmore.reset();
    });

    //接收头部发送信息，打开筛选侧边栏
    api.addEventListener&&api.addEventListener({
        name: 'shop-inventorySide'
    }, function(ret, err) {
        api.openDrawerPane({
            type: 'right'
        });
    });
   api.addEventListener&&api.addEventListener({
    name:'shop-inventoryNewNo'
   },function(ret,err){
    _g.openWin({
        header:{
            data:{
                title:"新增盘点批号"
            }
        },
        name:'shop-inventoryNewNo',
        url:'../shop/inventoryNewNo.html',
        bounces:false
    })

   })

   //接收搜索框传过来的信息刷新页面
   api && api.addEventListener({
       name: 'shop-inventoryCheckBatch-refresh'
   }, function(ret, err) {
       vm.rangeId = ret.value.rangeId;
       vm.warehouseId = ret.value.warehouseId;
       vm.statusId = ret.value.statusId ;
       vm.rangeName = ret.value.rangeName ? ret.value.rangeName : "全部";
       vm.warehouseName = ret.value.warehouseName ? ret.value.warehouseName : "全部";
       vm.isSelect = ret.value.isSelect;
       getData();
       loadmore.reset();
   });

   //接收详情页面传来的信息刷新页面
   api && api.addEventListener({
       name:'shop-inventorycheckdetail-refresh'
   },function(ret,err){
       getData();
       loadmore.reset();
   });
//详情页面返回刷新
   api && api.addEventListener({
    name:'inventoryCheckBatch-refresh'
    },function(){
    getData();
    loadmore.reset();
   });
   //接收新增盘点批号页面的返回信息
    api && api.addEventListener({
    name:'shop-inventoryCheckBatch1-refresh'
    },function(){
    getData();
    loadmore.reset();
   });
    module.exports = {};
});
