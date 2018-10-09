define(function (require,exports,module) {
	var Http = require('U/http');
	var vm = new Vue({
		el:'#costScreenList',
		template:_g.getTemplate('cost/costScreenList-body-V'),
		data:{
			store_name:"全部门店",
			store_id:null,
			bill_type_remark:"全部收支方式",
			bill_type:null,
			cost_type_name:"全部费用类型",
			cost_type_id:null,
			audit_status_name:"全部审核状态",
			audit_status:"",
			isManager:_g.getLS('UserInfo').notes == "store_admin"?false:true
		},
		filters:{
			
		},
		methods:{
			onMemberAssistant: function (type) {
				api.openFrame({
					name: 'cost-costScreenChoose',
					url: '../cost/costScreenChoose.html',
					rect: {
						x: 0,
						y: 0,
						w: 'auto',
						h: 'auto'
					},
					pageParam: {
						type:type
					},
					bounces: false,
		            animation:{
		                type: 'push',
		                subType: 'from_right',
		                duration: 300
		            }
				});
			},
			//确定
			onAgreeClose: function () {
				api.sendEvent && api.sendEvent({
                    name: 'cost-search',
                    extra: {
                        store_id: this.store_id,//筛选条件
                        bill_type: this.bill_type,//筛选条件
                        bill_type_remark:this.bill_type_remark,
                        cost_type_id: this.cost_type_id,//筛选条件
                        cost_type_name:this.cost_type_name,
                        audit_status: this.audit_status,//筛选条件
                    }
                });
				api.closeDrawerPane();
			},
			onCloseDrawer:function() {
				api.closeDrawerPane && api.closeDrawerPane();
			},
			//重置
			onReset: function () {
				this.store_name = "全部门店";
				this.store_id = null;
				this.bill_type_remark = "全部收支方式";
				this.bill_type = null;
				this.cost_type_name = "全部费用类型";
				this.cost_type_id = null;
				this.audit_status_name = "全部审核状态";
				this.audit_status = "";

			}
		},
		created:function () {
			this.store_name = "全部门店";
			this.store_id = null;
			this.bill_type_remark = "全部收支方式";
			this.bill_type = null;
			this.cost_type_name = "全部费用类型";
			this.cost_type_id = null;
			this.audit_status_name = "全部审核状态";
			this.audit_status = "";

        },
	});

	api.addEventListener && api.addEventListener({
	    name: 'cost-chooseItem'
	}, function(ret, err) {
		if(ret.value.key3 == 1){
			vm.store_name = ret.value.key1;
			vm.store_id = ret.value.key2;
		}else if(ret.value.key3 == 2){
			vm.bill_type_remark = ret.value.key1;
			vm.bill_type = ret.value.key2;
		}else if(ret.value.key3 == 3){
			vm.cost_type_name = ret.value.key1;
			vm.cost_type_id = ret.value.key2;
		}else if(ret.value.key3 == 4){
			vm.audit_status_name = ret.value.key1;
			vm.audit_status = ret.value.key2;
		}
	});
	api.addEventListener && api.addEventListener({
	    name: 'cost-chooseItemAll'
	}, function(ret, err) {
		if(ret.value.key1 == 3){
			vm.store_name = "全部门店";
			vm.store_id = "";
		}else if(ret.value.key1 == 1){
			vm.bill_type_remark = "全部收支方式";
			vm.bill_type = "";
		}else if(ret.value.key1 == 2){
			vm.cost_type_name = "全部费用类型";
			vm.cost_type_id = "";
		}else if(ret.value.key1 == 4){
			vm.audit_status_name = "全部审核状态";
			vm.audit_status = "";
		}
	});
	api.addEventListener && api.addEventListener({
	    name: 'cost-Add'
	}, function(ret, err) {
		vm.store_name = "";
		vm.store_id = null;
		vm.bill_type_remark = "";
		vm.bill_type = null;
		vm.cost_type_name = "";
		vm.cost_type_id = null;
		vm.audit_status_name = "";
		vm.audit_status = "";
	});



});
