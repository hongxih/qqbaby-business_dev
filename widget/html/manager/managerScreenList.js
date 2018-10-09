define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var type = api.pageParam.type;
    var sales_type_id = api.pageParam.sales_type_id;
    var timeId = api.pageParam.timeId;
    var dtPicker = new mui.DtPicker({
        type: 'date'
    });
    var vm = new Vue({
        el: '#managerScreenList',
        template: _g.getTemplate('manager/managerScreenList-body-V'),
        data: {
            type:type,
            startTime:"",
            endTime:"",
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
            onChooseTime : function(idx){
                _.map(this.list,function(item){
                    if(item){
                        item.isClick = false;
                    }
                })
                this.list[idx].isClick = !this.list[idx].isClick;
                api.sendEvent({
                        name: 'screenTimeList',
                        extra: {
                            key1: this.list[idx].itemId,
                        }
                    });
                api.closeFrame && api.closeFrame({});

            },
            onChooseItem : function(idx){
                _.map(this.list,function(item){
                    if(item){
                        item.isClick = false;
                    }
                })
                this.list[idx].isClick = !this.list[idx].isClick;
                if(this.list[idx].itemId=="002"){
                    api.openFrame({
                        name: 'manager-ScreenItem',
                        url: '../manager/managerScreenItem.html',
                        rect: {
                            x: 0,
                            y: 0,
                            w: 'auto',
                            h: 'auto'
                        },
                        pageParam: {
                            type:"002"
                        },
                        bounces: false,
                        animation:{
                            type: 'push',
                            subType: 'from_right',
                            duration: 300
                        }
                    });

                }else if(this.list[idx].itemId=="003"){
                    api.openFrame({
                        name: 'manager-ScreenItem',
                        url: '../manager/managerScreenItem.html',
                        rect: {
                            x: 0,
                            y: 0,
                            w: 'auto',
                            h: 'auto'
                        },
                        pageParam: {
                            type:"003"
                        },
                        bounces: false,
                        animation:{
                            type: 'push',
                            subType: 'from_right',
                            duration: 300
                        }
                    });

                }else{
                    api.sendEvent({
                        name: 'screenList',
                        extra: {
                            key1: this.list[idx].itemName,
                            key2: this.list[idx].itemId,
                            key3:'',
                            class_level:''
                        }
                    });
                    api.closeFrame && api.closeFrame({});
                }
                
            },
            onSelectStart: function (str) {
                dtPicker.show(function (selectItems) {
                    this[str] = selectItems.value;
                    var star = new Date(this.startTime).getTime();
                    var end = new Date(this.endTime).getTime();
                    if (star > end) {
                        _g.toast("开始时间不能大于结束时间")
                        this.startTime = ''
                        this.endTime = ''
                        return
                    }
                    api.sendEvent && api.sendEvent({
                        name: 'managerSideTime',
                        extra: {
                            key1: this.startTime + '至' + this.endTime,
                        }
                    });
                    if(this.endTime!=""){
                        api.closeFrame && api.closeFrame({});
                    }
                }.bind(this));
            },
            onSelectEnd: function (str) {
                dtPicker.show(function (selectItems) {
                    this[str] = selectItems.value;
                    var star = new Date(this.startTime).getTime();
                    var end = new Date(this.endTime).getTime();
                    if (star > end) {
                        _g.toast("开始时间不能大于结束时间")
                        this.startTime = ''
                        this.endTime = ''
                        return
                    }
                    api.sendEvent && api.sendEvent({
                        name: 'managerSideTime',
                        extra: {
                            key1: this.startTime + '至' + this.endTime,
                        }
                    });
                    if(this.startTime!=""){
                        api.closeFrame && api.closeFrame({});
                    }
                }.bind(this));

            }

        },
        created: function () {
            this.list = []
        }

    });
    var getItemList = function(){
        if(type == 1){
            vm.list = [
            {itemName:"全部类型",itemId:"",isClick:false},
            {itemName:"总额提成",itemId:"006",isClick:false},
            {itemName:"新客开发",itemId:"004",isClick:false},
            {itemName:"品类",itemId:"003",isClick:false},
            {itemName:"品牌",itemId:"002",isClick:false},
            {itemName:"单品",itemId:"001",isClick:false}
            ]
        }else{
            vm.list = [
            {itemName:"今日",itemId:"1",isClick:false},
            {itemName:"昨日",itemId:"0",isClick:false},
            {itemName:"近7日",itemId:"7",isClick:false},
            {itemName:"30日内",itemId:"30",isClick:false}
            ]

        }
    }
    getItemList();
    var getData = function(){
        _.map(vm.list,function(item){
            if(sales_type_id == item.itemId){
                item.isClick = true;
            }
            if(timeId == item.itemId){
                item.isClick = true;
            }
        })
    }
    getData();

});
