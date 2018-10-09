define(function(require, exports, module) {

    var headerHeight = 0;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;

    var mainFrameList = [
        'index',
        'ask',
        'me'
    ];

    var header = new Vue({
        el: '#header',
        template: _g.getTemplate('main/home-index-header-V'),
        data: {
            active: 0,
            title: '首页',
            isNavShow: 0,
            list: [
                '日',
                '周',
                '月',
            ]
        },
        created: function(){

        },
        methods: {
            onItemTap: function(index){
                if(this.active == index) return;
                this.active = index;
                //发送选择的日、周、月信息到home.js
                api.sendEvent && api.sendEvent({
                    name: 'changeTime',
                    extra: {
                        type: this.active,
                    }
                })
            },
            // 侧边栏导航
            onTapSlide: function(){
                api.openDrawerPane && api.openDrawerPane({
                    type: 'left'
                });
            }
        }
    });
    // var footer = new Vue({
    //     el: '#footer',
    //     template: _g.getTemplate('main/footer-V'),
    //     data: {
    //         active: 0,
    //         list: [{
    //             title: '首页',
    //             tag: 'home'
    //         }, {
    //             title: '店务',
    //             tag: 'business'
    //         }, {
    //             title: '统计',
    //             tag: 'statistics'
    //         }, {
    //             title: '我的',
    //             tag: 'me'
    //         }]
    //     },
    //     methods: {
    //         onItemTap: function(index) {
    //             if (this.active == index) return;
    //             if(index == 0){
    //                 api && api.sendEvent({
    //                     name:'refresh-home'
    //                 });
    //                 header.isHome = 1;
    //             }else{
    //                 header.isHome = 0;
    //             }
    //             if(index == 2){
    //                 // _g.closeWins(['me-myInfo-win','me-setting-win','main-index-win','shop-system-win']);
    //                 _g.toast('暂未开发');
    //                 return;
    //             }
    //             this.active = index;
    //             header.title = header.list[index];
    //              api.setFrameAttr({
    //                 name: 'me-index-frame',
    //                 hidden: true
    //             });
    //             setFrameGroupIndex(index);
    //             // if (index == 4) {
    //             //     api && api.openFrame({
    //             //         name: 'me-index-frame',
    //             //         url: '../me/center.html',
    //             //         rect: {
    //             //             x: 0,
    //             //             y: 0,
    //             //             w: 'auto',
    //             //             h: windowHeight - footerHeight
    //             //         },
    //             //     });
    //             // }else{
    //             //     api.setFrameAttr({
    //             //         name: 'me-index-frame',
    //             //         hidden: true
    //             //     });
    //             //     setFrameGroupIndex(index);
    //             // }

    //         },
    //         // openMePage: function() {
    //         //     if (!_g.getLS('UserInfo')) {
    //         //         api && api.openFrame({
    //         //             name: 'me-index-frame',
    //         //             url: '../me/index.html',
    //         //             rect: {
    //         //                 x: 0,
    //         //                 y: 0,
    //         //                 w: 'auto',
    //         //                 h: windowHeight - footerHeight
    //         //             },
    //         //         });
    //         //     } else {
    //         //         api && api.openWin({
    //         //             name: 'account-login',
    //         //             url: '../account/login.html',
    //         //         });
    //         //     }
    //         // }
    //     }
    // });

    setTimeout(function() {
        openFrameGroup()
    }, 0);

    function openFrameGroup() {
        headerHeight = $('#header').offset().height;
        footerHeight = $('#footer').height();

        api && api.openFrameGroup({
            name: 'main-group',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: headerHeight,
                w: 'auto',
                h: windowHeight - headerHeight - footerHeight
            },
            index: 0,
            preload: 1,
            frames: [{
                name: 'home-home-frame',
                url: '../home/home.html',
                bounces: true,
                bgColor: '#ededed',
            }, {
                name: 'shop-home-frame',
                url: '../shop/home.html',
                bounces: true,
                bgColor: '#ededed',
            }, {
                name: 'statistics-home-frame',
                url: '../shop/home.html',
                bounces: true,
                bgColor: '#ededed',
            }, {
                name: 'me-myHome-frame',
                url: '../me/myHome.html',
                bounces: true,
                bgColor: '#ededed',
            }]
        }, function(ret, err) {
            footer.active = ret.index;
        });
    }

    function setFrameGroupIndex(index) {
        api && api.setFrameGroupIndex({
            name: 'main-group',
            index: index,
            scroll: false
        });
    }


    // 页面打开完成
    api && api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {
        _g.closeWins(['account-system-win']);
    });

    // 监听安卓返回按钮事件
    api && api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.closeWidget();
    });

    module.exports = {};

});
