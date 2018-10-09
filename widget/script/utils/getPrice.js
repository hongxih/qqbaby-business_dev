define(function(require, exports, module) {

    var Http = require('U/http');
    function getPrice(){
        Http.ajax({
            url:'/app/auth/page/ent/getChangePriceSettingSet.do',
            success:function(ret){
                if (ret.code == 200) {
                    return{
                        isSeeBuyPrice : ret.object.buy_price_check_set
                    }
                } else {
                    _g.toast(ret.message);
                }
            }
        })
    }
    module.exports = getPrice;
});

