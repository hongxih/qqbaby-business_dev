define(function(require, exports, module) {
	console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var entId = api.pageParam.entId;
    var vm = new Vue({
        el: '#memberStatement',
        template: _g.getTemplate('member/memberStatement-body-V'),
        data: {
        	type:'00A',
            list:[
            {
            time:'14:00',
            day:'02-08',
            memony:300000,
            skuName:'贝因美奶粉1000ml婴儿',
            skuCode:'规格规格',
            skuNum:1,
            },
            {
            time:'14:00',
            day:'02-08',
            memony:300000,
            skuName:'贝因美奶粉1000ml婴儿',
            skuCode:'规格规格',
            skuNum:1,
            },{
            time:'14:00',
            day:'02-08',
            memony:300000,
            skuName:'贝因美奶粉1000ml婴儿',
            skuCode:'规格规格',
            skuNum:1,
            },{
            time:'14:00',
            day:'02-08',
            memony:300000,
            skuName:'贝因美奶粉1000ml婴儿',
            skuCode:'规格规格',
            skuNum:1,
            }
            ]
        },
        created: function(){
           this.list = [];
        },
        watch: {
          
        },
        filters: {
           
        },
        methods: {
			onTabSwitch :function(type){
				if(type==1){
					$(".ui-member__statmentTit").find('div').removeClass("active");
					$(".J-tab-sell").addClass("active");
					vm.type="00A";
					getData();
					loadmore.reset();
				}else if(type==2){
					$(".ui-member__statmentTit").find('div').removeClass("active");
					$(".J-tab-return").addClass("active");
					vm.type="00T";
					getData();
					loadmore.reset();
				}
			}
        }
    });
	var getData = function(opts,callback){
		opts = opts || {}
	    var _data={
				displayRecord : 10,
                page : opts.page || 1,
                user_id : entId,
                order_type:vm.type
            };
        var _url='/app/auth/crm/user/listCrmUserConsum.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"memberStatement数据获取","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					if(opts.page && opts.page > 1){
						setTimeout(function(){
							callback && callback(res);
							
						},0)
					}else{
						setTimeout(function(){
							vm.list = getItemList(res);
							if(vm.list.length<10){
								loadmore.toggleSwitch();
							}
						},0)
					}
				} else {
					_g.toast(res.message);
				}
			},
			error: function(err) {
				_g.hideProgress();
			}
		})
	};
	getData();
	var getItemList = function(res){
		return _.map(res.object,function(item){
			return{
				skuNum:item.amount,
				memony:item.consum_price,
				time:getTime(item.consum_time),
				day:getDay(item.consum_time),
				skuName:item.goods_name,
				skuCode:item.sku_name
			}
		})
	};
	var getTime = function(res){
		if(res){
			var time = res.split(" ");
			var Ndate = time[1].split(":");
			var Ntime = Ndate[0]+":"+Ndate[1];
			return Ntime;
		}
	}
	var getDay = function(res){
		if(res){
			var time = res.split(" ");
			var year = time[0].split("-");
			var Nday = year[1]+"-"+year[2];
			return Nday;
		}
	}
	var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data.object || data.object.length === 0){
                    return loadmore.loadend(false);
                }else{
                    vm.list = vm.list.concat(getItemList(data));
                    loadmore.loadend(true);
                }
            });
        }
    });
    module.exports = {};
});
