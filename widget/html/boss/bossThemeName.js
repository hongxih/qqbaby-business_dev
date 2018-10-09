define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var dialogBox = api.require('dialogBox');
    /**
     * entry 1: bossThemeCallBack1 ---> here
     */

    /**===== parameter & status =====**/
    var entId = api.pageParam.themeId;
    var type = 'special';
    if (entId === undefined || entId === '') {
        type = 'usual;'
    }
    var orgId = api.pageParam.orgID;

    var vm = new Vue({
        el: '#bossThemeName',
        template: _g.getTemplate('boss/bossThemeName-body-V'),
        data: {
            lastTime: "",
            isNoResult: false,
            isFirstLoading: true,
            list: [
                {
                    tel: '188 1234 1234',
                    uName: '徐佳莹',
                    hasRecall: false,
                    cardId: '123456789',
                    themeEnd: false,
                    recallTime: '02-08 10:05',
                    user_id: ''
                },
                {
                    tel: '188 1234 1234',
                    uName: '徐佳莹',
                    hasRecall: true,
                    cardId: '123456789',
                    themeEnd: false,
                    recallTime: '02-08 10:05',
                    user_id: ''
                },
                {
                    tel: '188 1234 1234',
                    uName: '',
                    hasRecall: false,
                    cardId: '123456789',
                    themeEnd: false,
                    recallTime: '02-08 10:05',
                    user_id: ''
                },
            ],
            orgId: [
                {
                    store_name: '',
                    store_id: '',   //storeId
                    org_id: ''      //orgId
                }
            ]
        },
        created: function () {
            this.list = []
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        computed: {
            isNoResult: function () {
                if (this.isFirstLoading) return false
                var sta = this.list.length === 0 ? true : false
                return sta
            }
        },
        watch: {},
        filters: {
            toBtn: function (val) {
                var str = '';
                if (val) {
                    str = '回访记录';
                } else {
                    str = '未回访';
                }
                return str;
            },
            strName: function (val) {
                var str = val || "无姓名"
                return str;
            },
            encrept: function (val) {
                if (!val) return
                var str = val
                var a = str.slice(0, 3)
                var b = str.slice(7)
                str = a + '****' + b
                return str
            }
        },
        methods: {
            onThemeInput: function (i) {
                event.stopPropagation()
                var self = this;
                dialogBox.actionMenu({
                    rect: {
                        h: 130
                    },
                    items: [
                        {
                            text: '短信',
                            icon: 'widget://image/manager/alertDx.png'
                        },
                        {
                            text: '微信',
                            icon: 'widget://image/manager/alertWx.png'
                        },
                        {
                            text: '电话',
                            icon: 'widget://image/manager/alertPhone.png'
                        }
                    ],
                    styles: {
                        bg: '#FFF',
                        column: 3,
                        itemText: {
                            color: '#000',
                            size: 12,
                            marginT: 8
                        },
                        itemIcon: {
                            size: 60
                        }
                    },
                    tapClose: true
                }, function (ret) {
                    //记录最后一次弹出的时间
                    var myDate = new Date();
                    var day = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()
                    var time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()
                    var data = day + " " + time;
                    vm.lastTime = data;
                    //调出底层通讯录
                    if (ret.index == 2) {
                        dialogBox.close({
                            dialogName: 'actionMenu'
                        });
                        api.call({
                            type: 'tel_prompt',
                            number: this.list[i].tel
                        })

                    }
                    //调出微信
                    if (ret.index == 1) {
                        dialogBox.close({
                            dialogName: 'actionMenu'
                        });
                        if (api.systemType == 'android') {//安卓
                            api.openApp({
                                androidPkg: 'com.tencent.mm',
                                mimeType: 'text/html',
                                uri: 'http://test.com'
                            }, function (ret, err) {

                            });
                        } else {//ios
                            api.openApp({
                                iosUrl: 'weixin://test.com', //打开微信的，其中weixin为微信的URL Scheme
                                appParam: {}
                            });
                        }
                    }
                    //调出短信
                    if (ret.index == 0) {
                        dialogBox.close({
                            dialogName: 'actionMenu'
                        });
                        api.sms({
                            numbers: [this.list[i].tel],
                            text: ''
                        }, function (ret, err) {
                            if (ret && ret.status) {
                                //已发送
                            } else {
                                //发送失败
                            }
                        });
                    }
                    _g.openWin({
                        header: {
                            data: {
                                title: '回访录入'
                            }
                        },
                        pageParam: {
                            list: self.list[i],
                            title: api.pageParam.title,
                            themeId: api.pageParam.themeId
                        },
                        name: 'member-clerkThemeInput',
                        url: '../member/clerkThemeInput.html',
                        bounces: false

                    });
                }.bind(this));
            },
            //入口---回访记录
            onReturnRecord: function (bVal, i) {
                if (!bVal) return;
                event.stopPropagation();
                _g.openWin({
                    header: {
                        data: {
                            title: '回访记录'
                        }
                    },
                    pageParam: {
                        list: this.list[i],
                        title: api.pageParam.title,
                        themeId: this.list[i].themeId, //come from this page this.list[i].themeId or last page
                        type: type
                    },
                    name: 'member-memberReturnRecord',
                    url: '../member/memberReturnRecord.html',
                });
            },
            //筛选
            openDrawer: function () {
                api && api.openDrawerPane({
                    type: 'right'
                });
            },
            onMerberItem: function (memberId, i) {
                _g.openWin({
                    header: {
                        data: {
                            title: '会员详情'
                        }
                    },
                    name: 'member-memberDetails',
                    url: '../member/memberDetails.html',
                    pageParam: {
                        entId: memberId,
                        title: api.pageParam.title,
                        themeId: this.list[i].themeId,
                        type: type
                    },
                });
            }

        }
    });

    var storeId = '';
    var search = '';

    //获取会员信息
    var getData = function (opts, callback) {
        var opts = opts || {};
        var _data={
                org_id: orgId || vm.orgId[0].org_id,        //门店组织ID 来源有两种情况：CallBack1跳转，搜索
                care_id: entId,                             //主题ID  number
                displayRecord: 10,                          //行数    number
                page: opts.page || 1,                       //页数    number
                search: search,                             //会员手机/姓名/卡号    string
                store_id: storeId || vm.orgId[0].store_id,   //来源有两种情况：CallBack1跳转，搜索
                type: type
            };
        var _url= '/app/auth/crm/user/listCrmCareUser.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"老板获取会员信息","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.isFirstLoading = false
                _g.hideProgress();
                if (res.success) {
                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            callback && callback(res);
                        }, 0)
                    } else {
                        /*if(_g.isEmpty(res.object)){
                         vm.isNoResult = true
                         return
                         }
                         vm.isNoResult = false*/
                        vm.list = getItem(res);
                    }
                } else {
                }
            },
            error: function (err) {
                vm.isFirstLoading = false
                _g.hideProgress();
                _g.toast(err.message);
            }
        })
    };

    //兼容home主页单个主题的入口
    var getOrgId = function (callback) {
        var _url='/app/auth/store/list.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"老板单个主题门店列表","Win_name":api.winName,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.orgId = getDetail(res);
                        getData();
                    }, 0);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    };

    var getDetail = function (res) {
        return _.map(_.filter(res.object, function (item) {
            return item.org_type === '002';
        }), function (item) {
            return {
                store_name: item.org_name,
                store_id: item.store_id,//storeId
                org_id: item.org_id//orgId
            };
        });
    };

    var getItem = function (res) {
        return _.map(res.object, function (item) {
                return {
                    cardId: item.card_no,	                        //会员卡号	string
                    hasRecall: item.is_visit,                       //是否已经回访	number
                    recallTime: item.last_visit_time,               //最后回访时间	string
                    tel: item.phone,	                            //会员手机号	string
                    themeEnd: item.status === 'end' ? true : false,	//主题状态	string	未发布undeploy 进行中ongoing 已结束end 已回访visited
                    user_id: item.user_id,                          //会员ID	number
                    uName: item.user_name,	                        //会员名称	string
                    sex: item.sex,
                    themeId: item.care_id,                           //主题ID
                    num: item.num
                }
            }
        )
    }

    var loadmore = new Loadmore({
        callback: function (page) {
            getData({page: page.page}, function (data) {
                if (!data.object || data.object.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.list = vm.list.concat(getItem(data));
                    loadmore.loadend(true);
                }
            });
        }
    });

    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
            loadmore.reset();
        }, 0)
    });

    api.addEventListener && api.addEventListener({
        name: 'ThemeCallBack1'
    }, function (ret, err) {

        _g.openWin({
            header: {
                data: {
                    title: '回访进度'
                }
            },
            pageParam: {
                entId: entId
            },
            name: 'boss-bossThemeCallBack1',
            url: '../boss/bossThemeCallBack1.html',
            bounces: false,
            slidBackEnabled: false,
        })
    });

    api.addEventListener && api.addEventListener({
        name: 'search'
    }, function (ret, err) {
        orgId = ret.value.orgId
        search = ret.value.number
        for (key in vm.orgId) {
            if (vm.orgId[key].org_id == orgId) storeId = vm.orgId[key].store_id
        }
        getData();
    });

    getOrgId();

});
/*
 1.getOrgId  getOrgId org的数据结构如下
 [
 {
 sName: '门店3',
 id:'',
 isChecked: 0
 }
 ]
 2.getOrg的回调里getData (设置状态变量控制筛选按钮--数据成功才可以点击)
 3.筛选按钮点击传参数

 */