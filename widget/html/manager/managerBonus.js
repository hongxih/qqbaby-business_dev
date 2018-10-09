define(function (require,exports,module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var getTime = require('U/getTime');
    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var dayMap = ['今日','本周','本月'];
    var day = new Date();
	var vm = new Vue({
		el:'#managerBonus',
		template:_g.getTemplate('manager/managerBonus-list-V'),
		data:{

			sum_kpi_price:10001,
			sales_kpi_price:100,
            org_id:'',
            sales_id:_g.getLS('UserInfo').user_id,
            store_name:'',

            type : 'DAY',
            dayDes : '今日',
            currentTime:getTime.transDateRange('DAY'),
            currentStamp : day.getTime()
		},
		methods:{
			onBonusDetails:function () {
				_g.openWin({
					header: {
                            data: {
                                title: '提成明细'
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
            onGetDayData : function(type,time,addOrSubtract){
                getFormatTime(type,time,addOrSubtract);
            }
		},
		created:function () {
			this.sum_kpi_price = '';
			this.sales_kpi_price = '';
            this.org_id = '';
		},
	});

	var getStoreData = function (min_time,max_time) {

        api && api.showProgress({
            style: 'default',
            animationType: 'fade',
            modal: false
        });
        var  _data={
                max_create_time:max_time ? max_time : new Date().Format('yyyy-MM-dd'),
                min_create_time:min_time ? min_time : new Date().Format('yyyy-MM-dd'),
                org_type:'Store',
            };
        var _url='/app/auth/kpi/sum.do';
		Http.ajax({
			api_versions: 'v2',
            data:_data,
            url:_url,
            success: function(ret) {
                 logger.log({"Type":"operation","action":"店长获取门店营业额","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    setTimeout(function() {
                    	vm.sum_kpi_price = dt.sum_kpi_price;
                        vm.org_id = dt.org_id;
                        vm.store_name = dt.store_name;
                    }, 0);
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

	var getPersonalData = function (min_time,max_time) {
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
                 logger.log({"Type":"operation","action":"店长获取店员数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    setTimeout(function() {
                    	vm.sales_kpi_price = dt.sales_kpi_price;
                    }, 0);
                }else{
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
            },
            error: function(err) {
                _g.hideProgress();
            },
        });
	}
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
        getStoreData(dayArr[0],dayArr[1]);
        getPersonalData(dayArr[0],dayArr[1]);
    };
	//接收index.js里面传送过来的日、周、月信息
    api.addEventListener && api.addEventListener({
        name: 'changeTime'
    }, function(ret, err) {
        if(vm.type == typeMap[ret.value.type])return;
        vm.type = typeMap[ret.value.type];
        vm.currentStamp = day.getTime();
        vm.currentTime = getTime.transDateRange(typeMap[ret.value.type]);
        getFormatTime(vm.type,vm.currentStamp,0);
        vm.dayDes = dayMap[ret.value.type];
    });
    setTimeout(function () {
    	 getStoreData();
   		 getPersonalData();
    },0)
})