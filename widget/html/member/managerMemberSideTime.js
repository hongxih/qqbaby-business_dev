define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var dtPicker = new mui.DtPicker({
        type: 'date'
    });
    var vm = new Vue({
        el: '#managerMemberSideTime',
        template: _g.getTemplate('member/managerMemberSideTime-body-V'),
        data: {
            isShow: true,
            isAllChecked: false,
            startTime: '',
            endTime: '',
            list: [
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
            onChooseTag: function () {
                this.isAllChecked = !this.isAllChecked
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                api.sendEvent && api.sendEvent({
                    name: 'sideTime',
                    extra: {
                        key1: '',
                        key2: '',
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            onChooseTime: function (idx) {
                for (key in this.list) {
                    this.list[key].isChecked = false;
                }
                this.list[idx].isChecked = true;
                var sideTime = this.formatDate(idx)
                api.sendEvent && api.sendEvent({
                    name: 'sideTime',
                    extra: {
                        key1: sideTime,
                        key2: idx,
                    }
                });
                api.closeFrame && api.closeFrame({});
            },
            formatDate: function (idx) {
                var data = new Date();
                var month = '';
                var day = '';
                var str = '';
                var isYesterday = false;
                month = data.getMonth() + 1
                day = data.getDate()
                month = month < 10 ? ('0' + month) : month
                day = day < 10 ? ('0' + day) : day
                /**
                 * 该方法要重写
                 **/
                var today = data.getFullYear() + "-" + month + "-" + day;
                if (idx == 0) {
                    month = data.getMonth() + 1
                    day = data.getDate()
                } else if (idx == 1) {// 昨天
                    data.setDate(data.getDate() - 1)
                    month = data.getMonth() + 1
                    day = data.getDate()
                    isYesterday = true
                } else if (idx == 2) {
                    data.setDate(data.getDate() - 6)
                    month = data.getMonth() + 1
                    day = data.getDate()
                } else if (idx == 3) {
                    data.setDate(data.getDate() - 29)
                    month = data.getMonth()
                    day = data.getDate()
                } else {
                    today = "";
                    str = "";
                }

                month = month < 10 ? ('0' + month) : month
                day = day < 10 ? ('0' + day) : day
                str = data.getFullYear() + "-" + month + "-" + day;

                if (today == str) {
                    var sideTime = today;
                } else if (isYesterday) {// 昨天
                    var sideTime = str
                } else {
                    var sideTime = str + "至" + today;
                }
                return sideTime;
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
                    api.sendEvent && api.sendEvent({
                        name: 'sideTime',
                        extra: {
                            key1: this.startTime + '到' + this.endTime,
                            key2: 4
                        }
                    });
                    api.closeFrame && api.closeFrame({});
                }.bind(this));

            }
        }
    });
    //api.pageParam.idx
    var getRadio = function () {
        var id = api.pageParam.idx;
        var sideTime = api.pageParam.sideTime;
        if (id === '') {
            vm.isAllChecked = true;
            for (key in vm.list) {
                vm.list[key].isChecked = false
            }
        } else {
            //id=4为自定义时间
            if (id == 4) {
                for (key in vm.list) {
                    vm.list[key].isChecked = false
                }
                vm.isAllChecked = false;
                vm.startTime = sideTime.split('到')[0]
                vm.endTime = sideTime.split('到')[1]

            } else {
                vm.list[id].isChecked = true
            }
        }
    };
    getRadio()

});
