define(function(require, exports, module) {
    var Http = require('U/http');
    var page = 1;
    var total_money = 0;
    var amount_sum = 0;
    var order_id = api && api.pageParam.order_id;
    var order_type = api && api.pageParam.order_type;
    var saleTicketDetail = new Vue({
        el: '#saleTicketDetail',
        template: _g.getTemplate('statistics/saleTicketDetail-body-V'),
        data: {
            isShow:false,
            detail: {
                order_no: 0,
                cash_staff_name: '',
                cash_staff: 0,
                sale_staff_name: '',
                sale_staff: 0,
                distribution_mode: '',
                distribution_mode_name: '',
                create_time: '',
                total_money: 0,
                amount_sum: 0,
                phone:'',
                user_name:'',
                commodity_sales_mod:null,
            },
            list: [{
                goods_name: '婴儿奶瓶(110120119)',
                bar_code: '',
                sku_name: '',
                sku_code: '蓝色:500ml',
                retail_price: 4500,
                sale_price: 3500,
                amount: 4,
                total_sale_price: 9000,
            }, ],
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onShowDetails:function(){
                this.isShow = !this.isShow;
                }

        }
    });
    getData = function(order_id, order_type) {
        var _data= {
                order_id: order_id,
                order_type: order_type
            };
        var _url='/app/auth/page/retail/getOrderItemDetail.do';
        Http.ajax({
            data:_data,
            isSync:true,
            url:_url,
            success: function(ret) {
                logger.log({"Type":"operation","action":"saleTicketDetail获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if (ret.code == 200) {
                    var dt = ret.object;
                    getDataList(dt);
                    saleTicketDetail.list = getDataDetailList(dt);
                    saleTicketDetail.detail.amount_sum = amount_sum || 0;
                    saleTicketDetail.detail.total_money = total_money || 0;
                    console.log(dt);
                } else {
                    _g.toast(ret.message);
                }
            },
            error: function(err) {},
        });
    }
    getDataList = function(result) {
        var item = result ? result.orderUser : {};
        saleTicketDetail.detail.order_no = item.order_no || 0;
        saleTicketDetail.detail.cash_staff_name = item.cash_staff_name || '';
        saleTicketDetail.detail.cash_staff = item.cash_staff || 0;
        saleTicketDetail.detail.sale_staff = item.sale_staff || 0;
        saleTicketDetail.detail.distribution_mode_name = item.distribution_mode_name || '';
        saleTicketDetail.detail.create_time = item.create_time || '';
        saleTicketDetail.detail.sale_staff_name = item.sale_staff_name || '';
        saleTicketDetail.detail.distribution_mode = item.distribution_mode || '';
        saleTicketDetail.detail.order_type = item.order_type || '';
        saleTicketDetail.detail.order_id = item.order_id || '';
        saleTicketDetail.detail.phone = item.phone || '';
        saleTicketDetail.detail.user_name=item.user_name || '';
        saleTicketDetail.detail.commodity_sales_mod=item.commodity_sales_mod == 1 ? false :true;
    }
    getDataDetailList = function(result) {
        var list = result ? result.orderItemList : [];
        return _.map(list, function(item) {
            amount_sum += item.amount || 0;
            total_money += (item.total_sale_price || 0);
            return {
                goods_name: item.goods_name || '',
                sku_code: item.sku_code || '',
                bar_code: item.bar_code || '',
                sku_name: item.sku_name || '',
                retail_price: item.retail_price || 0,
                sale_price: item.sale_price || 0,
                amount: item.amount || 0,
                total_sale_price: item.total_sale_price || 0,
                sale_staff_name:item.sale_staff_name,
            }
        });
    }
    getData(order_id, order_type);
    module.exports = {};
});
