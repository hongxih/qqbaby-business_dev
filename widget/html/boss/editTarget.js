define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');

    var entId = api.pageParam.entId;
    var chooseName;
    var vm = new Vue({
        el: '#editTarget',
        template: _g.getTemplate('boss/editTarget-body-V'),
        data: {
            isDetail: true,
            isComplete: false,
            typeOption: [{text: '全场目标', value: 'Overall'}, {text: '品类目标', value: 'Category'}, {
                text: '品牌目标',
                value: 'Brand'
            }, {text: '单品目标', value: 'Goods'}],
            target_range: '请选择',
            target_name: '',
            startDay: '2017-02-04 00:00:00',
            endDay: '2017-02-04 23:59:59',
            target_cycle: 1,
            complete: 1000,
            specific_target: '全场目标',
            specific_target_id: '',
            goal_rang: null,
            list: [
                {
                    store_name: '门店1',
                    store_id: 1,
                    store_goal_setting_id: 1,
                    each_goal: '请输入',
                },
                {
                    store_name: '门店2',
                    store_id: 2,
                    store_goal_setting_id: 2,
                    each_goal: '请输入',
                },
                {
                    store_name: '门店3',
                    store_id: 3,
                    store_goal_setting_id: 3,
                    each_goal: '请输入',
                },
            ],
            preinstall_goal: '',
            allNone: true
        },
        created: function () {
            this.target_range = '';
            this.specific_target = '';
            this.startDay = '';
            this.endDay = '';
            this.target_cycle = null;
            this.target_name = '';
            this.complete = null;
            this.list = [];
        },
        methods: {
            onSelectDate: function (type) {
                var self = this;
                setTimeout(function () {
                    var dtPicker = new mui.DtPicker({
                        type: 'date'
                    });
                    $(".mui-dtpicker").show();
                    dtPicker.show(function (selectItems) {
                        if (type.toString() == 'startDay') {
                            self[type.toString()] = selectItems.value + ' ' + '00:00:00';
                        } else if (type.toString() == 'endDay') {
                            self[type.toString()] = selectItems.value + ' ' + '23:59:59';
                        }
                        if (self.startDay != '请输入' && self.endDay != '请输入') {
                            var start = Date.parse(new Date(self.startDay));
                            var end = Date.parse(new Date(self.endDay));
                            self.target_cycle = Math.floor(((end - start) / 1000 / 60 / 60 / 24) + 1);
                            if (self.target_cycle <= 0) {
                                _g.toast("结束时间不能大于开始时间")
                                self[type.toString()] = '请输入';
                                self.target_cycle = null;
                            }
                        }
                        dtPicker.dispose();
                    });
                }, 260);
            },
            onSelectType: function () {
                setTimeout(function () {
                    var otPicker = new mui.PopPicker();
                    $(".mui-poppicker").show();
                    otPicker.setData(vm.typeOption);
                    otPicker.show(function (selectItems) {
                        vm.target_range = selectItems[0].text;
                        vm.goal_rang = selectItems[0].value;
                        if (vm.goal_rang == 'Overall') {
                            vm.specific_target = "全场目标"
                        } else {
                            vm.specific_target = null
                        }
                        otPicker.dispose();
                    })
                    for(var i = 0;i<vm.typeOption.length;i++){
                        if(self.goal_rang == vm.typeOption[i].value){
                            otPicker.pickers[0].setSelectedIndex(i, 100);
                        }
                    }
                }, 260)

            },
            onTargetFilter: function () {
                if (this.goal_rang != 'Overall' && this.goal_rang) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '具体目标',
                            }
                        },
                        name: 'assistant-targetFilter',
                        url: '../assistant/targetFilter.html',
                        pageParam: {
                            title: targetRange(this.goal_rang).substring(0, 2),
                            type: this.goal_rang
                        },
                        bounces: false,
                        slidBackEnabled: false,
                    });
                }
            },
            onSumTotal: function () {
                var sum = 0;
                _.map(this.list, function (item) {
                    if (Number(item.each_goal) && item.each_goal != null) {
                        if (item.each_goal.toString().indexOf('.') != -1) {
                            _g.toast('不允许输入小数点');
                        } else {
                            sum += parseFloat(item.each_goal ? item.each_goal : 0);
                        }
                    }
                });
                this.preinstall_goal = sum;
            },
            onCancelItem: function () {
                logger.log({"Type":"operation","action":"确认删除","Win_name":api.winName,"data":_data});
                var _data={
                    ent_goal_setting_id : entId,
                    goal_status : 'delete'
                };
                var buttons = ['取消', '确定'],
                    affirmIndex = 2;// 确认按钮下标 ios--2,android--1
                if (_g.isAndroid) {
                    buttons.reverse();
                    affirmIndex = 1;
                }
                api && api.confirm({
                    title: '确认删除？',
                    msg: '删除后不能恢复',
                    buttons: buttons
                }, function (ret, err) {
                    var index = ret.buttonIndex;
                    if (index === affirmIndex) {
                        var _url='/app/auth/goal/company/updateStatus.do';
                        Http.ajax({
                            data:_data,
                            api_versions: 'v2',
                            url: _url,
                            success: function(res) {
                                logger.log({"Type":"operation","action":"更新目标状态","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                                if (res.code == 200) {
                                    api.sendEvent && api.sendEvent({
                                        name: 'refresh-targetManager'
                                    });
                                    api.closeWin && api.closeWin();
                                } else {
                                    _g.toast(res.message);
                                }
                            },
                            error: function(err) {}
                        });
                    }
                });
            },
            onAddItem: function () {
                _g.confirm('确定保存？','是否确定保存',function(){
                    logger.log({"Type":"operation","action":"编辑目标保存","Win_name":api.winName});
                    submit();
                });              
            },
            hidePick: function () {
                $(".mui-dtpicker").hide();
                $(".mui-poppicker").hide();
            },
        }
    });

    var getchoose = function () {
        api.addEventListener({
            name: 'choose'
        }, function (ret, err) {
            chooseName = ret.value;
            vm.specific_target = chooseName.key2;
            vm.specific_target_id = chooseName.key1;
        });
    };
    var getData = function () {
        var _data= {
                ent_goal_setting_id: entId
            };
        var _url='/app/auth/goal/company/get.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function (res) {
                logger.log({"Type":"operation","action":"获取目标信息","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.target_name = res.object.goal_name;
                        vm.target_range = targetRange(res.object.goal_rang);
                        vm.goal_rang = res.object.goal_rang;
                        vm.specific_target = res.object.goal_type_name;
                        vm.startDay = res.object.goal_start_time;
                        vm.endDay = res.object.goal_end_time;
                        vm.target_cycle = res.object.goal_period;
                        vm.list = getStore(res.object.store_goal_list);
                        vm.specific_target_id = res.object.goal_type_id;
                        vm.preinstall_goal = res.object.pre_ent_total_amount / 100;
                    }, 0);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
            }
        })
    };
    var getStore = function (res) {
        return _.map(res, function (item) {
            return {
                store_name: item.store_name,
                store_id: item.store_id,
                each_goal: item.pre_store_total_amount / 100,
                store_goal_setting_id: item.store_goal_setting_id
            }
        })
    };
    var targetRange = function (stage) {
        switch (stage) {
            case 'Overall':
                return '全场目标';
            case 'Goods':
                return '单品目标';
            case 'Brand':
                return '品牌目标';
            case 'Category':
                return '品类目标';
        }
    };
    var submit = function (status) {
        var allNone = true;
        _.map(this.list, function (item) {
            if (Number(item.each_goal) && item.each_goal != null) {
                if (item.each_goal.toString().indexOf('.') != -1) {
                    allNone = false;
                }
            }
        });
        if (vm.target_name.length > 10) {
            _g.toast("目标名称不可超过10位");
            return false;
        }
        if (vm.target_name == "") {
            _g.toast("目标名称不可为空");
            return false;
        }
        if (!vm.target_range) {
            _g.toast("目标范围不可为空");
            return false;
        }
        if (!vm.specific_target) {
            _g.toast("具体目标不可为空");
            return false;
        }
        if (vm.startDay == "") {
            _g.toast("开始时间不可为空");
            return false;
        }
        if (vm.endDay == "") {
            _g.toast("结束时间不可为空");
            return false;
        }
        if (vm.target_cycle == "") {
            _g.toast("目标周期不可为空");
            return false;
        }
        if (!allNone) {
            _g.toast("不允许输入小数点");
            return false;
        }
        var url = '';
        var url1 = '';
        
        var data1 = {};
        var store_list = [];        
        _.map(vm.list, function (item) {

            var goal_list = {
                store_name: item.store_name,
                store_id: item.store_id,
                store_goal_setting_id: item.store_goal_setting_id,
                pre_store_total_amount: item.each_goal ? item.each_goal * 100 : 0
            };
            store_list.push(goal_list);
        });
        var data = {
            ent_goal_setting_id: entId,
            // goal_status: status ? 'un_allocate' : null,
            goal_name: vm.target_name,
            goal_rang: vm.goal_rang,
            goal_type_name: vm.specific_target,
            goal_type_id: vm.specific_target_id,
            goal_start_time: vm.startDay,
            goal_end_time: vm.endDay,
            goal_period: vm.target_cycle,
            store_goal_list: store_list,
            pre_ent_total_amount: vm.preinstall_goal * 100
        };
        logger.log({"Type":"operation","action":"发布","Win_name":api.winName,"data":data});
        
        url1 = '/app/auth/goal/company/updateStatus.do';
        data1 = {
            ent_goal_setting_id: entId,
            goal_status: 'un_allocate'
        };
        url = '/app/auth/goal/company/edit.do';

        if(status){
            // 发布按钮 1.先保存
            Http.ajax({
                data: data,
                api_versions: 'v2',
                url: url,
                success: function (res) {
                    logger.log({"Type":"operation","action":"保存目标","Win_name":api.winName,"data":data,"message":res,"requireURL":url})
                    // 2.发布
                    ///////////////////////////////////////////////
                    Http.ajax({
                        data: data1,
                        api_versions: 'v2',
                        url: url1,
                        success: function (res) {
                            logger.log({"Type":"operation","action":"发布目标","Win_name":api.winName,"data1":data1,"message":res,"requireURL":url1})
                            if (res.code == 200) {
                                api.sendEvent && api.sendEvent({
                                    name: 'refresh-targetManager'
                                });
                                api && api.closeWin();
                            } else {
                                _g.toast(res.message);
                            }
                        },
                        error: function (err) {
                        }
                    });
                    /////////////////////////////////////////////
                },
                error: function (err) {
                    _g.hideProgress();
                }
            });
        }else {
            Http.ajax({
                data: data,
                api_versions: 'v2',
                url: url,
                success: function (res) {
                    logger.log({"Type":"operation","action":"保存目标","Win_name":api.winName,"data":data,"message":res,"requireURL":url})
                    _g.hideProgress();
                    if (res.code == 200) {
                        api.sendEvent && api.sendEvent({
                            name: 'refresh-targetManager'
                        });
                        api && api.closeWin();
                    } else {
                        _g.toast(res.message);
                    }
                },
                error: function (err) {
                    _g.hideProgress();
                }
            });
        }

    };

    getData();
    getchoose();

    api.addEventListener({
        name: 'editTargetPublish'
    }, function (ret, err) {
        if (_g.isIOS) {
            api && api.confirm({
                title: '确认发布？',
                msg: '是否确认发布',
                buttons: ['取消', '确定']
            }, function (ret, err) {
                if (ret.buttonIndex == 2) {
                    submit('un_allocate');
                }
            });
        } else if (_g.isAndroid) {
            api && api.confirm({
                title: '确认发布？',
                msg: '是否确认发布',
                buttons: ['确定', '取消']
            }, function (ret, err) {
                if (ret.buttonIndex == 1) {
                    submit('un_allocate');
                }
            });
        }
    });

    /*
     屏蔽输入框小数点
     */
    $(document).on('keydown', function (e) {
        e = e || event;
        if (e.keyCode == 190) return false;
    });
});
