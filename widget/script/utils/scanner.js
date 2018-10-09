/**
 * [description] 扫码模块
 * @author sunzhibin
 * @version v1.0
 */
define(function(require, exports, module) {
    var FNScanner = api && api.require('FNScanner');
    var check_batch_id=null;
    var check_order_id=null;
    api.addEventListener && api.addEventListener({
        name:'shop-inventoryCheckScan__param'
    },function(ret){
        check_batch_id=ret.value.check_batch_id;
        check_order_id=ret.value.check_batch_id;
    });
    module.exports = {
        openScanner:function (opt,callback) {
            //调用扫码
            var opts = opt || {};
            FNScanner.openView({
            rect:{
                x:0,   //（可选项）数字类型；模块左上角的 x 坐标（相对于所属的 Window 或 Frame）；默认：0
                y:0,   //（可选项）数字类型；模块左上角的 y 坐标（相对于所属的 Window 或 Frame）；默认：0
                // w:, //（可选项）数字类型；模块的宽度；默认：所属的 Window 或 Frame 的宽度
                // h:,  //（可选项）数字类型；模块的高度；默认：所属的 Window 或 Frame 的高度
                },
            }, function(ret, err) {
                if(ret){
                    //模板
                    if(_g.isAndroid){
                        setTimeout(function () {
                            api && api.openFrame({
                                name: 'shop-inventoryCheckScan',
                                url: '../shop/inventoryCheckScan.html',
                                rect: {
                                    x: 0,
                                    y: 0,
                                    w: 'auto',
                                    h: 'auto'
                                },
                                pageParam:{
                                    orderId:opts.orderId,
                                    batchId:opts.batchId,
                                }
                            });
                        },500);
                        if (ret.eventType == 'success') {
                            callback && callback(ret,err);
                        } else {
                        }
                    }else{
                        setTimeout(function () {
                            api && api.openFrame({
                                name: 'shop-inventoryCheckScan',
                                url: '../shop/inventoryCheckScan.html',
                                rect: {
                                    x: 0,
                                    y: 0,
                                    w: 'auto',
                                    h: 'auto'
                                },
                                pageParam:{
                                    orderId:opts.orderId,
                                    batchId:opts.batchId,
                                }
                            });
                        },0);
                        if (ret.eventType == 'success') {
                            callback && callback(ret,err);
                        } else {
                        }
                    }
                }else{
                }
            });
        },
        closeScanner:function () {
            //关闭模块
            FNScanner.closeView();
        },
    };
});
