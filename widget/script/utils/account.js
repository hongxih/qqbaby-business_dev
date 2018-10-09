define(function(require, exports, module) {

	var Http = require('U/http');
	var userInfo = _g.getLS('UserInfo');
    module.exports = {
    	getRole: function(){
    		return this.getMap(userInfo.notes);
    	},
    	getMap: function(name){
    		var map = ['company_admin', 'store_admin', 'sales'];
    		for(var i in map){
    			if(map[i] === name) return i;
    		}
    	},
    	logout: function(){
            var _url='/app/auth/page/fxUser/logout.do';
            Http.ajax({
                url:_url,
                data: {},
                success: function(res){
                    logger.log({"Type":"operation","action":"登录","Win_name":api.winName,"message":res,"requireURL":_url})
                    if(res.success){
						setTimeout(function () {
							_g.clearLS(function (){
								api && api.closeWin({
								    name: 'boss-index-win'
								});
								api && api.closeWin({
								    name: 'manager-index'
								});
								api && api.closeWin({
								    name: 'clerk-index'
								});
								api && api.closeToWin({
		                            name: 'account-login-win'
		                        });
		                       setTimeout(function(){
		                           api && api.openWin({
		                               name: 'account-login-win',
		                               url: '../account/login.html',
		                               bounces: false,
		                               slidBackEnabled: false,
		                           });
		                       },500);
							})
						},500)
                        _g.toast('退出成功!');

                    }else{
                    	_g.toast(res.message);
                    }
                },
            });
    	},
        isLogin: function(){
            return userInfo === undefined ? false : true;
        },
        getUserId: function(){
            return userInfo.user_id;
        },
        getRoleName: function(){
            return userInfo.notes;
        }
    };
});
