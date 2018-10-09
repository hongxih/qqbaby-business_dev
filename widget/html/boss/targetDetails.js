define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');
	var entId = api.pageParam.entId,
		cancel = api.pageParam.cancel;
	var vm = new Vue({
		el:'#targetDetails',
		template:_g.getTemplate('boss/targetDetails-body-V'),
		data:{
			target_name:'十一月第一阶段营业目标',
			typeOption:['全场目标','品类目标','品牌目标','单品目标'],
			target_range:'全场目标',
			target_details:'全场目标',
			startDay:'2017-02-04 00:00:00',
			endDay:'2017-02-04 23:59:59',
			target_cycle:1,
			complete:1000,
			end_target:0,
			displayPreTarget : true,
			status : '',
			cancel : false,
			list:[
			{
				store_name:'门店1',
				each_goal:'1000',
				preTarget:'1000'
			},
			{
				store_name:'门店2',
				each_goal:'0',
				preTarget:'1000'
			},
			{
				store_name:'门店3',
				each_goal:'1200',
				preTarget : 0
			},
			],
			preinstall_goal:'3600',
		},
		created:function () {
			//this.startDay = ''
			this.target_name=''
			this.target_range=''
			this.target_details=''
			this.startDay=''
			this.endDay=''
			this.target_cycle=''
			this.complete=''
      		this.list = {}
		},
		computed: {
			transformStatus: function(){
				var map = {
					'doing': '终止',          //进行中
					'un_allocate': '撤销',    //等待分配
					'allocated': '撤销',      //已分配
                    'expired' : '删除',       //已失效
					'cancel' : '删除'
				};
				return map[this.status];
			},
			checkStatus: function(){
				return ( this.status === 'un_allocate' && (new Date(this.startDay.split(' ')[0]) > new Date().getTime()) )
                    || this.status === 'allocated'
                    || this.status === 'doing'
                    || this.status === 'expired'
					|| this.status === 'cancel';
			}
		},
		methods:{
			// 待分配状态下，可跳转至该门店下店员目标分配的页面
			toEditTargetForClerk: function (ind) {
				if( this.status !== 'un_allocate' ) return
				if(this.list[ind].preTarget === 0 ) return
				var titleText="编辑目标";
				if(this.list[ind].each_goal){
					titleText ="查看目标"
				}
				_g.openWin({
					header: {
						data: {
							title: titleText,
						}
					},
					name: 'boss-editTargetForClerk',
					url:  '../boss/editTargetForClerk.html',
					pageParam: {
						store_id:this.list[ind].store_id,
						sgs_id:this.list[ind].store_goal_setting_id,
						target_id:entId
					}
				})
			},
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
			onCancelItem:function (status) {

				var action = null;
				var msg = null;
				var isDelete = false; //已失效和被撤销置为true
				if(status === 'doing'){
					action = 'expired';
					msg = '终止';
				}else if(status === 'un_allocate' || status === 'allocated'){
					action = 'cancel';
					msg = '撤销';
				}else if(status === 'expired' || status === 'cancel'){
					action = 'delete';//删除功能字段
					msg = '删除';
				}
				if(status === 'expired' || status === 'cancel'){ //已失效和被撤销置为true
					isDelete = true
				}
				if(_g.isIOS){
					api && api.confirm({
				    title: '确认' + msg + '？',
				    msg: msg + '后不能恢复',
				    buttons: ['取消','确定']
					}, function(ret, err) {
						var _data={
							ent_goal_setting_id : entId,
							goal_status : action
						};
						logger.log({"Type":"operation","action":"open win","Win_name":api.winName,"data":_data})
					   	var index = ret.buttonIndex;
						if(index == 2){
							Http.ajax({
								data:_data,
								api_versions: 'v2',
								url: '/app/auth/goal/company/updateStatus.do',
								success: function(res) {
									if (res.code == 200) {
										if(isDelete){
											toHistoricalGoal()
											return
										}
										api.sendEvent && api.sendEvent({
											name: 'refresh-historicalGoal'
										});
										api.closeWin && api.closeWin();
									} else {
										_g.toast(res.message);
									}
								},
								error: function(err) {}
							});
						}
					});
				}else if(_g.isAndroid){
					api && api.confirm({
				    title: '确认' + msg + '？',
				    msg: msg + '后不能恢复',
				    buttons: ['确定','取消']
					}, function(ret, err) {
						var _data={
							ent_goal_setting_id : entId,
							goal_status : action
						};
						logger.log({"Type":"operation","action":"open win","Win_name":api.winName,"data":_data})
					   	var index = ret.buttonIndex;
						if(index == 1){
							Http.ajax({
								data:_data,
								api_versions: 'v2',
								url: '/app/auth/goal/company/updateStatus.do',
								success: function(res) {
									if (res.code == 200) {
										if(isDelete){
											toHistoricalGoal()
											return
										}
										api.sendEvent && api.sendEvent({
											name: 'refresh-historicalGoal'
										});
										api.closeWin && api.closeWin();
									} else {
										_g.toast(res.message);
									}
								},
								error: function(err) {}
							});
						}
					});
				}

			}
		}
	});
	var getData = function(opts,callback){
		var opts = opts || {};
		var _data= {
				ent_goal_setting_id : entId
			};
		var _url='/app/auth/goal/company/get.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"获取类型列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					setTimeout(function(){
						vm.target_name = res.object.goal_name;
						vm.target_range = targetType(res.object.goal_rang);
						vm.target_details = res.object.goal_type_name;
						vm.startDay = res.object.goal_start_time;
						vm.endDay = res.object.goal_end_time;
						vm.target_cycle = res.object.goal_period;
						vm.complete = res.object.real_ent_total_amount ? res.object.real_ent_total_amount : 0;
						vm.displayPreTarget = !(res.object.down_float == 0 && res.object.up_float == 0);
						vm.end_target = res.object.pre_ent_total_amount ? res.object.pre_ent_total_amount : 0;
						vm.list = getDetail(res.object.store_goal_list);
						vm.status = res.object.goal_status; // 目标状态
						// time = res.object.goal_start_time;
					},0);
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
				store_name:item.store_name,
				each_goal:item.store_goal_amount,
				preTarget : item.pre_store_total_amount,
				store_id : item.store_id,
				store_goal_setting_id:item.store_goal_setting_id,
				isPreTargetShow:(!vm.displayPreTarget && item.store_goal_amount) ? false : true
			}
		})
	};
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
	/**
	 * 跳转至历史目标
	 **/
	var toHistoricalGoal = function () {
		var str = _g.getLS('UserInfo').notes
		_g.openWin({
			header: {
				data: {
					title:'历史目标'
				},
			},
			name: 'boss-historicalGoal',
			url: '../boss/historicalGoal.html',
		})
	}
	/**
	 * 店员修改成功后刷新页面 from editTargetForClerk
	 **/
	api.addEventListener && api.addEventListener({
		name: 'refresh-editTargetForClerk'
	}, function(ret, err) {
		getData();
	});
	setTimeout(function(){
		getData();
	}, 0);
})
