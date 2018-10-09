define(function (require, exports, module) {
    var Http = require('U/http');
    var timeout; //长按定时器
    var header = _g.addHeader({
        template: '../html/main/login-header-V',
        data: {
            title: '登录'
        }
    });
    var login = new Vue({
        el: '#login',
        template: _g.getTemplate('account/login-V'),
        data: {
            phone: '',
            pwd: '',
            isPhoneInput: false,
            isPhoneSuccess: false,
            isPwdSuccess: false,
            isDisable: true,
            envirs: [
                {
                    envir: "dev",
                    envirName: "开发环境"
                },
                {
                    envir: "test",
                    envirName: "测试环境"
                },
                {
                    envir: "grayTest",
                    envirName: "灰度环境"
                },
                {
                    envir: "pub",
                    envirName: "正式环境"
                },
            ],
            envirIP: ''
        },
        methods: {
            onSetEnvir: function (envir, envirName) {
                //清楚输入框输入的IP缓存
                _g.rmLS("IP");
                _g.setLS("envir", envir);
                _g.toast('进入' + envirName + '...');
                location.reload();
            },
            onSetEnvirIP: function () {
                if(this.envirIP == '') {
                    _g.toast("IP不能为空");
                    return false;
                }
                var address;
                if(this.envirIP.length == 2 || this.envirIP.length == 1) {
                    address = 'http://' + '192.168.10.' + this.envirIP + ':60021';
                }else {
                    address = 'http://' + this.envirIP + ':60021';
                }
                _g.setLS("IP", address);
                _g.toast('域名为' + address);
                location.reload();
            },
            onPhoneInput: function () {
                var phoneReg = /^1[0-9]{10}$/;
                this.isPhoneInput = true;
                if (phoneReg.test(this.phone)) {
                    this.isPhoneSuccess = true;
                } else {
                    this.isPhoneSuccess = false;
                }
                if (this.isPhoneSuccess && this.isPwdSuccess) {
                    this.isDisable = false;
                } else {
                    this.isDisable = true;
                }
                if (this.phone == '') {
                    this.pwd = '';
                }
            },
            clearPhone: function () {
                this.phone = '';
                this.pwd = '';
                this.isPhoneInput = false;
                this.isPhoneSuccess = false;
                this.isDisable = true;
            },
            onPwdInput: function () {
                var pwdReg = /^[a-zA-Z0-9]{6,16}$/;
                if (pwdReg.test(this.pwd)) {
                    this.isPwdSuccess = true;
                } else {
                    this.isPwdSuccess = false;
                    this.isDisable = true;
                }
                if (this.isPhoneSuccess && this.isPwdSuccess) {
                    this.isDisable = false;
                }
            },
            onLoginClick: function () {
                var self = this;
                if (this.isDisable || !this.isPhoneSuccess || !this.isPwdSuccess) {
                    return;
                }
                if (this.isPhoneSuccess && this.isPwdSuccess) {
                    var deviceModel = api.deviceModel;
                    var systemType = api.systemType;
                    var systemVersion = api.systemVersion;
                    var deviceName = api.deviceName;
                    var _data = {
                        user_phone: this.phone,
                        password: this.pwd
                    };
                    var _url = '/app/account/login.do';
                    Http.ajax({
                        data: _data,
                        api_versions: 'v2',
                        url: _url,
                        success: function (ret) {
                            logger.log({ "Type": "operation", "action": "登录情况", "Win_name": api.winName, "data": _data, "message": ret, "requireURL": _url, "设备型号": deviceModel, "系统类型": systemType, "手机平台的系统版本": systemVersion, "设备名称": deviceName })
                            if (ret.code == 200) {
                                if (!ret.object) return
                                _g.setLS('UserInfo', ret.object);
                                _g.toast('登录成功!');
                                self.phone = '';
                                self.pwd = '';
                                self.isPhoneInput = false;
                                self.isPhoneSuccess = false;
                                self.isPwdSuccess = false;
                                self.isDisable = true;
                                if (ret.object.notes === 'company_admin') {
                                    // 老板
                                    api.openDrawerLayout && api.openDrawerLayout({
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
                                } else if (ret.object.notes === 'store_admin') {
                                    api.openWin && api.openWin({
                                        name: 'manager-index',
                                        url: '../manager/index.html',
                                        bounces: false,
                                        slidBackEnabled: false
                                    });
                                } else if (ret.object.notes === 'sales') {
                                    api.openWin && api.openWin({
                                        name: 'clerk-index',
                                        url: '../clerk/index.html',
                                        bounces: false,
                                        slidBackEnabled: false
                                    });
                                }

                            } else {
                                _g.toast(ret.message);
                            }
                        },
                        error: function (err) { },
                    });
                }
            },
            onForgetPwd: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '忘记密码'
                        }
                    },
                    name: 'account-forget',
                    url: '../account/forget.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }
        }
    });

    //长按logo设置环境
    var logo = $('.ui-login__logo__img')[0];
    logo.addEventListener('touchstart', function (e) {
        timeout = setTimeout(function () {
            $(logo).addClass("settingEnvir");
            $(".ui-btnBox__setEnvir").addClass("settingEnvir");
            $(".inputIPBox").show(1000);
            _g.toast(CONFIG.HOST);
        }, 3000);  //长按时间超过3000ms，则执行传入的方法
    }, false);
    logo.addEventListener('touchend', function (e) {
        clearTimeout(timeout);
    }, false);

    // 解决fixed浮动的bug
    // $('#login').css('height', window.innerHeight + 'px');

    turnSystem = function () {
        this.phone = '';
        this.pwd = '';
        this.isPhoneInput = false;
        this.isPhoneSuccess = false;
        this.isPwdSuccess = false;
        this.isDisable = true;

        api.openWin && api.openWin({
            name: 'account-system',
            url: 'system.html',
            bounces: false,
            slidBackEnabled: false
        });
    }
    // 监听安卓返回按钮事件
    api.addEventListener && api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        api.closeWidget();
    });
    logger.log({ "Type": "operation", "action": "登录页面", "Win_name": api.winName });
    module.exports = {};
});
