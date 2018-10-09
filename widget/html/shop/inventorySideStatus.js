define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#inventorySideStatus',
        template: _g.getTemplate('shop/inventorySideStatus-body-V'),
        data: {
            isAllChecked:false,
            list: [
                {
                    statusName:'正在进行',
                    statusId: '00N',
                    isChecked: false
                },
                {
                    statusName: '已完成',
                    statusId: '00P',
                    isChecked: false
                },
            ]
        },
        created: function () {
        //   this.list=[];
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
                    name: 'inventorySelectStatus',
                    extra: {
                        statusId:'',
                        statusName:'',
                        idx:'',
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onChooseStatus: function (statusId, i,statusName) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[i].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'inventorySelectStatus',
                    extra: {
                        statusId:statusId,
                        statusName:statusName,
                        idx:i
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
