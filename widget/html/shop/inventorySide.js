define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#inventorySide',
        template: _g.getTemplate('shop/inventorySide-body-V'),
        data: {
            warehouse:'',
            warehouseId:'',
            warehouseIdx:'',
            range:'',
            rangeId:'',
            rangeIdx:'',
            status:'',
            statusId:'',
            statusIdx:'',
        },
        filters: {
            transformRange:function (val) {
                if(val == ''){
                    return '全部'
                }else{
                    return val
                }
            },
            transformWarehouse:function (val) {
                if(val == ''){
                    return '全部'
                }else{
                    return val
                }
            },
            transformStatus:function (val) {
                if(val == ''){
                    return '全部'
                }else{
                    return val
                }
            },

        },
        methods: {
            onCloseDrawer: function () {
                api.closeDrawerPane();
            },
            onReset: function () {
                this.range='';
                this.rangeId='';
                this.rangeIdx='';
                this.warehouse='';
                this.warehouseId='';
                this.warehouseIdx='';
                this.status='';
                this.statusId='';
                this.statusIdx='';
            },
            onWarehouseTap:function () {
                api.openFrame && api.openFrame({
                    name: "shop-inventorySide-inventorySideWarehouse",
                    url: "../shop/inventorySideWarehouse.html",
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        id:this.warehouseIdx,
                    },
                    bounces: false,
                    animation:{
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            },
            onRangeTap:function () {
                api.openFrame && api.openFrame({
                    name: "shop-inventorySide-inventorySideRange",
                    url: "../shop/inventorySideRange.html",
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        id:this.rangeIdx,
                    },
                    bounces: false,
                    animation:{
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            },
            onStatusTap:function () {
                api.openFrame && api.openFrame({
                    name: "shop-inventorySide-inventorySideStatus",
                    url: "../shop/inventorySideStatus.html",
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam:{
                        id:this.statusIdx,
                    },
                    bounces: false,
                    animation:{
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            },
            //发送搜索框信息到盘点批号列表的页面刷新列表
            onSearchTap:function () {
                api.sendEvent({
                    name: 'shop-inventoryCheckBatch-refresh',
                    extra: {
                        rangeId:this.rangeId,
                        warehouseId:this.warehouseId,
                        statusId:this.statusId,
                        rangeName:this.range,
                        warehouseName:this.warehouse,
                        isSelect:true,
                    }
                });
                api.closeDrawerPane();
            }
        }
    });

    //接收二级搜索框（盘点范围）返回的数据
    api.addEventListener && api.addEventListener({
        name: 'inventorySelectRange'
    }, function (ret) {
        vm.rangeIdx = ret.value.idx;
        vm.rangeId = ret.value.rangeId;
        vm.range = ret.value.rangeName;
    });

    //接收二级搜索框（仓库）返回的数据
    api.addEventListener && api.addEventListener({
        name: 'inventorySelectWarehouse'
    }, function (ret) {
        vm.warehouseIdx = ret.value.idx;
        vm.warehouseId = ret.value.warehouseId;
        vm.warehouse = ret.value.warehouseName;
    });

    //接收二级搜索框（审核状态）返回的数据
    api.addEventListener && api.addEventListener({
        name: 'inventorySelectStatus'
    }, function (ret) {
        vm.statusIdx = ret.value.idx;
        vm.statusId = ret.value.statusId;
        vm.status = ret.value.statusName;
    });




});
