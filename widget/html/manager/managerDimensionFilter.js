define(function(require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#managerDimensionFilter',
        template: _g.getTemplate('manager/managerDimensionFilter-list-V'),
        data: {
            searchText:"",
            placeholder:"请输入内容",
            isInput:false,
            title:"分类",
            isShowBox:false,
            type: 'Category',
            options:[
                {
                    title:"分类",
                    isSelected:true,
                    type: 'Category',
                },
                {
                    title:"品牌",
                    isSelected:false,
                    type: 'Brand',
                },
                {
                    title:"单品",
                    isSelected:false,
                    type: 'Product',
                },
                {
                    title:"供应商",
                    isSelected:false,
                    type: 'Supplier',
                }, 
            ],
            resultList:[
                {
                    name: '模糊匹配',
                    id: 0    
                }
            ],
        },
        created: function(){
            // this.resultList = [];
        },
        methods: {
            onInputText:function () {
                this.isInput = true;
            },
            onClearText:function () {
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
                _.each(this.options,function (n) {
                    n.type == self.type ? n.isSelected = true : n.isSelected = false;  
                });        
            },
            onActionStatistics: function(id){
                _g.openWin({
                    header: {
                        data: {
                            active: dimensionType(),
                            list:['日', '周', '月'],
                        },
                        template: '../html/main/home-date-header-V',
                    },
                    name: 'home-filterResult',
                    url: '../home/filterResult.html',
                    pageParam: {
                        id: id,
                        sum_type: vm.type
                    }
                });
            },
            onSearch:function () {
                var self = this;
                api.showProgress && api.showProgress({
                    style: 'default',
                    animationType: 'fade',
                    title: '努力加载中...'
                });
                var _data= {
                        displayRecord: 10,
                        page: 1,
                        type: this.type,
                        name: this.searchText
                    };
                var _url='/app/auth/page/retail/listByType.do';
                Http.ajax({
                    url:_url,
                    data:_data,
                    success: function(res){
                        logger.log({"Type":"operation","action":"店长商品搜索","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                        if(res.success){
                            self.resultList = res.object;
                            api.hideProgress && api.hideProgress();
                        }else{
                            _g.toast(res.message);
                            api.hideProgress && api.hideProgress();
                        }
                    }
                });
            },
        },
    }); 

    function dimensionType(){
        var map = ['DAY', 'WEEK', 'MONTH'];
        var dimensionType = _g.getLS('dimensionType') || 'DAY';
        for(var key in map){
            if(map[key] === dimensionType) return key;
        }
    }

    // console.log(dimensionType());

    // window.app = vm;
    
    module.exports = {};
});