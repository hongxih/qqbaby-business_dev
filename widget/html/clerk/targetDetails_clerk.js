define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');
	var dtPicker = new mui.DtPicker({
		type:'date'
	});
	var otPicker = new mui.PopPicker();
	var entId = api.pageParam.entId;
	var vm = new Vue({
		el:'#targetDetails_clerk',
		template:_g.getTemplate('clerk/targetDetails_clerk-body-V'),
		data:{
			isComplete:true,
			target_name:'十一月第一阶段营业目标',
			typeOption:['全场目标','品类目标','品牌目标','单品目标'],
			target_range:'全场目标',
			target_details:'全场目标',
			startDay:'2017-02-04 00:00:00',
			endDay:'2017-02-04 23:59:59',
			target_cycle:1,
			complete:1000,
			my_goal:1000,
			store_aim : 0,
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
		},
		methods:{
			onSelectDate:function (type) {
				var self = this;
				dtPicker.show(function (selectItems) {
					if(type.toString() == 'startDay'){
					 	self[type.toString()] = selectItems.value +' ' + '00:00:00';
					}else if(type.toString() == 'endDay'){
						self[type.toString()] = selectItems.value +' ' + '23:59:59';
					}
                    if(self.startDay != '请输入' && self.endDay != '请输入'){
                    	var start = Date.parse(new Date(self.startDay));
                    	var end = Date.parse(new Date(self.endDay));
                    	self.target_cycle = Math.floor(((end - start)/1000/60/60/24) + 1);
                    	if(self.target_cycle <= 0){
                    		_g.toast("结束时间不能大于开始时间")
                    		self[type.toString()] = '请输入';
                    		self.target_cycle = null;
                    	}
                    }
                });
			},
			onSelectType:function () {
				var self = this;
				otPicker.setData(this.typeOption);
				setTimeout(function () {
					otPicker.show(function (selectItems) {
						self.target_range = selectItems;
					})
				},300)

			},
			onTargetFilter:function () {
				_g.openWin({
                    header: {
                        data: {
                            title: '具体目标',
                        }
                    },
                    name: 'assistant-targetFilter',
                    url: '../assistant/targetFilter.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
			},
			onSumTotal:function () {
				var sum = 0;
				_.map(this.list,function (item) {
					sum += parseFloat(item.each_goal);
				})
				this.preinstall_goal = sum;
			},
			onCancelItem:function () {
				api && api.confirm({
				    title: '确认撤销？',
				    msg: '撤销后不能恢复',
				    buttons: ['取消', '确定']
				}, function(ret, err) {
					logger.log({"Type":"operation","action":"确定撤销","Win_name":api.winName});
				   	var index = ret.buttonIndex;
				});
			}
		}
	});
	var getData = function(opts,callback){
		opts = opts || {};
		var _data= {
				sales_goal_setting_id : entId
			};
		var _url= '/app/auth/goal/sales/get.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,

			success: function(res) {
				logger.log({"Type":"operation","action":"获取具体目标","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					setTimeout(function(){
						vm.target_name = res.object.goal_name;
						vm.target_range = targetType(res.object.goal_rang);
						vm.target_details = res.object.goal_type_name;
						vm.startDay = res.object.goal_start_time;
						vm.endDay = res.object.goal_end_time;
						vm.target_cycle = res.object.goal_period;
						vm.complete = res.object.sales_total_amount ? res.object.sales_total_amount : 0;
						vm.displayPreTarget = !(res.object.down_float == 0 && res.object.up_float == 0);
						vm.my_goal = res.object.pre_sales_total_amount ? res.object.pre_sales_total_amount : 0;
						vm.store_aim = res.object.store_goal_amount ? res.object.store_goal_amount : 0
					},0)
				} else {
					_g.toast(res.message);
				}
			},
			error: function(err) {}
		});
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
