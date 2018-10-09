define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#inventorySideRange',
        template: _g.getTemplate('shop/inventorySideRange-body-V'),
        data: {
            isAllChecked:false,
            list: [
                {
                    rangeName: '全场盘点',
                    rangeId: "100",
                    isChecked: false
                },
                {
                    rangeName: '类别盘点',
                    rangeId: "101",
                    isChecked: false
                },
                {
                    rangeName: '品牌盘点',
                    rangeId: "102",
                    isChecked: false
                },
                {
                    rangeName: '抽样盘点',
                    rangeId: "103",
                    isChecked: false
                }
            ]
        },
        created: function () {
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
                    name: 'inventorySelectRange',
                    extra: {
                        rangeId:'',
                        rangeName:'',
                        idx:'',
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onChooseRange: function (rangeId, i,rangeName) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[i].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'inventorySelectRange',
                    extra: {
                        rangeId:rangeId,
                        rangeName:rangeName,
                        idx:i,
                    }
                });
                api.closeFrame && api.closeFrame({});
            }
        }
    });

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

    getRadio();

});
