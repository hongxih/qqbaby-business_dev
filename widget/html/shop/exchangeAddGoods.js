define(function (require, exports, module) {
   
    var Http = require('U/http');
    var type = api.pageParam.type;
    var homeList = new Vue({
        el: '#exchangeAddGoods',
        template: _g.getTemplate('shop/exchangeAddGoods-body-V'),
        data: {
            isShow:false,
            isType:type,
        	list:{               
        		strore_name:"门店名称1234",
        		repository_name:"仓库名称1234",
        		exchange_total_count:"2,000",
        		goods_variety:"2",
        		exchange_code:"12672648732856",
        		remark:"备注内容1234"

        	},
        	items:[
        		{
                    isShow:(type==1||type==4)?true:false,
            		goods_name:"商品名称商品名称",
            		goods_standard:"规格1；规格2",
            		cost_price:"1,234.00",
            		retail_price:"1,234.00"
        		},
        		{
                    isShow:(type==1||type==4)?true:false,
            		goods_name:"商品名称商品名称",
            		goods_standard:"规格1；规格2",
            		cost_price:"1,234.00",
            		retail_price:"1,234.00"
        		},
        		{
                    isShow:(type==1||type==4)?true:false,
            		goods_name:"商品名称商品名称",
            		goods_standard:"规格1；规格2",
            		cost_price:"1,234.00",
            		retail_price:"1,234.00"
        		}
        	]
        	
        },
        methods: {
            onItemClick:function(idx){
                if(this.items[idx].isShow==false){
                    this.items[idx].isShow = true;
                }else{
                    this.items[idx].isShow = false;
                }
            }
        },
        created:function(){
            items:""
        }
    })

   
    api.addEventListener && api.addEventListener({
        name: 'search-input'
    }, function (ret, err) {
        homeList.msg=ret.value.searchInput||"";
        
    })
})

