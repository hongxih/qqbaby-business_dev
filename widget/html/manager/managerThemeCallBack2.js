define(function (require,exports,module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');	
	var vm = new Vue({
		el:'#managerThemeCallBack2',
		template:_g.getTemplate('manager/managerThemeCallBack2-body-V'),
		data:{
			list:[
				{
					hasRecall:true,
					pName:'店长',
					recallF7:'120',
					lastTime:'02-08 15:33'
				},
				{
					hasRecall:false,
					pName:'店长',
					recallF7:'0',
					lastTime:'02-08 15:33'
				},
			]
		},
		created: function(){
          
        },
        watch: {
          
        },
        filters: {
           
        },
        methods: {
        	
        }

	});
	module.exports = {};
});
