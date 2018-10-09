define(function(require, exports, module) {

    // 初始化极光推送
    var ajpush = require('U/ajpush');
         ajpush.init();
         ajpush.click();
    function openMainPage() {
        if(_g.getLS('UserInfo')){
            if(_g.getLS('UserInfo').notes === 'company_admin'){
                // 抽屉式侧栏效果，老板
                api && api.openDrawerLayout({
                    name: 'boss-index-win',
                    url: './html/boss/index.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: { key: 'fade' },
                    animation: { type: 'none' }, 
                    leftPane: {
                        name: 'main-index-nav',
                        url: './html/main/nav.html',
                        bgColor: 'rgba(0,0,0,0.0)',
                        edge: 110
                    }
                });
            }else if(_g.getLS('UserInfo').notes === 'store_admin'){
                // 店长
                api.openWin && api.openWin({
                    name: 'manager-index',
                    url: './html/manager/index.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }else if(_g.getLS('UserInfo').notes === 'sales'){
                // 店员
                api.openWin && api.openWin({
                    name: 'clerk-index',
                    url: './html/clerk/index.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }
        }else{
            // 登录
            api && api.openWin({
                name: 'account-login-win',
                url: './html/account/login.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: { key: 'value' },
                animation: { type: 'none' }
            });
        }
    };


    api.addEventListener && api.addEventListener({
        name:'online'
    }, function(ret, err){
        //alert(JSON.stringify(ret) + new Date());
    });



    // 清除小红点
    api.setAppIconBadge({
        badge: 0
    });


    openMainPage();
    module.exports = {};

});
