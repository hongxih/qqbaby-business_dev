define(function (require,exports,module) {
	var Http = require('U/http');
	var type = api.pageParam.type;
	var vm = new Vue({
		el:'#allocationScreenItem',
		template:_g.getTemplate('shop/allocationScreenItem-body-V'),
		data:{
			type:type,
			list:[
			{
				itemName:"水真店",
				itemId:1,
				isClick:false
			},
			{
				itemName:"水真店",
				itemId:1,
				isClick:false
			},
			{
				itemName:"水真店",
				itemId:1,
				isClick:false
			},
			{
				itemName:"水真店",
				itemId:1,
				isClick:false
			}
			]
		},
		filters:{

		},
		methods:{
			onChooseItem:function(idx){
				_.map(this.list,function(item){
					if(item){
						item.isClick = false;
					}
				});
				if(this.list[idx].isClick===false){
					this.list[idx].isClick = true;
				}else{
					this.list[idx].isClick = false;
				}
				api.sendEvent({
                    name: 'allocation-chooseItem',
                    extra: {
                        key1: this.list[idx].itemName,
                        key2: this.list[idx].itemId,
                        key3:type
                    }
                });
                api.closeFrame && api.closeFrame({});
			},
			onChooseItemAll:function(type){
				api.sendEvent({
                    name: 'allocation-chooseItemAll',
                    extra: {
                        key1:type
                    }
                });
                api.closeFrame && api.closeFrame({});
			},
			onCloseDrawer:function() {
				api.closeDrawerPane && api.closeDrawerPane();
			},
			onClose : function(){
                api.closeFrame && api.closeFrame({});
            }
		},
		created:function () {
			this.list = [];
        },
	});

	var getData = function(){
		if(type==1 || type==2){
			var _url='/app/auth/store/list.do';
			Http.ajax({
                url:_url,
                data: {},
                api_versions: 'v2',
                success: function(res){
                	logger.log({"Type":"operation","action":"调拨筛选获取门店列表","Win_name":api.winName,"message":res,"requireURL":_url})
                    if(res.success){
                        setTimeout(function(){
                        	vm.list = getItemList(res);
                        },0)
                        console.log(vm.list);
                    }else{
                        _g.toast(res.message);
                    }
                }
            });
		}else{
			vm.list = [{itemName:"未审核",itemId:1,isClick:false},
			{itemName:"等待发货",itemId:2,isClick:false},
			{itemName:"等待收货",itemId:3,isClick:false},
			{itemName:"已完成",itemId:4,isClick:false},
			{itemName:"已终止",itemId:5,isClick:false},]
		}
	};
	getData();
	var getItemList = function(res){
		return _.map(res.object,function(item){
            if(item.org_type!="001"){
                return {
                    itemName:item.org_name,
                    itemId:item.store_id,
                    isClick:false
                }
            }
        })
	};

});
