define(function(require, exports, module) {
    var Http = require('U/http');
    var storeData = [];
    var CostTypeData = [];
    var entId = api.pageParam.entId;
    // var entId =161;
    var billData = [{bill_type_remark:"应收款",bill_type:"100"},{bill_type_remark:"应付款",bill_type:"200"}];
    var dtPicker = new mui.DtPicker({
        beginDate: new Date(1900, 1, 1),
        type: 'date'
    });

    var vm = new Vue({
        el: '#costAdd',
        template: _g.getTemplate('cost/costAdd-body-V'),
        data: {
            isBoss:_g.getLS('UserInfo').notes == "company_admin"?true:false,
            audit_status:"",
        	store_name:"",
            store_id:"",
            happen_date:"",
            bill_type:"",
            bill_type_remark:"",
            cost_type_name:"",
            cost_type_id:null,
            charge_amount:"",
            store_bill_charge_order_id:""
        },
        created: function(){
            this.audit_status = "";
            this.store_name = "";
            this.store_id = "";
            this.happen_date = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
            this.bill_type = "";
            this.bill_type_remark = "";
            this.cost_type_name = "";
            this.cost_type_id = null;
            this.charge_amount = "";
        },
        watch: {

        },
        filters: {

        },
        methods: {

            onCostAdd : function(){
                if(this.isBoss){
                    if(this.store_name == ""){
                        _g.toast("请选择发生门店")
                        return false;
                    }
                }
                if(this.happen_date == ""){
                    _g.toast("发生日期不能为空")
                    return false;
                }
                if(this.bill_type_remark == ""){
                    _g.toast("请选择收支方式")
                    return false;
                }
                if(this.cost_type_name == ""){
                    _g.toast("请选择费用类型")
                    return false;
                }
                if(this.charge_amount == ""){
                    _g.toast("请输入金额")
                    return false;
                }
                if(isNaN(this.charge_amount)){
                    _g.toast("金额输入有误")
                    return false;
                }
                
                var _data= {
                        audit_status:"00N",
                        happen_date:this.happen_date,
                        bill_type:this.bill_type,
                        charge_amount:this.charge_amount*100,
                        cost_type_id:this.cost_type_id,
                        store_id:this.store_id,
                        store_bill_charge_order_id:this.store_bill_charge_order_id
                    };
                var _url='/app/auth/erp/saveErpStoreBillChargeOrder.do';
                var title = '确认保存？';
                var message = '是否确认保存';
                 _g.confirm(title,message,function () {
                    logger.log({"Type":"operation","action":"添加费用确认","Win_name":api.winName,"data":_data});
                    Http.ajax({
                        url:_url,
                        data:_data,
                        api_versions: 'v2',
                        success: function(ret){
                            logger.log({"Type":"operation","action":"添加费用","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                            if(ret.success){
                                if(entId){  
                                    api.closeToWin({
                                        name:'shop-costAdministration-win'
                                    })

                                }else{
                                    api && api.closeWin();
                                }
                                api.sendEvent({
                                    name: 'cost-Add',
                                });
                            }else{
                                _g.toast(ret.message);
                            }
                        },
                        error : function(err){
                        }
                    });
                });
                

        	},
            onCostSave:function(){
                var title="确认审核？";
                var message = "是否保存并审核？";
                _g.confirm(title,message,function(){
                    if(vm.isBoss){
                        if(vm.store_name == ""){
                            _g.toast("请选择发生门店")
                            return false;
                        }
                    }
                    if(vm.happen_date == ""){
                        _g.toast("发生日期不能为空")
                        return false;
                    }
                    if(vm.bill_type == ""){
                        _g.toast("请选择收支方式")
                        return false;
                    }
                    if(vm.cost_type_name == ""){
                        _g.toast("请选择费用类型")
                        return false;
                    }
                    if(vm.charge_amount == ""){
                        _g.toast("请输入金额")
                        return false;
                    }
                    if(isNaN(vm.charge_amount)){
                        _g.toast("金额输入有误")
                        return false;
                    }

                    var _data= {
                            audit_status:"00P",
                            happen_date:vm.happen_date,
                            bill_type:vm.bill_type,
                            charge_amount:vm.charge_amount*100,
                            cost_type_id:vm.cost_type_id,
                            store_id:vm.store_id,
                            store_bill_charge_order_id:vm.store_bill_charge_order_id
                        };
                    var _url='/app/auth/erp/saveErpStoreBillChargeOrder.do';
                    Http.ajax({
                        url:_url,
                        data:_data,
                        api_versions: 'v2',
                        success: function(ret){
                            logger.log({"Type":"operation","action":"新增费用","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                            if(ret.success){
                                if(entId){
                                    // _g.openDrawerLayout({
                                    //     header: {
                                    //         data: {
                                    //             title: '费用管理',
                                    //             rightText: '筛选',
                                    //         }
                                    //     },
                                    //     pageParam: {

                                    //     },
                                    //     name: 'shop-costAdministration',
                                    //     url: '../cost/costAdministration.html',
                                    //     rightPane: {
                                    //         name: 'rightPane',
                                    //         url: '../cost/costScreenList.html'
                                    //     }
                                    // })
                                    api.closeToWin({
                                        name:'shop-costAdministration-win'
                                    })

                                }else{
                                    api && api.closeWin();
                                }
                                api.sendEvent({
                                    name: 'cost-Add',
                                });
                            }else{
                                _g.toast(ret.message);
                            }
                        },
                        error : function(err){
                            _g.hideProgress();
                        }
                    });
                })
            },
            onMemDate: function (type) {
                dtPicker.show(function (selectItems) {
                    this[type] = selectItems.value;
                }.bind(this));
            },
            onStoreName: function(){
                var self = this;
                var otPicker = new mui.PopPicker();
                otPicker.setData(storeData);
                otPicker.show(function(selectItem){
                    self.store_name = selectItem[0].text;
                    self.store_id = selectItem[0].value;
                    otPicker.dispose();
                });
                for(var i = 0;i<storeData.length;i++){
                    if(self.store_id == storeData[i].value){
                        otPicker.pickers[0].setSelectedIndex(i, 100);
                    }
                }
            },
            onCostType: function(){
                var self = this;
                var otPicker = new mui.PopPicker();
                otPicker.setData(CostTypeData);
                otPicker.show(function(selectItem){
                    self.cost_type_name = selectItem[0].text;
                    self.cost_type_id = selectItem[0].value;
                    otPicker.dispose();
                });
                for(var i = 0;i<CostTypeData.length;i++){
                    if(self.cost_type_id == CostTypeData[i].value){
                        otPicker.pickers[0].setSelectedIndex(i, 100);
                    }
                }
            },
            onBillType: function(){
                var self = this;
                var otPicker = new mui.PopPicker();
                otPicker.setData(billData);
                otPicker.show(function(selectItem){
                    self.bill_type_remark = selectItem[0].text;
                    self.bill_type = selectItem[0].value;
                    otPicker.dispose();
                });
                for(var i = 0;i<billData.length;i++){
                    if(self.bill_type == billData[i].value){
                        otPicker.pickers[0].setSelectedIndex(i, 100);
                    }
                }
                
            }
        }
    });
    var getData = function(){
        var _data={
                    bill_type_attr_code:"ERPSTORE_BILL_TYPE",
                    store_bill_charge_order_id:entId
                };
        var _url='/app/auth/erp/getErpStoreBillChargeOrder.do';
        if(entId){
           Http.ajax({
                url:_url,
                data:_data,
                api_versions: 'v2',
                success: function(res){
                     logger.log({"Type":"operation","action":"新增费用页面获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                    if(res.success){
                        vm.store_name = res.object.store_name;
                        vm.store_id = res.object.store_id;
                        vm.happen_date = res.object.happen_date;
                        vm.bill_type_remark = res.object.bill_type_remark;
                        vm.bill_type = res.object.bill_type;
                        vm.cost_type_name = res.object.cost_type_name;
                        vm.cost_type_id = res.object.cost_type_id;
                        vm.charge_amount = res.object.charge_amount/100;
                        vm.store_bill_charge_order_id = res.object.store_bill_charge_order_id;
                    }else{
                        _g.toast(res.message);
                    }
                }
        });
        }

    };
    getData();
	var getStore = function(){
        var _url='/app/auth/store/list.do';
        Http.ajax({
            url:_url,
            data: {},
            api_versions: 'v2',
            success: function(ret){
                logger.log({"Type":"operation","action":"新增费用页面获取门店列表","Win_name":api.winName,"message":ret,"requireURL":_url})
                if(ret.success){
                    for(var i = 0;i<ret.object.length;i++){
                        if(ret.object[i].org_type != "001"){
                            var data = {
                                value:ret.object[i].store_id,
                                text:ret.object[i].org_name
                            }
                            storeData.push(data);
                        }
                    }
                }else{
                    _g.toast(ret.message);
                }
            }
        });
    };
    var getCostType = function(){
        var _url='/app/auth/erp/listCostyType.do';
        Http.ajax({
            url:_url,
            data: {},
            api_versions: 'v2',
            success: function(ret){
                 logger.log({"Type":"operation","action":"获取费用类型","Win_name":api.winName,"message":ret,"requireURL":_url})
                if(ret.success){
                    CostTypeData = _.map(ret.object, function(item){
                        return {
                            value: item.cost_type_id,
                            text: item.cost_type_name
                        };
                    });
                }else{
                    _g.toast(ret.message);
                }
            }
        });
    };
    var getBillType = function(){
        billData = _.map(billData, function(item){
            return {
                value: item.bill_type,
                text: item.bill_type_remark
            };
        });
    };
    getBillType();
    getCostType();
    getStore();
	module.exports = {};
});
