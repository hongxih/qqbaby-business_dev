define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var dialogBox = api.require('dialogBox');
    /**
     * entry 1: home ---> here
     * entry 2: memberIndex ---> here
     */

    /**===== parameter & status =====**/
    var type = api.pageParam.title
    type = (type=='日常关怀' || type=='复购提醒') ? 'usual' : 'special'
    var entId = api.pageParam.careId || api.pageParam.themeId;
    //manager & clerk不需要orgId
    var vm = new Vue({
        el: '#clerkThemeName',
        template: _g.getTemplate('clerk/clerkThemeName-body-V'),
        data: {
            careId: entId,
            lastTime: "",
            isFirstLoading:true,
            isNoResult:false,
            list: [
                {
                    tel: '188 1234 1234',
                    uName: '徐佳莹',
                    hasRecall: false,
                    cardId: '123456789',
                    themeEnd: false,
                    recallTime: '02-08 10:05',
                    userid: ''
                },
                {
                    tel: '188 1234 1234',
                    uName: '徐佳莹',
                    hasRecall: true,
                    cardId: '123456789',
                    themeEnd: false,
                    recallTime: '02-08 10:05',
                    userid: ''
                },
                {
                    tel: '188 1234 1234',
                    uName: '',
                    hasRecall: false,
                    cardId: '123456789',
                    themeEnd: false,
                    recallTime: '02-08 10:05',
                    userid: ''
                },
            ],
            ifSelect: false,
            selectorValue: "提醒状态",
            redmind_status: {
                '提醒状态': '',
                '不限': '',
                '已提醒': 'visited',
                '未提醒': 'no_visit'
            },
            selItem1: false,
            selItem2: false,
            selItem3: false,
        },
        created: function () {
            this.list = []
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        watch: {},
        computed:{
            isNoResult: function () {
                if(this.isFirstLoading) return false
                var sta = this.list.length === 0 ? true : false
                return sta
            }
        },
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
                if(!val) return
                var str = val
                var a = str.slice(0, 3)
                var b = str.slice(7)
                str = a + '****' + b
                return str
            }
        },
        methods: {
            openSelector: function () {
                vm.selItem1 = false;
                vm.selItem2 = false;
                vm.selItem3 = false;
                vm.ifSelect = !vm.ifSelect;
            },
            selectStatus: function (name, index) {
                vm.selectorValue = name;
                vm['selItem' + index] = true;
                console.log('值  ' + vm.selItem1 + vm.selItem2 + vm.selItem3);
                setTimeout(function () {
                    vm.ifSelect = false;
                    getData();
                    loadmore.reset();
                }, 100);
            },
            onThemeInput: function (i, user_id) {
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
                            entId: user_id,
                            list: self.list[i],
                            title: api.pageParam.title,
                            themeId: entId,
                            inputType: ret.index //2--电话 1--微信 0--短信
                        },
                        name: 'member-clerkThemeInput',
                        url: '../member/clerkThemeInput.html',
                        bounces: false
                    });
                }.bind(this))
            },
            onReturnRecord: function (bVal, i) {
                if (!bVal) return;
                console.log('this.list[i]   ' + JSON.stringify(this.list[i]));
                event.stopPropagation();
                _g.openWin({
                    header: {
                        data: {
                            title: '回访记录',
                            rightText: '回访'
                        }
                    },
                    pageParam: {
                        list: this.list[i],
                        title: api.pageParam.title || '',
                        themeId: entId,
                        type:type
                    },
                    name: 'member-memberReturnRecord',
                    url: '../member/memberReturnRecord.html',
                });
            },
            openDrawer: function () {
                api && api.openDrawerPane({
                    type: 'right'
                });
            },
            onMerberItem: function (memberId,i) {
                console.log('this.list[i].themeId ' + entId);
                var _headerTitle = '会员详情';
                var _url = '../member/memberDetails.html';
                var _name = 'member-memberDetails';
                var _params = {
                    entId: memberId,
                    title: api.pageParam.title,
                    themeId: entId,
                    type: type
                }

                if(vm.careId == 7){
                    _headerTitle = '复购提醒'
                    _url = '../member/memberRePu.html';
                    _name = 'member-memberRePu';
                }
                _g.openWin({
                    header: {
                        data: {
                            title: _headerTitle
                        }
                    },
                    name: _name,
                    url: _url,
                    pageParam: _params,
                });
            }

        }
    });
    // 暂时不知道有什么用，没请求到，注释掉
    // !function () {
    //     Http.ajax({
    //         data: {},
    //         api_versions: 'v2',
    //         url: '/app/auth/store/list',
    //         success: function (res) {
    //             if (res.code == 200) {
    //                 orgId = res.object[0].org_id;
    //             } else {
    //                 _g.toast(res.message);
    //             }
    //         },
    //         error: function (err) {
    //         }
    //     })
    // }()
    //获取会员信息

    var endNum = '',
        startNum = '',
        search = '';
        user_type = '';
        product_id = '';
        sku_code = '';
        brand_id = '';
        class_id = '';
        residue_day_start = '';
        residue_day_end = '';
    var getData = function (opts, callback) {
        opts = opts || {};
        var _data= {
            care_id: entId, //entId,//主题ID	number
            displayRecord: 10,//	行数	number
            page: opts.page || 1,//	页数	number
            start_num: startNum,//    开始编号    number
            end_num: endNum,// 结束编号    number
            search: search || '',//	会员手机/姓名/卡号	string
            type: type,
            // redmind_status: vm.redmind_status[vm.selectorValue] || '',
            // user_type: user_type || 'all_user', //会员类型
            // product_id: product_id || '', //商品id
            // sku_code: sku_code || '', //规格编码
            // brand_id: brand_id || '', //品牌
            // class_id: class_id || '', //分类
            // residue_day_start: residue_day_start || '', //剩余天数开始
            // residue_day_end: residue_day_end || '', //剩余天数结束

        };
        if (entId==7) { //复购提醒参数
            _data.redmind_status = vm.redmind_status[vm.selectorValue] || '';
            _data.user_type = user_type || 'all_user';
            _data.product_id = product_id || '';
            _data.sku_code = sku_code || '';
            _data.brand_id = brand_id || '';
            _data.class_id = class_id || '';
            _data.residue_day_start = residue_day_start || '';
            _data.residue_day_end = residue_day_end || '';
        }
        var _url='/app/auth/crm/user/listCrmCareUser.do';
        Http.ajax({
            api_versions: 'v2',
            isSync: true,
            data:_data,
            url:_url,
            success: function (res) {
                 logger.log({"Type":"operation","action":"店员获取主题关怀","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.isFirstLoading = false
                console.log(res)
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
                    _g.toast(res.message);
                    setTimeout(function () {
                        callback && callback(res);
                    }, 0)
                }
            },
            error: function (err) {
                vm.isFirstLoading = false
                _g.hideProgress();
                _g.toast(err.message);
            }
        })
    };
    getData();
    var getItem = function (res) {
        return _.map(res.object, function (item,i) {
                return {
                    cardId: item.card_no,	//会员卡号	string
                    hasRecall: item.is_visit,//	是否已经回访	number
                    recallTime: item.last_visit_time,//最后回访时间	string
                    tel: item.phone,	//会员手机号	string
                    themeEnd: item.status === 'end' ? true : false,	//主题状态	string	未发布undeploy 进行中ongoing 已结束end 已回访visited
                    user_id: item.user_id, //会员ID	number
                    uName: item.user_name,	//会员名称	string
                    sex:item.sex,
                    themeId:item.care_id,
                    num:item.num || i
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
                entId: entId,
                type:type
            },
            name: 'clerk-clerkThemeCallBack1',
            url: '../clerk/clerkThemeCallBack1.html',
        })
    });
    //搜索响应
    api.addEventListener && api.addEventListener({
        name: 'themeNameSearch'
    }, function (ret, err) {
        endNum = ret.value.endNum;
        startNum = ret.value.startNum;
        search = ret.value.pNumber;
        user_type = ret.value.user_type || '';
        product_id = ret.value.product_id || '';
        sku_code = ret.value.sku_code || '';
        brand_id = ret.value.brand_id || '';
        class_id = ret.value.class_id || '';
        residue_day_start = ret.value.leftDaysFrom || '';
        residue_day_end = ret.value.leftDaysTo || '';
        getData();
    });

    api.addEventListener && api.addEventListener({
        name: 'reload-visitList'
    }, function(ret, err) {
        getData();
        loadmore.reset();
    });

});
