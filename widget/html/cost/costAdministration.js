define(function(require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#costAdministration',
        template: _g.getTemplate('cost/costAdministration-body-V'),
        data: {
            isFirstLoading:true,
            bill_type_remark:"",
            cost_type_nameL:"",
            isAttice:false,
            isNoResult:false,
             list:{
                month_time:"",
                // isLook:true,
                list:[
                    {
                        audit_status:"",
                        bill_type:null,
                        bill_type_name:"",
                        charge_amount:"",
                        cost_type_name:"",
                        happen_date:"",
                        store_bill_charge_order_id:null
                    }
                ]

            }

        },
        created: function(){
           this.list = [];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        watch: {

        },
        computed:{
            isNoResult: function () {
                if(this.isFirstLoading) return false
                var sta = this.list.length === 0 ? true : false
                return sta
            }
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
            formatType : function(res){
                if(res == "00P"){
                    return 0;
                }else{
                    return 1;
                }
            },
            formaTime : function(res){
                if(res){
                    var data = res.split("-")[2];
                    var beforeDay = new Date().getMonth()+1;
                    if(res.split("-")[1]==beforeDay){
                        var dateTime = new Date().getDate();
                        if(data == dateTime){
                            return '今天';
                        }else{
                            var time = new Date(Date.parse(res)).getDay();
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
                        var time = new Date(Date.parse(res)).getDay();
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
               if(res){
                    var data = res.split("-")[1]+"-"+res.split("-")[2];
                    return data ;
                }
            }
        },
        methods: {
            oncostAdd : function(){
                _g.openWin({
                    header:{
                        data:{
                            title:'新增费用'
                        }
                    },
                    bounces: false,
                    name:'cost-costAdd',
                    url:'../cost/costAdd.html',
                });
            },
            onCostDetails : function(id,type){
                _g.openWin({
                    header:{
                        data:{
                            title:'费用详情',
                            rightText:type=="00N"?'编辑':""
                        }
                    },
                    pageParam : {
                        entId:id
                    },
                    bounces: false,
                    name:'cost-costDetails',
                    url:'../cost/costDetails.html',
                });
            },

	   }
    });
    var store_id = "";
    var bill_type = "";
    var cost_type_id = "";
    var audit_status = "";
	var getData = function(opts,callback){
        opts = opts || {};
        var _data={
                displayRecord : 10,
                page : opts.page || 1,
                attr_code:"ERPSTORE_BILL_TYPE",
                //搜索用的参数
                audit_status:audit_status,
                bill_type:bill_type,
                cost_type_id:cost_type_id,
                store_id:store_id
            };
        var _url= '/app/auth/erp/listErpStoreBillChargeOrder.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
                 logger.log({"Type":"operation","action":"费用列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.isFirstLoading = false
                 console.log(res);
                if (res.success) {
                    if(opts.page && opts.page > 1){
                        setTimeout(function(){
                            callback && callback(res);
                        }, 0);
                    }else{
                        setTimeout(function(){
                            vm.list = res.object || [];
                            // vm.list[0].isLook = true;
                        },0)
                    }
                } else {
                    // _g.toast(res.message);
                }

            },
            error: function(err) {
                vm.isFirstLoading = false
                _g.hideProgress();
                //_g.toast(err.message);
            }
        });
    };
    getData();
    var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data.object || _.isEmpty(data.object)){
                    return loadmore.loadend(false);
                }else{
                    for(var i = 0;i<data.object.length;i++){
                        console.log(data.object[i].month_time);
                        if(vm.list[vm.list.length-1].month_time == data.object[i].month_time){
                            vm.list[vm.list.length-1].list = vm.list[vm.list.length-1].list.concat(data.object[i].list);
                        }else{
                            vm.list = vm.list.concat(data.object[i]);
                        }
                    }
                    loadmore.loadend(true);
                }
            });
        }
    });
    _g.setPullDownRefresh(function() {
        store_id = "";
        bill_type = "";
        cost_type_id = "";
        audit_status = "";

        getData();
        loadmore.reset();
    });
    api.addEventListener && api.addEventListener({
        name: 'cost-Add'
    }, function (ret, err) {
        store_id = "";
        bill_type = "";
        cost_type_id = "";
        audit_status = "";

        getData();

    })
    api.addEventListener && api.addEventListener({
        name: 'cost-Audit'
    }, function (ret, err) {
        getData();
    })
    api.addEventListener && api.addEventListener({
        name: 'cost-del'
    }, function (ret, err) {
        getData();
    })
    api.addEventListener && api.addEventListener({
        name: 'cost-screen'
    }, function (ret, err) {
        api.openDrawerPane({
            type: 'right'
        });
    })
    api.addEventListener && api.addEventListener({
        name: 'cost-search'
    }, function (ret, err) {
        vm.isLook = true;
        vm.cost_type_nameL = ret.value.cost_type_name?ret.value.cost_type_name:"全部费用类型";
        vm.bill_type_remark = ret.value.bill_type_remark?ret.value.bill_type_remark:"全部收支方式";
        store_id = ret.value.store_id;
        bill_type = ret.value.bill_type;
        cost_type_id = ret.value.cost_type_id;
        audit_status = ret.value.audit_status;
        getData();
    })

	module.exports = {};
});
