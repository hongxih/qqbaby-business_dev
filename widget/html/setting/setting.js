define(function (require,exports,module) {
	var Http = require('U/http');
	var Account = require('U/account');

	console.log(1);
	var vm = new Vue({
		el:'#setting',
		template:_g.getTemplate('setting/setting-body-V'),
		data:{
            version:'v' + api.appVersion,
            store_name:api.pageParam.storeName ? api.pageParam.storeName : _g.getLS("UserInfo").store_name,
            user_name:_g.getLS("UserInfo").user_name,
		},
		methods:{
			onTapAbout: function(){
                _g.openWin({
                    header: {
                        data: {
                            title: '关于我们'
                        },
                    },
                    name: 'setting-about',
                    url: '../setting/about.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
			},
			onTapSelect: function(){
				api && api.closeWin({
					name:"setting-select-win"
				});
                _g.openWin({
                    header: {
                        data: {
                            title: '选择门店'
                        },
                    },
                    name: 'setting-select',
                    url: '../setting/selectShop.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
			},

			onTapLogout: function(){
				Account.logout();
			},
		},
	});
})
