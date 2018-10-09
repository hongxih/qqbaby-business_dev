define(function(require, exports, module) {
    var Http = require('U/http');
    var role = require("U/account").getRole();
    var isSeeBuyPrice = true;
    var getStrategy = function(dt){
        var _url='/app/auth/page/ent/getChangePriceSettingSet.do';
        Http.ajax({
            data:{}, 
            url: _url,
            success: function(ret) {
                isSeeBuyPrice = !!ret.object.buy_price_check_set;
                logger.log({"Type":"operation","action":"获取价格策略","Win_name":api.winName,"message":ret,"requireURL":_url})
            },
            error:function(err){
            }
        });
    };
    getStrategy();
    var shopHome = new Vue({
        el: '#shopHome',
        template: _g.getTemplate('shop/home-body-V'),
        data: {
            role1:(_g.getLS('UserInfo').notes=="company_admin")? true:false,
            role:_g.getLS('UserInfo').notes,
            isShow:(_g.getLS('UserInfo').notes=="sales") ? true : false,
            type:1,
        	purchaseList:[
            //     {
            //         isLook:true,
            //         title:'采购订单',
            //         image:'../../image/store/list1.png',
            //         clickMethods:'onPurchaseOrderListTap',
            //     },
            //     {
            //         isLook:true,
            //         title:'采购收货',
            //         image:'../../image/store/list2.png',
            //         clickMethods:'onPurchaseListTap',
            //     },
            //     {
            //         isLook:true,
            //         title:'采购退货',
            //         image:'../../image/store/list3.png',
            //         clickMethods:'onPurchaseReturnListTap',
            //     },
            //     {
            //         isLook:_g.getLS('UserInfo').notes == "company_admin" ? true:false,
            //         title:'调拨单',
            //         image:'../../image/store/list6.png',
            //         clickMethods:'onAllocationListTap',
            //     },
            //     {
            //         isLook:_g.getLS('UserInfo').notes == "company_admin" ? false:true,
            //         title:'调拨入库',
            //         image:'../../image/store/gooscome.png',
            //         clickMethods:'onAllocationStorageTap',
            //     },
            //     {
            //         isLook:_g.getLS('UserInfo').notes == "company_admin" ? false:true,
            //         title:'调拨出库',
            //         image:'../../image/store/goosIn.png',
            //         clickMethods:'onAllocationLibraryTap',
            //     },
            //     // {
            //     //     title:'盘点单',
            //     //     image:'../../image/store/list4.png',
            //     //     clickMethods:'onInventoryCheckListTap',
            //     // },
            //     {
            //         isLook:true,
            //         title:'盘点批号',
            //         image:'../../image/store/list4.png',
            //         clickMethods:'onInventoryCheckListTap',
            //     },
            //     // {
            //     //     isLook:_g.getLS('UserInfo').notes == "company_admin" ? true:false,
            //     //     title:'盘点批号',
            //     //     image:'../../image/store/list4.png',
            //     //     clickMethods:'onInventoryCheckListTapBoss',
            //     // },
            //     {
            //         isLook:true,
            //         title:'库存查询',
            //         image:'../../image/store/list5.png',
            //         clickMethods:'onGoodsCostCheckTap',
            //     },
            //     {
            //         isLook:true,
            //         title:'新客开发列表',
            //         image:'../../image/store/list7.png',
            //         clickMethods:'onGetNewCustom',
            //     },
            // ],
            // tranferList:[
            //     // {
            //     //     title:'调拨单',
            //     //     image:'../../image/store/tranfer-receive.png',
            //     //     clickMethods:''
            //     // },
            //     // {
            //     //     title:'调拨收货',
            //     //     image:'../../image/store/tranfer-receive.png',
            //     //     clickMethods:''
            //     // },
            //     // {
            //     //     title:'调拨发货',
            //     //     image:'../../image/store/tranfer-send.png',
            //     //     clickMethods:''
            //     // },
            // ],
            // stockList:[
            //     {
            //         title:'费用管理',
            //         image:'../../image/store/list11.png',
            //         clickMethods:'onCostAdministrationTap',

            //     },
            //     {
            //         title:'费用图表',
            //         image:'../../image/store/list12.png',
            //         clickMethods:'onCostAdministrationChart'
            //     }


            // ],
            // productList:[
            //     // {
            //     //     title:'商品上架',
            //     //     image:'../../image/store/product-online.png',
            //     //     clickMethods:''
            //     // },
            //     // {
            //     //     title:'商品下架',
            //     //     image:'../../image/store/product-outline.png',
            //     //     clickMethods:''
            //     // },
            // ],
            // shopOrSales:[
            //     {
            //         title:'新客开发列表',
            //         image:'../../image/store/list7.png',
            //         clickMethods:'onGetNewCustom',
            //     },
            ],
        },
        created:function(){
            this.productList = [];
        },
        methods:{
            onSelect:function(i){
                 this.type=i;
            },
        	onPurchaseListTap:function(clickMethods){
                if(clickMethods == 1){
                  _g.openDrawerLayout({
                      header: {
                          data: {
                              title: '采购订单列表',
                            //   ',
                          },
                          template:'../html/header/header-hasScreen-V'
                      },
                      pageParam:{
                          isSeeBuyPrice:isSeeBuyPrice
                      },
                      name: 'shop-purchaseOrderList',
                      url: '../shop/purchaseOrderList.html',
                      rightPane: {
                          name: 'rightPane',
                          url: '../shop/shopSide.html'
                      }
                  });
                }else if(clickMethods == 2){
                    _g.openDrawerLayout({
                        header: {
                            data: {
                                title: '采购收货列表',
                            },
                            template:'../html/header/header-hasScreen-V'
                        },
                        pageParam:{
                            isSeeBuyPrice:isSeeBuyPrice
                        },
                        name: 'shop-purchaseReceiptList',
                        url: '../shop/purchaseReceiptList.html',
                        rightPane: {
                            name: 'rightPane',
                            url: '../shop/shopSide.html'
                        }
                    });
                }else if(clickMethods == 3){
                    _g.openDrawerLayout({
                        header: {
                            data: {
                                title: '采购退货列表',
                            },
                            template:'../html/header/header-hasScreen-V'
                        },
                        pageParam:{
                            isSeeBuyPrice:isSeeBuyPrice
                        },
                        name: 'shop-purchaseReturnList',
                        url: '../shop/purchaseReturnList.html',
                        rightPane: {
                            name: 'rightPane',
                            url: '../shop/shopSide.html'
                        }
                    });
                }else if(clickMethods == 4){
                     _g.openDrawerLayout({
                        header: {
                            data: {
                                title: '调拨入库列表',
                            },
                            template:'../html/header/header-Tbase-V'

                        },
                        pageParam: {

                        },
                        name: 'shop-allocationList',
                        url: '../shop/allocationList.html',
                        rightPane: {
                            name: 'rightPane',
                            url: '../shop/allocationScreenList.html'
                        }
                    })
                }else if(clickMethods == 5){
                     _g.openDrawerLayout({
                        header: {
                            data: {
                                title: '调拨出库列表',
                            },
                            template:'../html/header/header-Tbase-V'

                        },
                        pageParam: {

                        },
                        name: 'shop-allocationList',
                        url: '../shop/allocationList.html',
                        rightPane: {
                            name: 'rightPane',
                            url: '../shop/allocationScreenList.html'
                        }
                    })
                }
                else if(clickMethods == 6){
                    _g.openWin({
                        header:{
                            data:{
                                title:'库存成本查询列表',
                                typeText:'单品',
                                placeholder:'名称/条码/助记码/自编码',
                                isInput:false,
                                searchText:'',
                                isShopIn:true,
                                isAddTargetIn:false
                            },
                            template: '../html/main/scan-header-V'
                        },
                        name:'shop-goodsCostCheck',
                        url:'../shop/goodsCostCheck.html',
                        bounces:false
                    });
                }
                // }else if(clickMethods == 5){
                //     _g.openWin({
                //         header:{
                //             data:{
                //                 title:'商品出入库明细'
                //             }
                //         },
                //         name:'shop-commodityflowquery',
                //         url:'../shop/commodityflowquery.html',
                //     });
                // }
                  else if(clickMethods == 7){
                    _g.openDrawerLayout({
                        header: {
                            data: {
                                title: '盘点批号',
                                isSaler:shopHome.isShow,
                            },
                            template:'../html/header/header-Tbase-V'
                        },
                        pageParam:{
                        },
                        name: 'shop-inventoryCheckBatch',
                        url: '../shop/inventoryCheckBatch.html',
                        rightPane: {
                            name: 'rightPane',
                            url: '../shop/inventorySide.html'
                        }
                    });
                }

                // else if(clickMethods==7){
                //       _g.openDrawerLayout({
                //         header: {
                //             data: {
                //                 title: '盘点批号',

                //             },
                //             template:'../html/header/header-bossTbase-V'
                //         },
                //         pageParam:{
                //         },
                //         name: 'shop-inventoryCheckBatch',
                //         url: '../shop/inventoryCheckBatch.html',
                //         rightPane: {
                //             name: 'rightPane',
                //             url: '../shop/inventorySide.html'
                //         }
                //     });
                // }
                else if(clickMethods == 8){
                    _g.openWin({
                        header:{
                            data:{
                                title:'新客开发列表',
                                noBoss:role
                            },
                            template:'../html/main/home-header-V',
                        },
                        name:'shop-getNewCustom',
                        url:'../shop/getNewCustom.html',
                    });
                }else if(clickMethods == 9){
                     _g.openDrawerLayout({
                        header: {
                            data: {
                                title: '费用管理',
                            },
                            template:'../html/header/header-hasScreen-V'
                        },
                        pageParam: {

                        },
                        name: 'shop-costAdministration',
                        url: '../cost/costAdministration.html',
                        rightPane: {
                            name: 'rightPane',
                            url: '../cost/costScreenList.html'
                        }
                    })

                }else if(clickMethods == 10){
                     _g.openWin({
                        header:{
                            data:{
                                title:"费用图表",
                                 // type:1
                            },
                            // template:'../html/header/header-detailCost',
                        },
                        name:'cost-costChartMain',
                        url:'../cost/costChartMain.html',
                    });

                }
                else if(clickMethods == 11){
                     _g.openDrawerLayout({
                        header: {
                            data: {
                                title: '调拨单列表',
                            },
                            template:'../html/header/header-Tbase-V'

                        },
                        pageParam: {

                        },
                        name: 'shop-allocationList',
                        url: '../shop/allocationList.html',
                        rightPane: {
                            name: 'rightPane',
                            url: '../shop/allocationScreenList.html'
                        }
                    })
                }


            }
        }
    });

    module.exports = {};
});
