define(function(require,exports,module){
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var getTime = require('U/getTime');
    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var dayMap = ['今日','本周','本月'];
    var dayTypeMap = ['日','周','月'];
    var day = new Date();
    //var loadmore = new Loadmore({
    //    callback: function(page){
    //        getData({page: page.page}, function(data){
    //            if(!data.object || data.object.length === 0){
    //                return loadmore.loadend(false);
    //            }else{
    //                vm.rankInfo = vm.rankInfo.concat(getDetail(data));
    //                loadmore.loadend(true);
    //            }
    //        });
    //    }
    //});
    var vm = new Vue({
        el:'#shopRank',
        template : _g.getTemplate('boss/shopRank-body-V'),
        data : {
             rankInfo:[
             {
                 shopName : '爱x因斯1坦',
                 num : '100,100',
                 id : 19
             },{
                 shopName : '爱xx因斯坦',
                 num : '100,100',
                 id : 28
             },
             {
                 shopName : '爱xx因斯坦',
                 num : '100,100',
                 id : 28
             },
             {
                 shopName : '爱xx因斯坦',
                 num : '100,100',
                 id : 28
             },
             {
                 shopName : '爱xx因斯坦',
                 num : '100,100',
                 id : 28
             },
             ],
            bonus : 0,
            type : 'DAY',
            dayDes : '今日',
            dayType:'日',
            currentTime:getTime.transDateRange('DAY'),

            currentStamp : day.getTime()

        },
       created:function(){
            this.rankInfo = {};
        },
        methods : {
            turnToDetail : function(id,name){
                var shop = null;
                Http.ajax({
                    url: '/app/auth/store/list.do',
                    data: {},
                    api_versions: 'v2',
                    success: function(res){
                        if(res.code == 200){
                            setTimeout(function(){
                                shop = res.object;
                            },0)
                        }else{
                            _g.toast(ret.message);
                        }
                    },
                });

                _g.openWin({
                    header:{
                        data:{
                            title:'支出提成',
                            rightText: name ? null : '筛选',
                            shop:shop
                        },
                        template: '../html/header/header-base-V',
                    },
                    name:'boss-shopDetail',
                    url:'../boss/shopDetail.html',
                    bounces: false,
                    slidBackEnabled: false,
                    animation: { type: 'none' },
                    pageParam:{
                        store_id : id,
                    }
                });
            },
            onExpenditureDetails:function(day){
                _g.openDrawerLayout({
                        header:{
                            data:{
                                title:"支出提成"
                            },
                            template:'../html/header/header-hasScreen-V'
                        },
                        pageParam:{
                            day:day
                        },
                        name: "boss-bossExpenditureDetails",
                        url:"../boss/bossExpenditureDetails.html",
                        rightPane: {
                            pageParam:{
                                isClerk:0,
                            },
                            name: 'boss-bossScreenSide',
                            url: '../boss/bossScreenSide.html'
                        }
                    });
            },
            onExpenditureDetails1:function(id){
                _g.openDrawerLayout({
                        header:{
                            data:{
                                title:"支出提成"
                            },
                            template:'../html/header/header-hasScreen-V'
                        },
                        pageParam:{
                            id:id
                        },
                        name: "boss-bossExpenditureDetails",
                        url:"../boss/bossExpenditureDetails.html",
                        rightPane: {
                            pageParam:{
                                isClerk:0,
                                id:id
                            },
                            name: 'boss-bossScreenSide',
                            url: '../boss/bossScreenSide.html'
                        }
                    });

            },
            onGetDayData : function(type,time,addOrSubtract){
                getFormatTime(type,time,addOrSubtract);
            }
        }
    });
    var getBonus = function(min_time,max_time){
        var _data= {
                max_create_time:max_time ? max_time : new Date().Format('yyyy-MM-dd'),
                min_create_time:min_time ? min_time : new Date().Format('yyyy-MM-dd'),
                org_type : 'Company'
            };
        var _url='/app/auth/kpi/sum.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function(res) {
                logger.log({"Type":"operation","action":"shopRank获取营业额","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    vm.bonus = res.object.sum_kpi_price;
                    vm.id = res.object.org_id
                } else {
                    _g.toast(res.message);
                }
            },
            error: function(err) {}
        });

    };
    var getData = function(min_time,max_time,opts,callback){
        if(typeof max_time == "function"){
            callback = max_time;
            var opts = min_time;
            min_time = max_time = null;
        }
        api && api.showProgress({
            style: 'default',
            animationType: 'fade',
            modal: false
        });

        var opts = opts || {};
        var _data={
                displayRecord : 10,
                page :opts.page || 1,
                max_create_time:max_time ? max_time : new Date().Format('yyyy-MM-dd'),
                min_create_time:min_time ? min_time : getTime.formatTime(vm.type)
            };
        var _url='/app/auth/kpi/listSort.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
                logger.log({"Type":"operation","action":"shoprank获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function() {
                        if(opts.page && opts.page > 1){
                            setTimeout(function(){
                                callback && callback(res);
                            }, 0);
                        }else{
                            var lists = getDetail(res);
                            //if(lists.length<1){
                            //    loadmore.toggleSwitch();
                            //}
                            vm.rankInfo = lists;
                        }
                        api && api.hideProgress();
                    }, 0);
                } else {
                    api && api.hideProgress();
                }
            },
            error: function(err) {}
        });

    };
    var getDetail = function(res){
        return _.map(res.object,function(item){
            return{
                shopName : item.store_name,
                num : item.total_kpi_price,
                id : item.store_id,
                sort : item.sort
            }
        })
    };
    getData();
    getBonus();

    var getFormatTime = function(type,time,addOrSubtract){
        var dayArr = getTime.getCurrentTime(type,time,addOrSubtract).split('|');
        switch(type){
            case 'DAY':
                vm.currentTime = dayArr[0];
                break;
            case 'WEEK':
                vm.currentTime = dayArr[0]+'~'+dayArr[1];
                break;
            case 'MONTH':
                vm.currentTime = dayArr[0]+'~'+dayArr[1];
                break;
        }
        vm.currentStamp = dayArr[2];
        vm.dayDes = null;
        getBonus(dayArr[0],dayArr[1]);
        getData(dayArr[0],dayArr[1]);
    };
//接收index.js里面传送过来的日、周、月信息 1.门店  2.会员
    api.addEventListener && api.addEventListener({
        name: 'toggleDate'
    }, function(ret, err) {
        if(vm.type == typeMap[ret.value.type]) return;
        vm.type = typeMap[ret.value.type];
        vm.currentStamp = day.getTime();
        vm.currentTime = getTime.transDateRange(typeMap[ret.value.type]);
        getFormatTime(vm.type,vm.currentStamp,0);
        vm.dayDes = dayMap[ret.value.type];
        vm.dayType = dayTypeMap[ret.value.type];
    });


    module.exports = {};
});
