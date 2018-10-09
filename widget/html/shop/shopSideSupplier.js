define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#shopSideSupplier',
        template: _g.getTemplate('shop/shopSideSupplier-body-V'),
        data: {
            isAllChecked:false,
            list: [
                {
                    supplierName: '诺贝可',
                    supplierId: 1,
                    isChecked: false
                },
                {
                    supplierName: '诺贝可',
                    supplierId: 1,
                    isChecked: false
                },
                {
                    supplierName: '诺贝可',
                    supplierId: 1,
                    isChecked: false
                },
                {
                    supplierName: '诺贝可',
                    supplierId: 1,
                    isChecked: false
                },
                {
                    supplierName: '诺贝可',
                    supplierId: 1,
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
                    name: 'selectSupplier',
                    extra: {
                        supplierId:'',
                        supplierName:'',
                        idx:'',
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onChooseSupplier: function (supplierId, i,supplierName) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[i].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'selectSupplier',
                    extra: {
                        supplierId:supplierId,
                        supplierName:supplierName,
                        idx:i,
                    }
                });
                api.closeFrame && api.closeFrame({});
            }
        }
    });
    var getData = function () {
        var _url='/app/auth/page/erp/erpSupplierListAll.do';
        Http.ajax({
            data: {},
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"门店管理-侧边栏-供应商数据获取","Win_name":api.winName,"message":res,"requireURL":_url})
                console.log(res.object)
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
                 supplierName:item.supplier_name || '',
                 supplierId:item.supplier_id || '',
                 isChecked: false
             }
        })
    }
    var getRadio = function () {
        var id = api.pageParam.id;
        if(id===''){
            vm.isAllChecked=true;
            for (key in vm.list) {
                vm.list[key].isChecked = false
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
