define(function(require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#allocationList',
        template: _g.getTemplate('shop/allocationList-body-V'),
        data: {
            isShow:false,
            ConsignorStoreName:"",
            ConsigneeStoreName:"",
            list:[
            {
                mountTime:"",
                list:[
                {
                    ConsignorStore:"门店名称7",
                    ConsigneeStore:"门店名称8",
                    happenTime:"2017-03-20 12:22:32",
                    allocationNumber:300,
                    allocationNo:"P0123123819203783127",
                    type:5//1.待发货 2.待收货 3.已终止 4.未审核 5.已收货

                },
                {
                    ConsignorStore:"门店名称1",
                    ConsigneeStore:"门店名称2",
                    happenTime:"2017-03-23 12:22:32",
                    allocationNumber:300,
                    allocationNo:"P0123123819203783127",
                    type:1//1.待发货 2.待收货 3.已终止 4.未审核 5.已收货

                },
                {
                    ConsignorStore:"门店名称3",
                    ConsigneeStore:"门店名称4",
                    happenTime:"2017-03-22 12:22:32",
                    allocationNumber:300,
                    allocationNo:"P0123123819203783127",
                    type:2//1.待发货 2.待收货 3.已终止 4.未审核 5.已收货

                },
                {
                    ConsignorStore:"门店名称5",
                    ConsigneeStore:"门店名称6",
                    happenTime:"2017-03-21 12:22:32",
                    allocationNumber:300,
                    allocationNo:"P0123123819203783127",
                    type:3//1.待发货 2.待收货 3.已终止 4.未审核 5.已收货

                },
                {
                    ConsignorStore:"门店名称7",
                    ConsigneeStore:"门店名称8",
                    happenTime:"2017-03-20 12:22:32",
                    allocationNumber:300,
                    allocationNo:"P0123123819203783127",
                    type:4//1.待发货 2.待收货 3.已终止 4.未审核 5.已收货

                }
                ]
            }
            ]
        },
        created: function(){

        },
        watch: {

        },
        filters: {
            formatDate: function (val) {
                if(val){
                    var month = val.split('-')[1];
                    var beforeM = new Date().getMonth()+1;
                    if(month == beforeM){
                        return '本月'
                    }else{
                        if(month == '01'){
                            return '一月';
                        }else if(month == '02'){
                            return '二月';
                        }else if(month == '03'){
                            return '三月';
                        }else if(month == '04'){
                            return '四月';
                        }else if(month == '05'){
                            return '五月';
                        }else if(month == '06'){
                            return '六月';
                        }else if(month == '07'){
                            return '七月';
                        }else if(month == '08'){
                            return '八月';
                        }else if(month == '09'){
                            return '九月';
                        }else if(month == '10'){
                            return '十月';
                        }else if(month == '11'){
                            return '十一月';
                        }else if(month == '12'){
                            return '十二月';
                        }
                    }
                }
            },
            formatTime : function(res){
                 if(res){
                    //  alert()
                     var data = parseInt(res.split(" ")[0].split('-')[2]);
                     var dateTime = new Date().getDate();
                     var beforeDay = new Date().getMonth()+1;
                     var yesterday = (new Date(new Date().Format('yyyy-MM-dd')).getTime()) - 60*60*1000*24;
                     var dataYesterday = new Date(res.split(' ')[0]).getTime();
                     if(res.split("-")[1]==beforeDay){
                         if(data == dateTime){
                             return '今天';
                         }if(yesterday == dataYesterday){
                             return '昨天';
                         }else{
                             var time = new Date(res.split(' ')[0]).getDay();
                             switch(time){
                                 case 0:
                                     return '周日';
                                 case 1:
                                     return '周一';
                                 case 2:
                                     return '周二';
                                 case 3:
                                     return '周三';
                                 case 4:
                                     return '周四';
                                 case 5:
                                     return '周五';
                                 case 6:
                                     return '周六';
                             }
                         }
                     }else{
                         var time = new Date(res.split(' ')[0]).getDay();
                         switch(time){
                             case 0:
                                 return '周日';
                             case 1:
                                 return '周一';
                             case 2:
                                 return '周二';
                             case 3:
                                 return '周三';
                             case 4:
                                 return '周四';
                             case 5:
                                 return '周五';
                             case 6:
                                 return '周六';
                         }
                     }

                 }
             },
            formatDay : function(res){
                 var data = parseInt(res.split(" ")[0].split('-')[2]);
                 var dateTime = new Date().getDate();
                 var beforeDay = new Date().getMonth()+1;
                 var yesterday = (new Date(new Date().Format('yyyy-MM-dd')).getTime()) - 60*60*1000*24;
                 var dataYesterday = new Date(res.split(' ')[0]).getTime();
                 if(res.split("-")[1]==beforeDay){
                     if(data == dateTime || yesterday == dataYesterday){
                         var time =  res.split(' ')[1].split(':')[0] + ":" + res.split(' ')[1].split(':')[1];
                         return time;
                     }else{
                         var time2 = res.split(' ')[0].split('-')[1] + "-" + res.split(' ')[0].split('-')[2];
                         return time2;
                     }
                 }else{
                     var time3 = res.split(' ')[0].split('-')[1] + "-" + res.split(' ')[0].split('-')[2];
                     return time3;
                 }
             },
        },
        methods: {
            onAllocationDetails:function(type){
                _g.openWin({
                    header:{
                        data:{
                            title:'调拨单详情'
                        },
                    },
                    pageParam:{
                        type:type
                    },
                    bounces:false,
                    name:'shop-allocationDetails',
                    url:'../shop/allocationDetails.html',
                });
            }

	   }
    });
    api.addEventListener && api.addEventListener({
        name: 'shop-allocationSrech'
    }, function (ret, err) {
        api.openDrawerPane({
            type: 'right'
        });
    });
    
    api.addEventListener && api.addEventListener({
        name: 'shop-allocationAdd'
    }, function (ret, err) {
       _g.openWin({
            header:{
                data:{
                    title:"新增调拨单"
                }
            },
            name:'shop-exchangeList',
            url:'../shop/exchangeList.html',
            bounces:false
       })
     
    });

    api.addEventListener && api.addEventListener({
        name: 'allocation-scrren'
    }, function (ret, err) {
        vm.isShow = true;
        vm.ConsignorStoreName = ret.value.key1?ret.value.key1:"全部门店";
        vm.ConsigneeStoreName = ret.value.key2?ret.value.key2:"全部门店";
    })
	module.exports = {};
});
