define(function (require, exports, module) {
    var query_name = '';
    var Http = require('U/http');
    var mnPopups = api && api.require('MNPopups');
    var FNScanner = api && api.require('FNScanner');
    var deviceWidth = window.screen.width
    var goodsCostCheck = new Vue({
        el: '#goodsCostCheck',
        template: _g.getTemplate('shop/goodsCostCheck-list-V'),
        data: {
            isFirstLoading:true,
            isFirstSearch:true,
            searchText: '',
            // placeHolder : '名称/条码/助记码/自编码',
            // isInput:false,
            isNoResult: false,
            isNoSearch: false,
            list: [
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 3,
                    skuCode: '400ml',
                    productId: 1
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 4,
                    skuCode: '400ml',
                    productId: 1
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 35,
                    skuCode: '400ml',
                    productId: 1
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 36,
                    skuCode: '400ml',
                    productId: 1
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 7,
                    skuCode: '400ml',
                    productId: 1
                },
            ],
            selected: '单品',
            type: 1,
            options: [
                {selected: 1, value: '单品', type: 1},
                {selected: 0, value: '分类', type: 2},
                {selected: 0, value: '品牌', type: 3},
                {selected: 0, value: '供应商', type: 4}
            ],
            record: [
                {
                    text: '123456789012345678901234567890123456789012345',//length 45
                    type: ''
                },
                {
                    text: '一二三四五六七八九十一二三四五六七八九十一二三',//length 23
                    type: ''
                },
                {
                    text: '3123456789012345678901234567890123456789012345',
                    type: ''
                },
                {
                    text: '历史记录3',
                    type: ''
                },
            ],
            isRecord: true,
            isDataShow: false,
            isFirstLoading:true,
            // isList :false,
            // isShowMask:false,
        },
        filters: {
            clip: function (val) {
                if(val !== undefined){
                    var str = val
                    var len = str.replace(/[^x00-xff]/g, "01").length
                    var headStr = ''
                    var endStr = ''
                    var returnStr = ''
                    if (len > 45) {
                        headStr = val.substr(0, 10)
                        endStr = val.substr(-10)
                        returnStr = headStr + '......' + endStr
                    } else {
                        returnStr = val
                    }
                    return returnStr
                }
            },
            isShowWidth: function (val) {
                return true
            }
        },
        created: function () {
            this.list = [];
            this.record = [];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
            document.getElementById('noSearchWrap').style.height = h + 'px'
        },
        computed: {
        },
        methods: {
            clearRecord: function () {
                var _url='/app/auth/erp/stock/clearQueryRecord.do';
                Http.ajax({
                    data: {},
                    url:_url,
                    api_versions: 'v2',
                    success: function (ret) {
                        logger.log({"Type":"operation","action":"清除商品查询记录","Win_name":api.winName,"message":ret,"requireURL":_url})
                        //this.record.splice(0)
                    },
                    error: function (err) {
                    }
                });
                this.record.splice(0)
                this.isRecord = false
                this.isNoResult = true
            },
            onRecordSelect: function (ind) {
                var str = this.record[ind].text
                this.searchText = str
                api.sendEvent && api.sendEvent({
                    name: 'shop-goodsCostCheck-addMessage',
                    extra: {
                        searchText: str
                    }
                });
                this.onSearchTap()
            },
            onInputSearchTap: function () {
                this.isInput = true;
            },
            onClearTextTap: function () {
                this.searchText = '';
                this.isInput = false;
            },
            onSearchTap: function () {

                goodsCostCheck.list = [];
                loadmore.reset()
                if (this.searchText.trim().length == 0) {

                    _g.toast('请输入查询条件');
                } else {

                    getSearchData()
                }
            },
            onDetailTap: function (order_id) {
                _g.openWin({
                    header: {
                        data: {
                            title: '库存成本查询详情'
                        }
                    },
                    name: 'shop-queryresultpage',
                    url: '../shop/queryresultpage.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        order_id: order_id
                    }
                });
            },
            // onChangeType : function(){
            //     if(!this.isList){
            //         this.isList = true;
            //         this.isShowMask = true;
            //     }else{
            //         this.isList = false;
            //         this.isShowMask = false;
            //     }
            // },
            // onChangeValue : function(idx){
            //     this.selected = this.options[idx].value;
            //     this.type = this.options[idx].type;
            //     _.each(this.options,function(n,i){
            //         n.selected = idx == i ? 1 : 0;
            //     });
            //     switch (idx){
            //         case 0:
            //             this.placeHolder = '名称/条码/助记码/自编码';
            //             break;
            //         case 1:
            //             this.placeHolder = '分类名';
            //             break;
            //         case 2:
            //             this.placeHolder = '品牌名';
            //             break;
            //         default:
            //             this.placeHolder = '供应商名';
            //             break;
            //     }
            //     this.isList = false;
            //     this.isShowMask = false;
            // }
        }
    });
    // 扫码获取数据
    var getData = function (query_name) {
        var _data={
                displayRecord: 10,
                page: '1',
                query_name: query_name
            };
        var _url='/app/auth/page/erp/stockList.do';
        Http.ajax({
            data: _data,
            url: _url,
            success: function (ret) {
                console.log("goodsCostCheck获取数据",ret);
                logger.log({"Type":"operation","action":"goodsCostCheck获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                goodsCostCheck.isNoResult = false
                goodsCostCheck.isRecord = false
                if (ret.code == 200) {
                        if (ret.object) {
                            var list = getDataList(ret.object);
                            if (query_name) {
                                goodsCostCheck.list = [];
                            }
                            goodsCostCheck.list = goodsCostCheck.list.concat(list);
                            goodsCostCheck.isNoSearch = false
                        }
                } else {
                    goodsCostCheck.isNoSearch = true;
                    _g.toast(ret.message);
                }

            },
            error: function (err) {
                _g.hideProgress();
            },
        });
    }

    getDataList = function (result) {
        var list = result ? result.lists : [];
        return _.map(list, function (item) {
            return {
                image: item ? CONFIG.HOST + item.prod_pic_url : CONFIG.DEFAULT_PHOTO,
                goodsName: item ? item.product_name : '',
                goodsNo: item ? item.bar_code : '',
                goodsCount: item ? item.stock_amount : 0,
                productId: item ? item.product_id : 0,
                skuCode: item ? item.sku_code : 0,
                deposit_amount: item && item.deposit_amount || 0
            }
        });
    }

    getRecord = function () {
        var _data= {
                displayRecord: 10,
                page: '1',
            };
        var _url='/app/auth/erp/stock/listQueryRecord.do';
        Http.ajax({
            data: _data,
            api_versions: 'v2',
            url: _url,
            success: function (ret) {
                logger.log({"Type":"operation","action":"获取搜索记录","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                goodsCostCheck.isFirstLoading = false
                _g.hideProgress();
                if (ret.success) {
                    var list = getRecordDetail(ret.object)
                    list.length > 5 && (list.length = 5)
                    if(list.length === 0){
                        goodsCostCheck.isRecord = false
                        goodsCostCheck.isNoResult = true
                    }else{
                        goodsCostCheck.isRecord = true
                        goodsCostCheck.isNoResult = false
                    }
                    goodsCostCheck.record = list
                } else {
                    if(ret.code === 10007){
                        _g.toast(ret.message)
                    }
                }

            },
            error: function (err) {
                goodsCostCheck.isFirstLoading = false
                _g.hideProgress();
            }
        })
    }

    getRecordDetail = function (data) {
        return _.map(data, function (item) {
            return {
                text: item.erp_stock_query_record ? item.erp_stock_query_record : '',
                type: item.erp_stock_query_type ? item.erp_stock_query_type : '',
            }
        })
    }

    getRecord();
    // 搜索商品数据
    var getSearchData = function (opts,callback) {
        opts = opts || {};
        var _data={
            query_name_input: goodsCostCheck.searchText,
            displayRecord: 10,
            page: opts.page || 1,
            query_type: goodsCostCheck.type
        };
        var _url= '/app/auth/page/erp/stockList.do';
        api.showProgress && api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '努力加载中...'
        });
        Http.ajax({
            data: _data,
            url: _url,
            success: function (ret) {
                console.log('lzh 获取搜索记录 =========', ret);
             logger.log({"Type":"operation","action":"获取搜索记录","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                _g.hideProgress();
                goodsCostCheck.isNoResult = false // 没有查询结果页面是否显示
                goodsCostCheck.isRecord = false // 搜索记录状态栏是否显示
                if (ret.code == 200) {

                    if(opts.page && opts.page > 1) {
                        setTimeout(function () {
                            var list = getDataList(ret.object);
                            callback && callback(list)
                        },0)

                    }else{
                        setTimeout(function () {
                            goodsCostCheck.list = getDataList(ret.object);
                        },0)

                    }
                    goodsCostCheck.isNoSearch = false // 搜索记录状态栏是否显示
                } else {
                    goodsCostCheck.isNoSearch = true
                     logger.log({"Type":"error","action":"获取搜索数据失败","Win_name":api.winName,"data":_data,"message":ret})
                    if(ret.code === 10007){
                        _g.toast(ret.message);
                    }
                }

            },
            error: function (err) {
                goodsCostCheck.isNoResult = false
                goodsCostCheck.isRecord = false
                _g.hideProgress()
                _g.toast(err.message);
            },
        });
    }

    //打开扫码模块方法
    var openScanner = function () {
        FNScanner.openScanner({},function (ret,err) {
            if (ret.content) {
                goodsCostCheck.searchText = ret.content;
                goodsCostCheck.onSearchTap();
                api && api.sendEvent({
                    name: 'shop-goodsCostCheck-addMessage',
                    extra: {
                        searchText: ret.content,
                    }
                });
            }
        })
    }
    //分页
    var loadmore = new Loadmore({
        callback: function (page) {
            getSearchData({page: page.page}, function (data) {
                if (!data || data.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    goodsCostCheck.list = goodsCostCheck.list.concat(data);
                    loadmore.loadend(true);
                }
            });
        }
    });
    //从头部菜单栏获取type值
    api.addEventListener && api.addEventListener({
        name: 'shop-goodsCostCheck-type'
    }, function (data) {
        goodsCostCheck.type = data.value.type;
        if (!data.value.searchText) {
            return
        } else {
            goodsCostCheck.onSearchTap();
        }
    })

    //从头部菜单栏获取type值
    api.addEventListener && api.addEventListener({
        name: 'shop-goodsCostCheck-search'
    }, function (data) {
        goodsCostCheck.searchText = data.value.searchText || '';
        goodsCostCheck.onSearchTap();
    })

    //getData(query_name);  舍弃初始化查询

    api && api.addEventListener({
      name:'refresh-goodsCostCheck'
    },function(ret,err){
      if(ret.value.query_name){
          getData(ret.value.query_name);
      }
    });

    //接收func发送过来的消息打开扫码模块
    api && api.addEventListener({
        name:'shop-goodsCostCheck-openScanner'
    },function(ret,err){
        openScanner();
    });


    /**
     * 数组去重
     * @param [array]
     * @return [array]
     **/
    var removeRepeat = function (arr) {
        var uniqueArr = [];
        if(arr.length === 0) return uniqueArr
        uniqueArr.push(arr[0]);
        for (var i = 1; i < arr.length; i++) {
            for (var j = 0; j < uniqueArr.length; j++) {
                if (arr[i] === uniqueArr[j]) break;
            }
            if (j >= uniqueArr.length) {
                uniqueArr.push(arr[i]);
            }
        }
        return uniqueArr;
    }
    module.exports = {};
});
