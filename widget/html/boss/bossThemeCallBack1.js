define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var Time = require('U/getTime');
    var careId = api.pageParam && api.pageParam.themeId;
    var title = api.pageParam && api.pageParam.title;
    var themeType = api.pageParam && api.pageParam.statue;
    var vm = new Vue({
        el: '#bossThemeCallBack1',
        template: _g.getTemplate('boss/bossThemeCallBack1-body-V'),
        data: {
            careId: careId,
            isNoResult:false,
            list: [
                {
                    role: 1,//0----店员&店长 1-----营业员
                    pName: '营业员1',
                    hasRecall: 1500,
                    allPerson: 5000,
                    lastTime: '02-15 15:33'
                },
                {
                    role: 1,
                    pName: '营业员2',
                    hasRecall: 0,
                    allPerson: 5000,
                    lastTime: ''
                },
                {
                    role: 1,
                    pName: '营业员3',
                    hasRecall: 5000,
                    allPerson: 5000,
                    lastTime: '02-15 15:33'
                },
                {
                    role: 0,
                    pName: '店长2',
                    hasRecall: 0,
                    allPerson: 5000,
                    lastTime: ''
                },
                {
                    role: 0,
                    pName: '店长3',
                    hasRecall: 10,
                    allPerson: 0,
                    lastTime: '02-15 15:33'
                },
            ],
            orgId: [
                {
                    store_name: '',
                    store_id: '',//storeId
                    org_id:''//orgId
                }
            ]
        },
        created: function () {
            this.list = [];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        watch: {},
        filters: {
            roundOff: function (value) {
                return value * 100 || 0;
            },
            toPercent: function (value) {
                var v = Math.round(value * 10);
                var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                return arr[v];
            }
        },
        methods: {
            //筛选
            onMemberFiller: function () {
                api.openDrawerPane({
                    type: 'right',
                });
            }
        }

    });
    var i = i || 0;
    var getData = function (opts) {
        var opts = opts || {};
        var a=vm.orgId[i]&&vm.orgId[i].store_id
        var _data={
            care_id: careId,
            care_type: themeType,
            end_time: Time.getToday(),
            start_time: Time.getLastWeek(),
            org_id: vm.orgId[i] && vm.orgId[i].org_id,
            store_id: vm.orgId[i] && vm.orgId[i].store_id,
        };
        var _url='/app/auth/crm/care/listCareVisit.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"老板获取主题关怀列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                /*if(_g.isEmpty(res.object)){
                    vm.isNoResult = true
                    return
                }
                vm.isNoResult = false*/
                if (res.success) {
                    vm.list = res.object;
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
                _g.toast(err.message);
            }
        });
    }

    var getOrgId = function (callback) {
        var _data= {
                care_id:careId
            };
        var _url='/app/auth/crm/care/listCareOrg.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"老板获取主题关怀信息","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.orgId = getDetail(res);
                        getData();
                        broadcastThemeId();
                    }, 0);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    };

    var getDetail = function (res) {
        return _.map(res.object,function (item) {
            return {
                store_name: item.org_name,
                store_id: item.store_id,//orgId
                org_id: item.org_id//orgId
            };
        });
    };

    setTimeout(function () {
        getOrgId();
    }, 0)

    //会员列表
    api.addEventListener && api.addEventListener({
        name: 'bossThemeName'
    }, function (ret, err) {
        _g.openDrawerLayout({
            header: {
                data: {
                    title: title
                }
            },
            pageParam: {
                themeId: careId,
                statue: 'special',
                title: title,
                orgID: vm.orgId[0] && vm.orgId[0].org_id//orgId
            },
            name: 'boss-bossThemeName',
            url: '../boss/bossThemeName.html',
            rightPane: {
                name: 'rightPane',
                url: '../boss/bossThemeNameSide.html'
            }
        })
    });

    //搜索响应
    api.addEventListener && api.addEventListener({
        name: 'bossThemeCallBackSearch'
    }, function (ret, err) {
        i = ret.value.key2
        getData({})
    });

    /**
     *  广播主题ID和门店列表
     *  { themeId: ,storeList:[{ store_name: ,store_id: ,org_id: ,}]}
     **/
    var broadcastThemeId = function () {
        api.sendEvent && api.sendEvent({
            name: 'broadcastThemeId',
            extra: {
                type:'special',
                themeId:careId,
                storeList:vm.orgId
            }
        });
    }

    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        }, 0)
    });
    module.exports = {};
});
