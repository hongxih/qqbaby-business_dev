define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#bossStoreSide',
        template: _g.getTemplate('boss/bossStoreSideV2-body-V'),
        data: {
            allIsChecked: 1,
            sId: '',
            list: [
                {
                    sName: '门店1',
                    id: '',
                    isChecked: 0
                },
                {
                    sName: '门店2',
                    id: '',
                    isChecked: 0
                },
                {
                    sName: '门店3',
                    id: '',
                    isChecked: 0
                },
            ],
            orgList: []
        },
        methods: {
            onClose: function () {
                api.closeFrame && api.closeFrame({});
            },
            onCheckedInit: function (i) {
                _.map(this.list, function (item, ind) {
                    item.isChecked = 0;
                }.bind(this));
                this.list[i].isChecked = 1;
                this.allIsChecked = 0;
                this.sId = i;//i是下标
            },
            toggleChecked: function (i) {
                this.onCheckedInit(i)
                this.sendMsg(this.list[this.sId].sName, this.sId);
                this.onClose();
            },
            sendMsg: function (sName, sId) {
                if ($.trim(this.sId) === '') return;
                api.sendEvent && api.sendEvent({
                    name: 'refreshStore-' + api.pageParam.from,
                    extra: {
                        key1: sName,
                        key2: sId,//下标
                        orgId: this.list[sId].id//orgID
                    }
                });
            }
        },
        created: function () {
            this.list = []
        }

    });
    /**
     *  套接口
     **/
    var getDetail = function (res) {
        return _.map(res,function (item) {
            return {
                sName: item.store_name,
                id: item.org_id,
                isChecked: false
            };
        });
    };
    /**
     *  bossThemeCallBackSide =====>> here
     *  cName: this.clerkName,
     *  cId: this.clerkInd,//下标
     *  from: 'bossThemeCallBackSide',
     *  storeList:this.storeList
     **/
    vm.list = getDetail(api.pageParam.storeList)
    var ind = api.pageParam.cId
    if(vm.list.length !== 0){
        vm.list[ind].isChecked = true
    }

});
