define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');
	var role = require('U/account').getRole();
	var vm = new Vue({
		el:'#assistantFunction_clerk',
		template:_g.getTemplate('clerk/assistantFunction_clerk-body-V'),
		data:{
			bonus:"200000",
			total_sale_price:null,
			saleId : null,
			org_id:'',
            sales_id:_g.getLS('UserInfo').user_id,
			item:[
				{
					target_name:"十一月第一阶段目标",
					stage:"进行中",
					target_num:'￥100,000.00',
					target_achievement:"50%",
					time:'2015-05-05至2015-06-05',
					target_type:'全场目标',
					entId : 0
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
                    name: 'clerk-targetManageClerk',
                    url: '../clerk/targetManage_clerk.html',
                    bounces: true,
                    slidBackEnabled: false,
				})
			},
			onAllDetails : function(){
				_g.openDrawerLayout({
                    header:{
                        data:{
                            title:"全部销售明细"
                        },
						template:'../html/header/header-hasScreen-V'
                    },
                    name: "statistics-allDetails",
                    url:"../statistics/allDetails.html",
					pageParam:{
						isAssistantIn:true
					},
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
                    name: 'manager-commission',
                    url: '../manager/managerCommission.html',
                    bounces: false,
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
        			entId : entId
    			},
					bounces: false,
					slidBackEnabled: false,
				})
			},
			onTouchTop:function(){
				_g.openWin({
                    header: {
                            data: {
                                title: _g.getLS('UserInfo').user_name,
                            },
                        },
                    name: 'manager-bonusDetails',
                    url: '../boss/shopDetail.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam:{
                        store_id : this.org_id,
                        sales_id : this.sales_id,
                    }
                })
			}
		}
	});

	var getData = function(opts,callback){
		var opts = opts || {};
		var _data={
				displayRecord : 10,
				page : opts.page || 1,
				goal_manager_status : 'doing',
				goal_rang:null
			};
		var _url='/app/auth/goal/sales/listByStatus.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"店员功能获取信息","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
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
				target_num:item.pre_sales_total_amount ? item.pre_sales_total_amount : 0,
				target_achievement:item.goal_achieved_rate ? item.goal_achieved_rate : 0,
				start_time:item.goal_start_time ? item.goal_start_time.split(' ')[0] : ' '.split(' ')[0],
				end_time:item.goal_end_time ? item.goal_end_time.split(' ')[0] : ' '.split(' ')[0],
				target_type:targetType(item.goal_rang),
				target_code:item.goal_status,
				entId : item.sales_goal_setting_id
			}
		})
	};
	getData();
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
				logger.log({"Type":"operation","action":"店员功能获取提成明细","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
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
				  title: '门店详情',
				  rightText:'门店排行',
				  name: 'targetShop-detail',
				  url: '../assistant/shopDetails_clerk.html'};
			}else if(type == 'allocated' || type == 'cancel'){
			  return {
				  title: '目标详情',
				  rightText:null,
				  name: 'targetShop-targetDetailsClerk',
				  url: '../clerk/targetDetails_clerk.html'};
			}
	};

	var getBonus = function(){
		var _data= {
				max_create_time:new Date().Format('yyyy-MM-dd'),
				min_create_time:new Date().Format('yyyy-MM-dd')
			};
		var _url='/app/auth/kpi/sumSales.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				logger.log({"Type":"operation","action":"店员功能获取营业额","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					vm.bonus = res.object.sales_kpi_price ? res.object.sales_kpi_price : 0;
					vm.saleId = res.object.sales_goal_setting_id
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
		getStaff();
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
