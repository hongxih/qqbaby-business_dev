define(function(require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    // alert(JSON.stringify(_g.getLS('UserInfo')));
    var Http = require('U/http');
    var deviceModel = api.deviceModel;
    var systemType =api.systemType;
    var systemVersion=api.systemVersion;
    var deviceName=api.deviceName;
    var user_id = '';
    var noteMes = {
        name: '',
        tel: '',
        comment: '',
        '企业编码': '',
        '企业名称': '',
    };
    if (_g.getLS("UserInfo")) {
        noteMes.name = _g.getLS('UserInfo').user_name;
        noteMes.tel = _g.getLS('UserInfo').user_phone;
        user_id = _g.getLS('UserInfo').user_id;
    }
    var param = {
        appkey: "9a560c1acf61196e9d20b4b1e2f873dd"
    };
    var clientIdParam = {
        id: '000000' + user_id
    }

    // 引入阿里推送
    if (aliPush) {
        aliPush.unbindAccount(function(ret,err) {});
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
                aliPush.bindAccount({ account: clientIdParam.id}, function (ret, err) {
                    if(!ret.status) {
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
    	template: _g.getTemplate('header/header-bossH-V'),
        data: {
            active: 0,
            list: {
                name:""
            },
            noteCount: 0,
        },
        created:function () {
            openFrameGroup();
        },
        methods: returnHeadMethod()
    });

    function returnHeadMethod(){
        return {
            onItemTap: function(index){
                this.active = index;
                api && api.sendEvent({
                    name:'changeTime',
                    extra:{
                        type : index,
                    }
                })
            },
            // 侧边栏导航
            onTapSlide: function(){
                api.openDrawerPane && api.openDrawerPane({
                    type: 'left'
                });
            },

            //打开消息中心
            onTapRightBtn:function(){
                // _g.openWin({
                //     header: {
                //         data: {
                //             title:'消息中心',
                //         },
                //     },
                //     name: 'assistant-messageCenter',
                //     url: '../assistant/messageCenter.html',
                //     bounces: true,
                //     slidBackEnabled: false,
                // })
                // 2018-7-3修改
                window.console.log('打开meiqia成功!--------------');
                // 打开meiQia
                window.meiqia.show();
            }
        };
    }
    //2018-7-3修改，计算未读消息
    function noteCount() {
        window.meiqia.getUnreadMessageCount(function (ret) {
            header.noteCount = ret.count;
        });
    }
    var getStoreList = function () {
        var _url='/app/auth/store/list.do';
        Http.ajax({
            url:_url,
            data: {},
            api_versions: 'v2',
            success: function(res){
                logger.log({"Type":"operation","action":"老板首页获取门店列表","Win_name":api.winName,"message":res,"requireURL":_url})
                if(res.success){
                    _.each(res.object,function (item) {
                        if(item.org_type == '001'){
                            console.log(item.org_name)
                            header.list.name = item.org_name
                            noteMes['企业名称'] = item.org_name;
                            noteMes['企业编码'] = item.org_code;
                        }
                        
                    })
                }else{
                    _g.toast(res.message);
                }
            },
            error:function (err) {

            }
        });
    }

    getStoreList();

    function openFrameGroup(){
        headerHeight = $('#header').offset().height + _g.getBarHeight();
        api && api.openFrameGroup({
            name: 'boss-group',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: headerHeight,
                w: 'auto',
                h: window.innerHeight - headerHeight
            },
            index: 0,
            preload: 1,
            frames: [{
                name: 'boss-home-frame',
                url: '../boss/home.html',
                bounces: true,
            },
            ]
        }, function(ret, err) {
        });
    }

    // 监听安卓返回按钮事件
    api && api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.closeWidget();
    });

    //监听从后台进入app事件
    api && api.addEventListener({
        name: 'resume'
    }, function (ret, err) {
        noteCount();
    });
    //监听打开window事件
    _g.viewAppear(function (ret, err) {
        noteCount();
    });
    api && api.addEventListener({
        name: 'note_refresh'
    }, function (ret, err) {
        noteCount();
    });
    //api && api.addEventListener({
    //    name: 'changeShop-selectShop',
    //}, function(ret, err) {
    //    location.reload();
    //});
    // 侧滑效果
    // api.setFrameGroupAttr && api.setFrameGroupAttr({
    //     name: 'manage-group',
    //     scrollEnabled: true
    // });
    // 
    logger.log({"Type":"operation","action":"老板首页","Win_name":api.winName,"设备型号":deviceModel,"系统类型":systemType,"手机平台的系统版本":systemVersion,"设备名称":deviceName})
    module.exports = {};
});
