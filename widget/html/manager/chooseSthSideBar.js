define(function (require, exports, module) {
    var Http = require('U/http');
    var chooseType = api.pageParam.type;//1为会员，2为PBC，勿动
    var vm = new Vue({
        el: '#chooseSth',
        template: _g.getTemplate('manager/chooseSthSideBar-body-V'),
        data: {
            isAllChecked:false,
            list: [
                {
                    statusName:'全部会员',
                    statusId: '100',
                    isChecked: false
                },
                {
                    statusName: '我的会员',
                    statusId: '200',
                    isChecked: false
                },
            ],
            listsList: {
                memberList: [
                    {
                        statusName:'全部会员',
                        statusId: '100',
                        isChecked: false
                    },
                    {
                        statusName: '我的会员',
                        statusId: '200',
                        isChecked: false
                    },
                ],
                productTypeList: [
                    {
                        statusName:'单品',
                        statusId: '100',
                        isChecked: false
                    },
                    {
                        statusName: '品牌',
                        statusId: '200',
                        isChecked: false
                    },
                    {
                        statusName:'分类',
                        statusId: '100',
                        isChecked: false
                    }
                ]
            }
        },
        created: function () {
        //   this.list=[];
            if(chooseType == 1) {
                this.list = this.listsList.memberList;
            }else if(chooseType == 2) {
                this.list = this.listsList.productTypeList;
            }
        },
        methods: {
            onClose: function () {
                api.closeFrame({});
            },
            onChooseStatus: function (statusId, i,statusName) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[i].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'chooseSth',
                    extra: {
                        chooseType:chooseType,
                        statusId:statusId,
                        statusName:statusName,
                        idx:i
                    }
                });
                var extra = {
                    statusId:statusId,
                    statusName:statusName,
                    idx:i
                };
                console.log(JSON.stringify(extra));
                api.closeFrame && api.closeFrame({});
            }
        }
    });

});
