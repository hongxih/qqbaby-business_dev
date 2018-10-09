define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#bossStoreSide',
        template: _g.getTemplate('boss/bossStoreSide-body-V'),
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
                // alert(api.pageParam.from);
                // return;

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
    /*
     获取企业门店列表
     */
    var getData = function () {
        var _url= '/app/auth/store/list.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                  logger.log({"Type":"operation","action":"老板提成获取门店列表","Win_name":api.winName,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.list = getDetail(res);
                        var id = api.pageParam.cId//数组序号
                        vm.list[id] && (vm.list[id].isChecked = true);
                    }, 0);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    };
    /*
     过滤企业门店列表
     */
    var getDetail = function (res) {
        return _.map(_.filter(res.object, function (item) {
            return item.org_type === '002';
        }), function (item) {
            return {
                sName: item.org_name,
                id: item.org_id,
                isChecked: 0
            };
        });
    };
    getData();


});
