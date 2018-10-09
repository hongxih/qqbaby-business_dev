define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#managerMemberSideLevel',
        template: _g.getTemplate('member/managerMemberSideLevel-body-V'),
        data: {
            isAllChecked:false,
            list: [
                {
                    memberLevel: 1,
                    memberLevelId: 1,
                    isChecked: false
                },
                {
                    memberLevel: 2,
                    memberLevelId: 2,
                    isChecked: false
                },
                {
                    memberLevel: 3,
                    memberLevelId: 3,
                    isChecked: false
                },
                {
                    memberLevel: 4,
                    memberLevelId: 4,
                    isChecked: false
                },
                {
                    memberLevel: 5,
                    memberLevelId: 5,
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
                    name: 'level',
                    extra: {
                        key1: '',
                        key2: ''
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onChooseLevel: function (level, i) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[i].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'level',
                    extra: {
                        key1: this.list[i].memberLevel,
                        key2: this.list[i].memberLevelId
                    }
                });
                api.closeFrame && api.closeFrame({});
            }
        }
    });
    var getData = function () {
        var _url='/app/auth/crm/user/listCrmUserLevel.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"会员等级筛选","Win_name":api.winName,"message":res,"requireURL":_url})
                vm.list = getItem(res.object);
                getRadio();
            },
            error: function (err) {
            }
        })
    }
    var getItem = function (obj) {
        return _.map(obj, function (item) {
            return {
                memberLevel: item.user_level_name,
                memberLevelId: item.user_level_id,
                isChecked: false
            }
        })
    }
    var getRadio = function () {
        var id = api.pageParam.Id;
        if(id===''){
            vm.isAllChecked=true;
            for (key in vm.list) {
                vm.list[key].isChecked = false
            }
        }else{
            for (key in vm.list) {
                vm.list[key].memberLevelId == id && (vm.list[key].isChecked = true)
            }
        }

    };
    getData()

});
