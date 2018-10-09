define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    console.log('api.pageParam.themeId ' + api.pageParam.themeId);
    var Http = require('U/http');
    var list = api.pageParam.list;
    var title = api.pageParam.title || '';
    var usualT = false;
    var isSelectedWay = false;
    var entId = api.pageParam.entId;//user id
    if (title == '日常关怀') {
        usualT = true;
        title = '';
    }

    var vm = new Vue({
        el: '#clerkThemeInput',
        template: _g.getTemplate('member/clerkThemeInput-body-V'),
        data: {
            isMemberDet: title ? false : true,//入口判断：从会员详情进入为真
            recallMan: _g.getLS('UserInfo').user_name,//营业员名字

            themeType: {
                onThemeName: title || '请选择',
                onThemeId: api.pageParam.themeId
            },//显示主题名称
            themeList: [
                {
                    text: '2月21主题',
                    value: 001
                },
                {
                    text: '测试消息推送',
                    value: 002
                },
            ],
            wayType: {
                onWayName: '请选择',
                onWayType: ''
            },//显示回访方式
            wayList: [
                {
                    text: '电话',
                    value: 'phone'
                },
                {
                    text: '微信',
                    value: 'wx'
                },
                {
                    text: '短信',
                    value: 'msg'
                },
                {
                    text: '其他',
                    value: 'other'
                },
            ],
            remindProductCount: 0,
            rememberCheckProductID: [],
            rememberCheckSkuCode: [],
            isSexShow: '',
            isShow: false,//会员信息下拉框
            nameIsShow: true,//会员信息横条
            tel: list && list.tel,
            uName: list && list.uName,
            uSex: list && list.sex,
            cartId: list && list.cardId,
            uBirthday: list && list.birthday ? list.birthday : "--",
            uYear: list && list.memberOld,
            uId: list && list.userid,
            content: '',
            isRed: false,
            wordNum: 0,
            goodsList: [],  // 商品id,条码列表
        },
        created: function () {
            this.recallMan = _g.getLS('UserInfo').user_name;
            this.themeList = [];
        },
        watch: {
            content: {
                handler: function (val) {
                    this.wordNum = val.length;
                    this.isRed = this.wordNum > 85 ? true : false;
                }
            },
            deep: true
        },
        computed: {
            isSexShow: function () {
                console.log(this.uSex)
                if(this.uSex === null || this.uSex === '' || this.uSex === undefined){
                    return false
                }else{
                    this.uSex = Number(this.uSex)
                    if(this.uSex === 2){
                        return false
                    }else{
                        return true
                    }
                }
            }
        },
        filters: {
            toSex: function (val) {
                if (val === null || val === '' || val === undefined) return
                val = Number(val)
                var arr = ['女', '男'];
                return arr[val];
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
            onWaySelect: function () {
                if (!!isSelectedWay) return false;
                setTimeout(function () {
                    var otPicker = new mui.PopPicker();
                    otPicker.setData(this.wayList);
                    otPicker.show(function (selectItems) {
                        this.wayType.onWayName = selectItems[0].text;
                        this.wayType.onWayType = selectItems[0].value;
                        otPicker.dispose();
                    }.bind(this));
                }.bind(this), 260)
            },
            onThemeSelect: function () {
                if (!this.isMemberDet) return; //入口判断
                setTimeout(function () {
                    var otPicker = new mui.PopPicker();
                    otPicker.setData(this.themeList);
                    otPicker.show(function (selectItems) {
                        this.themeType.onThemeName = selectItems[0].text;
                        this.themeType.onThemeId = selectItems[0].value;
                        otPicker.dispose(this.themeType.onThemeId);
                    }.bind(this));
                }.bind(this), 260)
            },
            onTagList: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '选择商品'
                        }
                    },
                    pageParam: {
                        entId: entId,
                        rememberCheckProductID: this.rememberCheckProductID,
                        rememberCheckSkuCode: this.rememberCheckSkuCode,
                    },
                    name: 'clerk-remindAfterBuyList',
                    url: '../clerk/remindAfterBuyList.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onThemeSave: function () {
                if (!check()) return;
                var _data={
                    care_id: this.themeType.onThemeId,// 主题关怀
                    content: this.content.trim(),
                    type: this.wayType.onWayType,// string  phone电话 wx微信 msg短信 other其他
                    user_id: list.user_id,
                };
                if (this.themeType.onThemeId == 7) {
                    _data.product_info_list = JSON.stringify(this.goodsList);
                }
                var _url='/app/auth/crm/care/saveCrmCareVisit.do';
                var title = '确认保存？';
                var message = '是否确认保存回访记录？';
                console.log("11111111111111==========",JSON.stringify(_data));
                 _g.confirm(title,message,function(){
                    Http.ajax({
                        data: _data,
                        url:_url,
                        api_versions: 'v2',
                        success: function (ret) {
                            logger.log({"Type":"operation","action":"回访录入保存","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                            if (ret.success) {
                                api.sendEvent && api.sendEvent({
                                    name: 'reload-visitList'
                                });
                                api.closeWin && api.closeWin();
                            } else {
                                _g.toast(ret.message);
                            }
                        },
                        error:function(err) {
                            _g.toast(err);
                        }
                    });
                })
            },
            onShowType: function () {
                this.nameIsShow = !this.nameIsShow;
                this.isShow = !this.isShow;
            }
        }
    });

    // alert(JSON.stringify(list));

    // 记录筛选方式
    if (api.pageParam.inputType !== undefined && api.pageParam.inputType == 0) {
        isSelectedWay = true;
        vm.wayType.onWayType = 'msg';
        vm.wayType.onWayName = '短信';
    } else if (api.pageParam.inputType !== undefined && api.pageParam.inputType == 1) {
        isSelectedWay = true;
        vm.wayType.onWayType = 'wx';
        vm.wayType.onWayName = '微信';
    } else if (api.pageParam.inputType !== undefined && api.pageParam.inputType == 2) {
        isSelectedWay = true;
        vm.wayType.onWayType = 'phone';
        vm.wayType.onWayName = '电话';
    }

    function check() {
        if (vm.themeType.onThemeId === undefined) {
            _g.toast('请选择回访主题');
            return false;
        } else if (vm.wayType.onWayType === '') {
            _g.toast('请选择回访方式');
            return false;
        } else if (vm.themeType.onThemeId == 7 && vm.remindProductCount<1){
            _g.toast('请选择提醒复购的商品');
            return false;
        }else if(vm.content===""){
            _g.toast('请输入回访内容');
            return false;
        }
        return true;
    };


    var getData = function () {
        var _data= {
                publish_status: 'ongoing'   //主题状态  string  值为：
            };
        var _url='/app/auth/crm/care/listAllCrmCare.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"店员获取主题关怀","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.themeList = getItem(res.object);
            },
            error: function (err) {
            }
        })

        //获取未提醒商品所需数据
        var _data2= {
                // displayRecord: 10,
                // page: opts.page || 1,
                user_id: entId,//   会员ID    number
            };
        var _url2='/app/auth/crm/multiConRedmind/listMCRemindProductDialog.do';
        Http.ajax({
            data:_data2,
            api_versions: 'v2',
            url:_url2,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取选择商品数据","Win_name":api.winName,"data":_data2,"message":res,"requireURL":_url2,"line":"------------------------------------------------------"})
                if (res.code == 200) {
                    if(res.object) {
                        for(var i = 0; i < res.object.length; i++) {
                            var item = {};
                            item.product_id = res.object[i].product_id;
                            item.sku_code = res.object[i].sku_code;
                            vm.rememberCheckProductID.push(res.object[i].product_id);
                            vm.rememberCheckSkuCode.push(res.object[i].sku_code);
                            vm.remindProductCount = res.object.length;
                            vm.goodsList.push(item);
                        }
                    }
                } else {
                    // alert(_url + ' failed ' + JSON.stringify(res));
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                // alert(_url + ' failed ' + JSON.stringify(res));
                _g.hideProgress();
            }
        })
    }
    var getDataUsual = function () {
        var _data= {
                type: 'usual'   //主题状态  string  值为：
            };
        var _url='/app/auth/crm/care/listAllCrmCares.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"店员获取日常关怀","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.themeList = getItem(res.object);
            },
            error: function (err) {
            }
        })
    }
    var getItem = function (obj) {
        return _.map(obj, function (item) {
            return {
                text: item.title,
                value: item.care_id
            }
        })
    }

    if (usualT) {
        getDataUsual()
    } else {
        getData()
        //复购商品数
        api.addEventListener({
            name: 'chooseProduct'
        }, function(ret){
            console.log("ret=====================", JSON.stringify(ret));
            vm.remindProductCount = ret.value.count;
            vm.rememberCheckProductID = ret.value.rememberCheckProductID;
            vm.rememberCheckSkuCode = ret.value.rememberCheckSkuCode;
            vm.goodsList = ret.value.data;
        });
    }


});
