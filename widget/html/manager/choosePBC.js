define(function (require, exports, module) {
    var PBCName = api.pageParam.PBC;
    var query_name = '';
    var Http = require('U/http');
    var mnPopups = api && api.require('MNPopups');
    var FNScanner = api && api.require('FNScanner');
    var deviceWidth = window.screen.width
    var goodsCostCheck = new Vue({
        el: '#choosePBC',
        template: _g.getTemplate('manager/choosePBC-body-V'),
        data: {
            isFirstLoading: true,
            isFirstSearch: true,
            searchText: '',
            placeHolder: '名称/条码/助记码/自编码',
            isNoResult: false,
            isNoSearch: false,
            PBC: 'product',
            PBCName: '单品',
            choosingPBCName: '',//选中的单品，品牌，分类名称
            choosingPBCId: '',//选中的单品，品牌，分类ID
            choosingSkuCode: '',
            list: [
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 3,
                    skuName: '400ml',
                    skuCode: '',
                    PBCId: 1,
                    checked: false
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 4,
                    skuName: '400ml',
                    skuCode: '',
                    PBCId: 1,
                    checked: false
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 35,
                    skuName: '400ml',
                    skuCode: '',
                    PBCId: 1,
                    checked: false
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 36,
                    skuName: '400ml',
                    skuCode: '',
                    PBCId: 1,
                    checked: false
                },
                {
                    image: '../../image/store/goodsPic.png',
                    goodsName: '雅培奶粉',
                    goodsNo: '69125489746547',
                    goodsCount: 7,
                    skuName: '400ml',
                    skuCode: '',
                    PBCId: 1,
                    checked: false
                },
            ],
            selected: '单品',
            type: 1,
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
            isFirstLoading: true,
        },
        filters: {
            clip: function (val) {
                if (val !== undefined) {
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
            this.listenChoose();
        },
        ready: function () {
        },
        computed: {
        },
        methods: {
            clearRecord: function () {
                var _url = '/app/auth/crm/multiConRedmind/clearQueryRecode.do';
                Http.ajax({
                    data: { query_type: goodsCostCheck.type },
                    url: _url,
                    api_versions: 'v2',
                    success: function (ret) {
                        logger.log({ "Type": "operation", "action": "清除商品查询记录", "Win_name": api.winName, "message": ret, "requireURL": _url })
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
            onChooseOne: function (i, PBCId) {
                this.list.forEach(function (v) {
                    v.checked = false;
                });
                this.list[i].checked = !this.list[i].checked;
            },
            onCloseFrame: function () {
                api.closeFrame();
            },
            onConfirm: function () {
                this.list.forEach(function (item) {
                    if (item.checked) {
                        goodsCostCheck.choosingPBCName = item.goodsName;
                        goodsCostCheck.choosingPBCId = item.PBCId;
                        if (item && item.skuCode) {
                            goodsCostCheck.choosingSkuCode = item.skuCode;
                        }
                    }
                });
                api.sendEvent && api.sendEvent({
                    name: 'chooseOnePBC',
                    extra: {
                        PBCId: goodsCostCheck.choosingPBCId,
                        goodsName: goodsCostCheck.choosingPBCName,
                        skuCode: goodsCostCheck.choosingSkuCode
                    }
                });
                api.closeFrame();
            },
            onReset: function () {
                this.searchText = '';
            },
            listenChoose: function () {
                this.PBCName = PBCName;
                switch (PBCName) {
                    case '单品':
                        this.placeHolder = '请输入商品条码/名称/助记码';
                        this.type = 1;
                        break;
                    case '品牌':
                        this.placeHolder = '请输入品牌名';
                        this.type = 2;
                        break;
                    case '分类':
                        this.placeHolder = '请输入分类名';
                        this.type = 3;
                        break;
                }
            },
        }
    });

    var getData = function (query_name) {
        var _data = {
            displayRecord: 10,
            page: '1',
            query_name: query_name
        };
        var _url = '/app/auth/page/erp/stockList.do';
        Http.ajax({
            data: _data,
            url: _url,
            success: function (ret) {
                logger.log({ "Type": "operation", "action": "goodsCostCheck获取数据", "Win_name": api.winName, "data": _data, "message": ret, "requireURL": _url })
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
        var list = result ? result : [];
        return _.map(list, function (item) {
            var goodsName;
            var PBCId;
            if (goodsCostCheck.type == 1) {
                goodsName = item.product_name;
                PBCId = item.product_id;
            } else if (goodsCostCheck.type == 2) {
                goodsName = item.brand_name;
                PBCId = item.brand_id;
            } else if (goodsCostCheck.type == 3) {
                goodsName = item.class_name;
                PBCId = item.class_id;
            }
            return {
                goodsName: item ? goodsName : '',
                goodsNo: item ? item.bar_code : '',
                PBCId: item ? PBCId : 0,
                skuCode: item ? item.sku_code : 0,
                skuName: item ? item.sku_name : '',
                checked: false,
            }
        });
    }

    getRecord = function (type) {
        var _data = {
            displayRecord: 10,
            page: '1',
            query_type: type,
        };
        var _url = '/app/auth/crm/multiConRedmind/listQueryRecode.do';
        Http.ajax({
            data: _data,
            api_versions: 'v2',
            url: _url,
            success: function (ret) {
                logger.log({ "Type": "operation", "action": "获取搜索记录", "Win_name": api.winName, "data": _data, "message": ret, "requireURL": _url })
                goodsCostCheck.isFirstLoading = false
                _g.hideProgress();
                if (ret.success) {
                    var list = getRecordDetail(ret.object)
                    list.length > 10 && (list.length = 10)
                    if (list.length === 0) {
                        goodsCostCheck.isRecord = false
                        goodsCostCheck.isNoResult = true
                    } else {
                        goodsCostCheck.isRecord = true
                        goodsCostCheck.isNoResult = false
                    }
                    goodsCostCheck.record = list
                } else {
                    if (ret.code === 10007) {
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
                text: item.multi_consume_remind_query_record ? item.multi_consume_remind_query_record : '',
                type: item.multi_consume_remind_query_type ? item.multi_consume_remind_query_type : '',
            }
        })
    }

    getRecord(goodsCostCheck.type);
    var getSearchData = function (opts, callback) {
        opts = opts || {};
        //
        var _data = {
            query_name_input: goodsCostCheck.searchText,
            displayRecord: 15,
            page: opts.page || 1,
            query_type: goodsCostCheck.type
        };
        if(goodsCostCheck.type == 2) {
            delete _data.displayRecord;
            delete _data.page;
        }
        var _url = '/app/auth/page/product/listProByInput.do';
        Http.ajax({
            data: _data,
            url: _url,
            api_versions: 'v2',
            success: function (ret) {
                logger.log({ "Type": "operation", "action": "获取搜索的列表", "Win_name": api.winName, "data": _data, "message": ret, "requireURL": _url })
                _g.hideProgress();
                goodsCostCheck.isNoResult = false // 没有查询结果页面是否显示
                goodsCostCheck.isRecord = false // 搜索记录状态栏是否显示
                if (ret.code == 200) {

                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            var list = getDataList(ret.object);
                            callback && callback(list)
                        }, 0)

                    } else {
                        setTimeout(function () {
                            goodsCostCheck.list = getDataList(ret.object);
                        }, 0)

                    }
                    goodsCostCheck.isNoSearch = false // 搜索记录状态栏是否显示
                } else {
                    goodsCostCheck.isNoSearch = true
                    logger.log({ "Type": "error", "action": "获取搜索数据失败", "Win_name": api.winName, "data": _data, "message": ret })
                    if (ret.code === 10007) {
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

    //分页
    var loadmore = new Loadmore({
        callback: function (page) {
            getSearchData({ page: page.page }, function (data) {
                if (!data || data.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    if(goodsCostCheck.type != 2) {
                        goodsCostCheck.list = goodsCostCheck.list.concat(data);
                    }
                    loadmore.loadend(true);
                }
            });
        }
    });

    /**
     * 数组去重
     * @param [array]
     * @return [array]
     **/
    var removeRepeat = function (arr) {
        var uniqueArr = [];
        if (arr.length === 0) return uniqueArr
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
