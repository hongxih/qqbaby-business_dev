define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var tagList = api.pageParam.tagList || [];
    var vm = new Vue({
        el: '#managerMemberSideTag',
        template: _g.getTemplate('member/managerMemberSideTag-body-V'),
        data: {
            allCheck: false,
            list: [
                {
                    index: 1,
                    tagName: '标签1',
                    check: false,
                    i: 0
                },
                {
                    index: 2,
                    tagName: '标签2',
                    check: false,
                    i: 1
                },
                {
                    index: 3,
                    tagName: '标签3',
                    check: false,
                    i: 2
                },
                {
                    index: 4,
                    tagName: '标签4',
                    check: false,
                    i: 3
                },
            ]
        },
        created: function () {
            this.list = []
        },
        methods: {
            onClose: function () {
                api.closeFrame({});
            },
            //全部标签
            onChooseTag: function () {
                this.allCheck = !this.allCheck
                for (key in this.list) {
                    this.list[key].check = this.allCheck
                }
            },
            //单个标签
            onClickTag: function (idx) {
                this.list[idx].check = !this.list[idx].check;
                var status = true;
                for (key in this.list) {
                    status = status && this.list[key].check
                }
                this.allCheck = status;
            },
            onChooseTagList: function () {
                var tagList = [];
                _.map(this.list, function (item, i) {
                    if (item.check) {
                        var data = {};
                        data.tagName = item.tagName;
                        data.index = item.index;
                        data.check = item.check;
                        data.i = i;
                        var List = data && JSON.stringify(data)
                        tagList.push(List);
                    }
                })
                var tagListArr = tagList.toString()

                api.sendEvent({
                    name: 'tagList',
                    extra: {
                        key1: tagListArr
                    }
                });
                api.closeFrame({});
            }
        }
    });
    var getData = function () {
        var _url='/app/auth/crm/user/listAllCrmUserTag.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"会员信息筛选","Win_name":api.winName,"message":res,"requireURL":_url})
                vm.list = getItem(res.object);
                if (!tagList) return
                for (key in tagList) {
                    var i = tagList[key].i
                    vm.list[i].check = true
                }
            },
            error: function (err) {
            }
        })
    }
    var getItem = function (obj) {
        return _.map(obj, function (item, i) {
            return {
                index: item.tag_id,
                tagName: item.tag_name,
                check: !!item.is_selected,
                i: i
            }
        })
    }
    getData()
});
