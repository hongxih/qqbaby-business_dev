/**
 * [description] 极光推送初始化
 * @author libinpeng
 * @version v1.0
 */
define(function(require, exports, module) {
    var Account = require('U/account');
    var Http = require('U/http');
    module.exports = {
    	ajpush: api.require && api.require('ajpush'),
    	init: function(){
    		var self = this;	
    		if(!Account.isLogin()) return;
    		if(_g.isAndroid){
    			self.ajpush.init(function(ret){
                    logger.log({"Type":"operation","action":"极光推送初始化","Win_name":api.winName,"data":ret.status});
    				if(ret && ret.status){
    					self.listen();
                        self.click();
    				}
    			});
    		}else{
    			self.listen();	
                self.click();
    		}
            self.ajpush.resumePush(function(ret){
                // alert('resumePush:' + ret.status);
            });
    	},
    	listen: function(){
    		var self = this;
    		var param = {
    			alias: window.APPMODE + '_' + Account.getUserId(),
    			tags: [Account.getRoleName()]
    		};
    		self.ajpush.bindAliasAndTags(param, function(ret, err){
                // alert(JSON.stringify(param));
    			self.ajpush.setListener(function(ret){
                    //推送消息广播事件
                   	api.sendEvent && api.sendEvent({
                        name: 'ajpushMessage'
                    });
                    
    			});
      //           self.ajpush.getRegistrationId(function(ret) {
      //                   alert(ret.id);
      //               });
    		});
    	},
        click:function(){
            if(_g.isAndroid){
                api.addEventListener({
                    name: 'appintent'
                }, function(ret, err) {
                    if(ret  && ret.appParam.ajpush){
                        var ajpush = ret.appParam.ajpush;
                        skip(ajpush.extra);
                        setTimeout(function(){
                           reflesh(ajpush.extra.msg_info_id);
                        },0);
                    }
                  logger.log({"Type":"operation","action":"Andriod点击信息","Win_name":api.winName,"data":JSON.stringify(ret)});
                });    
            }else if(_g.isIOS){
                api.addEventListener({
                    name: 'noticeclicked'
                }, function(ret, err) {
                    if (ret && ret.value) {
                        var ajpush = ret.value;
                        skip(ajpush.extra);
                        setTimeout(function(){
                           reflesh(ajpush.extra.msg_info_id);
                        },0);
                    }
                    logger.log({"Type":"operation","action":"IOS点击信息","Win_name":api.winName,"data":JSON.stringify(ret)});
                });
            }
        
        }
    };
    var reflesh =function(msg_id){
        var _data= {
                app_msg_log_id:msg_id,
            };
        var _url='/app/auth/message/updateReadStatus.do';
         Http.ajax({
            url:_url,
            data:_data,
            api_versions: 'v2',
            success: function(res){
                logger.log({"Type":"operation","action":"极光推送更新信息状态","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    api && api.sendEvent({
                        name: 'refresh-messageCenter',
                    });
                    return;
                }else{
                    _g.toast(res.message);
                }
            },
            error: function(){ }
        })
     };
    var skip=function(object){
        if(object.msg_role_type == 'company_admin' && object.msg_type == 'goal'){
            var opts = turnToPageBoss(object.msg_status);
            _g.openWin1({
                    header: {
                        data: {
                            title: opts.title,
                            rightText:opts.rightText,
                        }
                    },
                    name: opts.name,
                    url:  opts.url,
                    pageParam: {
                        entId : object.msg_id,
                        cancel : opts.cancel
                    },
                    bounces: false,
                    slidBackEnabled: false,
                });
        }else if(object.msg_role_type == 'store_admin' && object.msg_type == 'goal'){
            var opts = turnToPageManager(object.msg_status);
            _g.openWin1({
                    header: {
                        data: {
                            title: opts.title,
                            rightText:opts.rightText,
                        }
                    },
                    name: opts.name,
                    url:  opts.url,
                    pageParam: {
                        entId : object.msg_id,
                        cancel : opts.cancel
                    },
                    bounces: false,
                    slidBackEnabled: false,
                })
        }else if(object.msg_role_type == 'sales' && object.msg_type == 'goal'){
            var opts = turnToPageClerk(object.msg_status);
            _g.openWin1({
                header: {
                    data: {
                        title: opts.title,
                        rightText:opts.rightText,
                    }
                },
                name: opts.name,
                url:  opts.url,
                pageParam: {
                    entId : object.msg_id
                },
                bounces: false,
                slidBackEnabled: false,
            })
        }else if(object.msg_role_type == 'company_admin' && object.msg_type == 'care'){
            _g.openWin1({
                header: {
                    data: {
                        title: '主题关怀',
                    }
                },
                name: 'boss-bossTheme',
                url: '../../html/boss/bossTheme.html',
                bounces: false,
                slidBackEnabled: false,
            });
        }else if(object.msg_role_type == 'store_admin' && object.msg_type == 'care'){
            _g.openWin1({
                header: {
                    data: {
                        title: '主题关怀',
                    }
                },
                name: 'member-theme',
                url: '../../html/manager/managerTheme.html',
                bounces: false,
                slidBackEnabled: false,
            });
        }else if(object.msg_role_type == 'sales' && object.msg_type == 'care'){
            _g.openWin1({
                header: {
                    data: {
                        title: '主题关怀',
                    }
                },
                name: 'clerk-clerkTheme',
                url: '../../html/clerk/clerkTheme.html',
                bounces: false,
                slidBackEnabled: false,
            });
        }
    };
     var turnToPageBoss = function(type){
        if(type == 'doing' || type == 'end' || type == 'expired'){
            return {
                title: '门店排行',
                rightText:'店员',
                name: 'targetShop-rank',
                url: '../../html/assistant/targetShopRank.html'};
        }else if(type == 'allocated' || type == 'cancel' || type == 'un_allocate'){
            return {
                title: '目标详情',
                rightText:null,
                name: 'targetShop-targetDetails',
                url: '../../html/boss/targetDetails.html'};
        }else {
            return {
                title: '编辑目标',
                rightText: '发布',
                name: 'targetShop-editTarget',
                url: '../../html/boss/editTarget.html'
            };
        }
    };
    var turnToPageManager = function(type){
        if(type == 'doing' || type == 'end' || type == 'expired'){
            return {
                title: '门店详情',
                rightText:'门店排行',
                name: 'targetShop-detail',
                url: '../../html/assistant/shopDetails.html'};
        }else if(type == 'allocated' || type == 'cancel'){
            return {
                title: '目标详情',
                rightText:null,
                name: 'targetShop-targetDetailsManager',
                cancel : type == 'cancel' ? true : null,
                url: '../../html/manager/targetDetails_manager.html'};
        }else{
            return {
                title: '编辑目标',
                rightText:null,
                name: 'targetShop-editTargetManager',
                url: '../../html/manager/editTarget_manager.html'};
        }
    };

    var turnToPageClerk = function(type){
        if(type == 'doing' || type == 'end' || type == 'expired'){
            return {
                title: '门店详情',
                rightText:'门店排行',
                name: 'targetShop-detail',
                url: '../../html/assistant/shopDetails_clerk.html'};
        }else if(type == 'allocated' || type == 'cancel'){
            return {
                title: '目标详情',
                rightText:null,
                name: 'targetShop-targetDetailsClerk',
                url: '../../html/clerk/targetDetails_clerk.html'};
        }
    };
});


