define(function (require,exports,module) {
	var Http = require('U/http');
	var vm = new Vue({
		el:'#messageCenter',
		template:_g.getTemplate('assistant/messageCenter-body-V'),
		data:{
			// isRead:true,
			role:_g.getLS('UserInfo').notes,
			noResult:false,
			list:[
			{
				title:'大单提醒',
				message:'黄金家园有张新的大单',
				create_time:'2018-14-01 00:00:00',
			},
			{
				title:'大单提醒',
				message:'黄金家园有张新的大单',
				create_time:'2018-14-01 00:00:00',
			},
			{
				title:'目标提醒',
				message:'目标有了一个新的状态：已分配',
				create_time:'2018-14-01 00:00:00',
			},
			],
		},
		created:function () {
			this.list = {};
		},
		methods:{
			onItemTap : function(type,entId,msgId,msgType){
				var _url='/app/auth/message/updateReadStatus.do';
				var _data={
		                app_msg_log_id:msgId,
		            };
				Http.ajax({
		            url:_url,
		            data:_data,
		           	api_versions: 'v2',
		            success: function(res){
		               logger.log({"Type":"operation","action":"更新信息读取状态","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
		                if(res.success){
							api && api.sendEvent({
			                	name: 'refresh-messageCenter',
			                });
		                    return;
		                }else{
		                    console.log(res);
		                    _g.toast(res.message);
		                }
		            },
		            error: function(){ }
		        })
		    	if(this.role == 'company_admin' && msgType == 'goal'){
		    		var opts = turnToPageBoss(type);
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
							},
							bounces: false,
							slidBackEnabled: false,
						});
		    	}else if(this.role == 'store_admin' && msgType == 'goal'){
		    		var opts = turnToPageManager(type);
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
							},
							bounces: false,
							slidBackEnabled: false,
						})
		    	}else if(this.role == 'sales' && msgType == 'goal'){
		    		var opts = turnToPageClerk(type);
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
		    	}else if(this.role == 'company_admin' && msgType == 'care'){
	                _g.openWin({
	                    header: {
	                        data: {
	                            title: '主题关怀',
	                        }
	                    },
	                    name: 'boss-bossTheme',
	                    url: '../boss/bossTheme.html',
	                    bounces: false,
	                    slidBackEnabled: false,
	                });
		    	}else if(this.role == 'store_admin' && msgType == 'care'){
		    		_g.openWin({
	                    header: {
	                        data: {
	                            title: '主题关怀',
	                        }
	                    },
	                    name: 'member-theme',
	                    url: '../manager/managerTheme.html',
	                    bounces: false,
	                    slidBackEnabled: false,
	                });
		    	}else if(this.role == 'sales' && msgType == 'care'){
		    		_g.openWin({
	                    header: {
	                        data: {
	                            title: '主题关怀',
	                        }
	                    },
	                    name: 'clerk-clerkTheme',
	                    url: '../clerk/clerkTheme.html',
	                    bounces: false,
	                    slidBackEnabled: false,
	                });
		    	}
		    }
		},
	});
	var getData = function (opts,callback) {
		var opts = opts || {};
		var _data= {
				displayRecord:10,
				page:opts.page || 1,
			};
		var _url='/app/auth/message/list.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function(res) {
				 logger.log({"Type":"operation","action":"获取未审核信息","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
					if (res.code == 200) {
						if(opts.page && opts.page > 1){
							setTimeout(function(){
								callback && callback(res)
							},0)
						}else{
							  if(res.object){
                                 vm.noResult=false;
							  }else{
			                      vm.noResult=true;
							  }
							vm.list = res.object;
							_.map(vm.list,function (item) {
								console.log(item);
							})
						}
					} else {
							_g.toast(res.message);
					}
			},
			error: function(err) {}
		});
	};
	getData();
	var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data.object || data.object.length === 0){
                    return loadmore.loadend(false);
                }else{
                    vm.list = vm.list.concat(data.object);
                    loadmore.loadend(true);
                }
            });
        }
    });
    window.app = vm;

    var turnToPageBoss = function(type){
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

	var turnToPageManager = function(type){
		if(type == 'doing' || type == 'end' || type == 'expired'){
			return {
				title: '门店详情',
				rightText:'门店排行',
				name: 'targetShop-detail',
				url: '../assistant/shopDetails.html'};
		}else if(type == 'allocated' || type == 'cancel'){
			return {
				title: '目标详情',
				rightText:null,
				name: 'targetShop-targetDetailsManager',
				cancel : type == 'cancel' ? true : null,
				url: '../manager/targetDetails_manager.html'};
		}else{
			return {
				title: '编辑目标',
				rightText:null,
				name: 'targetShop-editTargetManager',
				url: '../manager/editTarget_manager.html'};
		}
	};

	var turnToPageClerk = function(type){
		if(type == 'doing' || type == 'end' || type == 'expired'){
			return {
				title: '门店详情',
				rightText:'门店排行',
				name: 'targetShop-detail',
				url: '../assistant/shopDetails_clerk.html'};
		}else if(type == 'allocated' || type == 'cancel' || type == "un_allocate"){
			return {
				title: '目标详情',
				rightText:null,
				name: 'targetShop-targetDetailsClerk',
				url: '../clerk/targetDetails_clerk.html'};
		}else{
			return {
				title: '目标详情',
				rightText:null,
				name: 'targetShop-targetDetailsClerk',
				url: '../clerk/targetDetails_clerk.html'};
		}
	};

	_g.setPullDownRefresh(function () {
		setTimeout(function () {
			getData();
			loadmore.reset();
		},0)
	})

  //   api && api.addEventListener({
  //       name: 'keyback'
  //      }, function(ret, err) {
  //      	setTimeout(function () {
		// 	getData();
		// 	loadmore.reset();
		// },0)
  //   });

	api.addEventListener({
	    name: 'refresh-messageCenter'
	}, function(ret, err) {
		setTimeout(function () {
			getData();
			loadmore.reset();
		},0)
	});

})
