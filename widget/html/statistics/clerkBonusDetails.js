define(function(require, exports, module) {

    var Http = require('U/http');

    var shopHome = new Vue({
        el: '#clerkBonusDetails',
        template: _g.getTemplate('statistics/clerkBonusDetails-list-V'),
        data:{
            isShow:false,
            type:[
                {
                    typeName:"单品",
                },
                {
                    typeName:"品牌",
                },
                {
                    typeName:"会员",
                },
                {
                    typeName:"全店总额",
                },
                {
                    typeName:"新会员",
                },
                {
                    typeName:"新客开发",
                },
            ],
            list:[
                {
                create_time:"2016-05-05-21  11:05:23",
                profit:"+3,000.00",
                product_name:"美素佳儿1000g奶粉美素佳儿1000g奶粉",
                user_name:"王思聪",
                bonus_type:"单品提成",
                },

                {
                create_time:"2016-05-05-21  11:05:23",
                profit:"+3,000.00",
                product_name:"美素佳儿1000g奶粉美素佳儿1000g奶粉",
                user_name:"王思聪",
                bonus_type:"单品提成",
                },
            ],
        	
        },
        created:function(){
           // this.productList = [];
        },
        methods:{
            onShowType:function () {
                this.isShow = !this.isShow;
                if(this.isShow){
                    $('.ui-clerkBonusDetails__iconRight').css("background-image","url('../../image/clerk/unfold.png')");
                }else{
                    $('.ui-clerkBonusDetails__iconRight').css("background-image","url('../../image/clerk/fold.png')");
                }
                
            },

            onSelectType:function (index) {
                $('#typeName').html(this.type[index].typeName);
                $('.ui-clerkBonusDetails__typeList i').removeClass('is-select');
                $('.ui-clerkBonusDetails__typeList i').eq(index).addClass('is-select');
            },
        }
    });

    module.exports = {};
});