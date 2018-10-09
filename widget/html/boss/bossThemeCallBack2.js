define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var Time = require('U/getTime');
    /**
     * entry 1: home ---> here
     * entry 2: memberIndex ---> here
     */
    var themeType = api && api.pageParam.themeType;
        careId = api && api.pageParam.careId;
    var vm = new Vue({
        el: '#bossThemeCallBack2',
        template: _g.getTemplate('boss/bossThemeCallBack2-body-V'),
        data: {
            careId: careId,
            isNoResult:false,
            list: [
                {
                    hasRecall: true,
                    sales_name: '店长',
                    recallF7: '120',
                    lastTime: '02-08 15:33'
                },
                {
                    hasRecall: false,
                    sales_name: '店长',
                    recallF7: '0',
                    lastTime: '02-08 15:33'
                },
            ],
            orgId: [],
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
            formatDate: function (val) {
                var str=val.substring(5,16);
                return str
            }
        },
        methods: {
            onMemberFiller: function(){
                api.openDrawerPane({
                    type: 'right',
                });
            }
        }

    });
    var orgId='';
    var getData = function (opts) {
        var opts = opts || {};
        var _data= {
                // displayRecord:10,
                care_id: careId || '',
                care_type: themeType,
                end_time: Time.getToday(),
                start_time: Time.getLastWeek(),
                org_id:orgId
                // page:opts.page,
            };
        var _url='/app/auth/crm/care/listCareVisit.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"老板账号主题关怀筛选","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
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
                _g.hideProgress()

                _g.toast(err.message);
            }
        });
    }

    //获取org_id
    var getOrgId = function (callback) {
        // Http.ajax({
        //     data: {
        //         care_id:careId
        //     },
        //     api_versions: 'v2',
        //     url: '/app/auth/crm/care/listCareOrg.do',
        //     success: function (res) {
        //         if (res.code == 200) {
        //             setTimeout(function () {
        //                 vm.orgId = getDetail(res);
        //                 getData();
        //                 broadcastThemeId();
        //             }, 0);
        //         } else {
        //             _g.toast(res.message);
        //         }
        //     },
        //     error: function (err) {
        //     }
        // });
        var _url='/app/auth/store/list.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"老板账号主题关怀选择门店","Win_name":api.winName,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.orgId = getDetail(res);
                        orgId=vm.orgId[0].store_id;//orgIg初始化
                        getData();
                        broadcastThemeId()
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
        return _.map(_.filter(res.object, function (item) {
            return item.org_type === '002';
        }), function (item) {
            return {
                store_name: item.org_name,
                store_id: item.org_id
            };
        });
    };
    // 响应筛选的信息
    api.addEventListener && api.addEventListener({
        name: 'bossThemeCallBackSearch'
    }, function (ret, err) {
        orgId=vm.orgId[ret.value.key2].store_id
        getData();
    });


    setTimeout(function () {
        getOrgId();
    }, 0)

    /**
     *  广播主题ID和门店列表
     *  { themeId: ,storeList:[{ store_name: ,store_id: ,org_id: ,}]}
     **/
    var broadcastThemeId = function () {
        api.sendEvent && api.sendEvent({
            name: 'broadcastThemeId',
            extra: {
                type:'usual',
                themeId:careId,
                storeList:vm.orgId
            }
        });
    }

    // 下拉刷新
    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        }, 0)
    });

    module.exports = {};
});
