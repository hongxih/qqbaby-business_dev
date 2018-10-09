define(function(require, exports, module) {
    var Http = require('U/http'),
        title = api.pageParam.title,
        type = api.pageParam.type;
    var vm = new Vue({
        el: '#targetFilter',
        template: _g.getTemplate('assistant/targetFilter-body-V'),
        data: {
            isFirstLoading:true,
            searchText:"",
            placeholder:"请输入内容",
            isInput:false,
            title:title,
            isShowBox:false,
            type: type,
            isNoResult:false,
            options:[
                {
                    title:"分类",
                    isSelected:true,
                    type: 'Category',
                },
                {
                    title:"单品",
                    isSelected:false,
                    type: 'Goods',
                },
                {
                    title:"品牌",
                    isSelected:false,
                    type: 'Brand',
                },
            ],
            resultList:[
                // {
                //     name: '模糊匹配',
                //     id: 0
                // }
            ],
        },
        created: function(){
            this.resultList = [];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        watch:{
            // searchText:function () {
            //     if(this.searchText == ""){
            //         this.isInput = false;
            //         console.log(this.isInput);
            //     }else{
            //         this.isInput = true;
            //     }
            // }
        },
        computed:{
            isNoResult: function () {
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
            // onSelectOptions: function() {
            //     this.isShowBox = !this.isShowBox;
            // },
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
            chooseItem : function(id,item_name){
                api.sendEvent({
                    name: 'choose',
                    extra: {
                        key1: id,
                        key2: item_name
                    }
                });
                api && api.closeWin();
            },
            // onActionStatistics: function(id,item_name){
            //     _g.openWin({
            //         header: {
            //             data: {
            //                 active: dimensionType(),
            //                 list:['日', '周', '月'],
            //             },
            //             template: '../html/main/home-date-header-V',
            //         },
            //         name: 'statistics-filterResult',
            //         url: '../statistics/filterResult.html',
            //         pageParam: {
            //             id: id,
            //             name: item_name,
            //             sum_type: vm.type
            //         }
            //     });
            // },
            onSearch:function () {
                loadmore.reset();
                getData();
            },
        },
    });

    function getData(opts, callback){
        var self = this;
        var opts = opts || {};
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
            success: function(res){
                logger.log({"Type":"operation","action":"目标查询","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                api.hideProgress && api.hideProgress();
                vm.isFirstLoading = false
                if(res.success){
                    if(opts.page && opts.page > 1){
                        callback && callback(res.object);
                    }else{
                        if(res.object === null){
                            res.object = []
                        }
                        vm.resultList = res.object;
                    }
                }else{
                    vm.isFirstLoading = false
                    _g.toast(res.message);
                }
            }
        });

    }

    // function dimensionType(){
    //     var map = ['DAY', 'WEEK', 'MONTH'];
    //     var dimensionType = _g.getLS('dimensionType') || 'DAY';
    //     for(var key in map){
    //         if(map[key] === dimensionType) return key;
    //     }
    // }

    var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                console.log(data);
                if(!data || data.length === 0){
                    return loadmore.loadend(false);
                }else{
                    vm.resultList = vm.resultList.concat(data);
                    loadmore.loadend(true);
                }
            });
        }
    });
    /**
     * 搜索响应
     **/
    //从头部菜单栏获取type&text值
    api.addEventListener && api.addEventListener({
        name: 'assistant-targetFilter-search'
    }, function (data) {
        vm.searchText = data.value.searchText || '';
        vm.onSearch();
    })

    vm.onSearch();
    window.app = vm;

    module.exports = {};
});
