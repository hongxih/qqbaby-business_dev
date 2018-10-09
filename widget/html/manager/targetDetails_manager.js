define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');
	var entId = api.pageParam.entId,
		  cancel = api.pageParam.cancel;
	var dtPicker = new mui.DtPicker({
		type:'date'
	});
	var otPicker = new mui.PopPicker();
	var vm = new Vue({
		el:'#targetDetails_manager',
		template:_g.getTemplate('manager/targetDetails_manager-body-V'),
		data:{
			isComplete:true,
			target_name:'十一月第一阶段营业目标',
			typeOption:['全场目标','品类目标','品牌目标','单品目标'],
			target_range:'全场目标',
			target_details:'全场目标',
			startDay:'2017-02-04 00:00:00',
			endDay:'2017-02-04 23:59:59',
			target_cycle:1,
			store:'',
			complete:1000,
			list:[
			{
				store_name:'店员1',
				each_goal:'1200',
			},
			{
				store_name:'店员2',
				each_goal:'1200',
			},
			{
				store_name:'店员3',
				each_goal:'1200',
			},
			],
			preinstall_goal:'3600',
		},
		created:function () {
			this.list = [];
			this.target_name = '';
      		this.target_range = '';
      		this.target_details = '';
      		this.startDay = '';
      		this.endDay = '';
      		this.complete = null;
      		this.target_cycle = null;
      		this.preinstall_goal = null;
		},
		methods:{
			
		}
	});


	var getData = function(opts,callback){
		opts = opts || {};
		var _data={
				store_goal_setting_id : entId
			};
		var _url='/app/auth/goal/store/get.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"店长目标详情获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					setTimeout(function(){
						vm.target_name = res.object.goal_name;
						vm.target_range = targetType(res.object.goal_rang);
						vm.target_details = res.object.goal_type_name;
						vm.startDay = res.object.goal_start_time;
						vm.endDay = res.object.goal_end_time;
						vm.target_cycle = res.object.goal_period;
						vm.complete = res.object.store_total_amount ? res.object.store_total_amount : 0;
						vm.displayPreTarget = !(res.object.down_float == 0 && res.object.up_float == 0);
						vm.list = getDetail(res.object.sales_goal_list);
						vm.store = res.object.store_goal_amount ? res.object.store_goal_amount : 0;
						vm.preinstall_goal = res.object.pre_store_total_amount ? res.object.pre_store_total_amount : 0;
						_.map(vm.list,function (item,i) {
							item.each_goal=parseFloat(item.each_goal);
							if(!item.each_goal){
								$('#ui-addTarget__preinstall'+i).css( "top","0.55rem" )
							}
						})

					},0)
				} else {
					_g.toast(res.message);
				}
			},
			error: function(err) {}
		});
	};
	var getDetail = function(arr){
		return _.map(arr,function(item){
			return{
				store_name:item.sales_name,
				// each_goal:item.store_goal_amount,
				preTarget : item.pre_sales_total_amount
			}
		})
	};
	getData();
	var targetType = function(type){
		switch(type){
			case 'Overall':
				return '全场目标';
			case 'Goods':
				return '单品目标';
			case 'Brand':
				return '品牌目标';
			default:
				return '品类目标';
		}
	};
})
