define(function (require,exports,module) {
	var Http = require('U/http');
  var role = require('U/account').getRole();
	var id = api.pageParam.id;
	var vm = new Vue({
		el:'#targetSalesRank',
		template:_g.getTemplate('assistant/targetSalesRank-body-V'),
		data:{
       role : role,
			 rankInfo:[
             {
                 salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 19,
             },{
                salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 28
             },
             {
                 salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 28,
							   entId : null,
								 shopId : null,
             }
             ],
		},
		created:function () {
      this.rankInfo = {}
		},
		methods:{
			// onAllDetail:function (role) {
			// 	var opts = turnToRole(role);
			// 	_g.openWin({
			// 	 header: {
			// 		 data: {
			// 			 title: opts.title,
			// 			 rightText:opts.rightText,
			// 		 }
			// 	 },
			// 	 name: opts.name,
			// 	 url:  opts.url,
			// 	 pageParam: {
			// 			 entId : id,
			// 	 cancel : opts.cancel
			// 	 },
			// 	 bounces: false,
			// 	 slidBackEnabled: false,
			//  })
			// }
		},
	});


//老板入口
    var getData = function(id){
        var _data= {
                ent_goal_setting_id : id
            };
        var _url='/app/auth/goal/sales/entSalesSort.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
                logger.log({"Type":"operation","action":"获取店员目标排行","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function(){
                        vm.rankInfo = getDetail(res);
                    },0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function(err) {}
        });
    }
    var getDetail = function(res){
        return _.map(res.object,function(item){
            return{
                salesName : item.sales_name,
                shopName : item.store_name,
                salesAchievement : item.goal_achieved_rate ? item.goal_achieved_rate : 0,
                salesPrice:item.sales_total_amount ? item.sales_total_amount : 0,
                salesTarget:item.pre_sales_total_amount ? item.pre_sales_total_amount : 0,
								entId : item.ent_goal_setting_id
            }
        })
    };




//店长或店员入口
		var getDataShop = function(id){
            var _data= {
                store_goal_setting_id : id
            };
            var _url= '/app/auth/goal/sales/salesSort.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
                logger.log({"Type":"operation","action":"店长或店员入口","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function(){
                        vm.rankInfo = getDetailShop(res);
                    },0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function(err) {}
        });
    }
    var getDetailShop = function(res){
        return _.map(res.object,function(item){
            return{
                salesName : item.sales_name,
                shopName : item.store_name,
                salesAchievement : item.goal_achieved_rate ? item.goal_achieved_rate : 0,
                salesPrice:item.sales_total_amount ? item.sales_total_amount : 0,
                salesTarget:item.pre_sales_total_amount ? item.pre_sales_total_amount : 0,
								entId : item.store_goal_setting_id
            }
        })
    };


		// var turnToRole = function(role){
		// 	  if(role == 0){
		// 			return {
		// 			 title: '目标详情',
		// 			 rightText:null,
		// 			 name: 'targetShop-targetDetails',
		// 			 url: '../boss/targetDetails.html'};
		// 		}else if(role == 1){
		// 			return {
		// 			title: '目标详情',
		// 			rightText:null,
		// 			name: 'targetShop-targetDetailsManager',
		// 			url: '../manager/targetDetails_manager.html'};
		// 		}else{
		// 			return {
		// 			title: '目标详情',
		// 			rightText:null,
		// 			name: 'targetShop-targetDetailsClerk',
		// 			url: '../clerk/targetDetails_clerk.html'};
		// 		}
		// }

		// if(role == 0){
		// 	getData(id);
		// }else{
		// 	getDataShop(id);
		// }

    getData(id);
})
