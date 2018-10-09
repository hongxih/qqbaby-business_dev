define(function(require, exports, module) {
    var Http = require('U/http');

    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var homeList = new Vue({
        el: '#index',
        template: _g.getTemplate('boss/index-body-V'),
        data: {
            active: 0,
            isNavShow: 0,
            isToggle : true,
            bonus : 10000,
            dateList: [
                '日',
                '周',
                '月',
            ],
            shopName : null,
            isUncheckBill: false,
            flag:true,
            isMonth:false,
            type : "DAY", //头部日、周、月类型;
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
                    width: 0.6,
                    height: 0.6
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
        },
        watch: {
            type: function(){
                this.isMonth = false;
                if(this.type === 'MONTH'){
                    this.isMonth = true;
                }
                getData();
            }
        },
        created: function() {
            this.homeHeader = {
                avg_sale_price: 000,
                current_date: '',
                estimate_profit: 000,
                total_customer: 000,
                total_sale_price: 000,
                total_sale_profit:000,
                un_audit_num:000,
            };
            this.bonus = 000;

        },
        methods: {
            onItemTap: function(index){
                if(this.active == index) return;
                this.active = index;
                this.isToggle = true;
                //发送选择的日、周、月信息到home.js
                api.sendEvent && api.sendEvent({
                    name: 'changeTime',
                    extra: {
                        type: this.active
                    }
                });
            },
            // 侧边栏导航
            onTapSlide: function(){
                api.openDrawerPane && api.openDrawerPane({
                    type: 'left'
                });
            },
            onActionCommission: function(){
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list:['日', '周', '月'],
                            rightText: '店员'
                        },
                        template: '../html/header/header-date-V',
                    },
                    name: 'boss-shopRank',
                    url: '../boss/shopRank.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
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
            onWeekTurnOverTap: function() {
                this.isToggle = true;
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list:['日', '周', '月'],
                            rightText: '筛选'
                        },
                        template: '../html/main/home-date-header-V',
                    },
                    name: 'statistics-bossWeekturnover',
                    url: '../statistics/bossWeekturnover.html',
                    pageParam:{
                        shopName : homeList.shopName
                    },
                    bounces: false,
                    slidBackEnabled: false
                });
            },
            onCloseTap: function(){
                this.isUncheckBill = false;
                this.isToggle = false;
                this.flag = false;
            },
            onJumpTap: function(){
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
            }
        }
    });
    var getData = function() {
        var _data= {
                date_type: homeList.type,
                max_create_time: new Date().Format('yyyy-MM-dd'),
                min_create_time: formatTime(),
            };
        var _url='/app/auth/page/retail/indexSumSale.do';
        Http.ajax({
            data:_data,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"老板首页具体销售信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    console.log(dt);
                    setTimeout(function() {
                        if (dt) {
                            var homeHeader = toVueHomeHeader(dt);
                            homeList.homeHeader = homeHeader;
                            if(homeList.homeHeader.un_audit_num === 0){
                                homeList.isUncheckBill = false;
                            }else{
                                homeList.isUncheckBill = true;
                            }
                        }
                    }, 0);
                }else{
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
            },
            error: function(err) {
                logger.log({"Type":"operation","action":"老板首页具体销售信息","Win_name":api.winName,"data":_data,"message":err,"requireURL":_url})
                homeList.homeHeader = {
                    // isCheck:false,
                    avg_sale_price: 000,
                    current_date: '',
                    estimate_profit: 000,
                    total_customer: 000,
                    total_sale_price: 000,
                    total_sale_profit:000,
                    un_audit_num:000,
                }
                _g.hideProgress();
            },
        });
    }
    getData();
    var getBonus = function(){
        var _data= {
                max_create_time:new Date().Format('yyyy-MM-dd'),
                min_create_time:new Date().Format('yyyy-MM-dd'),
                org_type : 'Company'
            };
        var _url='/app/auth/kpi/sum.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
                logger.log({"Type":"operation","action":"老板首页获取营业额","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    homeList.bonus = res.object.sum_kpi_price;
                    homeList.shopName = res.object.store_name;
                } else {
                    _g.toast(res.message);
                }
            },
            error: function(err) {}
        });

    };
    getBonus();
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
    
    _g.setPullDownRefresh(function() {
        getData();
        getBonus();
    });

    //接收index.js里面传送过来的日、周、月信息
    api.addEventListener && api.addEventListener({
        name: 'changeTime'
    }, function(ret, err) {
        // console.log('hehe');
        homeList.type = typeMap[ret.value.type];
    });

    //function getSide(){
    //    api && api.openDrawerLayout({
    //        name: 'boss-index-win',
    //        url: './html/boss/index.html',
    //        bounces: false,
    //        slidBackEnabled: false,
    //        pageParam: { key: 'fade' },
    //        animation: { type: 'none' },
    //        leftPane: {
    //            name: 'main-index-nav',
    //            url: './html/main/nav.html',
    //            bgColor: 'rgba(0,0,0,0.0)',
    //            edge: 110
    //        }
    //    });
    //}
    //getSide();

    function formatTime(time){
        return _.map(transDateRange().split('-'), function(value){
            return value.length >= 2 ? value : '0'+value;
        }).join('-'); 
    }
    // 起始日期，区间
    function transDateRange(){
        var now = new Date();
        if(homeList.type === 'DAY'){
            return now.Format('yyyy-MM-dd');
        }else if(homeList.type === 'WEEK'){
            var timeStamp = now.getTime() - (24*60*60*1000)*(now.getDay()-1);
            var weekDate = new Date(timeStamp);
            return weekDate.getFullYear()+'-'+(weekDate.getMonth() + 1)+'-'+weekDate.getDate();
        }else if(homeList.type === 'MONTH'){
            return now.getFullYear()+'-'+(now.getMonth() + 1)+'-01';
        }
    };

    // function changeType(callback){

    // }
    // if (ret.value.type === 0) {
    //     homeList.isMonth = false;
    //     homeList.type = "DAY";
    //     minDay = (new Date()).Format("yyyy-MM-dd");
    // }else if(ret.value.type === 1) {
    //     homeList.isMonth = false;
    //     homeList.type = "WEEK";
    //     var now = new Date(); 
    //     var nowTime = now.getTime() ; 
    //     var day = now.getDay();
    //     var oneDayLong = 24*60*60*1000 ;
    //     var MondayTime = null; 
    //     if(day === 0){
    //         MondayTime = nowTime - 6*oneDayLong;
    //     }else{
    //         MondayTime = nowTime - (day-1)*oneDayLong;  
    //     }
    //     var monday = new Date(MondayTime);
    //     var mondayString = monday.toString();
    //     var date = mondayString.split(' ')[2];
    //     var month = (Number(monday.getMonth())+1).toString();
    //     var year = monday.getFullYear().toString();
    //     minDay = year + "-" + month + "-" + date;
    // }else if(ret.value.type === 2) {
    //     homeList.type = "MONTH";
    //     homeList.isMonth = true;
    //     minDay = (new Date()).Format("yyyy-MM") + "-01"; 
    // }
    // getData();
    

    api.addEventListener && api.addEventListener({
        name: 'selectStore'
    }, function(ret, err) {
        getData();
        getBonus();
    });
    // api.addEventListener && api.addEventListener({
    //     name: 'refresh-homeMenu'
    // }, function(ret, err) {
    //     getHomeMenu();
    // });

    module.exports = {};
});
