define(function (require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#dimensionFilter',
        template: _g.getTemplate('statistics/dimensionFilter-body-V'),
        data: {
            isFirstLoading:true,
            searchText: "",
            placeholder: "请输入内容",
            isInput: false,
            title: "分类",
            isShowBox: false,
            type: 'Category',
            isNoResult:false,
            options: [
                {
                    title: "分类",
                    isSelected: true,
                    type: 'Category',
                },
                {
                    title: "单品",
                    isSelected: false,
                    type: 'Goods',
                },
                {
                    title: "品牌",
                    isSelected: false,
                    type: 'Brand',
                },
                {
                    title: "供应商",
                    isSelected: false,
                    type: 'Supplier',
                },
            ],
            resultList: [
                {
                    name: '模糊匹配',
                    id: 0
                }
            ],
        },
        created: function () {
            this.resultList = [];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        watch: {
            searchText: function () {
                if (this.searchText == "") {
                    this.isInput = false;
                    console.log(this.isInput);
                } else {
                    this.isInput = true;
                }
            }
        },
        computed:{
            isNoResult: function () {
                //console.log(this.isFirstLoading)
                if(this.isFirstLoading) return false
                var sta = this.resultList.length === 0 ? true : false
                return sta
            }
        },
        methods: {
            /*onClearText:function () {
             this.searchText = "";
             this.isInput = false;
             },
             onSelectOptions: function() {
             this.isShowBox = !this.isShowBox;
             },
             onChangeOptions:function (index) {
             var self = this;
             this.title = this.options[index].title;
             this.type = this.options[index].type;
             this.isShowBox = false;
             this.resultList = [];
             loadmore.reset();
             _.each(this.options,function (n) {
             n.type == self.type ? n.isSelected = true : n.isSelected = false;
             });
             },*/
            onActionStatistics: function (id, item_name) {
                _g.openWin({
                    header: {
                        data: {
                            active: dimensionType(),
                            list: ['日', '周', '月'],
                        },
                        template: '../html/main/home-date-header-V',
                    },
                    name: 'statistics-filterResult',
                    url: '../statistics/filterResult.html',
                    pageParam: {
                        id: id,
                        name: item_name,
                        sum_type: vm.type
                    },
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onSearch: function () {
                loadmore.reset();
                getData();
            },
        },
    });

    function getData(opts, callback) {
        var self = this;
        opts = opts || {};
        api.showProgress && api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '努力加载中...'
        });
        var _data= {
                displayRecord: 20,
                page: opts.page || 1,
                type: vm.type,
                name: vm.searchText
            };
        var _url='/app/auth/page/retail/listByType.do';
        Http.ajax({
            url:_url,
            data:_data,
            success: function (res) {
                logger.log({"Type":"operation","action":"dimensionFilter页面获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.isFirstLoading = false
                api.hideProgress && api.hideProgress();
                if (res.success) {
                    if (opts.page && opts.page > 1) {
                        callback && callback(res.object);
                    } else {
                        if(res.object === null){
                            res.object = []
                        }
                        vm.resultList = res.object;
                    }
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (res) {
                vm.isFirstLoading = false
                api.hideProgress && api.hideProgress();
                _g.toast(res.message);
            }
        });

    }

    function dimensionType() {
        var map = ['DAY', 'WEEK', 'MONTH'];
        var dimensionType = _g.getLS('dimensionType') || 'DAY';
        for (var key in map) {
            if (map[key] === dimensionType) return key;
        }
    }

    var loadmore = new Loadmore({
        callback: function (page) {
            if (vm.type != 'Goods') return loadmore.loadend(false);
            getData({page: page.page}, function (data) {
                console.log(data);
                if (!data || data.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.resultList = vm.resultList.concat(data);
                    loadmore.loadend(true);
                }
            });
        }
    });

    /**
     * 搜索响应
     **/
    //从头部菜单栏获取type值
    api.addEventListener && api.addEventListener({
        name: 'statistics-dimensionFilter-type'
    }, function (data) {
        var ind = data.value.index
        vm.type = vm.options[ind].type;
        if (!data.value.searchText) {
            return
        } else {
            vm.onSearch();
        }
    })

    //从头部菜单栏获取type&text值
    api.addEventListener && api.addEventListener({
        name: 'statistics-dimensionFilter-search'
    }, function (data) {
        vm.searchText = data.value.searchText || '';
        vm.onSearch();
    })

    window.app = vm;

    module.exports = {};
});