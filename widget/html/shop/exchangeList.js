define(function (require, exports, module) {

    var Http = require('U/http');
    var homeList = new Vue({
        el: '#exchangeList',
        template: _g.getTemplate('shop/exchangeList-body-V'),
        data: {
        	store_name:"门店名称1234"
        },
        methods:{
        	onClick:function(){
        		_g.openWin({
        			header:{
        				data:{
        					title:"添加商品"
        				},
                        template:'../html/header/header-addGoods-V'
        			},
        			name:'shop-exchangeAddGoods',
                    url:'../shop/exchangeAddGoods.html',
                    bounces:false

        		})
        	}
           
        }
    })


})
