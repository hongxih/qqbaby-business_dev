define(function(require,exports,module){
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var getTime = require('U/getTime');
    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var dayMap = ['今日','本周','本月'];
    var day = new Date();
    var store_id = api && api.pageParam.store_id;
    var vm = new Vue({
        el:'#sellerRank',
        template : _g.getTemplate('boss/sellerRank-body-V'),
        data : {
           lists : [{
               seller : 'sxsad1',
               shopName : 'cvvvvvv',
               amount : '123123123',
               id : 20
           },{
               seller : 'sxsad2',
               shopName : 'cvvvvvv',
               amount : '123123123',
               id : 201
           },{
               seller : 'sxsad3',
               shopName : 'cvvvvvv',
               amount : '123123123',
               id : 22
           },{
               seller : 'sxsad4',
               shopName : 'cvvvvvv',
               amount : '123123123',
               id : 27
           }],
            type : 'DAY',
            dayDes : '今日',

            currentTime:getTime.transDateRange('DAY'),

            currentStamp : day.getTime(),

            startTime : new Date().Format('yyyy-MM-dd'),
            endTime : new Date().Format('yyyy-MM-dd')
        },
        created:function(){
            this.lists = {};
        },
        methods : {
            turnToDetail : function(id,name){
                _g.openWin({
                    header:{
                        data:{
                            title:name
                        },
                        template: '../html/header/header-base-V',
                    },
                    name:'boss-shopDetail',
                    url:'../boss/sellerDetail.html',
                    bounces:false,
                    pageParam:{
                        sales_id : id
                    }
                });
            },
            onExpenditureDetails:function(id,name,day){
                _g.openDrawerLayout({
                        header:{
                            data:{
                                title:name
                            },
                            template:'../html/header/header-hasScreen-V'
                        },
                        pageParam:{
                            day:day,
                            sales_id:id
                        },
                        name: "boss-bossExpenditureDetails",
                        url:"../boss/bossExpenditureDetails.html",
                        rightPane: {
                            pageParam:{
                                isClerk:1,
                                sales_id:id
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

    var getData = function(opts,callback,min_time,max_time){
        api && api.showProgress({
            style: 'default',
            animationType: 'fade',
            modal: false
        });

        var opts = opts || {};
        var _data= {
                displayRecord : 20,
                page : opts.page || 1,
                max_create_time:max_time ? max_time : new Date().Format('yyyy-MM-dd'),
                min_create_time:min_time ? min_time : new Date().Format('yyyy-MM-dd'),
                org_id:store_id || null
            };
        var _url='/app/auth/kpi/listSalesSum.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function(res) {
                logger.log({"Type":"operation","action":"sellerRank数据获取","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
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
                            vm.lists = lists;
                        }
                    }, 0);
                } else {
                    _g.toast(res.message);
                }
                api && api.hideProgress();
            },
            error: function(err) {
                api && api.hideProgress();
            }
        });

    };
    var getDetail = function(res){
        return _.map(res.object,function(item){
            return{
                shopName : item.store_name,
                amount : item.sum_kpi_price,
                id : item.sales_id,
                store_id : item.store_id,
                seller : item.sales_name
            }
        })
    };
    getData();
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
        vm.pastTime = dayArr[0];
        vm.endTime = dayArr[1];
        getData(null,null,dayArr[0],dayArr[1]);
        //loadmore.reset();
    };
    //接收index.js里面传送过来的日、周、月信息  1.门店  2.会员
    api.addEventListener && api.addEventListener({
        name: 'toggleDate'
    }, function(ret, err) {
        if(vm.type == typeMap[ret.value.type])return;
        vm.type = typeMap[ret.value.type];
        vm.currentStamp = day.getTime();
        vm.currentTime = getTime.transDateRange(typeMap[ret.value.type]);
        getFormatTime(vm.type,vm.currentStamp,0);
        vm.dayDes = dayMap[ret.value.type];
    });

    //var loadmore = new Loadmore({
    //    callback: function(page){
    //        getData({page: page.page}, function(data){
    //            if(!data.object || data.object.length === 0){
    //                return loadmore.loadend(false);
    //            }else{
    //                vm.lists = vm.lists.concat(getDetail(data));
    //                loadmore.loadend(true);
    //            }
    //        },vm.pastTime,vm.endTime);
    //    }
    //});

    module.exports = {};
});
