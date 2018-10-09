define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    console.log('api.pageParam.themeId ' + api.pageParam.themeId);
    var Http = require('U/http');
    var Account = require('U/account');

    /**
     * entry 1: **ThemeName(boss,manager,clerk) ---> here
     * entry 2: memberMessage ----> here
     */ 

    /**===== parameter & status =====**/
    var entId = api.pageParam.entId;//user id
    var themeId = api.pageParam.themeId || '';//兼容两个入口
    var type = api.pageParam.type || '';//兼容两个入口

    var vm = new Vue({
        el: '#memberRePu',
        template: _g.getTemplate('member/memberRePu-body-V'),

        data: {
            // 最近消费时间
            saleTime: '--',
            saleTimeDay: '--',
            // 最近回访时间
            backTime: '--',
            backTimeDay: '--',
            // 筛选商品状态
            ifSelect: false,
            // 商品状态
            goodsStatus: '全部商品',
            redmind_status: {
                '全部商品': '',
                '已提醒商品': 'visited',
                '未提醒商品': 'no_visit'
            },
            // 复购提醒信息
            goodsData: [],
            selItem1: false,
            selItem2: false,
            selItem3: false,
            isNoResult: false,
            isFirstLoading: true,
            isBoss: Account.getRole() === '0' ? false : true,
            clerkName: '薛小姐',
            memberPhone: '18800000000',
            memberCard: '123456789',
            memberName: '方先生',
            memberSex: 1,
            memberOld: '80后',
            memberBirthday: '2012-12-12',
            memberVip: 1,
            memberIntegral: 520,
        },
        created: function () {
            this.clerkName = _g.getLS('UserInfo').user_name;
            this.memberPhone = '';
            this.memberCard = '';
            this.memberName = '';
            this.memberSex = '';
            this.memberOld = '';
            this.memberVip = '';
            this.memberIntegral = '';
        },
        computed: {
            isNoResult: function () {
                if (this.isFirstLoading) return false
                var sta = this.goodsData.length === 0 ? true : false
                return sta
            }
        },
        filters: {
            encrept: function (val) {
                if (!val) return
                var str = val
                var a = str.slice(0, 3)
                var b = str.slice(7)
                str = a + '****' + b
                return str
            }
        },
        methods: {
            openSelector: function() {
                vm.selItem1 = false;
                vm.selItem2 = false;
                vm.selItem3 = false;
                vm.ifSelect = !vm.ifSelect;
            },
            selectGoods: function(name,index) {
                vm.goodsStatus = name;
                vm['selItem'+index] = true;
                setTimeout(function() {
                    vm.ifSelect = false;
                    getData3();
                    loadmore.reset();
                }, 100);
            },
            onEssentialInformation: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '基本信息',
                            rightText: '编辑'
                        }
                    },
                    pageParam: {
                        entId: entId
                    },
                    name: 'member-essentialInformation',
                    url: '../member/essentialInformation.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            oncallBack: function () {

                var list = {};
                list.tel = this.memberPhone;
                list.uName = this.memberName;
                list.cardId = this.memberCard;
                list.birthday = this.memberBrithday;
                list.memberOld = this.memberOld;
                list.sex = this.memberSex;
                list.user_id = entId;
                logger.log({ "Type": "operation", "action": "点击会员详情页面的回访", "Win_name": api.winName, "list": list });
                _g.openWin({
                    header: {
                        data: {
                            title: '回访录入',
                            status: 'memberDetail'
                        }
                    },
                    name: 'member-clerkThemeInput',
                    url: '../member/clerkThemeInput.html',
                    pageParam: {
                        entId: entId,
                        title: api.pageParam.title || '复购提醒', //主题入口带title
                        list: list,
                        themeId: api.pageParam.themeId || 7,
                    },
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onMemberStatement: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '消费明细'
                        }
                    },
                    pageParam: {
                        entId: entId
                    },
                    name: 'member-memberStatement',
                    url: '../member/memberStatement.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onMemberRturn: function () {

                var list = {};
                list.tel = this.memberPhone;
                list.uName = this.memberName;
                list.cardId = this.memberCard;
                list.birthday = this.memberBrithday;
                list.memberOld = this.memberOld;
                list.sex = this.memberSex;
                list.user_id = entId;
                logger.log({ "Type": "operation", "action": "回访记录", "Win_name": api.winName, "list": list });
                _g.openWin({
                    header: {
                        data: {
                            title: '回访记录',
                            rightText: Account.getRole() === '0' ? '' : '回访'
                        }
                    },
                    pageParam: {
                        entId: entId,
                        list: list,
                        title: api.pageParam.title || '', //主题入口带title
                        themeId: themeId,
                        type: type
                    },
                    name: 'member-memberReturnRecord',
                    url: '../member/memberReturnRecord.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onRePurchase: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '复购提醒'
                        }
                    },
                    pageParam: {
                        entId: entId
                    },
                    name: 'member-memberStatement',
                    url: '../member/memberStatement.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onOpenDX: function (type) {
                if (type == 1) {
                    api.sms({
                        numbers: [this.memberPhone],
                        text: ''
                    }, function (ret, err) {
                        if (ret && ret.status) {
                            //已发送
                        } else {
                            //发送失败
                        }
                    });
                } else if (type == 2) {
                    if (api.systemType == 'android') {
                        api.openApp({
                            androidPkg: 'com.tencent.mm',
                            mimeType: 'text/html',
                            uri: 'http://test.com'
                        }, function (ret, err) {

                        });
                    } else {
                        api.openApp({
                            iosUrl: 'weixin://test.com', //打开微信的，其中weixin为微信的URL Scheme
                            appParam: {}
                        });
                    }
                } else {
                    api.call({
                        type: 'tel_prompt',
                        number: this.memberPhone
                    });
                }
            }
        },

    });
    var getData = function () {
        var _data = {
            user_id: entId
        };
        
        var _url = '/app/auth/crm/user/getInfo.do';
        Http.ajax({
            data: _data,
            api_versions: 'v2',
            url: _url,

            success: function (res) {
                logger.log({ "Type": "operation", "action": "会员详情获取数据", "Win_name": api.winName, "data": _data, "message": res, "requireURL": _url })
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.memberPhone = res.object.phone;
                        vm.memberCard = res.object.card_no;
                        vm.memberName = res.object.user_name;
                        vm.memberSex = res.object.sex;
                        vm.memberOld = getMemberOld(res.object.birthday);
                        vm.memberBrithday = res.object.birthday;
                        vm.memberVip = getVip(res.object.user_level_name);
                        vm.memberIntegral = res.object.integral ? res.object.integral : 0;
                    }, 0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
            }
        })
        getData2();
        getData3();
    };

    // 获取提醒商品列表
    var getData3 = function (opts, callback) {
        var opts = opts || {};
        var _data = {
            user_id: entId,
            redmind_status: vm.redmind_status[vm.goodsStatus],
            page : opts.page || 1,
            displayRecord: 5,
        }
        var _url = '/app/auth/crm/multiConRedmind/listMCRemindProductDetail.do'; // user_id,分页page,displayRecord
        // 复购提醒商品详情信息
        Http.ajax({
            api_versions: 'v2',
            isSync: true,
            data: _data,
            url: _url,
            success: function (res) {
                logger.log({ "Type": "operation", "action": "会员详情获取数据", "Win_name": api.winName, "data": _data, "message": res, "requireURL": _url })
                vm.isFirstLoading = false;
                if (res.code == 200) {
                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            callback && callback(res);

                        }, 0)
                    } else {
                        setTimeout(function () {
                            vm.goodsData = getItemList(res);
                        }, 0)
                    }
                } else {
                    _g.toast(res.message);
                    alert(__url + 'failed ' + JSON.stringify(res));
                }
            },
            error: function (err) {
                vm.isFirstLoading = false;
                _g.hideProgress();
                alert(_url + 'failed ' + JSON.stringify(err));
               
            }
        });
    }
    // 获取最近记录
    var getData2 =  function() {
        var _data = {
            user_id: entId,
            care_id: 7
        };
        var _url = '/app/auth/crm/user/listInfoAndLatestTime.do'; // 输入参数user_id,care_id=7
        
        // 复购提醒最近回访、消费时间
        Http.ajax({
            data: _data,
            api_versions: 'v2',
            url: _url,
            success: function(res) {
                logger.log({ "Type": "operation", "action": "会员详情获取数据", "Win_name": api.winName, "data": _data, "message": res, "requireURL": _url })
                if(res.code==200) {
                    vm.saleTime = res.object.latest_consume_time || '--';
                    vm.backTime = res.object.latest_visit_time || '--';
                    vm.saleTimeDay = res.object.consume_time_interval.toString() || '--';
                    vm.backTimeDay = res.object.visit_time_interval.toString() || '--';

                    vm.memberPhone = res.object.phone;
                    vm.memberCard = res.object.card_no;
                    vm.memberName = res.object.user_name;
                    vm.memberSex = res.object.sex;
                    vm.memberOld = getMemberOld(res.object.birthday);
                    vm.memberBrithday = res.object.birthday;
                    vm.memberVip = getVip(res.object.user_level_name);
                    vm.memberIntegral = res.object.integral ? res.object.integral : 0;
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
            }
        });
    }
    var getVip = function (res) {
        switch (res) {
            case 'V1':
                return 1;
            case 'V2':
                return 2;
            case 'V3':
                return 3;
            case 'V4':
                return 4;
            case 'V5':
                return 5;
            case 'V6':
                return 6;
            case 'V7':
                return 7;
            case 'V8':
                return 8;
            case 'V9':
                return 9;
            case 'V10':
                return 10;
            case 'V11':
                return 11;

        }
    }
    var getMemberOld = function (res) {
        if (res) {
            var selfYear = res.split("-")[0];
            var num = selfYear.split("");
            return num[2] + "0后";
        }
    }
    //格式化列表
    var getItemList = function (res,num) {
        return _.map(res.object, function (item) {
            return {
                goodName: item.product_name,  // 商品名称
                goodStatus: item.redmind_status, // 状态
                sku_code: item.bar_code, // 商品条码
                buy_time: item.consume_time, // 购买日期
                buy_num: item.goods_count, // 数量
                use_cycle: item.single_use_days,  // 使用周期
                remain_day: item.estimate_lave_days,  // 剩余天数
                pre_time: item.estimate_used_time  // 预计用完时间
            }
        })
    };
    // getData();
    getData2();
    getData3();

    // 分页
    var loadmore = new Loadmore({
        callback: function (page) {
            getData3({ page: page.page }, function (data) {
                if (!data.object || data.object.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.goodsData = vm.goodsData.concat(getItemList(data));
                    loadmore.loadend(true);
                }
            });
        }
    });

    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData3()
            loadmore.reset();
        }, 0)
    });
    // 回访录入保存，返回刷新页面
    api.addEventListener && api.addEventListener({
        name: 'reload-visitList'
    }, function (ret, err) {
        getData3();
        loadmore.reset();
    });

    module.exports = {};
});
