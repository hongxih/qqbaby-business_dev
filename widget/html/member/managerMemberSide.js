define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#managerMemberSide',
        template: _g.getTemplate('member/managerMemberSide-body-V'),
        data: {
            clerkName: '',//营业员 暂时不用
            clerkId: null,
            sideTime: '',
            startTime: '',//筛选条件
            endTime: '',//筛选条件
            idx: '',
            memberLevel: '',
            memberLevelId: null,//筛选条件
            memberTag: [],
            tag_list: [],//筛选条件
            start_integral: '',//筛选条件
            end_integral: '',//筛选条件
            tagList: null
        },
        filters: {
            formatTime: function (val) {
                if (val === '') {
                    return '全部时间'
                } else {
                    return val
                }
            },
            formatLevel: function (val) {
                if (val === '') {
                    return '全部等级'
                } else {
                    return val
                }
            }
        },
        methods: {
            //消费时间
            onMemberTime: function () {
                var self = this;
                openSubFrame({
                    name: 'member-managerMemberSideTime',
                    url: '../member/managerMemberSideTime.html',
                    pageParam:{
                        sideTime: self.sideTime,
                        idx: self.idx
                    }
                });
            },
            //等级
            onMemberLevel: function (id) {
                var self = this;
                openSubFrame({
                    name: 'member-managerMemberSideLevel',
                    url: '../member/managerMemberSideLevel.html',
                    pageParam:{
                        Id: id || ''
                    }
                });
            },
            //全部标签
            onMemberTag: function () {
                var self = this;
                openSubFrame({
                    name: 'member-managerMemberSideTag',
                    url: '../member/managerMemberSideTag.html',
                    pageParam:{
                        tagList: self.tagList
                    }
                });
            },
            onAgreeClose: function () {
                /*if (this.start_integral > this.end_integral) {
                    this.start_integral = ''
                    this.end_integral = ''
                    return
                }else if (this.start_integral===''&&this.end_integral!==''){
                    this.start_integral = ''
                    this.end_integral = ''
                    return
                }else if (this.start_integral!==''&&this.end_integral===''){
                    this.start_integral = ''
                    this.end_integral = ''
                    return
                }*/
                if(this.start_integral!==''&&this.end_integral!==''){
                    if(!/^[0-9]*$/.test(this.start_integral) || !/^[0-9]*$/.test(this.end_integral)){
                        _g.toast("请输入数字!");
                    }
                    if (Number(this.start_integral) > Number(this.end_integral)) {
                        this.start_integral = '';
                        this.end_integral = '';
                        _g.toast('起始积分不能大于终止积分')
                        return
                    }
                }
                api.sendEvent && api.sendEvent({
                    name: 'search',
                    extra: {
                        start_consume_time: this.startTime,//筛选条件
                        end_consume_time: this.endTime,//筛选条件
                        tag_list: this.tag_list,//筛选条件
                        start_integral: this.start_integral,//筛选条件
                        end_integral: this.end_integral,//筛选条件
                        user_level_id: this.memberLevelId//筛选条件
                    }
                });
                api.closeDrawerPane && api.closeDrawerPane();
            },
            onCloseDrawer: function () {
                api.closeDrawerPane();
            },
            onReset: function () {
                this.clerkName = '';//营业员 暂时不用
                this.clerkId = null;
                this.sideTime = '';
                this.startTime = '';//筛选条件
                this.endTime = '';//筛选条件
                this.idx = '';
                this.memberLevel = '';
                this.memberLevelId = null;//筛选条件
                this.memberTag = [];
                this.tag_list = [];//筛选条件
                this.start_integral = '';//筛选条件
                this.end_integral = '';//筛选条件
                this.tagList = null;
            }
        }
    });


    api.addEventListener && api.addEventListener({
        name: 'level'
    }, function (ret, err) {
        if (ret.value.key1 === '') {
            vm.memberLevel = '';
            vm.memberLevelId = '';
        } else {
            vm.memberLevel = ret.value.key1;
            vm.memberLevelId = ret.value.key2;
        }

    });

    api.addEventListener && api.addEventListener({
        name: 'tagList'
    }, function (ret, err) {
        if (ret.value.key1 === '') {
            vm.tagList = []
            vm.tag_list = []
        } else {
            var tagListArr = ret.value.key1.split("},");
            var tagList = []
            for (var i = 0; i < tagListArr.length - 1; i++) {
                tagListArr[i] = tagListArr[i] + "}";

            }
            for (var j = 0; j < tagListArr.length; j++) {
                var data = JSON.parse(tagListArr[j]);
                tagList.push(data);
            }
            vm.tagList = tagList;
            var arr = [];
            var jsonStr = '[' + ret.value.key1 + ']'
            var jArr = JSON.parse(jsonStr)
            for (key in jArr) {
                arr.push(jArr[key].index)
            }
            vm.tag_list = arr;
        }

    });
    //消费时间响应
    api.addEventListener && api.addEventListener({
        name: 'sideTime'
    }, function (ret, err) {
        vm.sideTime = ret.value.key1;
        vm.idx = ret.value.key2;
        if(ret.value.key1==''){
            vm.startTime = '';
            vm.endTime = '';
            return
        }
        var str = String(ret.value.key1)
        var star = str.slice(0, 10);
        var end = str.slice(11);
        if (end == '') {
            end = star;
        }
        star = star + " " + "00:00:00"
        end = end + " " + "23:59:59"
        vm.startTime = star;
        vm.endTime = end;
    });

    /**
     * [打开新的子页面]
     * @return {[type]} [description]
     */
    function openSubFrame(opts, callback){
        api.openFrame && api.openFrame({
            name: opts.name,
            url: opts.url,
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: 'auto'
            },
            pageParam: opts.pageParam,
            bounces: false,
            animation:{
                type: 'push',
                subType: 'from_right',
                duration: 300
            }
        });
        callback && callback();
    }
});
