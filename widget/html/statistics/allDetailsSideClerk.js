define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#allDetailsSideClerk',
        template: _g.getTemplate('statistics/allDetailsSideClerk-body-V'),
        data: {
            list: [
                {
                    clerkName: '',
                    clerkId: '',
                    isChecked: false
                }
            ]
        },
        created: function () {
            this.list = [];
        },
        methods: {
            onClose: function () {
                api.closeFrame({});
            },
            onChooseLevel: function (idx) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[idx].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'allDetailSideClerkChoose',
                    extra: {
                        clerkName: this.list[idx].clerkName,
                        clerkId: this.list[idx].clerkId,
                        idx: idx
                    }
                });
                api.closeFrame && api.closeFrame({});
            }
        }
    });

    /**
     *  获取数据--营业员信息
     *
     **/
    var getData = function (opts, callback) {
        opts = opts || {};
        var _data= {
                displayRecord: '',// 一页大小   number
                page: ''
            };
        var _url='/app/auth/sales/list.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (ret) {
                logger.log({"Type":"operation","action":"全部销售列表-侧边栏-营业员数据获取","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.success) {
                    var arr = getItem(ret.object)
                    var allClerk = {
                        clerkName: '全部营业员',
                        clerkId: '',
                        isChecked: false
                    }
                    arr.unshift(allClerk)
                    vm.list = arr
                    clerkInit()
                } else {
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
            },
            error: function (err) {
                _g.toast(err.message);
            }
        });
    };
    // 暂不使用
    var loadmore = new Loadmore({
        callback: function (page) {
            getData({page: page.page}, function (data) {
                if (!data || data.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.list = vm.list.concat(data);
                    loadmore.loadend(true);
                }
            });
        }
    });
    /**
     *  套接口
     *  @param [object]
     *  @return [array]
     **/
    var getItem = function (obj) {
        return _.map(obj, function (item, i) {
            return {
                clerkName: item.sales_name,
                clerkId: item.sales_id,
                isChecked: false
            }
        })
    }

    /**
     *  初始化
     *
     **/
    var clerkInit = function () {
        /**===== parameter & status =====**/
        var idx = api.pageParam.idx || 0
        for (key in vm.list) {
            vm.list[key].isChecked = false
        }
        vm.list[idx].isChecked = true
    }

    /**===== invoking function =====**/
    getData()
});
