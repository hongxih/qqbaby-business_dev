define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');
	var vm = new Vue({
		el:'#assistantFunction',
		template:_g.getTemplate('boss/assistantFunction-body-V'),
		data:{
			bonus:"200000",
			org_id : null,
			total_sale_price:"",
			item:[
				{
					target_name:"十一月第一阶段目标",
					stage:"进行中",
					target_num:'￥100,000.00',
					target_achievement:"50%",
					time:'2015-05-05至2015-06-05',
					target_type:'全场目标',
					enId : 0,
					disOrNot:false
				},
			]
		},
		created:function () {
			this.item = {};
			this.bonus = 0;
		},
		methods:{
			onAllTarget:function () {
				_g.openWin({
					header: {
						data: {
							title: '目标管理',
							rightText:'历史目标',
						}
					},
					name: 'boss-targetManage',
					url: '../boss/targetManage.html',
					bounces: true,
					slidBackEnabled: false,
				})
			},
			onAllDetails:function(){
				_g.openDrawerLayout({
                    header:{
                        data:{
                            title:"全部销售明细"
                        },
                        template:'../html/header/header-hasScreen-V'
                    },
                    name: "statistics-allDetails",
                    url:"../statistics/allDetails.html",
                    rightPane: {
                        name: 'rightPane',
                        url: '../statistics/allDetailsSide.html'
                    }
                });
			},
			onCommission : function(){
				_g.openWin({
					header: {
                        data: {
                            title: '提成',
                        }
                    },
                    name: 'boss-bossCommission',
                    url: '../boss/bossCommission.html',
                    bounces: true,
                    slidBackEnabled: false,
				})

			},
			onTargetShop:function(type,entId){
				var opts = turnToPage(type);
				_g.openWin({
					header: {
						data: {
							title: opts.title,
							rightText:opts.rightText,
						}
					},
					name: opts.name,
					url:  opts.url,
					pageParam: {
        			entId : entId,
					cancel : opts.cancel
    			}
				})
			},
			onTouchBonus : function(){
				_g.openWin({
						header: {
								data: {
										active: 0,
										list:['日', '周', '月'],
										rightText: '店员'
								},
								template: '../html/header/header-date-V',
						},
						name: 'boss-shopRank',
						url: '../boss/shopRank.html',
						bounces: false,
						slidBackEnabled: false,
				});
			}
		}
	});

	var getData = function(opts,callback){
		var opts = opts || {};
		var _data= {
				displayRecord : 10,
				page : opts.page || 1,
				goal_manager_status : 'doing',
				goal_rang:null
			};
		var _url='/app/auth/goal/company/listByStatus.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"获取目标状态","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					if(opts.page && opts.page > 1){
						setTimeout(function(){
							callback && callback(res);
						}, 0);
					}else{
						setTimeout(function(){
							vm.item = getDetail(res);
						},0)
					}
				} else {
					_g.toast(res.message);
				}
			},
			error: function(err) {}
		});
	};
	var getDetail = function(res){
		return _.map(res.object,function(item){
			return{
				target_name:item.goal_name,
				stage:targetStage(item.goal_status),
				target_num:item.pre_ent_total_amount,
				target_achievement:item.goal_achieved_rate,
				start_time:item.goal_start_time.split(' ')[0],
				end_time:item.goal_end_time.split(' ')[0],
				target_type:targetType(item.goal_rang),
				target_code:item.goal_status,
				disOrNot : item.goal_status != 'un_pulish' && item.goal_status != 'un_allocate',
				entId : item.ent_goal_setting_id
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
  var targetStage = function(stage){
       switch (stage){
		   case 'doing':
			   return '进行中';
		   case 'un_pulish':
			   return '未发布';
		   case 'un_allocate':
			   return '待分配';
		   case 'allocated':
			   return '已分配';
		   case 'end':
			   return '已完成';
		   case 'cancel':
			   return '被撤销';
		   default:
			   return '已失效'
	   }
	};
	//boss:未发布（编辑目标）；等待分配，已分配，被撤销（目标详情）；进行中，已完成，已失效（企业排行）;
	//shop:等待分配（编辑目标）;已分配，被撤销（目标详情）；进行中，已完成，已失效（门店详情）;
	//sale:已分配，被撤销（目标详情）；进行中，已完成，已失效（门店详情）;
	var turnToPage = function(type){
		  if(type == 'doing' || type == 'end' || type == 'expired'){
			  return {
				  title: '门店排行',
				  rightText:'店员',
				  name: 'targetShop-rank',
				  url: '../assistant/targetShopRank.html'};
			}else if(type == 'allocated' || type == 'cancel' || type == 'un_allocate'){
				return {
					title: '目标详情',
					rightText:null,
					cancel : type == 'cancel' ? true : null,
					name: 'targetShop-targetDetails',
					url: '../boss/targetDetails.html'};
			}else {
			  return {
				  title: '编辑目标',
				  rightText: '发布',
				  name: 'targetShop-editTarget',
				  url: '../boss/editTarget.html'
			  };
		  }
	};
	var getStaff = function(){
		var date = new Date();
		var min_create_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		var max_create_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		var _data= {
				min_create_time : min_create_time,
				max_create_time:max_create_time,
				sum_type:"Staff"
			};
		var _url='/app/auth/page/retail/sumStaffRetail.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"获取店员信息","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					vm.total_sale_price = res.object.total_sale_price;
				} else {
					_g.toast(res.message);
				}
			},
			error: function(err) {}
		});

	};
	getStaff();
	var getBonus = function(){
		var _data= {
				max_create_time:new Date().Format('yyyy-MM-dd'),
				min_create_time:new Date().Format('yyyy-MM-dd'),
				org_type : 'Company'
			};
		var _url='/app/auth/kpi/sum.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"获取店员营业额","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					vm.bonus = res.object.sum_kpi_price ? res.object.sum_kpi_price : 0
				} else {
					_g.toast(res.message);
				}
			},
			error: function(err) {}
		});

	};
	getBonus();
	
	_g.setPullDownRefresh(function() {
        getData();
        getBonus();
    });

	var loadmore = new Loadmore({
		callback: function(page){
			getData({page: page.page}, function(data){
				if(!data.object || data.object.length === 0){
					return loadmore.loadend(false);
				}else{
					vm.item = vm.item.concat(getDetail(data));
					loadmore.loadend(true);
				}
			});
		}
	});
});
