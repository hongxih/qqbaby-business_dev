define(function (require,exports,module) {
	var Http = require('U/http');
	var vm = new Vue({
		el:'#allocationScreenList',
		template:_g.getTemplate('shop/allocationScreenList-body-V'),
		data:{
			ConsignorStore:"调出门店",
			ConsignorStoreId:null,
			ConsigneeStore:"调入门店",
			ConsigneeStoreId:null,
			type:"全部"
		},
		filters:{

		},
		methods:{
			onChooseStore: function (type) {
				api.openFrame({
					name: 'shop-allocationScreenItem',
					url: '../shop/allocationScreenItem.html',
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
				api.sendEvent({
                    name: 'allocation-scrren',
                    extra: {
                        key1:this.ConsignorStore,
                        key2:this.ConsigneeStore,
                        key3:this.type
                    }
                });
				api.closeDrawerPane();
			},
			onCloseDrawer:function() {
				api.closeDrawerPane && api.closeDrawerPane();
			},
			//重置
			onReset: function () {
				this.ConsignorStore = "";
				this.ConsignorStoreId = "";
				this.ConsigneeStore = "";
				this.ConsigneeStoreId = "";
				this.type = "";
			}
		},
		created:function () {
			this.ConsignorStore = "";
			this.ConsignorStoreId = "";
			this.ConsigneeStore = "";
			this.ConsigneeStoreId = "";
			this.type = "";

        },
	});
	api.addEventListener && api.addEventListener({
	    name: 'allocation-chooseItem'
	}, function(ret, err) {
		if(ret.value.key3==1){
			vm.ConsignorStore = ret.value.key1;
			vm.ConsignorStoreId = ret.value.key2;
		}else if(ret.value.key3==2){
			vm.ConsigneeStore = ret.value.key1;
			vm.ConsigneeStoreId = ret.value.key2;
		}else if(ret.value.key3==3){
			vm.type = ret.value.key1;
		}
	});
	api.addEventListener && api.addEventListener({
	    name: 'allocation-chooseItemAll'
	}, function(ret, err) {
		if(ret.value.key1==1){
			vm.ConsignorStore = "全部门店";
			vm.ConsignorStoreId = "";
		}else if(ret.value.key1==2){
			vm.ConsigneeStore = "全部门店";
			vm.ConsigneeStoreId = "";
		}else if(ret.value.key1==3){
			vm.type = "全部状态";
		}
	});
});
