define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');
	var vm = new Vue({
		el:'#managerSet',
		template:_g.getTemplate('manager/managerSet-list-V'),
		data:{

		},
		methods:{
			
		},
	});
})