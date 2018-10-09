define(function(require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var dtPicker = new mui.DtPicker({
        type: 'date'
    });     

    var allDetails = new Vue({
        el: '#clerkAllDetails',
        template: _g.getTemplate('clerk/clerkAllDetails-list-V'),
        data: {
            startDay: new Date().Format('yyyy-MM-dd'),
            endDay: new Date().Format('yyyy-MM-dd'),
            today: new Date().Format('yyyy-MM-dd'),
            list:[
                {
                    time:"2016-12-20 00:00:00",
                    increase:"200",
                },
            ]
        },
        created: function () {
            this.list = [];
        },
        watch:{
            startDay:function () {
                loadmore.reset();
                getData();
            },
            endDay:function () {
                loadmore.reset();                
                getData();
            }
        },
        methods: {
            dtpicker: function(type){
                var self = this;
                dtPicker.show(function(selectItems){
                    self[type.toString()] = selectItems.value;
                });
            },
            onClickTap:function (type,id) {
                _g.openWin({
                    header:{
                        data:{
                            title:'销售单详情'
                        }
                    },
                    name:'home-saleTicketDetail',
                    url:'../home/saleTicketDetail.html',
                    bounces:false,
                    pageParam:{
                        order_id:id,
                        order_type:type,
                    }
                });
            }
        }
    });

    var getData = function (opts, callback) {
        var opts = opts || {};
        var _data={
                displayRecord: 15,
                page: opts.page || 1,
                max_create_time: allDetails.endDay,
                min_create_time: allDetails.startDay,
                sale_price:0
            };
        var _url='/app/auth/page/retail/listOrderItemV2.do';
        Http.ajax({
            data:_data,
            url:_url,
            success:function (ret) {
                logger.log({"Type":"operation","action":"店员全部销售明细获取数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                if(ret.success){
                    if(opts.page && opts.page > 1){
                        setTimeout(function(){
                            callback && callback(ret.object);
                        }, 0);
                    }else{
                        allDetails.list = ret.object;    
                    }
                }else{
                    _g.hideProgress();
                    _g.toast(ret.message);
                }
            },
            error:function (err) {
                _g.toast(err.message);
            }
        });


    };
    var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data || data.length === 0){
                    return loadmore.loadend(false); 
                }else{
                    allDetails.list = allDetails.list.concat(data);
                    loadmore.loadend(true);                         
                }
            });
        }   
    });

    getData();


    module.exports = {};
});
