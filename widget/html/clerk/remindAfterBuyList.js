define(function (require, exports, module) {
    var Http = require('U/http');
    var userId=api.pageParam.entId//	会员ID	number
    //记录选中
    var checkProductID = api.pageParam.rememberCheckProductID;
    var checkSkuCode = api.pageParam.rememberCheckSkuCode;
    var vm = new Vue({
        el: '#remindAfterBuyList',
        template: _g.getTemplate('clerk/remindAfterBuyList-body-V'),
        data: {
            AllTagNum: 0,
            sent: true,
            chooseTag:false,
            list: [
                {
                    tagName: '商品1',
                    index: 1,
                    check: false,
                    productID: '',
                    skuCode: ''
                },
                {
                    tagName: '商品2',
                    index: 2,
                    check: false,
                    productID: '',
                    skuCode: ''
                },
                {
                    tagName: '商品3',
                    index: 3,
                    check: false,
                    productID: '',
                    skuCode: ''
                },
                {
                    tagName: '商品4',
                    index: 4,
                    check: false,
                    productID: '',
                    skuCode: ''
                }
            ],
            result : [],//输出
            rememberCheckProductID: checkProductID,//已选中的商品ID
            rememberCheckSkuCode: checkSkuCode,//已选中的skuCode
            query_name: '', //查询条件
            initCount: -1,
            isFirst: true,
        },
        created: function () {
            this.list = [];
            this.sent = true;
        },
        watch: {},
        filters: {},
        methods: {
            search: function () {
                getData({query_name : this.query_name});
            },
            //单个标签
            onClickTag: function (idx) {
                this.list[idx].check = !this.list[idx].check;
                if(this.list[idx].check) {
                    this.rememberCheckProductID.push(this.list[idx].productID);
                    this.rememberCheckSkuCode.push(this.list[idx].skuCode);
                }else {
                    this.rememberCheckProductID.splice(this.rememberCheckProductID.indexOf(this.list[idx].productID), 1);
                    this.rememberCheckSkuCode.splice(this.rememberCheckSkuCode.indexOf(this.list[idx].SkuCode), 1);
                }
                this.countNum()
                },
            //全选    
            onchooseTag : function(){
                this.chooseTag = !this.chooseTag;
                if(this.chooseTag){
                    _.map(this.list, function(item) { 
                        item.check =true;
                        vm.rememberCheckProductID.push(item.productID);
                        vm.rememberCheckSkuCode.push(item.skuCode);
                        vm.rememberCheckProductID = Array.from(new Set(vm.rememberCheckProductID));//去重
                        vm.rememberCheckSkuCode = Array.from(new Set(vm.rememberCheckSkuCode));//去重
                    });
                    this.countNum();
                }else{
                    _.map(this.list, function(item) {
                        item.check =false;
                        vm.rememberCheckProductID.pop(item.productID);
                        vm.rememberCheckSkuCode.pop(item.skuCode);
                    });
                    this.countNum();
                }
            },
            //已选择数量
            countNum: function () {
                var num = 0;
                // for (key in this.list) {
                //     if (this.list[key].check) num++
                // }
                num = this.rememberCheckProductID.length;
                this.AllTagNum = num;

                // 判断全选
                // this.chooseTag = this.AllTagNum == this.initCount? true : false;
                this.chooseTag = true;
                for(var i = 0; i < this.list.length; i++) {
                    if(this.list[i].check == false) {
                        this.chooseTag = false;
                        break;
                    }
                    
                }

            },
            onAgree: function () {
                // if (!this.sent) return
                // this.sent = false;
                var arr = [];
                for (key in this.list) {
                    if (this.list[key].check) arr.push(this.list[key].index);
                }
                if (arr.length === 0) {
                    arr = '';
                }else{
                    arr = '['+arr+']';
                }
                for (var i = 0; i < this.rememberCheckProductID.length; i++) {
                    var item = {};
                    item.product_id = this.rememberCheckProductID[i];
                    item.sku_code = this.rememberCheckSkuCode[i];
                    this.result.push(item);
                }
                // this.sent = true;
                api.sendEvent && api.sendEvent({
                    name: 'chooseProduct',
                    extra: {data: this.result, count: this.AllTagNum, rememberCheckProductID: this.rememberCheckProductID, rememberCheckSkuCode: this.rememberCheckSkuCode}
                });
                api.closeWin && api.closeWin();
            }

        }
    });
    var getData = function (opts, callback) {
        opts = opts || {};
        var _data= {
                displayRecord: 10,
                page: opts.page || 1,
                user_id: userId,//   会员ID    number
                query_name: opts.query_name
            };
        var _url='/app/auth/crm/multiConRedmind/listMCRemindProductDialog.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"memberTag获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url,"line":"------------------------------------------------------"})
                if (res.code == 200) {
                    // alert(_url + ' success ' + JSON.stringify(res));
                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            callback && callback(res);
                        }, 0)
                    } else {
                        setTimeout(function () {
                            vm.list = getItemList(res);
                            if (vm.isFirst && vm.list.length>0) {
                                vm.isFirst = false;
                                vm.initCount = vm.list.length;
                            }
                            vm.list.forEach(function (item) {
                                vm.rememberCheckProductID.forEach(function(v, i) {
                                    if(v == item.productID) {
                                        item.check = true;
                                    }
                                });
                            })//选中记录
                            vm.countNum();
                        }, 0)
                    }
                } else {
                    // alert(_url + ' failed ' + JSON.stringify(res));
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                // alert(_url + ' failed ' + JSON.stringify(res));
                _g.hideProgress();
            }
        })
    };
    
    getData()
    var loadmore = new Loadmore({
        callback: function (page) {
            getData({page: page.page}, function (data) {
                if (!data.object || data.object.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.list = vm.list.concat(getItemList(data));
                    vm.list.forEach(function (item) {
                        vm.rememberCheckProductID.forEach(function(v, i) {
                            if(v == item.productID) {
                                item.check = true;
                            }
                        });
                    })
                    loadmore.loadend(true);
                }
            });
        }
    });
    var getItemList = function (res) {
        return _.map(res.object, function (item) {
            return {
                tagName: item.product_name,
                index: item.product_id,
                check: false,
                productID: item.product_id,
                skuCode: item.sku_code,
                skuName: item.sku_name
            }
        })
    }
      _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        },0)
        loadmore.reset();
    });
    module.exports = {};
});
