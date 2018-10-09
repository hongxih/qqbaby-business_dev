define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#shopSide',
        template: _g.getTemplate('shop/shopSide-body-V'),
        data: {
            supplier:'',
            supplierId:'',
            supplierIdx:'',
            warehouse:'',
            warehouseId:'',
            warehouseIdx:'',
            status:'',
            statusId:'',
            statusIdx:'',
        },
        filters: {
            transformSupplier:function (val) {
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
                this.supplier='';
                this.supplierId='';
                this.supplierIdx='';
                this.warehouse='';
                this.warehouseId='';
                this.warehouseIdx='';
                this.status='';
                this.statusId='';
                this.statusIdx='';
            },
            onSupplierTap:function () {
                api.openFrame && api.openFrame({
                    name: "shop-shopSide-shopSideSupplier",
                    url: "../shop/shopSideSupplier.html",
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        id:this.supplierIdx,
                    },
                    bounces: false,
                    animation:{
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            },
            onWarehouseTap:function () {
                api.openFrame && api.openFrame({
                    name: "shop-shopSide-shopSideWarehouse",
                    url: "../shop/shopSideWarehouse.html",
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
            onStatusTap:function () {
                api.openFrame && api.openFrame({
                    name: "shop-shopSide-shopSideStatus",
                    url: "../shop/shopSideStatus.html",
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
            //发送搜索框信息到门店管理的采购订单、采购退货、采购收货页面刷新列表
            onSearchTap:function () {
                api.sendEvent({
                    name: 'shop-refresh',
                    extra: {
                        supplierId:this.supplierId,
                        warehouseId:this.warehouseId,
                        statusId:this.statusId,
                        supplierName:this.supplier,
                        warehouseName:this.warehouse,
                        isSelect:true,
                    }
                });
                api.closeDrawerPane();
            }
        }
    });

    //接收二级搜索框（供应商）返回的数据
    api.addEventListener && api.addEventListener({
        name: 'selectSupplier'
    }, function (ret) {
        vm.supplierIdx = ret.value.idx;
        vm.supplierId = ret.value.supplierId;
        vm.supplier = ret.value.supplierName;
    });

    //接收二级搜索框（仓库）返回的数据
    api.addEventListener && api.addEventListener({
        name: 'selectWarehouse'
    }, function (ret) {
        vm.warehouseIdx = ret.value.idx;
        vm.warehouseId = ret.value.warehouseId;
        vm.warehouse = ret.value.warehouseName;
    });

    //接收二级搜索框（审核状态）返回的数据
    api.addEventListener && api.addEventListener({
        name: 'selectStatus'
    }, function (ret) {
        vm.statusIdx = ret.value.idx;
        vm.statusId = ret.value.statusId;
        vm.status = ret.value.statusName;
    });




});
