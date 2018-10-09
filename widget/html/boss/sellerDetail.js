define(function(require,exports,module){
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var sales_id = api && api.pageParam.sales_id;
    var vm = new Vue({
        el:'#sellerDetail',
        template : _g.getTemplate('boss/sellerDetail-body-V'),
        data : {
            isShow:false,
            defaultType:'提成类型',
            type:[
                {
                    typeName:"全部提成类型",
                    typeNum :null
                },
                {
                    typeName:"单品提成",
                    typeNum :'001'
                },
                {
                    typeName:"品牌提成",
                    typeNum :'002'
                },
                {
                    typeName:"类别提成",
                    typeNum :'003'
                },
                {
                    typeName:"新客开发提成",
                    typeNum :'004'
                },
                {
                    typeName:"总额提成",
                    typeNum :'006'
                }
            ],
             lists : [{
                 time : '2014-12-12',
                 credit : '20000',
                 desc : '22222asdsad',
                 buyer : 'asjdka ',
                 type : 'asjoqwjnas',
                 sales_id : null
             }],
            typeNum : null
        },
        created:function(){
            this.lists = {};
        },
        methods : {
            onShowType:function () {
                this.isShow = !this.isShow;
            },

            onSelectType:function (index,num,type) {

                this.selectIdx = index;
                this.defaultType = type;
                this.isShow = !this.isShow;
                this.typeNum = num;
                getData(this.typeNum);
                loadmore.reset();
            }
        }
    });
    var getData = function(typeNum,opts,callback){
        var opts = opts || {};
        var _data= {
                displayRecord : 10,
                page : opts.page || 1,
                kpi_type : typeNum ? typeNum : null,
                sales_id: sales_id || null,
                store_id : null
            };
        var _url= '/app/auth/kpi/listStoreDetail.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
                logger.log({"Type":"operation","action":"sellerDetails门店详情","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function() {
                        if(opts.page && opts.page > 1){
                            setTimeout(function(){
                                callback && callback(res);
                            }, 0);
                        }else{
                            var lists = getDetail(res);
                            vm.lists = lists;
                        }
                    }, 0);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function(err) {},
        });
    }
    var getDetail = function(res){
        return _.map(res.object,function(item){
            return {
                time : item.kpi_time,
                credit : item.kpi_price,
                desc : item.kpi_store_name,
                //buyer : item.members_name ? item.members_name : null,
                type : getType(item.kpi_type),
                typeNum : null,
                sales_id : null,
                buyer : item.sales_name
            }
        })
    };
    var getType = function(num){
        var type = null;
        switch(num.toString()){
            case '001':
                type = '单品提成';
                break;
            case '002':
                type = '品牌提成';
                break;
            case '003':
                type = '类别提成';
                break;
            case '004':
                type = '新客开发提成';
                break;
            case '005':
                type = '新会员提成 ';
                break;
            default:
                type = '总额提成';
                break;
        }
        return type;
    };
    getData(vm.typeNum);

    var loadmore = new Loadmore({
        callback: function(page){
            getData(vm.typeNum,{page: page.page}, function(data){
                if(!data.object || data.object.length === 0){
                    return loadmore.loadend(false);
                }else{
                    vm.lists = vm.lists.concat(getDetail(data));
                    loadmore.loadend(true);
                }
            });
        }
    });
    module.exports = {};
});

