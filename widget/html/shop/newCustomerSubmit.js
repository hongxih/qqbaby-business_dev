define(function (require,exports,module) {
	var Http = require("U/http");
	var role = require("U/account").getRole();
	var vm = new Vue({
		el:'#newCustomerSubmit',
		template:_g.getTemplate('shop/newCustomerSubmit-list-V'),
		data:{
			phone:'',
			name:'',
			order_no:''
		},
		created:function () {

		},
		methods:{
			onSubmit:function(){
				var _data= {
							cumstomer_name:vm.name,
							cumstomer_phone:vm.phone,
							order_no:vm.order_no
						};
				var _url='/app/auth/cumstomer/submit.do';
				switch (this.onCheck()){
					case 0 :
						_g.toast('请填写手机号');
						break;
					case 1 :
						_g.toast('请输入正确手机号码');
						break;
					case 2 :
						_g.toast('请填写姓名');
						break;
					default :
					 _g.confirm("确认提交？","是否确认提交",function () {
					 	Http.ajax({
							data:_data,
							api_versions: 'v2',
							url:_url,
							success: function(res) {
								logger.log({"Type":"operation","action":"新客开发提交","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
								if (res.code == 200) {
									api && api.sendEvent({
										name: 'reload-newCustom'
									});
									api && api.closeWin();
								} else {
									_g.toast(res.message);
								}
							},
							error: function(err) {},
						});
					 });
					break;
				}
			},
			onCheck:function(){
				var phone = vm.phone.trim();
				var len = phone.length;
				var nameLen = vm.name.trim().length;
				if(len == 0) return 0;
				if(len != 11 || phone.charAt(0) != 1) return 1;
				if(nameLen == 0) return 2;
				return 3;
			}
		}
	})

	module.exports = {};
})