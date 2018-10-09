define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var homeList = new Vue({
        el: '#index',
        template: _g.getTemplate('manager/home-body-V'),
        data: {
            isUncheckBill: false,
            isMonth: false,
            sales_kpi_price: 10,
            flag: true,
            type: "DAY", //头部日、周、月类型;
            target_name: null,
            target_show: "",
            target_num: 0,
            achievement: null,

            isThemes: false,//判断是否为多个主题
            homeHeader: {
                avg_sale_price: 000,
                current_date: '',
                estimate_profit: 000,
                total_customer: 000,
                total_sale_price: 000,
                total_sale_profit: 000,
                un_audit_num: 000,
            },
            detail: {
                add_customer: 0,
                add_estimate_profit: 0,
                add_sale_price: 0,
                add_sale_profit: 0,
                avg_sale_price: 0,
                estimate_profit: 0,
                // total_customer: 0,
                total_sale_price: 0,
                total_sale_profit: 0
            },

            list: [{
                image: '../../image/home/home_icon_1.png',
                text: '库存查询',
                clickMethod: 'onGoodsCostCheckTap',
                width: 0.48,
                height: 0.58
            }, {
                image: '../../image/home/home_icon_2.png',
                text: '商品出入库查询',
                clickMethod: 'onCommodityDlowQueryTap',
                width: 0.52,
                height: 0.47
            }, {
                image: '../../image/home/home_icon_3.png',
                text: '采购订单',
                clickMethod: 'onPurchaseOrderListTap',
                width: 0.48,
                height: 0.6
            }, {
                image: '../../image/home/home_icon_4.png',
                text: '采购收货单',
                clickMethod: 'onPurchaseNoteTap',
                width: 0.48,
                height: 0.6
            }, {
                image: '../../image/home/home_icon_5.png',
                text: '采购退货单',
                clickMethod: 'onPurchaseReturnListTap',
                width: 0.48,
                height: 0.6
            }
                , {
                    image: '../../image/home/home_icon_6.png',
                    text: '库存盘点单',
                    clickMethod: 'onInventoryCheckListTap',
                    width: 0.51,
                    height: 0.59
                }
            ],
            turnWhere: {
                title: '目标管理',
                rightText: '历史目标',
                name: 'manager-targetManage',
                url: '../manager/targetManage_manager.html'
            },
            isShow: false,
            themeList: {
                achieved_rate: '',
                care_count: '',
                care_id: '',
                statisticNum: '',
                title: '',
                user_count: ''
            }

        },
        watch: {
            type: function () {
                this.isMonth = false;
                if (this.type === 'MONTH') {
                    this.isMonth = true;
                }
                getData();
                getPersonalData();
            }
        },
        created: function () {
            this.sales_kpi_price = 000;
            this.homeHeader = {
                total_customer: '--',
            };
            this.detail = {};
        },
        methods: {
            onClickTap: function (clickMethod) {
                if (clickMethod == 'onPurchaseNoteTap') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '采购收货列表',
                            }
                        },
                        name: 'shop-purchaseReceiptList',
                        url: '../shop/purchaseReceiptList.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if (clickMethod == 'onPurchaseReturnListTap') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '采购退货列表'
                            }
                        },
                        name: 'shop-purchaseReturnList',
                        url: '../shop/purchaseReturnList.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if (clickMethod == 'onInventoryCheckListTap') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '盘点单列表'
                            },
                        },
                        name: 'shop-inventorychecklist',
                        url: '../shop/inventorychecklist.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if (clickMethod == 'onAddReduceTap') {
                    // _g.toast('开发中...');
                    _g.openWin({
                        header: {
                            data: {
                                leftText: '完成',
                                title: '快捷菜单'
                            },
                            template: '../html/main/home-menuHeader-V'
                        },
                        name: 'shop-shortcutmenu',
                        url: '../home/shortcutmenu.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if (clickMethod == 'onCommodityDlowQueryTap') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '商品出入库明细'
                            }
                        },
                        name: 'shop-commodityflowquery',
                        url: '../shop/commodityflowquery.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if (clickMethod == 'onGoodsCostCheckTap') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '库存成本查询列表'
                            },
                            template: '../html/main/scan-header-V'
                        },
                        name: 'shop-goodsCostCheck',
                        url: '../shop/goodsCostCheck.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if (clickMethod == 'onPurchaseOrderListTap') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '采购订单列表'
                            },
                        },
                        name: 'shop-purchaseOrderList',
                        url: '../shop/purchaseOrderList.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                }
            },
            onAllTarget: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '目标管理',
                            rightText: '历史目标',
                        }
                    },
                    name: 'manager-targetManage',
                    url: '../manager/targetManage_manager.html',
                    bounces: false,
                    slidBackEnabled: false,
                })
            },
            onWeekTurnOverTap: function () {
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list: ['日', '周', '月'],
                            rightText: '筛选'
                        },
                        template: '../html/main/home-date-header-V',
                    },
                    name: 'statistics-weekturnover',
                    url: '../statistics/weekturnover.html',
                    bounces: false,
                    slidBackEnabled: false
                });
            },
            onBonusTap: function () {
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list: ['日', '周', '月'],
                        },
                        template: '../html/main/home-date-header-V',
                    },
                    name: 'manager-managerBonus',
                    url: '../manager/managerBonus.html',
                    bounces: false,
                    slidBackEnabled: false
                });
            },
            onActionTarget: function () {
                var opts = this.turnWhere;
                _g.openWin({
                    header: {
                        data: {
                            title: opts.title,
                            rightText: opts.rightText,
                        }
                    },
                    name: opts.name,
                    url: opts.url,
                    pageParam: opts.pageParam,
                    bounces: false,
                    slidBackEnabled: false
                })
            },
            onCloseTap: function () {
                this.isUncheckBill = false;
                this.flag = false;
            },
            onJumpTap: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '未审核列表',
                            rightText: '共',
                            rightNum: 0
                        },
                    },
                    name: 'statistics-uncheckBill',
                    url: '../statistics/uncheckBill.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onAllTheme: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '主题关怀',
                        }
                    },
                    name: 'manager-managerTheme',
                    url: '../manager/managerTheme.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onAllThemeName: function (sTitle, careId) {
                _g.openDrawerLayout({
                    header: {
                        data: {
                            title: sTitle,
                            rightText: '回访进度',
                        }
                    },
                    name: 'manager-managerThemeName',
                    url: '../manager/managerThemeName.html',
                    rightPane: {
                        name: 'rightPane',
                        url: '../manager/managerThemeNameSide.html'
                    },
                    pageParam: {
                        themeId: careId,
                        statue: 'special',
                        title: sTitle
                    }
                })
            }
        }
    });
    var getData = function () {
        var _data={
                date_type: homeList.type,
                max_create_time: new Date().Format('yyyy-MM-dd'),
                min_create_time: formatTime(),
                org_type: 'Store'
            };
        var _url='/app/auth/page/retail/indexSumSaleV2.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions: 'v2',
            success: function (ret) {
                 logger.log({"Type":"operation","action":"店长首页数据获取","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;

                    setTimeout(function () {
                        if (dt) {
                            var homeHeader = toVueHomeHeader(dt);
                            homeList.homeHeader = homeHeader;
                            if (homeList.homeHeader.un_audit_num === 0) {
                                homeList.isUncheckBill = false;
                            } else {
                                homeList.isUncheckBill = true;
                            }
                        }
                    }, 0);
                } else {
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
                //console.log(homeList.homeHeader)
            },
            error: function (err) {
                // homeList.homeHeader = {
                //     // isCheck:false,
                //     avg_sale_price: 000,
                //     current_date: '',
                //     estimate_profit: 000,
                //     total_customer: 000,
                //     total_sale_price: 000,
                //     total_sale_profit: 000,
                //     un_audit_num: 000,
                // }
                _g.hideProgress();
            },
        });
    }
    getData()


    //获取主题
    var getTheme = function () {
        var _data= {
                publish_status: 'ongoing'
            };
        var _url='/app/auth/crm/care/latest.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions: 'v2',
            success: function (ret) {
                 logger.log({"Type":"operation","action":"店长首页获取主题","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var type = ret.object || {};
                    setTimeout(function () {
                        if (type) {
                            homeList.themeList.achieved_rate = type.achieved_rate;
                            homeList.themeList.care_count = type.care_count;
                            homeList.themeList.care_id = type.care_id;
                            homeList.themeList.statisticNum = type.statisticNum;
                            homeList.themeList.title = type.title;
                            homeList.themeList.user_count = type.user_count;
                        }
                    }, 0);
                } else {
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
                //console.log(homeList.homeHeader)
            },
            error: function (err) {

                _g.hideProgress();
            },
        });
    }
    getTheme()

    // 获取门店的统计数据
    var getStatic = function (opts) {
        opts = opts || {};
        //console.log(opts);
        var _data={
                date_type: homeList.type,
                max_create_time: opts.max || new Date().Format('yyyy-MM-dd'),
                min_create_time: opts.min || formatTime()
            };
        var _url='/app/auth/page/retail/sumRetail.do';
        Http.ajax({
            url:_url,
            data:_data,
            success: function (res) {
                logger.log({"Type":"operation","action":"店长首页获取门店的统计数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.success) {
                    homeList.detail = res.object;
                    homeList.detail.add_customer = res.object.add_customer// 来客数同比增长	number
                    homeList.detail.add_estimate_profit = res.object.add_estimate_profit// 预估毛利同比增长	number
                    homeList.detail.add_sale_price = res.object.add_sale_price// 营业额同比增长	number
                    homeList.detail.add_sale_profit = res.object.add_sale_profit// 营业利润同比增长	number
                    homeList.detail.avg_sale_price = res.object.avg_sale_price// 客单价	number
                    homeList.detail.estimate_profit = res.object.estimate_profit// 预估毛利	number
                    homeList.detail.total_customer = res.object.total_customer// 来客数	number
                    homeList.detail.total_sale_profit = res.object.total_sale_profit

                    var n = res.object.total_sale_price// 营业额	number
                    if (Number(n) > 0) {
                        numberGrow(n)
                    } else {
                        homeList.detail.total_sale_price = n
                    }
                    console.log(homeList.detail)
                } else {
                    //console.log(res);
                    _g.toast(res.message);
                }
            },
            error: function () {
            }
        })
    }
    getStatic();
    /**
     * 从0开始,在2s内增长到指定数值
     * @param [number]
     * */
    function numberGrow(number) {
        number = Number(number);
        if (isNaN(number)) number = 0;
        var timeStep = 24, // 每个step需要的时间
            time = 2000, // 总时间
            num = number, //要显示的真实数值
            step = num * timeStep / time, // 每24ms增加的数值
            start = 0, // 计数器
            interval, // 定时器
            showNum = '0';
        interval = setInterval(function () {
            start = start + step;
            if (start >= num) {
                start = num;
                clearInterval(interval);
                interval = null;
            }
            showNum = start | 0 //不能影响start的值
            homeList.detail.total_sale_price = showNum;
        }, timeStep);
    }

    var getPersonalData = function () {
        var _data= {
                max_create_time: new Date().Format('yyyy-MM-dd'),
                min_create_time: formatTime(),
            };
        var _url='/app/auth/kpi/sumSales.do';
        Http.ajax({
            api_versions: 'v2',
            data:_data,
            url:_url,
            success: function (ret) {
                 logger.log({"Type":"operation","action":"店长首页获取店员数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    //console.log(dt);
                    setTimeout(function () {
                        homeList.sales_kpi_price = dt.sales_kpi_price;
                    }, 0);
                } else {
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
            },
        });
    }
    getPersonalData();


    var toVueHomeHeader = function (result) {
        var object = result ? result : {};
        return {
            // isCheck:false,
            avg_sale_price: object ? Number(object.avg_sale_price) : 0,
            estimate_profit: object ? Number(object.estimate_profit) : 0,
            total_customer: object ? Number(object.total_customer) : 0,
            total_sale_price: object ? Number(object.total_sale_price) : 0,
            total_sale_profit: object ? Number(object.total_sale_profit) : 0,
            current_date: object ? object.current_date : '',
            un_audit_num: object ? object.un_audit_num : '',
        };
    };


    //接收index.js里面传送过来的日、周、月信息
    api.addEventListener && api.addEventListener({
        name: 'changeTime'
    }, function (ret, err) {
        homeList.type = typeMap[ret.value.type];
        getPersonalData();
        getData();
        getStatic();
        getTarget();
    });

    function formatTime(time) {
        return _.map(transDateRange().split('-'), function (value) {
            return value.length >= 2 ? value : '0' + value;
        }).join('-');
    }

    // 起始日期，区间
    function transDateRange() {
        var now = new Date();
        var timeStamp;
        if (homeList.type === 'DAY') {
            return now.Format('yyyy-MM-dd');
        } else if (homeList.type === 'WEEK') {
            if (now.getDay() == 0) {
                timeStamp = now.getTime() - (24 * 60 * 60 * 1000) * 6;
            } else {
                timeStamp = now.getTime() - (24 * 60 * 60 * 1000) * (now.getDay() - 1);
            }
            var weekDate = new Date(timeStamp);
            return weekDate.getFullYear() + '-' + (weekDate.getMonth() + 1) + '-' + weekDate.getDate();
        } else if (homeList.type === 'MONTH') {
            return now.getFullYear() + '-' + (now.getMonth() + 1) + '-01';
        }
    };
    var getTarget = function () {
        var _url='/app/auth/goal/store/latest.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"店长首页获取目标","Win_name":api.winName,"message":res,"requireURL":_url})
                res.object = res.object || {};
                if (res.code == 200) {
                    homeList.target_num = res.object.store_goal_amount ? res.object.store_goal_amount : 0;
                    homeList.target_name = res.object.goal_name ? res.object.goal_name : '';
                    homeList.achievement = res.object.goal_achieved_rate ? res.object.goal_achieved_rate : 0;
                    homeList.target_show = res.object.goal_setting_count ? res.object.goal_setting_count : 0;
                    if (res.object.store_goal_setting_id) {
                        homeList.turnWhere = {
                            title: '门店详情',
                            rightText: '门店排行',
                            name: 'targetShop-detail',
                            url: '../assistant/shopDetails.html',
                            pageParam: {
                                entId: res.object.store_goal_setting_id
                            }
                        };
                        homeList.isShow = true;
                    } else {
                        homeList.isShow = false;
                    }
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    };
    getTarget();

    //选择门店后刷新页面
    api.addEventListener && api.addEventListener({
        name: 'selectStore',
    }, function (ret, err) {
        getTarget();
        getPersonalData();
        getData();
        getStatic();
        getTheme();
    });

    // 监听安卓返回按钮事件
    api.addEventListener && api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        api.closeWidget();
    });

    // 断网监听
   /* api.addEventListener && api.addEventListener({
        name:'offline'
    }, function(ret, err){
        api.openFrame({
            name:'main-badNetwork',
            url:'../main/badNetwork.html',
            pageParam:{

            }
        })
    });*/
    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getTarget();
            getPersonalData();
            getData();
            getStatic();
            getTheme();
            api && api.hideProgress();
            // 2018-7-5更新
            // 广播刷新事件，获取未读客服信息条数
            api && api.sendEvent({
                name: 'note_refresh',
                extra: {}
            });
        }, 0)
    });
    module.exports = {};
});
