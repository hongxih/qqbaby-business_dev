define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var homeList = new Vue({
        el: '#index',
        template: _g.getTemplate('boss/home-body-V'),
        data: {
            active: 0,
            isNavShow: 0,
            isToggle: true,
            bonus: 0,
            target_show: false,
            target_name: null,
            achievement: "0",
            target_num: '0',
            entId: null,
            dateList: [
                '日',
                '周',
                '月',
            ],
            shopName: null,
            isUncheckBill: false,
            flag: true,
            isMonth: false,
            type: "DAY", //头部日、周、月类型;
            homeHeader: {
                avg_sale_price: 0,
                current_date: '',
                estimate_profit: 0,
                total_customer: 0,
                total_sale_price: 0,
                total_sale_profit: 0,
                un_audit_num: 0,
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
                height: 0.52
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
                name: 'boss-shopRank',
                url: '../boss/shopRank.html'
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
            }
        },
        created: function () {
            this.homeHeader = {
                avg_sale_price: 0,
                current_date: '',
                estimate_profit: 0,
                total_customer: 0,
                total_sale_price: 0,
                total_sale_profit: 0,
                un_audit_num: 0,
            };
            this.bonus = 0;
            this.target_num = 0;
        },
        methods: {
            onActionCommission: function () {
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list: ['日', '周', '月'],
                            rightText: '店员'
                        },
                        template: '../html/header/header-date-V',
                    },
                    name: 'boss-shopRank',
                    url: '../boss/shopRank.html',
                });
            },
            onAllTarget: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '目标管理',
                            rightText: '历史目标',
                        }
                    },
                    name: 'boss-targetManage',
                    url: '../boss/targetManage.html',
                    bounces: true,
                    slidBackEnabled: false,
                })
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
                });
            },
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
                    });
                }
            },
            onWeekTurnOverTap: function () {
                this.isToggle = true;
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list: ['日', '周', '月'],
                            rightText: '筛选'
                        },
                        template: '../html/main/home-date-header-V',
                    },
                    name: 'statistics-bossWeekturnover',
                    url: '../statistics/bossWeekturnover.html',
                    pageParam: {
                        shopName: homeList.shopName
                    },
                    bounces:false,
                    slidBackEnabled: false
                });
            },
            onCloseTap: function () {
                this.isUncheckBill = false;
                this.isToggle = false;
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
                });
            },
            //多个主题
            onAllTheme: function () {
                logger.log({Win_name:api.winName,type:"win"});
                _g.openWin({
                    header: {
                        data: {
                            title: '主题关怀',
                        }
                    },
                    name: 'boss-bossTheme',
                    url: '../boss/bossTheme.html',
                });
            },
            //单个主题
            onAllThemeName: function (sTitle, tId) {
                _g.openDrawerLayout({
                    header: {
                        data: {
                            title: sTitle,
                            rightText: '会员列表',
                        }
                    },
                    pageParam: {
                        themeId: tId,
                        statue: 'special',
                        title: sTitle
                    },
                    name: 'boss-bossThemeCallBack1',
                    url: '../boss/bossThemeCallBack1.html',
                    rightPane: {
                        name: 'rightPane',
                        url: '../boss/bossThemeCallBackSide.html'
                    }
                })
            }
        }
    });
    var getData = function () {
        var _data= {
                date_type: homeList.type,
                max_create_time: new Date().Format('yyyy-MM-dd'),
                min_create_time: formatTime(),
            };
        var _url='/app/auth/page/retail/indexSumSaleV2.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            success: function (ret) {
                logger.log({"Type":"operation","action":"获取老板首页营业数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    console.log(dt);
                    setTimeout(function () {
                        if (dt) {
                            //var homeHeader = toVueHomeHeader(dt);
                            //homeList.homeHeader = homeHeader;
                            homeList.homeHeader.avg_sale_price = dt ? Number(dt.avg_sale_price) : 0;
                            homeList.homeHeader.estimate_profit = dt ? Number(dt.estimate_profit) : 0;
                            homeList.homeHeader.total_customer = dt ? Number(dt.total_customer) : 0;
                            //total_sale_price= object ? Number(object.total_sale_price) : 0;
                            homeList.homeHeader.total_sale_profit = dt ? Number(dt.total_sale_profit) : 0;
                            homeList.homeHeader.current_date = dt ? dt.current_date : '';
                            homeList.homeHeader.un_audit_num = dt ? dt.un_audit_num : '';

                            var n = dt.total_sale_price// 营业额	number
                            if (Number(n) > 0) {
                                numberGrow(n)
                            } else {
                                homeList.homeHeader.total_sale_price = n
                            }
                            if (homeList.homeHeader.un_audit_num === 0) {
                                homeList.isUncheckBill = false;
                            } else {
                                homeList.isUncheckBill = true;
                            }
                            console.log(homeList.homeHeader)
                        }
                    }, 0);
                } else {
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
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
    };

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
            homeList.homeHeader.total_sale_price = showNum;
        }, timeStep);
    }

    getData();
    var getBonus = function () {
        var _data={
                max_create_time: new Date().Format('yyyy-MM-dd'),
                min_create_time: new Date().Format('yyyy-MM-dd'),
                org_type: 'Company'
            };
        var _url='/app/auth/kpi/sum.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function (res) {
                logger.log({"Type":"operation","action":"老板首页获取总营业额","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    homeList.bonus = res.object.sum_kpi_price;
                    homeList.shopName = res.object.store_name;
                    api && api.sendEvent({
                        name: 'getShopName',
                        extra: {
                            name: res.object.store_name,
                        }
                    })
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });

    };
    getBonus();
    var getTarget = function () {
        var _url= '/app/auth/goal/company/latest.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"老板首页获取目标","Win_name":api.winName,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    res.object = res.object ? res.object : {};
                    homeList.target_name = res.object.goal_name ? res.object.goal_name : '';
                    homeList.target_num = res.object.pre_ent_total_amount ? res.object.pre_ent_total_amount : 0;
                    homeList.achievement = res.object.goal_achieved_rate ? res.object.goal_achieved_rate : 0;
                    homeList.target_show = res.object.goal_setting_count;
                    if (res.object.ent_goal_setting_id) {
                        homeList.turnWhere = {
                            title: '门店排行',
                            rightText: '店员',
                            name: 'targetShop-rank',
                            url: '../assistant/targetShopRank.html',
                            pageParam: {
                                entId: res.object.ent_goal_setting_id
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
    var toVueHomeHeader = function (result) {
        var object = result ? result : {};
        return {
            // isCheck:false,
            avg_sale_price: object ? Number(object.avg_sale_price) : 0,
            estimate_profit: object ? Number(object.estimate_profit) : 0,
            total_customer: object ? Number(object.total_customer) : 0,
            //total_sale_price: object ? Number(object.total_sale_price) : 0,
            total_sale_profit: object ? Number(object.total_sale_profit) : 0,
            current_date: object ? object.current_date : '',
            un_audit_num: object ? object.un_audit_num : '',
        };
    };

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
                logger.log({"Type":"operation","action":"老板首页获取主题","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
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
                        console.log(homeList.themeList);
                    }, 0);
                } else {
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
                console.log(homeList.homeHeader)
            },
            error: function (err) {

                _g.hideProgress();
            },
        });
    }
    getTheme();
    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
            getBonus();
            getTarget();
            getTheme();
            // 广播刷新事件，获取未读客服信息条数
            api.sendEvent({
                name: 'note_refresh',
                extra: {}
            });
        }, 0)
    });

    //接收index.js里面传送过来的日、周、月信息
    api.addEventListener && api.addEventListener({
        name: 'changeTime'
    }, function (ret, err) {
        homeList.type = typeMap[ret.value.type];
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
    }

    // 监听安卓返回按钮事件
    api && api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        api.closeWidget();
    });
    //页面刷新数据
    api && api.addEventListener({
        name: 'selectStore',
    }, function (ret, err) {
        location.reload();
    });
    module.exports = {};
});
