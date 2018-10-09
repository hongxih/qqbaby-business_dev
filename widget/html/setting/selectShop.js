define(function(require,exports,module){

    var Http = require('U/http');
    var Account = require('U/account');

    var vm = new Vue({
        el:'#selectShop',
        template : _g.getTemplate('setting/selectShop-body-V'),
        data : {
             shopName:[{
                 name : '爱婴家园',
                 id : '11'
                },{
                 name : '爱婴家xxxx园',
                 id : '22'
                 }],
            isShow:_g.getLS('UserInfo').notes,
        },
        created:function(){
            this.shopName = [];
        },
        methods : {
            //选择门店
            getShop : function(idx,id,name){
                _.each(this.shopName,function(item){
                   item.is_selected = false;
                });
                this.shopName[idx].is_selected = true;
                _g.setLS('StoreName',name);
                var _data= {
                        org_id : id
                    };
                var _url='/app/auth/store/select.do';
                Http.ajax({
                    url:_url,
                    api_versions: 'v2',
                    data:_data,
                    success: function(res){
                        logger.log({"Type":"operation","action":"选择门店","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                        if(res.code == 200){
                            if(_g.getLS('UserInfo').notes === "company_admin"){
                                // 抽屉式侧栏效果，老板
                                //api && api.closeToWin({
                                //    name: 'boss-index-win'
                                //});
                                api && api.openDrawerLayout({
                                name: 'boss-index-win',
                                url: '../boss/index.html',
                                bounces: false,
                                slidBackEnabled: false,
                                pageParam: { key: 'fade' },
                                animation: { type: 'none' },
                                leftPane: {
                                    name: 'main-index-nav',
                                    url: '../main/nav.html',
                                    bgColor: 'rgba(0,0,0,0.0)',
                                    edge: 110
                                    }
                                });
                            }else if(_g.getLS('UserInfo').notes === "store_admin"){
                                // api && api.closeToWin({
                                //    name: 'manager-index'
                                // });
                                api && api.closeWin({
                                    name:"setting-setting-win"
                                });
                                api && api.closeWin({
                                    name:"manager-index"
                                });
                                api && api.openWin({
                                    name: 'manager-index',
                                    url: '../manager/index.html',
                                    bounces: false,
                                    slidBackEnabled: false,
                                    reload:true,
                                    pageParam:{
                                        storeName:_g.getLS("StoreName"),
                                    }
                                });

                            }else{

                                api && api.closeWin({
                                    name:'setting-setting-win'
                                });
                                api && api.closeWin({
                                    name:'clerk-index'
                                });
                                api.openWin && api.openWin({
                                    name: 'clerk-index',
                                    url: '../clerk/index.html',
                                    bounces: false,
                                    slidBackEnabled: false,
                                    reload:true,
                                    pageParam:{
                                         storeName:_g.getLS("StoreName"),
                                    }
                                });
                            }

                            //setTimeout(function(){
                            //    api && api.sendEvent({
                            //        name: 'changeShop-selectShop',
                            //        extra: {
                            //            name:name
                            //        }
                            //    });
                            //},1000)
                            api && api.sendEvent({
                                name:'selectStore',
                            });
                        }else{
                           _g.toast(res.message);
                        }
                    },
                    error:function(){
                        _g.hideProgress();
                    }
                });
            },
            //退出登录
            exitSign : function(){
                Account.logout();
            }
       }
    });

    var getData = function(){
        var _url='/app/auth/store/list.do';
        Http.ajax({
            url:_url,
            data: {},
            api_versions: 'v2',
            success: function(res){
                logger.log({"Type":"operation","action":"获取门店列表","Win_name":api.winName,"message":res,"requireURL":_url})
                if(res.code == 200){
                    setTimeout(function(){
                      var lists = getDetail(res);
                        vm.shopName = lists;
                    },0);
                }else{
                    _g.toast(ret.message);
                }

            },
            error:function () {
                _g.hideProgress();
            }
        });
    };

    var getDetail = function(res){
        return _.map(res.object,function(item){
            return {
                name : item.org_name,
                id : item.org_id,
                org_code : item.org_code,
                company_id : item.company_id,
                org_type : item.org_type,
                is_selected : item.is_selected
            }
        })
    };
    getData ();
    module.exports = {};
    window.app = vm.isShow
});
