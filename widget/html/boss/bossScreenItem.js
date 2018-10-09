define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var type = api.pageParam.type=="002"?1:2;
    // var type = 1;
    var vm = new Vue({
        el: '#bossScreenItem',
        template: _g.getTemplate('boss/bossScreenItem-body-V'),
        data: {
            type:type,
            list:[
                {
                  itemName:"哈哈",
                  itemId:1,
                  isClick:false,
                  class_level:null  
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
                    name: 'screenItem',
                    extra: {
                        key1: this.list[idx].itemName,
                        key2: this.list[idx].itemId,
                        key3: "002",
                        class_level:this.list[idx].class_level
                    }
                });
                api.closeFrame && api.closeFrame({
                    name:"boss-bossScreenList"
                });

                api.closeFrame && api.closeFrame({});

                },
            onChooseItem1 : function(idx){
                _.map(this.list,function(item){
                    if(item){
                        item.isClick = false;
                    }
                })
                this.list[idx].isClick = !this.list[idx].isClick;
                api.sendEvent({
                    name: 'screenItem1',
                    extra: {
                        key1: this.list[idx].itemName,
                        key2: this.list[idx].itemId,
                        key3:"003",
                        class_level:this.list[idx].class_level
                    }
                });
                api.closeFrame && api.closeFrame({
                    name:"boss-bossScreenList"
                });
                api.closeFrame && api.closeFrame({});
            },

            onChooseAll:function(){
                api.sendEvent({
                    name: 'screenItemAll',
                });
                api.closeFrame && api.closeFrame({
                    name:"manager-ScreenList"
                });
                api.closeFrame && api.closeFrame({});

            },
            onChoosePAll:function(){
                api.sendEvent({
                    name: 'screenItemPAll',
                });
                api.closeFrame && api.closeFrame({
                    name:"manager-ScreenList"
                });
                api.closeFrame && api.closeFrame({});
            }
        },
        created: function () {
            this.list = [];
        }

    });

    var getData = function(opts,callback){
        var opts = opts || {};
        var _data= {
                displayRecord : 10,
                page : opts.page || 1,
                name:"",
                type:type==1?"Brand":"Category"
            };
        var _url='/app/auth/page/retail/listByType.do';
        Http.ajax({
            api_versions: 'v2',
            data:_data,
            url:_url,
            success: function(res) {
                logger.log({"Type":"operation","action":"获取类型列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function(){
                        vm.list = getItemList(res);
                    },0)
                }else{
                }
            },
            error: function(err) {
            },
        });
    };
    getData();
    var getItemList = function(res){
        return _.map(res.object,function(item){
            return{
                itemName:item.name,
                itemId:item.id,
                isClick:false,
                class_level:item.level
            }
        })
    }

});
