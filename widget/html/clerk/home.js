define(function(require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var getTime = require('U/getTime');
    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var dayMap = ['今日','本周','本月'];
    var day = new Date();
    var homeList = new Vue({
        el: '#homeList',
        template: _g.getTemplate('clerk/home-list-V'),
        data: {
            target_name:null,
            achievement:null,
            target_num: 0,
            target_show:"",
            sales_kpi_price:0,
            org_id:'',
            sales_id:_g.getLS('UserInfo').user_id,
            isUncheckBill: false,
            isMonth:false,
            type : 'DAY',
            dayDes : '今日',
            currentTime:getTime.transDateRange('DAY'),
            currentStamp : day.getTime(),
            homeHeader: {
                avg_sale_price: 000,
                current_date: '',
                estimate_profit: 000,
                total_customer: 000,
                total_sale_price: 000,
                total_sale_profit:000,
                un_audit_num:000,
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
            turnWhere:{
                title:"店员功能",
                rightText:null,
                name: "targetShop_assistantFunction",
                url:"../clerk/assistantFunction_clerk.html"
            },
            isShow : false,
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
            type: function(){
                // this.isMonth = false;
                // if(this.type === 'MONTH'){
                //     this.isMonth = true;
                // }
                //getData();
                //getPersonalData();
            }
        },
        created: function() {
            this.sales_kpi_price = 000,
            this.homeHeader = {
                avg_sale_price: 000,
                current_date: '',
                estimate_profit: 000,
                total_customer: 000,
                total_sale_price: 000,
                total_sale_profit:000,
                un_audit_num:000,
            };
        },
        methods: {
            onClickTap: function(clickMethod) {
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
                                leftText:'完成',
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
            onAllTarget:function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '目标管理',
                            rightText:'历史目标',
                        }
                    },
                    name: 'clerk-targetManageClerk',
                    url: '../clerk/targetManage_clerk.html',
                    bounces: true,
                    slidBackEnabled: false,
                })
            },
            onExpenditureDetails:function(day){
                _g.openDrawerLayout({
                        header:{
                            data:{
                                title:_g.getLS('UserInfo').user_name,
                                // '
                            },
							template:'../html/header/header-hasScreen-V'
                        },
                        pageParam:{
                            day:day,
                            clerk:"clerk",
                        },
                        name: "manager-managerExpenditureDetails",
                        url:"../manager/managerExpenditureDetails.html",
                        rightPane: {
                            name: 'manager-managerScreenSide',
                            url: '../manager/managerScreenSide.html',
                            pageParam:{
                                isClerkHomeIn:true
                            }
                        }
                    });

            },
            onWeekTurnOverTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list:['日', '周', '月'],
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
            onBonusDetails:function () {
                _g.openWin({
                    header: {
                            data: {
                                title: _g.getLS('UserInfo').user_name,
                            },
                        },
                    name: 'manager-bonusDetails',
                    url: '../boss/shopDetail.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam:{
                        store_id : this.org_id,
                        sales_id : this.sales_id,
                    }
                })
            },
            onCloseTap: function(){
                // this.isUncheckBill = false;
            },
            onActionTarget:function(){
                var opts = this.turnWhere;
                _g.openWin({
                    header: {
                        data: {
                            title: opts.title,
                            rightText:opts.rightText
                        }
                    },
                    name: opts.name,
                    url: opts.url,
                    pageParam : opts.pageParam,
                    bounces: false,
                    slidBackEnabled: false
                })
            },
            onAllDetails : function () {
                _g.openDrawerLayout({
                    header:{
                        data:{
                            title:"全部销售明细"
                        },
                        template:'../html/header/header-hasScreen-V'
                    },
                    name: "statistics-allDetails",
                    url:"../statistics/allDetails.html",
                    rightPane: {
                        name: 'rightPane',
                        url: '../statistics/allDetailsSide.html'
                    }
                });
            },
            onGetDayData : function(type,time,addOrSubtract){
                getFormatTime(type,time,addOrSubtract);
            },
            onAllTheme : function(){
                _g.openWin({
                    header: {
                        data: {
                            title: '主题关怀',
                        }
                    },
                    name: 'clerk-clerkTheme',
                    url: '../clerk/clerkTheme.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onAllThemeName: function (sTitle,careId) {
                _g.openDrawerLayout({
                    header: {
                        data: {
                            title: sTitle,
                        }
                    },
                    name: 'clerk-clerkThemeName',
                    url: '../clerk/clerkThemeName.html',
                    rightPane: {
                        name: 'rightPane',
                        url: '../clerk/clerkThemeNameSide.html'
                    },
                    pageParam:{
                        themeId:careId,
                        statue:'special',
                        title:sTitle
                    },
                })
            }
        }
    });
    //var getData = function(min_time,max_time) {
    //    Http.ajax({
    //        data: {
    //            date_type: homeList.type,
    //            max_create_time:max_time ? max_time : new Date().Format('yyyy-MM-dd'),
    //            min_create_time:min_time ? min_time : new Date().Format('yyyy-MM-dd'),
    //        },
    //        url: '/app/auth/page/retail/indexSumSale.do',
    //        success: function(ret) {
    //            if (ret.code == 200) {
    //                var dt = ret.object;
    //                console.log(dt);
    //                setTimeout(function() {
    //                    if (dt) {
    //                        var homeHeader = toVueHomeHeader(dt);
    //                        homeList.homeHeader = homeHeader;
    //                        if(homeList.homeHeader.un_audit_num === 0){
    //                            homeList.isUncheckBill = false;
    //                        }else{
    //                            homeList.isUncheckBill = true;
    //                        }
    //                    }
    //                }, 0);
    //            }else{
    //                _g.hideProgress();
    //                _g.toast(ret.message);
    //            }
    //        },
    //        error: function(err) {
    //            homeList.homeHeader = {
    //                // isCheck:false,
    //                avg_sale_price: 000,
    //                current_date: '',
    //                estimate_profit: 000,
    //                total_customer: 000,
    //                total_sale_price: 000,
    //                total_sale_profit:000,
    //                un_audit_num:000,
    //            }
    //            _g.hideProgress();
    //        },
    //    });
    //}

    var getPersonalData = function (min_time,max_time) {
        api && api.showProgress({
            style: 'default',
            animationType: 'fade',
            modal: false
        });
        var _data= {
                max_create_time:max_time ? max_time : new Date().Format('yyyy-MM-dd'),
                min_create_time:min_time ? min_time : new Date().Format('yyyy-MM-dd'),
            };
        var _url='/app/auth/kpi/sumSales.do';
        Http.ajax({
            api_versions: 'v2',
            data:_data,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"店员首页获取店员信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    console.log(dt);
                    /*setTimeout(function() {
                        homeList.sales_kpi_price = dt.sales_kpi_price;
                    }, 0);*/
                    var n = dt.sales_kpi_price// 营业额	number
                    if (Number(n) > 0) {
                        numberGrow(n)
                    } else {
                        homeList.sales_kpi_price = n
                    }
                }else{
                    _g.toast(ret.message);
                }
                api && api.hideProgress();
            },
            error: function(err) {
                _g.hideProgress();
            },
        });
    }
    getPersonalData();
    /**
     * 从0开始,在1s内增长到指定数值
     * @param [number]
     * */
    function numberGrow(number) {
        number = Number(number);
        if (isNaN(number)) number = 0;
        var timeStep = 24, // 每个step需要的时间
            time = 1000, // 总时间
            num = number, // 要显示的真实数值
            step = num * timeStep / time, // 每1ms增加的数值
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
            homeList.sales_kpi_price = showNum;
        }, timeStep);
    }
    var toVueHomeHeader = function(result) {
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


    var getFormatTime = function(type,time,addOrSubtract){
        var dayArr = getTime.getCurrentTime(type,time,addOrSubtract).split('|');
        switch(type){
            case 'DAY':
                homeList.currentTime = dayArr[0];
                break;
            case 'WEEK':
                homeList.currentTime = dayArr[0]+'~'+dayArr[1];
                break;
            case 'MONTH':
                homeList.currentTime = dayArr[0]+'~'+dayArr[1];
                break;
        }
        homeList.currentStamp = dayArr[2];
        homeList.dayDes = null;
        homeList.startTime = dayArr[0];
        homeList.endTime = dayArr[1];
        //getData(dayArr[0],dayArr[1]);
        getPersonalData(dayArr[0],dayArr[1]);
    };

    //接收index.js里面传送过来的日、周、月信息
    api.addEventListener && api.addEventListener({
        name: 'clerk-changeTime'
    }, function(ret, err) {
        if(homeList.type == typeMap[ret.value.type])return;
        homeList.type = typeMap[ret.value.type];
        homeList.currentStamp = day.getTime();
        homeList.currentTime = getTime.transDateRange(typeMap[ret.value.type]);
        getFormatTime(homeList.type,homeList.currentStamp,0);
    });



    var getTarget = function(){
        var _url='/app/auth/goal/sales/latest.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,

            success: function(res) {
                logger.log({"Type":"operation","action":"店员角色首页获取目标","Win_name":api.winName,"message":res,"requireURL":_url})
                res.object = res.object || {};
                if (res.code == 200) {
                    homeList.target_name = res.object.goal_name ? res.object.goal_name : '';
                    homeList.target_num = res.object.pre_sales_total_amount ? res.object.pre_sales_total_amount : 0;
                    homeList.achievement = res.object.goal_achieved_rate ? res.object.goal_achieved_rate : 0;
                    homeList.target_show = res.object.goal_setting_count ? res.object.goal_setting_count : 0;
                    if(res.object.sales_goal_setting_id){
                        homeList.turnWhere = {
                            title: '门店详情',
                            rightText:'门店排行',
                            name: 'targetShop-detail',
                            url: '../assistant/shopDetails_clerk.html',
                            pageParam : {
                                entId : res.object.sales_goal_setting_id
                            }
                        };
                        homeList.isShow = true;
                    }
                } else {
                    _g.toast(res.message);
                }
            },
            error: function(err) {}
        });
    };

    getTarget();

    //获取主题
    var getTheme=function () {
        var _data= {
                publish_status: 'ongoing'
            };
        var _url='/app/auth/crm/care/latest.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions: 'v2',
            success: function (ret) {
                logger.log({"Type":"operation","action":"店员首页获取主题","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var type = ret.object || {};
                    setTimeout(function () {
                        if (type) {
                            console.dir(type)
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
                console.log(homeList.homeHeader)
            },
            error: function (err) {

                _g.hideProgress();
            },
        });
    }
    getTheme();

    _g.setPullDownRefresh(function() {
        setTimeout(function (){
            getPersonalData(homeList.startTime,homeList.endTime);
            getTarget();
            getTheme();
            api && api.hideProgress();
            // 2018-7-4更新
            // 广播刷新事件，获取未读客服信息条数
            api && api.sendEvent({
                name: 'note_refresh',
                extra: {}
            });

        },0)
    });


    module.exports = {};
});
