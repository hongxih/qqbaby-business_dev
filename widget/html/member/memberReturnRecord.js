define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    /**
     * entry 1: **ThemeName(boss,manager,clerk) ---> here
     * entry 2: memberDetail ---> here
     */

    /**===== parameter & status =====**/
    var themeId = api.pageParam.themeId;// themeId <<=== lastPage
    var list = api.pageParam.list;
    var type = api.pageParam.type;
    var entId = '';
    if (list) {
        entId = list.user_id //memberDetail & **ThemeName(boss,manager,clerk) in
    } else {
        entId = api.pageParam.entId//memberDetail in
    }

    var vm = new Vue({
        el: '#memberReturnRecord',
        template: _g.getTemplate('member/memberReturnRecord-body-V'),
        data: {
            list: [
                {
                    clerkName: '',
                    ReturnWay: '',
                    RecommendWays: '',
                    ReturnTime: '',
                    ReturnInfo: ''

                }
            ],
            isFirstLoading:true,
            isNoResult:false,
        },
        created: function () {
            this.list = [];
        },
        ready:function(){
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        computed: {
            isNoResult: function () {
                if(this.isFirstLoading) return false
                var sta = this.list.length === 0 ? true : false
                return sta
            }
        },
        watch: {},
        filters: {},
        methods: {}
    });


    var getData = function (opts, callback) {
        opts = opts || {};
        var _data={
                displayRecord: 10,
                page: opts.page || 1,
                user_id: entId,
                care_id: themeId,
                type: type
            };
        var _url='/app/auth/crm/user/listCrmUserVisit.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function (res) {
                logger.log({"Type":"operation","action":"会员回访记录获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.isFirstLoading = false
                if (res.code == 200) {
                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            callback && callback(res);
                        }, 0)
                    } else {
                        setTimeout(function () {
                            vm.list = getItemList(res);
                        }, 0)
                    }
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                vm.isFirstLoading = false
                _g.hideProgress();
            }
        })
    };
    getData();
    //格式化列表
    var getItemList = function (res) {
        return _.map(res.object, function (item) {
            return {
                clerkName: item.staff_name,//营业员
                ReturnWay: getType(item.type),//回访方式
                RecommendWays: item.care_name,//主题名称
                ReturnTime: getTime(item.visit_time),//回访时间
                ReturnInfo: item.content//回访内容
            }
        })
    };
    //回访方式
    var getType = function (res) {
        switch (res) {
            case 'wx':
                return '微信';
            case 'phone':
                return '电话';
            case 'msg':
                return '短信';
            case 'other':
                return '其他';
        }
    };
    //格式化时间  xx-xx hh:mm
    var getTime = function (res) {
        if (res) {
            var time = res.split(" ");
            var Ndate = time[1].split(":");
            var year = time[0].split("-");
            var Ntime = year[1] + "-" + year[2] + " " + Ndate[0] + ":" + Ndate[1];
            return Ntime;
        }
    }
    //分页
    var loadmore = new Loadmore({
        callback: function (page) {
            getData({page: page.page}, function (data) {
                if (!data.object || data.object.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.list = vm.list.concat(getItemList(data));
                    loadmore.loadend(true);
                }
            });
        }
    });
    api.addEventListener && api.addEventListener({
        name: 'managerThemeInput'
    }, function (ret, err) {
        _g.openWin({
            header: {
                data: {
                    title: '回访录入'
                },
            },
            pageParam: {
                list: list,
                title: api.pageParam.title,
                themeId: api.pageParam.themeId,
                entId: entId,
            },
            name: 'member-clerkThemeInput',
            url: '../member/clerkThemeInput.html',
            bounces: false,
            slidBackEnabled: false,
        })
    });
    api.addEventListener && api.addEventListener({
        name: 'reload-visitList'
    }, function (ret, err) {
        getData();
    });
    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
            loadmore.reset();
        }, 0)
    });
    module.exports = {};
});
