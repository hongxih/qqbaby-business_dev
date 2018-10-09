define(function(require, exports, module) {

    var order_id = api && api.pageParam.order_id;
    var queryresultdetail = api && api.pageParam.queryresultdetail;
    var isSeeBuyPrice = null;
    // queryresultdetail = {
    //             code: 200,
    //             message: "查询库存成本详情成功",
    //             object: {
    //                 businessAppStockProductVO: {
    //                     product_id: 392,
    //                     product_name: "婴儿低脂奶粉",
    //                     bar_code: "11111111",
    //                     supplier_name: "奶粉供应商",
    //                     category_name: "罐装",
    //                     brand_name: "牛栏奶粉"
    //                 },
    //                 total_stock_amount: 18092,
    //                 storehouseStockVOList: [{
    //                     storehouse_id: 373,
    //                     storehouse_name: "全家",
    //                     storehouse_stock_amount: 6000,
    //                     stockSkuVOList: [{
    //                         sku_name: "1500g",
    //                         sku_own_code: "11111111-3",
    //                         stock_amount: 2000,
    //                         price: 1000,
    //                         stock_price: 2000000
    //                     }]
    //                 },
    //                  {
    //                     storehouse_id: 372,
    //                     storehouse_name: "喜事多",
    //                     storehouse_stock_amount: 12092,
    //                     stockSkuVOList: [{
    //                         sku_name: "1500g",
    //                         sku_own_code: "11111111-3",
    //                         stock_amount: 4000,
    //                         price: 1000,
    //                         stock_price: 4000000
    //                     }]
    //                 }, {
    //                     storehouse_id: 374,
    //                     storehouse_name: "总仓",
    //                     storehouse_stock_amount: 0,
    //                     stockSkuVOList: [{
    //                         sku_name: "1500g",
    //                         sku_own_code: "11111111-3",
    //                         stock_amount: 0,
    //                         price: 1000,
    //                         stock_price: 0
    //                     }]
    //                 }
    //                 ]
    //             },
    //             success: true
    //         };
    var totalStoreHouseNum = 0;

    var Http = require('U/http');

    var queryresultpage = new Vue({
        el: '#queryresultpage',
        template: _g.getTemplate('shop/queryresultpage-detail-V'),
        data: {
        	detail:{
                barCode:'4011101210687',
                productName:'雅培奶粉',
                supplierName:'雅培',
                categoryName:'母婴类',
                brandName:'雅培',
                totalStockAmount:230,
            },
            storeHouseList:[
                {
                    storehouseId:373,
                    storehouseName:'全家',
                    storehouseStockAmount:6000,
                    stockSkuVOList:[
                        {
                            skuName:'1500g',
                            skuOwnCode:'11111111-3',
                            stockAmount:2000,
                            price:1000,
                            stockPrice:2000000,

                        }
                    ]
                }
            ]
        },
        created:function(){
            this.detail = {};
            this.storeHouseList = [];
        },
        methods:{
        	
        }
    });

    checkWin=function(queryresultdetail){
        
        if(order_id){
            getData(order_id);
        }else if(queryresultdetail.object){
            var detail = getVueDetail(queryresultdetail.object);
            queryresultpage.detail = detail;
            queryresultpage.isSeeBuyPrice = isSeeBuyPrice;
            var list = getVueList(queryresultdetail.object);
            queryresultpage.storeHouseList = list;
        }else{
            _g.closeWins(['shop-queryresultpage']);
        }
    }
    var getStrategy = function(dt){
        var _url='/app/auth/page/ent/getChangePriceSettingSet.do';
        Http.ajax({
            data:{},
            url:_url,
            success: function(ret) {
                console.log("lzh 库存查询详情获取价格策略==========", ret);
                logger.log({"Type":"operation","action":"库存查询详情获取价格策略","Win_name":api.winName,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    isSeeBuyPrice = ret.object.buy_price_check_set;
                    setTimeout(function() {
                        if(dt){
                            var detail = getVueDetail(dt);
                            queryresultpage.detail = detail;
                            queryresultpage.isSeeBuyPrice = isSeeBuyPrice;
                            var list = getVueList(dt);
                            queryresultpage.storeHouseList = list;
                        }
                    }, 0);
                } else {
                    _g.toast(ret.message);
                }
            }
        });
    }
    var getData = function(order_id){
        var _data= {
                product_id: Number(order_id)
            };
        var _url='/app/auth/page/erp/stockDetail.do';
        Http.ajax({
            data:_data,
            url:_url,
            success: function(ret) {
                console.log("lzh 库存查询详情获取数据========", ret);
               logger.log({"Type":"operation","action":"库存查询详情获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {

                    var dt = ret.object;

                    getStrategy(dt);

                } else {

                    _g.toast(ret.message);

                }

            },

            error: function(err) {},
        });
    }

    getVueDetail = function(result){
        return {
            barCode:result.businessAppStockProductVO?result.businessAppStockProductVO.bar_code:'',
            productName:result.businessAppStockProductVO?result.businessAppStockProductVO.product_name:'',
            supplierName:result.businessAppStockProductVO?result.businessAppStockProductVO.supplier_name:'',
            categoryName:result.businessAppStockProductVO?result.businessAppStockProductVO.category_name:'',
            brandName:result.businessAppStockProductVO?result.businessAppStockProductVO.brand_name:'',
            totalStockAmount:result?result.total_stock_amount:0,
            deposit_amount: result?result.total_deposit_amount : 0,
        }
    }
    getVueList = function(result){
        var list = result.storehouseStockVOList?result.storehouseStockVOList:[];
        return _.map(list,function(item){
            return {
                storehouseId:item?item.storehouse_id:'',
                storehouseName:item?item.storehouse_name:'',
                storehouseStockAmount:item?item.storehouse_stock_amount:0,
                stockSkuVOList:_.map(item.stockSkuVOList,function(goods){
                    return {
                        skuName:goods?goods.sku_name:'',
                        skuOwnCode:goods?goods.sku_own_code:'',
                        stockAmount:goods?goods.stock_amount:0,
                        price:goods?goods.price:0,
                        stockPrice:goods?goods.stock_price:0,
                        retail_price:goods?goods.retail_price:0,
                        total_retail_price:goods?goods.total_retail_price:0,
                        deposit_amount: goods ? goods.deposit_amount : 0,
                    }
                })
            }
        });
    }

    checkWin(queryresultdetail);

    // getData(order_id);

    module.exports = {};
});
