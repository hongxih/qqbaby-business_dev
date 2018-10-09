define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var Account = require('U/account');

    /**
     * entry 1: **ThemeName(boss,manager,clerk) ---> here
     * entry 2: memberMessage ----> here
     */

    /**===== parameter & status =====**/
    var entId = api.pageParam.entId;//user id
    var themeId=api.pageParam.themeId || '';//兼容两个入口
    var type = api.pageParam.type || '';//兼容两个入口

    var vm = new Vue({
        el: '#memberDetails',
        template: _g.getTemplate('member/memberDetails-body-V'),
        data: {
            isBoss: Account.getRole() === '0' ? false : true,      
            clerkName: '薛小姐',
            memberPhone: '18800000000',
            memberCard: '123456789',
            memberName: '方先生',
            memberSex: 1,
            memberOld: '80后',
            memberBirthday:'2012-12-12',
            memberVip: 1,
            memberIntegral: 520,
            tagList: ['80后', '小清新', '小清新', '测试一下', '80后', '小清新', '测试一下'],
            babyList: [
                {
                    babyName: '宝宝名称1',
                    babySex: 1,
                    babyState: '婴儿',
                    babyBrithday: '2017-01-01',
                    babyFeed: '喂养方式'
                },
                {
                    babyName: '宝宝名称2',
                    babySex: 1,
                    babyState: '较大婴儿',
                    babyBrithday: '2017-01-01',
                    babyFeed: '混合喂养'
                },
                {
                    babyName: '宝宝名称2',
                    babySex: 1,
                    babyState: '幼儿',
                    babyBrithday: '2017-01-01',
                    babyFeed: '喂养方式'
                }
            ]
        },
        created: function () {
            this.clerkName = _g.getLS('UserInfo').user_name;
            this.babyList = [];
            this.tagList = [];
            this.memberPhone = '';
            this.memberCard = '';
            this.memberName = '';
            this.memberSex = '';
            this.memberOld = '';
            this.memberVip = '';
            this.memberIntegral = '';
        },
        watch: {},
        filters: {
            encrept: function (val) {
                if(!val) return
                var str = val
                var a = str.slice(0, 3)
                var b = str.slice(7)
                str = a + '****' + b
                return str
            }
        },
        methods: {
            onEssentialInformation: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '基本信息',
                            rightText: '编辑'
                        }
                    },
                    pageParam: {
                        entId: entId
                    },
                    name: 'member-essentialInformation',
                    url: '../member/essentialInformation.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            oncallBack: function () {

                var list = {};
                list.tel = this.memberPhone;
                list.uName = this.memberName;
                list.cardId = this.memberCard;
                list.birthday=this.memberBrithday;
                list.memberOld=this.memberOld;
                list.sex=this.memberSex;
                list.user_id = entId;
                logger.log({"Type":"operation","action":"点击会员详情页面的回访","Win_name":api.winName,"list":list});
                _g.openWin({
                    header: {
                        data: {
                            title: '回访录入',
                            status: 'memberDetail'
                        }
                    },
                    name: 'member-clerkThemeInput',
                    url: '../member/clerkThemeInput.html',
                    pageParam: {
                        entId: entId,
                        title: api.pageParam.title || '', //主题入口带title
                        list: list,
                        themeId:api.pageParam.themeId
                    },
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onMemberStatement: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '消费明细' 
                        }
                    },
                    pageParam: {
                        entId: entId
                    },
                    name: 'member-memberStatement',
                    url: '../member/memberStatement.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onMemberRturn: function () {

                var list = {};
                list.tel = this.memberPhone;
                list.uName = this.memberName;
                list.cardId = this.memberCard;
                list.birthday=this.memberBrithday;
                list.memberOld=this.memberOld;
                list.sex=this.memberSex;
                list.user_id = entId;
                logger.log({"Type":"operation","action":"回访记录","Win_name":api.winName,"list":list});
                _g.openWin({
                    header: {
                        data: {
                            title: '回访记录',
                            rightText: Account.getRole() === '0' ? '' : '回访'
                        }
                    },
                    pageParam: {
                        entId: entId,
                        list:list,
                        title: api.pageParam.title || '', //主题入口带title
                        themeId:themeId,
                        type:type
                    },
                    name: 'member-memberReturnRecord',
                    url: '../member/memberReturnRecord.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onRePurchase: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '复购提醒'
                        }
                    },
                    pageParam: {
                        entId: entId,
                        title: "复购提醒", //主题入口带title
                        themeId: 7
                    },
                    name: 'member-memberRePu',
                    url: '../member/memberRePu.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onTagList: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '标签管理'
                        }
                    },
                    pageParam: {
                        entId: entId
                    },
                    name: 'clerk-memberTag',
                    url: '../clerk/memberTag.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onOpenDX: function (type) {
                if (type == 1) {
                    api.sms({
                        numbers: [this.memberPhone],
                        text: ''
                    }, function (ret, err) {
                        if (ret && ret.status) {
                            //已发送
                        } else {
                            //发送失败
                        }
                    });
                } else if (type == 2) {
                    if (api.systemType == 'android') {
                        api.openApp({
                            androidPkg: 'com.tencent.mm',
                            mimeType: 'text/html',
                            uri: 'http://test.com'
                        }, function (ret, err) {

                        });
                    } else {
                        api.openApp({
                            iosUrl: 'weixin://test.com', //打开微信的，其中weixin为微信的URL Scheme
                            appParam: {}
                        });
                    }
                } else {
                    api.call({
                        type: 'tel_prompt',
                        number: this.memberPhone
                    });
                }
            }
        },

    });
    var getData = function () {
        var _data= {
                user_id: entId
            };
        var _url='/app/auth/crm/user/getInfo.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function (res) {
                logger.log({"Type":"operation","action":"会员详情获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.memberPhone = res.object.phone;
                        vm.memberCard = res.object.card_no;
                        vm.memberName = res.object.user_name;
                        vm.memberSex = res.object.sex;
                        vm.memberOld = getMemberOld(res.object.birthday);
                        vm.memberBrithday=res.object.birthday;
                        vm.memberVip = getVip(res.object.user_level_name);
                        vm.memberIntegral = res.object.integral ? res.object.integral : 0;
                        vm.tagList = getTagList(res.object.tag_list);
                        vm.babyList = getBabyList(res.object.baby_list);

                    }, 0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
            }
        })
    };
    var getTagList = function (res) {
        return _.map(res, function (item) {
            return {
                tag_name: item.tag_name,
                tag_id: item.tag_id,
                is_selected: item.is_selected
            }
        })
    }
    var getVip = function(res){
        switch(res){
            case 'V1' :
                return 1;
            case 'V2' :
                return 2;
            case 'V3' :
                return 3;
            case 'V4' :
                return 4;
            case 'V5' :
                return 5;
            case 'V6' :
                return 6;
            case 'V7' :
                return 7;
            case 'V8' :
                return 8;
            case 'V9' :
                return 9;
            case 'V10' :
                return 10;
            case 'V11' :
                return 11;

        }
    }
    var getBabyList = function (res) {
        return _.map(res, function (item) {
            return {
                babyName: item.baby_name,
                babyId: item.baby_id,
                babySex: item.baby_sex,
                babyBrithday: item.birthday,
                babyFeed: getType(item.feeding_pattern),
                babyState: getState(item.birthday)
            }
        })
    }
    var getType = function (res) {
        switch (res) {
            case '001':
                return '母乳喂养';
            case '002':
                return '人工喂养';
            case '003':
                return '混合喂养';
        }
    };
    var getState = function (res) {
        if (res) {
            var data = new Date();//格式化时间
            var year = data.getFullYear(); //年
            var mouth = data.getMonth() + 1;//月
            var babyYear = res.split("-")[0];//宝宝年份
            var babyMouth = res.split("-")[1];//宝宝月份
            var beforeY = data.getFullYear()+"-"+(data.getMonth()+1)+"-"+data.getDate();//当前年份
            beforeY = new Date(Date.parse(beforeY));
            beforeY = beforeY.getTime();//格式化时间戳
            var afterY = new Date(Date.parse(res));//宝宝年份
            afterY =afterY.getTime();//格式化时间戳
                if(afterY>=beforeY){
                    return "预产期"
                }else{
                    if (year == babyYear) {
                        if (mouth - babyMouth <= 6) {
                            return "婴儿";
                        } else {
                            return "较大婴儿";
                        }
                    } else if (year - babyYear >= 1 && year - babyYear <= 3) {
                            return "幼儿";
                        } else {
                            return "儿童";
                        }

                    }
                }
        
            }
    var getMemberOld = function (res) {
        if (res) {
            var selfYear = res.split("-")[0];
            var num = selfYear.split("");
            return num[2] + "0后";
        }
    }
    getData();
    //标签返回刷新
    api.addEventListener && api.addEventListener({
        name: 'memberTagReload'
    }, function (ret, err) {
        getData();
    })
    //编辑返回刷新
    api.addEventListener && api.addEventListener({
        name: 'refresh-editMember'
    }, function (ret, err) {
        getData();
    })
    module.exports = {};
});
