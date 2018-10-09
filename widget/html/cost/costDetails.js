define(function(require, exports, module) {
    var Http = require('U/http');
    var entId = api.pageParam.entId;
    var vm = new Vue({
        el: '#costDetails',
        template: _g.getTemplate('cost/costDetails-body-V'),
        data: {
            isBoss:_g.getLS('UserInfo').notes == "company_admin"?true:false,
            audit_status:'00N',
            bill_type:'100',
            bill_type_remark:'应收款',
            charge_amount:'',
            cost_type_name:'加盟费',
            happen_date:'2017-01-01',
        	store_name:'天津店',
            store_id:1,
            store_bill_charge_order_id:1
        },
        created: function(){
            this.audit_status='',
            this.bill_type='',
            this.bill_type_remark='',
            this.charge_amount='',
            this.cost_type_name='',
            this.happen_date='',
            this.store_name='',
            this.store_id=null,
            this.store_bill_charge_order_id=null
        },
        watch: {

        },
        filters: {

        },
        methods: {
            onAuditStatus : function(id){
                var title = "确认审核"
                var message = "是否保存并审核？"
                _g.confirm(title,message,function(){
                    var _data= {
                            store_bill_charge_order_id:id
                          };
                    var _url='/app/auth/erp/auditErpStoreBillChargeOrder.do';
                    Http.ajax({
                        data:_data,
                        api_versions: 'v2',
                        url:_url,
                        success: function(res) {
                            logger.log({"Type":"operation","action":"费用详情页面审核","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                            if (res.success) {
                               api && api.closeWin();
                               api.sendEvent({
                                    name: 'cost-Audit',
                                });

                            } else {
                                _g.toast(res.message);
                            }
                        },
                        error: function(err) {

                            _g.hideProgress();
                        }
                    });
                })

            },
            onItemDel:function(id){
                var title = "确认删除";
                var message = "是否确认删除？"
                _g.confirm(title,message,function(){
                    var _data= {
                            store_bill_charge_order_id:id
                          };
                    var _url='/app/auth/erp/deleteErpStoreBillChargeOrder.do';
                    Http.ajax({
                        data:_data,
                        api_versions: 'v2',
                        url:_url,

                        success: function(res) {
                            logger.log({"Type":"operation","action":"费用详情页面删除","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                            _g.hideProgress();
                            if (res.success) {
                               api && api.closeWin();
                               api.sendEvent({
                                    name: 'cost-del',
                                });
                            } else {
                                _g.toast(res.message);
                            }
                        },
                        error: function(err) {
                            _g.hideProgress();
                        }
                    });
                })

            }
		}
    });
	var getData = function(){
        var _data= {
                bill_type_attr_code:"ERPSTORE_BILL_TYPE",
                store_bill_charge_order_id:entId
            };
        var _url='/app/auth/erp/getErpStoreBillChargeOrder.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function(res) {
                logger.log({"Type":"operation","action":"费用详情页面获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    vm.audit_status = res.object.audit_status == "00P"?0:1;
                    vm.bill_type = res.object.bill_type;
                    vm.bill_type_remark = res.object.bill_type_remark;
                    vm.charge_amount = res.object.charge_amount;
                    vm.cost_type_name = res.object.cost_type_name;
                    vm.happen_date = res.object.happen_date;
                    vm.store_name = res.object.store_name;
                    vm.store_id = res.object.store_id;
                    vm.store_bill_charge_order_id = res.object.store_bill_charge_order_id;
                }else{

                }
            },
            error: function(err) {
            }
        });
    }
    getData();
    api.addEventListener && api.addEventListener({
        name: 'cost-editCost'
    }, function (ret, err) {
        _g.openWin({
            header: {
                data: {
                    title: '编辑费用'
                },
            },
            pageParam : {
                entId:entId
            },
            name: 'cost-costAdd',
            url: '../cost/costAdd.html',
            bounces: false,
            slidBackEnabled: false,
        })
    })
    // api.addEventListener && api.addEventListener({
    //     name: 'cost-Add'
    // }, function (ret, err) {
    //     // alert();
    //     getData();
    // })
	module.exports = {};
});
