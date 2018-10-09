define(function(require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    console.log(window.DeviceId);
    var Http = require('U/http');
    var StoreName = _g.getLS('StoreName') || _g.getLS('UserInfo').store_name;
    var deviceModel = api.deviceModel;
    var systemType =api.systemType;
    var systemVersion=api.systemVersion;
    var deviceName=api.deviceName;
    var user_id = ''
    var noteMes = {
        name: '',
        tel: '',
        comment: '',
        '企业编码': _g.getLS('UserInfo').company_code || '',
        '企业名称': _g.getLS('UserInfo').company_name || '',
        '门店编码': _g.getLS('UserInfo').store_code || '',
        '门店名称': StoreName
    };
    if (_g.getLS("UserInfo")) {
        noteMes.name = _g.getLS('UserInfo').user_name;
        noteMes.tel = _g.getLS('UserInfo').user_phone;
        user_id = _g.getLS('UserInfo').user_id;
    }
    var clientIdParam = {
        id: '000000' + user_id
    }

    // 引入阿里推送
    if (aliPush) {
        aliPush.unbindAccount(function (ret, err) { });
    }
    var aliPush = api.require('aliPush');
    if (aliPush) {
        aliPush.isRegister(function (ret, err) {
            if (ret.status) {
                // 监听通知
                aliPush.addEventListener({
                    name: 'onNotification'
                }, function (ret, err) {
                    console.log('onNotification' + JSON.stringify(ret));
                    noteCount();
                });
                // 打开通知消息
                aliPush.addEventListener({
                    name: 'onNotificationOpened'
                }, function (ret, err) {
                    console.log("打开通知消息");
                    // 打开meiQia
                    window.meiqia.show();
                });

                // 绑定账号
                console.log('clientIdParam.id ' + clientIdParam.id);
                aliPush.bindAccount({ account: clientIdParam.id }, function (ret, err) {
                    if (!ret.status) {
                        console.log('aliPush绑定失败！ ');
                    }
                });
            } else {
                console.log("ali推送注册失败：" + JSON.stringify(err));
            }
        });
    }
    // 引入meiQia
    // meiQia设置自定义信息
    console.log('noteMes ' + JSON.stringify(noteMes));
    window.meiqia.setClientInfo(noteMes);
    // 设置登录用户
    window.meiqia.setLoginCustomizedId(clientIdParam);

    var header = new Vue({
    	el: '#header',
    	template: _g.getTemplate('header/header-index-V'),
        data: {
            active: 0,
            list: {
                name: StoreName,
            },
            noteCount: 0
        },
        methods: returnHeadMethod()
    });
    var footer = new Vue({
        el: '#footer',
        template: _g.getTemplate('header/footer-nav-V'),
        data: {
            active: 1,
            list: [{
                title: '首页',
            },{
                title: '门店',
            },{
                title: '店员',
            },{
                title: '会员',
            }]
        },
        methods: {
            onTap: function(index){
                this.active = index;
                setFrameGroupHead(index);
                api.setFrameGroupIndex && api.setFrameGroupIndex({
                    name: 'manage-group',
                    index: index,
                    scroll: false,
                    reload: false
                });
            },

        }
    });

    function returnHeadMethod(){
        return {
            onItemTap: function(index){
                this.active = index;
                header.active = index;
                api && api.sendEvent({
                    name:'changeTime',
                    extra:{
                        type : index,
                    }
                })
            },
            // 跳转到设置页面
            onTapSetting: function(){
                _g.openWin({
                    header: {
                        data: {
                            title: '设置'
                        }
                    },
                    name: 'setting-setting',
                    url: '../setting/setting.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam:{
                        storeName: StoreName,
                    }
                });
            },
            //打开消息中心
            // onTapRightBtn:function(){
            //     _g.openWin({
            //         header: {
            //             data: {
            //                 title:'消息中心',
            //             },
            //         },
            //         name: 'assistant-messageCenter',
            //         url: '../assistant/messageCenter.html',
            //         bounces: false,
            //         slidBackEnabled: false,
            //     })
            // },
            // 2018-07-04更新
            onTapRightBtn: function () {
                window.console.log('打开meiqia成功!--------------');
                // 打开meiQia
                window.meiqia.show();
            }
        };
    }

    //2018-7-5更新，计算未读消息
    function noteCount() {
        window.meiqia.getUnreadMessageCount(function (ret) {
            header.noteCount = ret.count;
        });
    }

    function openFrameGroup(){
        // headerHeight=document.getElementById('header').offsetHeight + _g.getBarHeight();
        headerHeight = $('#header').offset().height + _g.getBarHeight();
        // footerHeight=document.getElementById('footer').offsetHeight;
        footerHeight = $('#footer').height();

        api && api.openFrameGroup({
            name: 'manage-group',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: headerHeight,
                w: 'auto',
                h: api.winHeight - headerHeight - footerHeight    //之前用的是window.innerHeight
            },
            index: 0,
            preload: 4,
            frames: [{
                name: 'manager-home-frame',
                url: '../manager/home.html',
                bounces: true
            }, {
                name: 'shop-home-frame',
                url: '../shop/home.html',
                bounces: true
            },{
                name: 'assistant-home-frame',
                url: '../manager/assistantFunction_manager.html',
                bounces: true
            },{
                name: 'menber-home-frame',
                url: '../manager/memberIndex.html',
                bounces: true
            }]
        }, function(ret, err) {
            footer.active = ret.index;
        });
    }

    function setFrameGroupHead(index){
        if(index === 1){
           _g.addHeader({
                data: {
                    title: '门店'
                },
                template: 'header/header-shop-V',
            });
        }else if(index === 0){
           _g.addHeader({
                data: {
                    active: header.active,
                    list: [StoreName],
                    noteCount: header.noteCount
                },
                template: 'header/header-index-V',
                methods: returnHeadMethod()
            });
        }else if(index === 2){
            _g.addHeader({
                data: {
                    title: '店员功能'
                },
                template: 'header/header-shop-V',
            });
        }else{
        	_g.addHeader({
                data: {
                    title: '会员管理'
                },
                template: 'header/header-shop-V',
            });
        }
    }

    openFrameGroup();

    // 监听安卓返回按钮事件
    api && api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.closeWidget();
    });

    api.addEventListener && api.addEventListener({
        name: 'selectStore',
    }, function (ret, err) {
        name = _g.getLS('StoreName');
    });
    // 2018-7-5更新
    //监听从后台进入app事件
    api && api.addEventListener({
        name: 'resume'
    }, function (ret, err) {
        window.console.log('监听从后台进入app事件==========================')
        noteCount();
    });
    //监听打开window事件
    _g.viewAppear(function (ret, err) {
        noteCount();
        console.log('监听打开window事件=============================');
    });
    api && api.addEventListener({
        name: 'note_refresh'
    }, function (ret, err) {
        noteCount();
        console.log('note_refresh===================================');
    });
    // 侧滑效果
    // api.setFrameGroupAttr && api.setFrameGroupAttr({
    //     name: 'manage-group',
    //     scrollEnabled: true
    // });
     logger.log({"Type":"operation","action":"店长首页","Win_name":api.winName,"设备型号":deviceModel,"系统类型":systemType,"手机平台的系统版本":systemVersion,"设备名称":deviceName})
    module.exports = {};
});
