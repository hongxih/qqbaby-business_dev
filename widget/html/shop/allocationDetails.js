define(function(require, exports, module) {
    var Http = require('U/http');
    var type = api.pageParam.type;
    var vm = new Vue({
        el: '#allocationDetails',
        template: _g.getTemplate('shop/allocationDetails-body-V'),
        data: {
            role:_g.getLS('UserInfo').notes == 'company_admin'?true:false,
            isShow:false,
            isItemShow:false,
            isType:type,
            allocationNo:"DB12312312312312313",
            ApplyName:"调拨申请门店名称123",
            ApplyNo:"AP123123123123",
            CallOut:"门店/仓库123",
            CallIn:"门店/仓库123",
            admin:"我是创建者1",
            adminTime:"2017-03-01 1:23:22",
            Consignor:"我是发货人1",
            ConsignorTime:"2017-03-01 1:23:22",
            Consignee:"我是收货人1",
            ConsigneeTime:"2017-03-01 1:23:22",
            termination:"我是终止人",
            terminationTime:"2017-03-01 1:23:22",
            Reviewer:"审核者名称",
            ReviewerTime:"2017-03-01 1:23:22",
            Remark:type,
            msg:"",
            list:[
            {
                isShow:(type==1||type==4)?true:false,
                goodsName:"婴儿奶粉",
                goodsCode:"123123123123",
                Specifications:"白色；500ml；规格3",
                CostPrice:30000,
                CostPriceAll:30000,
                RetailPrice:30000,
                RetailPriceAll:30000,
                allocationPrice:30000,
                allocationPriceAll:30000,
                allocationNumber:300,
                unit:"瓶",
                Remark:"我是备注备注"
            },
            {
                isShow:(type==1||type==4)?true:false,
                goodsName:"婴儿奶粉1",
                goodsCode:"2342342342",
                Specifications:"黑色；500ml；规格2",
                CostPrice:10000,
                CostPriceAll:10000,
                RetailPrice:20000,
                RetailPriceAll:20000,
                allocationPrice:30000,
                allocationPriceAll:30000,
                allocationNumber:400,
                unit:"瓶",
                Remark:"1111"
            }

            ]

        },
        created: function(){

        },
        watch: {

        },
        filters: {

        },
        methods: {
            onCloseList:function(){
                if(this.isShow==false){
                    this.isShow = true;
                }
                else{
                    this.isShow = false;
                }
            },
            onItemClick:function(idx){
                if(this.list[idx].isShow==false){
                    this.list[idx].isShow = true;
                }else{
                    this.list[idx].isShow = false;
                }
            },
            onSaveType1:function(){
                api.closeWin && api.closeWin();
            },
            onConsignorType1:function(){
                var title = "确认发货";
                var message = "确认调拨数量、调拨价是否正确?"
                _g.confirm(title,message,function(){
                    api.closeWin && api.closeWin();
                })
            },
            onDelTab:function(){
                var title = "确认删除";
                var message = "是否确认删除?"
                _g.confirm(title,message,function(){
                    api.closeWin && api.closeWin();
                })
            },
            onStopTab:function(){
                var title = "确认终止";
                var message = "是否要终止该调拨单?"
                _g.confirm(title,message,function(){
                    api.closeWin && api.closeWin();
                })
            },
            onDelItem:function(idx){
                this.list.splice(idx,1);
            },
            onSaveType4:function(){
               api.closeWin && api.closeWin(); 
           },
            onAuditType4:function(){
                var title = "确认审核";
                var message = "确认调拨数量、调拨价是否正确?"
                _g.confirm(title,message,function(){
                    api.closeWin && api.closeWin();
                })
           }
	    }
    });
    // var display = function(){
    //     if(_g.getLS('UserInfo').notes == 'company_admin'){
    //          document.getElementsByClassName('ui-allocationDetails__bottomRightCome')[0].innerHTML = "审核";
    //     };
    // }
    // display();
	module.exports = {};
});
