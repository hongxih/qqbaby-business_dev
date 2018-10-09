define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
	var vm = new Vue({
		el:'#managerCommission',
		template:_g.getTemplate('manager/managerCommission-body-V'),
		data:{
			last_day_kpi_price:null,//昨日提成
			this_day_kpi_price:null,//今日提成
			last_month_kpi_price:null,//上个月提成
			this_month_kpi_price:null,//本月提成
			list:[
				{
					kpi_time:"",
					kpi_type_name:"",
					kpi_type:"",
					last_kpi_value:null,
					staff_id:"",
					sum_kpi_value:null
				}
			]

		},
		methods:{
			  onExpenditureDetails : function(type){
			  		_g.openDrawerLayout({
	                    header:{
	                        data:{
	                            title:_g.getLS('UserInfo').user_name,
	                            // '
							},
							template:'../html/header/header-hasScreen-V'
	                    },
	                    pageParam:{
	                    	type:type
	                    },
	                    name: "manager-managerExpenditureDetails",
	                    url:"../manager/managerExpenditureDetails.html",
	                    rightPane: {
	                        name: 'manager-managerScreenSide',
	                        url: '../manager/managerScreenSide.html'
	                    }
	                });

			  }
        },
		created:function () {
			this.list = [];
        },
	});
	var getData = function(){
		var date  = new Date();
		var min_create_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+"01"+" "+"00:00:00";
		var day = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
		var max_create_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+day+" "+"23:59:59";
		var _data={
            	max_create_time:max_create_time,
            	min_create_time:min_create_time
            };
         var _url= '/app/auth/kpi/sumSalesGroupByType.do';
		Http.ajax({
			api_versions: 'v2',
            data:_data,
            url:_url,
            success: function(res) {
            	logger.log({"Type":"operation","action":"店长获取提成数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function(){
                    	vm.list = getItemList(res);
                    },0)
                }else{
                }
            },
            error: function(err) {
            },
        });

	};
	var getItemList = function(res){
		return _.map(res.object,function(item){
			return {
				kpi_time:item.kpi_time,
				kpi_type_name:item.kpi_type_name,
				kpi_type:item.kpi_type,
				last_kpi_value:item.last_kpi_value,
				staff_id:item.staff_id,
				sum_kpi_value:item.sum_kpi_value
			}
		})
	};
	getData();
	var getPrice = function(){
		var date = new Date();
		var max_create_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+"23:59:59";
		var min_create_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()-1)+" "+"00:00:00";
		var min_month_kpi_time = date.getFullYear()+"-"+(date.getMonth())+"-"+"01"+" "+"00:00:00";
		var day = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
		var max_month_kpi_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+day+" "+"23:59:59";
		var _data={
            	max_create_time:max_create_time,//今天时间
            	min_create_time:min_create_time,//昨天时间
            	min_month_kpi_time:min_month_kpi_time,//上个月第一天
            	max_month_kpi_time:max_month_kpi_time//本月最后一天
            };
         var _url='/app/auth/kpi/sumSalesMonthKpi.do';
		Http.ajax({
			api_versions: 'v2',
            data:_data,
            url:_url,
            success: function(res) {
            	logger.log({"Type":"operation","action":"店长获取营业额","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    if(res.object){
                        setTimeout(function(){
                        	vm.last_day_kpi_price = res.object.last_day_kpi_price||"";
                        	vm.this_day_kpi_price = res.object.this_day_kpi_price||"";
                        	vm.last_month_kpi_price = res.object.last_month_kpi_price||"";
                        	vm.this_month_kpi_price = res.object.this_month_kpi_price||"";
                        },0)
                    }
                }else{
                    _g.tosat(res.message);
                }
            },
            error: function(err) {
            },
        });
	}
	getPrice();
    _g.setPullDownRefresh(function() {
			getData();
            getPrice();
	});
})
