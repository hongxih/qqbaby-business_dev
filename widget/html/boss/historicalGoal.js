define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#historicalGoal',
        template: _g.getTemplate('boss/historicalGoal-body-V'),
        data: {
            isShow: false,
            showImg: '',
            selectIdx: 0,
            defaultType: '目标类型',
            type: [
                {
                    typeName: "全部目标",
                    typeNum: '000',
                    type: ''
                },
                {
                    typeName: "单品目标",
                    typeNum: '001',
                    type: 'Goods'
                },
                {
                    typeName: "品牌目标",
                    typeNum: '002',
                    type: 'Brand'
                },
                {
                    typeName: "品类目标",
                    typeNum: '003',
                    type: 'Category'
                },
                {
                    typeName: "全场目标",
                    typeNum: '004',
                    type: 'Overall'
                },
            ],
            item: [
                {
                    target_name: null,
                    stage: "进行中",
                    target_num: '￥100,000.00',
                    target_achievement: "50%",
                    time: '2015-05-05至2015-06-05',
                    disOrNot: false

                }

            ],
            selectType: null,
            isFirstLoading:true,
            isNoResult:false,
        },
        created: function () {
            this.item = [];
        },
        ready:function(){
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },

        methods: {
            onShowType: function () {
                this.isShow = !this.isShow;
            },

            onSelectType: function (index, num, type) {
                console.log(num)
                this.selectIdx = index;
                this.defaultType = type;
                this.isShow = !this.isShow;

                //this.typeNum = num;
                this.selectType = num;
                getData();
                loadmore.reset();
            },
            onTargetShop: function (type, entId) {
                var opts = turnToPage(type);
                _g.openWin({
                    header: {
                        data: {
                            title: opts.title,
                            rightText: opts.rightText,
                        }
                    },
                    name: opts.name,
                    url: opts.url,
                    pageParam: {
                        entId: entId,
                        cancel: opts.cancel
                    },
                    bounces: false,
                    slidBackEnabled: false,
                })
            }
        }
    });

    var getData = function (opts, callback) {
        var opts = opts || {};
        var _data= {
                displayRecord: 30,
                page: opts.page || 1,
                goal_manager_status: 'history',
                goal_rang: vm.selectType || null
            };
        var _url='/app/auth/goal/company/listByStatus.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取历史目标","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.isFirstLoading = false
                if (res.code == 200) {
                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            callback && callback(res);
                        }, 0);
                    } else {
                        setTimeout(function () {
                            vm.item = getDetail(res);
                            vm.isNoResult = vm.item.length === 0 ? true : false
                        }, 0)
                    }
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                vm.isFirstLoading = false
            }
        });
    };
    var getDetail = function (res) {
        return _.map(res.object, function (item) {
            return {
                target_name: item.goal_name,
                stage: targetStage(item.goal_status),
                target_num: item.pre_ent_total_amount ? item.pre_ent_total_amount : 0,
                target_achievement: item.goal_achieved_rate ? item.goal_achieved_rate : 0,

                start_time: item.goal_start_time ? item.goal_start_time.split(' ')[0] : ' '.split(' ')[0],
                end_time: item.goal_end_time ? item.goal_end_time.split(' ')[0] : ' '.split(' ')[0],

                target_type: targetType(item.goal_rang),
                target_code: item.goal_status,
                disOrNot: item.goal_status != 'un_pulish' && item.goal_status != 'un_allocate',
                entId: item.ent_goal_setting_id
            }
        })
    };
    getData();

    var turnToPage = function (type) {
        if (type == 'doing' || type == 'end' || type == 'expired') {
            return {
                title: '门店排行',
                rightText: '店员',
                name: 'targetShop-rank',
                url: '../assistant/targetShopRank.html'
            };
        } else if (type == 'allocated' || type == 'cancel' || type == 'un_allocate') {
            return {
                title: '目标详情',
                rightText: null,
                cancel: type == 'cancel' ? true : null,
                name: 'targetShop-targetDetails',
                url: '../boss/targetDetails.html'
            };
        } else {
            return {
                title: '编辑目标',
                rightText: '发布',
                name: 'targetShop-editTarget',
                url: '../boss/editTarget.html'
            };
        }
    };

    var targetType = function (type) {
        switch (type) {
            case 'Overall':
                return '全场目标';
            case 'Goods':
                return '单品目标';
            case 'Brand':
                return '品牌目标';
            default:
                return '品类目标';
        }
    };
    var targetStage = function (stage) {
        switch (stage) {
            case 'doing':
                return '进行中';
            case 'un_pulish':
                return '未发布';
            case 'un_allocate':
                return '待分配';
            case 'allocated':
                return '已分配';
            case 'end':
                return '已完成';
            case 'cancel':
                return '被撤销';
            default:
                return '已失效'
        }
    };
    var loadmore = new Loadmore({
        callback: function (page) {
            getData({page: page.page}, function (data) {
                if (!data.object || data.object.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.item = vm.item.concat(getDetail(data));
                    loadmore.loadend(true);
                }
            });
        }
    });

    _g.setPullDownRefresh(function () {
        getData();
        loadmore.reset()
    });

    api.addEventListener && api.addEventListener({
        name: 'refresh-historicalGoal'
    }, function (ret, err) {
        getData();
        loadmore.reset();
    });
})
