/**
 * [description] 所有头部的事件响应都在这里定义
 * @author libinpeng
 * @version v1.0
 */
define(function(require, exports, module) {
    var showMenu = require('U/showMenu');
    var FNScanner = require('U/scanner');
    function Func() {
        this['shop-purchaseOrderDetail'] = {
            onTapLeftBtn: function() {
                api && api.sendEvent({
                    name: 'refresh-purchaseOrderList'
                });
                api && api.closeWin();
            },
            onTapRightBtn:function () {
                api && api.sendEvent({
                    name: 'share-purchaseOrder'
                });
            }
        },
        this['shop-shortcutmenu'] = {
            onTapLeftBtn: function() {
                api && api.sendEvent({
                    name:'save-homeMenuShow',
                    extra:{
                        closeType:'this'
                    }
                });
            },
            onMenuDraggingTapRightBtn: function() {
                api && api.sendEvent({
                    name:'save-homeMenuShow',
                    extra:{
                        closeType:'none',
                    }
                });
            }
        },
        this['shop-commodityflowqueryGoodsList'] = {
            onSearchInput: function() {
                this.isSearchInput = true;
                this.isText = true;
                if (this.searchText == '') {
                    this.isSearchInput = false;
                    this.isText = false;
                }
            },
            onSearchClearTap: function() {
                this.searchText = '';
                this.isText = false;
                this.isSearchInput = false;
            },
            onEnter: function() {
                api && api.sendEvent({
                    name: 'refresh-commodityflowqueryGoodsList',
                    extra: {
                        query_name: this.searchText,
                        storehouse_id: this.storehouseId
                    }
                });
            },
            onTapRightBtn: function(item) {
                if (item == 'scan') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '二维码·条码',
                            }
                        },
                        name: 'scan-index',
                        url: '../scan/index.html',
                        bounces: false,
                        pageParam: {
                            win_name: api.winName,
                            storehouseId: this.storehouseId
                        }
                    });
                } else if (item == 'text') {
                    api && api.sendEvent({
                        name: 'refresh-commodityflowqueryGoodsList',
                        extra: {
                            query_name: this.searchText,
                            storehouse_id: this.storehouseId
                        }
                    });
                }
            }
        },
        this['shop-goodsCostCheck'] = {
            onScanTapRightBtn: function() {
                // _g.openWin({
                //     header: {
                //         data: {
                //             title: '二维码·条码',
                //         }
                //     },
                //     name: 'scan-index',
                //     url: '../scan/index.html',
                //     bounces: false,
                //     pageParam: {
                //         win_name: api.winName
                //     }
                // });
                api && api.sendEvent({
                    name: 'shop-goodsCostCheck-openScanner',
                });

            },
            onChangeType:function () {
                var self = this;
                showMenu.showMenu(
                    [{
                    title: '单品',
                    icon: 'widget://image/store/costCheck01.png'
                }, {
                    title: '分类',
                    icon: 'widget://image/store/costCheck02.png'
                }, {
                    title: '品牌',
                    icon: 'widget://image/store/costCheck03.png'
                }, {
                    title: '供应商',
                    icon: 'widget://image/store/costCheck04.png'
                }],function (ret){
                    var options = [
                        { selected: 1, value: '单品',type:1 },
                        { selected: 0, value: '分类',type:2 },
                        { selected: 0, value: '品牌',type:3 },
                        { selected: 0, value: '供应商',type:4}
                    ];
                    self.typeText = options[ret.index].value;
                    switch (ret.index){
                        case 0:
                            self.placeholder = '名称/条码/助记码/自编码';
                            break;
                        case 1:
                            self.placeholder = '分类名';
                            break;
                        case 2:
                            self.placeholder = '品牌名';
                            break;
                        default:
                            self.placeholder = '供应商名';
                            break;
                    }
                    api && api.sendEvent({
                        name: 'shop-goodsCostCheck-type',
                        extra: {
                            searchText: self.searchText,
                            type:options[ret.index].type
                        }
                    });
                });

            },
            onInputSearchTap:function(){
                this.isInput = true;
            },
            onClearTextTap:function(){
                this.searchText = '';
                this.isInput = false;
            },
            search:function (){
                api.sendEvent && api.sendEvent({
                    name: 'shop-goodsCostCheck-search',
                    extra: {
                        searchText: this.searchText
                    }
                })
            }
        },
        this['shop-inventoryCheckeditorSearch'] = {
            onSearchInput: function() {
                this.isText = true;
                this.isSearchInput = true;
                if (this.searchText == '') {
                    this.isText = false;
                    this.isSearchInput = false;
                }
            },
            onSearchClearTap: function() {
                this.searchText = '';
                this.isSearchInput = false;
                this.isText = false;
            },
            // onSearchBlur: function() {
            //     api && api.sendEvent({
            //         name: 'shop-inventoryCheckeditorSearch',
            //         extra: {
            //             searchText: this.searchText
            //         }
            //     });
            // },
            onTapRightBtn: function(item) {

                if (item == 'scan') {
                    _g.openWin({
                        header: {
                            data: {
                                title: '二维码·条码',
                            }
                        },
                        name: 'scan-index',
                        url: '../scan/index.html',
                        bounces: false,
                        pageParam: {
                            storehouseId: this.storehouseId,
                            win_name: api.winName
                        }
                    });
                } else if (item == 'text') {
                    api && api.sendEvent({
                        name: 'shop-inventoryCheckeditorSearch',
                        extra: {
                            searchText: this.searchText
                        }
                    });
                }
            }
        },
        this['shop-inventorychecklist'] = {
            onTapLeftBtn:function(){
                api && api.closeWin();
                api && api.sendEvent({
                    name:'shop-inventorychecklist-refresh'
                });
            },
            onAddRightBtnTap: function() {
                // _g.openWin({
                //     header: {
                //         data: {
                //             title: '新增盘点单',
                //         }
                //     },
                //     name: 'shop-inventorycheck',
                //     url: '../shop/inventorycheck.html',
                //     bounces: false,
                //     slidBackEnabled: false,
                // });
                api.sendEvent && api.sendEvent({
                    name:"shop-addInventoryCheck__add"
                });

            }
        },
        this['index-classify'] = {
            onTagTap: function(index) {
                if (this.activeIndex == index) return;
                this.activeIndex = index;
                api && api.sendEvent({
                    name: 'index-classify-tagChange',
                    extra: {
                        activeIndex: index
                    }
                });
            },
            onTapRightBtn: function() {
                _g.openWin({
                    header: {
                        template: 'common/header-search-V',
                        data: {
                            isSearchInput: false,
                            searchText: ''
                        }
                    },
                    name: 'index-search',
                    url: '../index/search.html',
                });
            }
        };
        this['index-search'] = {
            onSearchInput: function() {
                this.isSearchInput = !!this.searchText;
                if (!this.isSearchInput) return;
                api && api.sendEvent({
                    name: 'index-search-nameList',
                    extra: {
                        goods_name: this.searchText
                    }
                });
            },
            onSearchClearTap: function() {
                this.searchText = '';
                this.isSearchInput = false;
            },
            onTapRightBtn: function() {
                if (!this.isSearchInput) return;
                api && api.sendEvent({
                    name: 'index-search-search',
                    extra: {
                        goods_name: this.searchText
                    }
                });
            }
        };
        this['search-result'] = {
            onSearchKeyup: function() {
                if (!this.isSearchInput) return;
                api && api.sendEvent({
                    name: 'search-result-newSearch',
                    extra: {
                        goods_name: this.searchText
                    }
                });
            },
            onSearchInput: function() {
                this.isSearchInput = !!this.searchText;
                if (!this.isSearchInput) return;
            },
            onSearchFocus: function() {
                // api && api.closeWin();
                _g.openWin({
                    header: {
                        template: 'common/header-search-V',
                        data: {
                            isSearchInput: false,
                            searchText: ''
                        }
                    },
                    name: 'index-search',
                    url: '../index/search.html',
                });
            },
            onSearchClearTap: function() {
                this.searchText = '';
                this.isSearchInput = false;
            },
            onTapRightBtn: function() {
                if (this.listType == 'is-line') {
                    this.listType = 'is-column';
                } else if (this.listType == 'is-column') {
                    this.listType = 'is-line';
                }
                api && api.sendEvent({
                    name: 'search-result-listType-change',
                    extra: {
                        listType: this.listType
                    }
                });
            },
            onPriceTap: function() {
                this.byCount = false;
                this.byPopular = false;
                var sort_price = '';
                if (this.byPrice == 0) {
                    // 在默认价格排序下点击, 触发按低到高排
                    this.byPrice = 1;
                    sort_price = 'asc';
                } else if (this.byPrice == 1) {
                    // 在按低到高排序下点击, 触发按高到低排
                    this.byPrice = 2;
                    sort_price = 'desc';
                } else if (this.byPrice == 2) {
                    // 在按高到低排序下点击, 触发按低到高排
                    this.byPrice = 1;
                    sort_price = 'asc';
                }

                api && api.sendEvent({
                    name: 'search-result-newSearch-byType',
                    extra: {
                        type: {
                            sort_price: sort_price
                        }
                    }
                });
            },
            onCountTap: function() {
                this.byPrice = 0;
                this.byCount = !this.byCount;
                this.byPopular = false;

                api && api.sendEvent({
                    name: 'search-result-newSearch-byType',
                    extra: {
                        type: {
                            sort_sales: this.byCount ? 'desc' : 'asc'
                        }
                    }
                });
            },
            onPopularTap: function() {
                this.byPrice = 0;
                this.byCount = false;
                this.byPopular = !this.byPopular;

                api && api.sendEvent({
                    name: 'search-result-newSearch-byType',
                    extra: {
                        type: {
                            sort_collect: this.byPopular ? 'desc' : 'asc'
                        }
                    }
                });
            },
        };
        this['cart-addAddress'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'cart-addAddress-save',
                });
                return
                api && api.execScript({
                    name: api.winName,
                    frameName: 'cart-addAddress-frame',
                    script: 'onSaveBtnTap();'
                });
            }
        };
        this['cart-index-page'] = {
            onEditTap: function() {
                if (this.isEdit) {
                    this.rightText = '编辑';
                    this.isEdit = false;
                    api.sendEvent({
                        name: api.winName + 'cart-index-edit-finish',
                    });
                } else {
                    this.rightText = '完成';
                    this.isEdit = true;
                    api.sendEvent({
                        name: api.winName + 'cart-index-edit',
                    });
                }
            }
        };
        this['me-myInfo'] = {
            onTapRightBtn: function() {
                api && api.execScript({
                    name: api.winName,
                    frameName: 'me-myInfo-frame',
                    script: 'onSaveBtnTap();'
                });
            }
        };
        this['me-myCollection'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'me-myCollection-edit'
                });
            }
        };
        this['me-browseHistory'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'me-browseHistory-edit'
                });
            }
        };
        this['order-index'] = {
            onTitleTap: function() {
                api && api.sendEvent({
                    name: api.winName + '-other-order'
                })
            },
            onItemTap: function(index) {
                if (this.active == index) return;
                this.active = index;
                api && api.sendEvent({
                    name: 'order-index-change-type',
                    extra: {
                        tag: this.list[index].tag
                    }
                });
            }
        };
        this['setting-editAddress2'] = {
            onTapRightBtn: function() {
                api && api.execScript({
                    name: api.winName,
                    frameName: 'setting-editAddress2-frame',
                    script: 'onSaveTap();'
                });
            }
        };
        this['order-address'] = {
            onTapRightBtn: function() {
                api && api.execScript({
                    name: api.winName,
                    frameName: 'order-address-frame',
                    script: 'onEditTap();'
                });
            }
        };
        this['cart-transport'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: api.winName + '-cart-transport-save'
                })
            }
        };
        this['cart-payway'] = {
            onTapLeftBtn: function() {
                api.confirm({
                    title: '确认暂不支付吗?',
                    msg: '订单保留1个小时后将自动取消,\n请尽快完成支付',
                    buttons: ['继续支付', '暂不支付']
                }, function(ret, err) {
                    if (ret.buttonIndex == 2) {
                        api && api.closeWin();
                    }
                });
            }
        };
        this['me-NewMemberApplication'] = {
            onAddRightBtnTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '新客户开发申请',
                        },
                    },
                    name: 'me-NewMemberApply',
                    url: '../me/NewMemberApply.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }
        };
        this['shop-getNewCustom'] = {
            onAddRightBtnTap:function () {
               _g.openWin({
                header:{
                    data:{
                        title:"提交新客开发",
                    },
                },
                name:"shop-newCustomerSubmit",
                bounces:false,
                url:'../shop/newCustomerSubmit.html',
               });
            },
        };
        this['statistics-weekturnover'] = {
            onTapRightBtn: function(){
                _g.openWin({
                    header: {
                        data: {
                            title: '维度筛选',
                            typeText:'分类',
                            placeholder:'请输入内容',
                            isInput:false,
                            isShopIn:false,
                            isAddTargetIn:false
                        },
                        template: '../html/main/scan-header-V'
                    },
                    name: 'statistics-dimensionFilter',
                    bounces: false,
                    url: '../statistics/dimensionFilter.html',
                });
            },
            onItemTap: function(index){
                if(this.active == index) return;
                this.active = index;
                api.sendEvent && api.sendEvent({
                    name: 'toggleDate',
                    extra: {
                        type: index
                    }
                });
            }
        };
        this['assistant-targetFilter']={
            onChangeType:function () {
                return
                /*var self = this;
                showMenu.showMenu(
                    [{
                        title: '分类',
                        icon: 'widget://image/store/costCheck02.png'
                    }, {
                        title: '单品',
                        icon: 'widget://image/store/costCheck01.png'
                    }, {
                        title: '品牌',
                        icon: 'widget://image/store/costCheck03.png'
                    }],function (ret){
                        var options = [
                            { selected: 1, value: '分类',type:0 },
                            { selected: 0, value: '单品',type:1 },
                            { selected: 0, value: '品牌',type:2 }
                        ];
                        self.typeText = options[ret.index].value;
                        switch (ret.index){
                            case 0:
                                self.placeholder = '分类名';
                                break;
                            case 1:
                                self.placeholder = '单品名';
                                break;
                            case 2:
                                self.placeholder = '品牌名';
                                break;
                        }
                        api && api.sendEvent({
                            name: 'assistant-targetFilter-type',
                            extra: {
                                searchText: self.searchText,
                                index:options[ret.index].type
                            }
                        });
                    });*/

            },
            onInputSearchTap:function(){
                this.isInput = true;
            },
            onClearTextTap:function(){
                this.searchText = '';
                this.isInput = false;
            },
            search:function (){
                api.sendEvent && api.sendEvent({
                    name: 'assistant-targetFilter-search',
                    extra: {
                        searchText: this.searchText
                    }
                })
            }
        };
        this['statistics-allDetails'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'drawOutSearchSide',
                });
            }
        }
        this['statistics-filterResult'] = {
            onItemTap: function(index){
                if(this.active == index) return;
                this.active = index;
                api.sendEvent && api.sendEvent({
                    name: 'changeDate',
                    extra: {
                        type: index
                    }
                });
            }
        };
        this['manager-managerBonus'] = {

            onItemTap:function (index) {
                if(this.active == index) return;
                this.active = index;
                api.sendEvent && api.sendEvent({
                    name: 'changeTime',
                    extra: {
                        type: index
                    }
                });
            }
        };
        this['statistics-bossWeekturnover'] = {
            // onTapLeftBtn:function(){
            //     api.sendEvent && api.sendEvent({
            //         name:'renewSelect',
            //     });
            // },
            onTapRightBtn: function(){
                _g.openWin({
                    header: {
                        data: {
                            title: '维度筛选',
                            typeText:'分类',
                            placeholder:'请输入内容',
                            isInput:false,
                            isShopIn:false,
                            isAddTargetIn:false
                        },
                        template: '../html/main/scan-header-V'
                    },
                    name: 'statistics-dimensionFilter',
                    bounces: false,
                    url: '../statistics/dimensionFilter.html',
                });
            },
            onItemTap: function(index){
                if(this.active == index) return;
                this.active = index;
                api.sendEvent && api.sendEvent({
                    name: 'toggleDate',
                    extra: {
                        type: index
                    }
                });
            }
        };
        this['statistics-dimensionFilter'] = {
            onChangeType:function () {
                var self = this;
                showMenu.showMenu(
                    [{
                        title: '分类',
                        icon: 'widget://image/store/costCheck02.png'
                    }, {
                        title: '单品',
                        icon: 'widget://image/store/costCheck01.png'
                    }, {
                        title: '品牌',
                        icon: 'widget://image/store/costCheck03.png'
                    }, {
                        title: '供应商',
                        icon: 'widget://image/store/costCheck04.png'
                    }],function (ret){
                        var options = [
                            { selected: 1, value: '分类',type:0 },
                            { selected: 0, value: '单品',type:1 },
                            { selected: 0, value: '品牌',type:2 },
                            { selected: 0, value: '供应商',type:3}
                        ];
                        self.typeText = options[ret.index].value;
                        switch (ret.index){
                            case 0:
                                self.placeholder = '分类名';
                                break;
                            case 1:
                                self.placeholder = '单品名';
                                break;
                            case 2:
                                self.placeholder = '品牌名';
                                break;
                            default:
                                self.placeholder = '供应商名';
                                break;
                        }
                        api && api.sendEvent({
                            name: 'statistics-dimensionFilter-type',
                            extra: {
                                searchText: self.searchText,
                                index:options[ret.index].type
                            }
                        });
                    });

            },
            onInputSearchTap:function(){
                this.isInput = true;
            },
            onClearTextTap:function(){
                this.searchText = '';
                this.isInput = false;
            },
            search:function (){
                api.sendEvent && api.sendEvent({
                    name: 'statistics-dimensionFilter-search',
                    extra: {
                        searchText: this.searchText
                    }
                })
            }
        };
        this['boss-shopRank'] = {
            onTapRightBtn: function(){
                _g.openWin({
                    header: {
                        data: {
                            active: 0,
                            list:['日', '周', '月'],
                            rightText: '门店'
                        },
                        template: '../html/header/header-date-V',
                    },
                    name: 'boss-sellerRank',
                    url: '../boss/sellerRank.html',
                    bounces: false,
                });
            },
            onItemTap: function(index){
                if(this.active == index) return;
                this.active = index;
                api.sendEvent && api.sendEvent({
                    name: 'toggleDate',
                    extra: {
                        type: index
                    }
                });
            }
        };
        this['boss-sellerRank'] = {
            onTapRightBtn: function(){
                api && api.closeWin();
            },
            onItemTap: function(index){
                if(this.active == index) return;
                this.active = index;
                api.sendEvent && api.sendEvent({
                    name: 'toggleDate',
                    extra: {
                        type: index
                    }
                });
            }
        };
        this['boss-shopDetail'] = {
            onTapRightBtn: function(idx){
                api.sendEvent && api.sendEvent({
                    name: 'getShopId'
                });
            }
        };
        this['boss-targetManage'] = {
             onTapRightBtn:function () {
                _g.openWin({
                    header: {
                        data: {
                           title:'历史目标'
                        },
                    },
                    name: 'boss-historicalGoal',
                    url: '../boss/historicalGoal.html',
                    bounces: false,
                    slidBackEnabled: false,
                })
             }
        };
        this['targetShop-rank'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
            onTapRightBtn:function () {
                api && api.sendEvent({
                    name: 'target-saleRank',
                });
            }
        };
        this['targetShop-detail'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
            onTapRightBtn:function () {
              api && api.sendEvent({
                  name: 'target-entRank',
              });
            }
        };
        this['targetShop-targetDetailsClerk'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
        };
        this['targetShop-targetDetailsManager'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
        };

        this['targetShop-editTargetManager'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
        };
        this['manager-targetManage'] = {
            onTapRightBtn:function () {
                _g.openWin({
                    header: {
                        data: {
                            title:'历史目标'
                        },
                    },
                    name: 'manager-historicalGoal',
                    url: '../manager/historicalGoal_manager.html',
                    bounces: false,
                    slidBackEnabled: false,
                })
            }
        };
        this['clerk-targetManageClerk'] = {
            onTapRightBtn:function () {
                _g.openWin({
                    header: {
                        data: {
                            title:'历史目标'
                        },
                    },
                    name: 'clerk-historicalGoal',
                    url: '../clerk/historicalGoal_clerk.html',
                    bounces: false,
                    slidBackEnabled: false,
                })
            }
        };

        this['assistant-salesRank'] = {
            onTapRightBtn:function () {
                api && api.closeWin();
            }
        };
        this['targetShop-editTarget'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
            onTapRightBtn:function () {
                api.sendEvent && api.sendEvent({
                    name: 'publish',
                });
            }
        };
        this['boss-addTarget'] = {
            onTapRightBtn:function () {
                api.sendEvent && api.sendEvent({
                    name: 'publish',
                });
            }
        };
        this['boss-editTarget'] = {
            onTapRightBtn:function () {
                api.sendEvent && api.sendEvent({
                    name: 'editTargetPublish',
                });
            }
        };
        this['targetShop-targetDetails'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
        };
        this['boss-bossTheme'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
        };
        this['member-theme'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
        };
        this['clerk-clerkTheme'] = {
            onTapLeftBtn:function () {
                api && api.sendEvent({
                   name: 'refresh-messageCenter',
                });
                api && api.closeWin();
            },
        };
        this['boss-bossThemeCallBack1'] = {
            onTapRightBtn: function () {

                api.sendEvent && api.sendEvent({
                    name: 'bossThemeName',
                    extra:{
                    }
                });

            }
        };
        this['boss-bossThemeName'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'ThemeCallBack1',
                    extra:{
                        msg:1
                    }
                });
            }
        };
        this['manager-managerThemeName'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'ThemeCallBack1',
                });
            }
        };
        this['member-memberReturnRecord'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'managerThemeInput'
                });
            }
        };
        this['clerk-clerkThemeName'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'ThemeCallBack1',
                });
            }
        };
        this['member-memberMessage'] = {
            resetInput: function(){
                this.searchInput = '';
            },
            search: function(){
                api.sendEvent && api.sendEvent({
                    name: 'search-input',
                    extra: {
                        searchInput: this.searchInput
                    }
                })
            },
            onAddRightBtnTap: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '新增会员',
                            rightText: '保存'
                        },
                    },
                    name: 'member-addMemberInformation',
                    url: '../member/addMemberInformation.html',
                    bounces: false,
                    slidBackEnabled: false,
                })
            }
        };
        this['member-addMemberInformation'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'save-memberInfo',
                });
            }
        };
        this['member-essentialInformation'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'edit-memberInfo',
                });
            }
        };
        this['member-editMemberInformation'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'save-editMemberInfo',
                });
            }
        };
        this['cost-costDetails'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'cost-editCost',
                });

            }
        };
        this['shop-costAdministration'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'cost-screen',
                });

            }
        };
        this['shop-purchaseOrderList'] = {
            onTapRightBtn:function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-purchaseOrderList-openDrawerLayout',
                });
            }
        };
        this['shop-purchaseReceiptList'] = {
            onTapRightBtn:function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-purchaseReceiptList-openDrawerLayout',
                });
            }
        };
        this['shop-purchaseReturnList'] = {
            onTapRightBtn:function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-purchaseReturnList-openDrawerLayout',
                });
            }
        };

        this['manager-managerExpenditureDetails'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'manager-sideList',
                });

            }
        };
        this['boss-bossExpenditureDetails'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'boss-sideList',
                });

            }
        };
        this["shop-inventoryCheckBatch"] = {
            onTapRightBtn:function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-inventoryCheckBatch-openDrawerLayout',
                });
            }
        };
        this['shop-allocationDetails'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-allocationDetails',
                });

            }
        };
        this['shop-allocationDetails1'] = {
            onTapRightBtn: function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-allocationDetails1',
                });

            }
        };
        this['shop-allocationList'] = {
            onTapRightBtn1: function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-allocationSrech',
                });
            },
            onTapRightBtn2: function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-allocationAdd',
                });
            }

        };

        this['shop-exchangeAddGoods'] ={
            resetInput: function(){
                this.searchInput = '';
            },
            search: function(){
                api.sendEvent && api.sendEvent({

                    name: 'search-input',
                    extra: {
                        searchInput: this.searchInput
                    }
                })
            }

        };

        this['shop-addInventoryCheck'] = {
            resetInput:function () {
                this.searchInput = "";
                api && api.sendEvent({
                        name:'baseWin-index-addInventoryCheckChangeMode',
                        extra:{
                            searchInput:'',
                            placeholder:'条码/自编码/助记码',
                            mode:'search'
                        }
                    });
            },
            onTapLeftBtn:function () {
                api && api.closeWin();
                api && api.sendEvent({
                    name: 'shop-inventorycheckdetails-refresh',
                });
                api && api.sendEvent({
                    name: 'shop-inventorycheckbatch-refresh',
                });
                api && api.sendEvent({
                    name:'shop-inventorychecklist-refresh'
                });
            },
            onRightTap: function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-addInventoryCheck-openScanner',
                })
            },
            search:function(mode){
                if(mode === "search"){
                    api && api.sendEvent({
                        name:'shop-addInventoryCheck-search',
                        extra:{
                            searchInput:this.searchInput
                        }
                    })
                }else if(mode === "input"){
                    api && api.sendEvent({
                        name: 'shop-addInventoryCheck-input',
                        extra: {
                            searchInput:this.searchInput
                        }
                    });
                }
                $("#search").select();
            },
        };
        this["shop-inventoryCheckBatchDetail"] = {
            onTapLeftBtn:function(){
                api && api.closeWin();
                api && api.sendEvent({
                    name:'shop-inventorycheckdetail-refresh'
                });
            },
            onTapRightBtn:function () {
                //  _g.openWin({
                //     header: {
                //         data: {
                //             title: '盘点单列表',
                //         },
                //         template: '../html/header/header-inventoryCheckList-V',
                //     },
                //     name: 'shop-inventorychecklist',
                //     url: '../shop/inventorychecklist.html',
                //     bounces: false,
                //     slidBackEnabled: false
                // })
               api && api.sendEvent({
                   name: 'shop-inventoryCheckBatchDetail-openAllBatchList',
               });
            }
        };
        this['shop-inventoryCheckBatch']={
            onTapRightBtn1: function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-inventorySide',
                });
            },
            onTapRightBtn2: function () {
                api.sendEvent && api.sendEvent({
                    name: 'shop-inventoryNewNo',
                });
            }

        };
        this['shop-inventorycheckdetails']={
            onTapLeftBtn:function(){
                api && api.closeWin();
                api && api.sendEvent({
                    name:'shop-inventorychecklist1-refresh'
                });
            }
        };
         this['shop-inventoryNewNo']={
             onTapLeftBtn:function(){
                api && api.closeWin();
                api && api.sendEvent({
                    name:'shop-inventoryCheckBatch1-refresh'
                });
             }
         };
         this['cost-costChart']={
            onSelectType:function(i){
              this.type=i;
            }
         }
    };


    Func.prototype = {
        get: function(page) {
            return this[page] || {}
        }
    };

    Func.prototype.constructor = Func;

    module.exports = new Func();

});
