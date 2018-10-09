define(function (require, exports, module) {
    var Http = require('U/http');
    var type = api.pageParam.type;
    var vm = new Vue({
        el: '#costScreenChoose',
        template: _g.getTemplate('cost/costScreenChoose-body-V'),
        data: {
            type:type,
            list:[
                {
                  itemName:"",
                  itemId:null,
                  isClick:false  
                }
            ]
            },
        methods: {
            onClose : function(){
                api.closeFrame && api.closeFrame({});
            },
            onChooseItem : function(idx){
                _.map(this.list,function(item){
                    if(item){
                        item.isClick = false;
                    }
                })
                this.list[idx].isClick = !this.list[idx].isClick;
                api.sendEvent({
                    name: 'cost-chooseItem',
                    extra: {
                        key1: this.list[idx].itemName,
                        key2: this.list[idx].itemId,
                        key3:type
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onChooseItemAll:function(type){
                api.sendEvent({
                    name: 'cost-chooseItemAll',
                    extra: {
                        key1: type,
                        
                    }
                });
                api.closeFrame && api.closeFrame({});

            }
        },
        created: function () {
            this.list = []
        }

    });
    var getData = function(){
        if(type == 1){
            var _url='/app/auth/store/list.do';
            Http.ajax({
                url:_url,
                data: {},
                api_versions: 'v2',
                success: function(res){
                    logger.log({"Type":"operation","action":"费用筛选门店列表获取","Win_name":api.winName,"message":res,"requireURL":_url})
                    if(res.success){
                        vm.list = getItemList(res);
                    }else{
                        _g.toast(res.message);
                    }
                }
            });

        }else if(type == 3){
            var _url='/app/auth/erp/listCostyType.do';
            Http.ajax({
                url:_url,
                data: {},
                api_versions: 'v2',
                success: function(res){
                    logger.log({"Type":"operation","action":"费用刷选费用类型获取","Win_name":api.winName,"message":res,"requireURL":_url})
                    if(res.success){
                        vm.list = getItemList1(res);
                    }else{
                        _g.toast(res.message);
                    }
                }
            });
        }else if(type == 2){
            vm.list = [{itemName:"应收款",itemId:"100",isClick:false},{itemName:"应付款",itemId:"200",isClick:false}];    
        }else if(type == 4){
            vm.list = [{itemId:"00P",itemName:"已审核",isClick:false},{itemId:"00N",itemName:"未审核",isClick:false}];
        }
    };
    getData();
    var getItemList = function(res){
        return _.map(res.object,function(item){
            if(item.org_type!="001"){
                return {
                    itemName:item.org_name,
                    itemId:item.store_id,
                    isClick:false
                }
            }
        })
    };
    var getItemList1 = function(res){
        return _.map(res.object,function(item){
            return {
                itemName:item.cost_type_name,
                itemId:item.cost_type_id,
                isClick:false
            }
        })
    };
   

});
