define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#inventorySideWarehouse',
        template: _g.getTemplate('shop/inventorySideWarehouse-body-V'),
        data: {
            isAllChecked:false,
            list: [
                {
                    warehouseName: '诺贝可',
                    warehouseId: 1,
                    isChecked: false
                },
                {
                    warehouseName: '诺贝可',
                    warehouseId: 1,
                    isChecked: false
                },
                {
                    warehouseName: '诺贝可',
                    warehouseId: 1,
                    isChecked: false
                },
                {
                    warehouseName: '诺贝可',
                    warehouseId: 1,
                    isChecked: false
                },
                {
                    warehouseName: '诺贝可',
                    warehouseId: 1,
                    isChecked: false
                }
            ]
        },
        created: function () {
          this.list=[];
        },
        methods: {
            onClose: function () {
                api.closeFrame({});
            },
            onChooseTag: function () {
                this.isAllChecked = !this.isAllChecked
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                api.sendEvent && api.sendEvent({
                    name: 'inventorySelectWarehouse',
                    extra: {
                        warehouseId:'',
                        warehouseName:'',
                        idx:''
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onChooseWarehouse: function (warehouseId, i,warehouseName) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[i].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'inventorySelectWarehouse',
                    extra: {
                        warehouseId:warehouseId,
                        warehouseName:warehouseName,
                        idx:i
                    }
                });
                api.closeFrame && api.closeFrame({});
            }
        }
    });
    var getData = function () {
        var _url='/app/auth/page/erp/erpStorehouseListAll.do';
        Http.ajax({
            data: {},
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"盘点批号侧边栏仓库列表获取","Win_name":api.winName,"message":res,"requireURL":_url})
                // console.log(res.object)
                vm.list = getItem(res.object);
                getRadio();
            },
            error: function (err) {
            }
        })
    }
    var getItem = function (obj) {
        return _.map(obj.lists, function (item) {
             return {
                 warehouseName:item.storehouse_name || '',
                 warehouseId:item.storehouse_id || '',
                 isChecked: false
             }
        })
    }
    var getRadio = function () {
        var id = api.pageParam.id;
        if(id===''){
            vm.isAllChecked=true;
            for (key in vm.list) {
                vm.list[key].isChecked = false;
            }
        }else{
            for (key in vm.list) {
                vm.list[key].isChecked = false;
                vm.list[id].isChecked = true;
            }
        }

    };
    getData()

});
