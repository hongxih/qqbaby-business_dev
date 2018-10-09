define(function (require, exports, module) {
    var Http = require('U/http');
    var dtPicker = new mui.DtPicker({
        type: 'date'
    });
    var vm = new Vue({
        el: '#allDetailsSideTime',
        template: _g.getTemplate('statistics/allDetailsSideTime-body-V'),
        data: {
            isShow: true,
            isAllChecked: false,
            startTime: '',
            endTime: '',
            list: [
                {
                    aName: '全部时间',
                    timeValue: 1,
                    isChecked: false
                },
                {
                    aName: '今日',
                    timeValue: 1,
                    isChecked: false
                },
                {
                    aName: '昨日',
                    timeValue: 0,
                    isChecked: false
                },
                {
                    aName: '近7日',
                    timeValue: 7,
                    isChecked: false
                },
                {
                    aName: '30日内',
                    timeValue: 30,
                    isChecked: false
                }
            ]
        },
        methods: {
            onClose: function () {
                api.closeFrame({});
            },
            onChooseTime: function (idx) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[idx].isChecked = true;
                api.sendEvent && api.sendEvent({
                    name: 'allDetailSideTimeChoose',
                    extra: {
                        idx: idx
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onSelectStart: function (str) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                dtPicker.show(function (selectItems) {
                    this[str] = selectItems.value;
                }.bind(this));
            },
            onSelectEnd: function (str) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                dtPicker.show(function (selectItems) {
                    this[str] = selectItems.value;
                    if (this.startTime === '') {
                        this[str] = ''
                        _g.toast('请选择起始时间')
                        return
                    }
                    var star = new Date(this.startTime).getTime();
                    var end = new Date(this.endTime).getTime();
                    if (star > end) {
                        this.startTime = ''
                        this.endTime = ''
                        _g.toast('起始时间不能大于等于结束时间')
                        return
                    }
                    var obj = {
                        startTime: this.startTime,
                        endTime: this.endTime
                    }
                    api.sendEvent && api.sendEvent({
                        name: 'allDetailSideTimeChoose',
                        extra: {
                            timeObj: obj,
                            idx: 5
                        }
                    });
                    api.closeFrame && api.closeFrame({});
                }.bind(this));

            }
        }
    });
    /**===== parameter & status =====**/
    var idx = Number(api.pageParam.idx)
    var timeObj = api.pageParam.timeObj || {}

    /**
     * 初始化状态
     * timeObj = { startTime:'...' , endTime:'...' }
     *
     * index   0       1     2     3      4       5
     *        全部时间  今天   昨天   近7天   30天内  自定义
     * */

    var getRadio = function () {
        if (idx === 5) {
            for (key in vm.list) {
                vm.list[key].isChecked = false
            }
            vm.startTime=timeObj.startTime
            vm.endTime=timeObj.endTime
        }else{
            for (key in vm.list) {
                vm.list[key].isChecked = false
            }
            vm.list[idx].isChecked = true
        }
    };
    getRadio()

});
