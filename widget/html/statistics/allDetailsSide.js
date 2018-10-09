define(function (require, exports, module) {
    var Http = require('U/http');
    var account = require('../../script/utils/account');
    var isBoss=_g.getLS('UserInfo').notes === 'company_admin' ? true : false;
    var vm = new Vue({
        el: '#allDetailsSide',
        template: _g.getTemplate('statistics/allDetailsSide-body-V'),
        data: {
            storeName:'',
            isBoss:isBoss,
            storeIx:'',
            org_id:'',
            isClerkLogin: '',// 是否是店员登录
            clerkName: '',//营业员
            clerkId: null,
            clerkIdx: '',
            sideTime: '',
            startTime: '',//筛选条件
            endTime: '',//筛选条件
            idx: ''
        },
        created: function () {
            this.storeName="全部门店";
            this.org_id="";
            this.clerkName = '全部营业员';//营业员
            this.clerkId = '';//筛选条件
            this.clerkIdx = 0;
            this.sideTime = '全部时间';
            this.startTime = '';//筛选条件
            this.endTime = '';//筛选条件
            this.idx = 0;
        },
        filters: {},
        computed: {
            isClerkLogin: function () {
                var userInfo = _g.getLS('UserInfo')
                var i = Number(account.getRole(userInfo))
                var status = i === 2 ? true : false
                return status
            }
        },
        methods: {
            //跳转至门店选择
            toStoreChoose:function(){
                var self=this;
                openSubFrame({
                    name: 'statistics-allDetailsSideStore',
                    url: '../statistics/allDetailsSideStore.html',
                    pageParam: {
                        idx: self.storeIx
                    }
                });
            },
            // 跳转至时间选择
            toTimeChoose: function () {
                var self = this;
                var obj = {
                    startTime: this.startTime,
                    endTime: this.endTime
                }
                openSubFrame({
                    name: 'statistics-allDetailsSideTime',
                    url: '../statistics/allDetailsSideTime.html',
                    pageParam: {
                        timeObj: obj,
                        idx: self.idx
                    }
                });
            },
            // 跳转至营业员选择
            toClerkChoose: function () {
                openSubFrame({
                    name: 'statistics-allDetailsSideClerk',
                    url: '../statistics/allDetailsSideClerk.html',
                    pageParam: {
                        clerkName: this.clerkName,
                        clerkId: this.clerkId,
                        idx: this.clerkIdx
                    }
                });
            },
            onAgreeClose: function () {
                if (this.isClerkLogin) {
                    this.clerkName = ''
                }
                api.sendEvent && api.sendEvent({
                    name: 'allDetailsSideSearch',
                    extra: {
                        storeName:this.storeName,
                        org_id:this.org_id,
                        clerkName: this.clerkName,// 营业员 筛选条件
                        clerkId: this.clerkId,
                        sideTime: this.sideTime,
                        startTime: this.startTime,// 筛选条件
                        endTime: this.endTime// 筛选条件
                    }
                });
                api.closeDrawerPane();
            },
            onCloseDrawer: function () {
                api.closeDrawerPane();
            },
            onReset: function () {
                this.storeName="全部门店";
                this.org_id="";
                this.clerkName = '全部营业员';//营业员
                this.clerkId = '';//筛选条件
                this.clerkIdx = 0;

                this.sideTime = '全部时间';
                this.startTime = '';//筛选条件
                this.endTime = '';//筛选条件
                this.idx = 0;
            }
        }
    });
    /**
     * 营业员搜索响应
     * @param [ string,string,number ]  clerkName clerkId idx
     **/
    api.addEventListener && api.addEventListener({
        name: 'allDetailSideClerkChoose'
    }, function (ret, err) {
        var clerkIdx = Number(ret.value.idx) // idx ====>> clerkIdx
        vm.clerkIdx = clerkIdx
        vm.clerkName = ret.value.clerkName
        vm.clerkId = ret.value.clerkId
    });
    api.addEventListener && api.addEventListener({
        name:"allDetailSideStoreChoose"
    },function(ret,err){
        vm.storeName=ret.value.storeName;
        vm.org_id=ret.value.org_id;
    })
    /**
     * 时间搜索响应
     * @param [ number,object ]  index , { startTime:'...' , endTime:'...' }
     **/
    api.addEventListener && api.addEventListener({
        name: 'allDetailSideTimeChoose'
    }, function (ret, err) {
        var idx = Number(ret.value.idx)
        vm.idx = idx
        var timeObj = ret.value.timeObj || {}
        formatTime(idx, timeObj)
    });

    /**
     * 格式化显示时间
     * @param [ number,object ]  index , object = { startTime:'...' , endTime:'...' }
     *
     * index   0       1     2     3      4       5
     *        全部时间  今天   昨天   近7天   30天内  自定义
     **/
    var formatTime = function (idx, timeObj) {
        if (idx === 0) {
            vm.sideTime = '全部时间'
            vm.startTime = ''
            vm.endTime = ''
        } else if (idx === 1) {
            var obj = new Date()
            var str = changeTime(obj)
            vm.sideTime = str
            vm.startTime = str
            vm.endTime = str
        } else if (idx === 2) {
            var obj = new Date()
            obj.setDate(obj.getDate() - 1)
            var str = changeTime(obj)
            vm.sideTime = str
            vm.startTime = str
            vm.endTime = str
        } else if (idx === 3) {
            nDayAgo(6)
        } else if (idx === 4) {
            nDayAgo(29)
        } else if (idx === 5) {
            if (!timeObj) return
            vm.sideTime = timeObj.startTime + '到' + timeObj.endTime
            vm.startTime = timeObj.startTime
            vm.endTime = timeObj.endTime
        }
    }
    /**
     * n天前
     * @param [ number ]
     **/
    var nDayAgo = function (num) {
        var today = new Date()
        var nDayAgo = new Date()
        nDayAgo.setDate(nDayAgo.getDate() - num)
        var todayStr = changeTime(today)
        var nDayAgoStr = changeTime(nDayAgo)
        vm.sideTime = nDayAgoStr + '到' + todayStr
        vm.startTime = nDayAgoStr
        vm.endTime = todayStr
    }

    /**
     * 转换为 '2017-03-07' 格式
     * @param [ object ]  time object
     * @return [ string ] '2017-03-07'
     **/
    var changeTime = function (obj) {
        var year = obj.getFullYear()
        var month = obj.getMonth() + 1
        var date = obj.getDate()
        month < 10 && (month = '0' + month)
        date < 10 && (date = '0' + date)
        var timeStr = year + '-' + month + '-' + date
        return timeStr
    }

    /**
     * [打开新的子页面]
     * @return {[type]} [description]
     **/
    function openSubFrame(opts, callback) {
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
            animation: {
                type: 'push',
                subType: 'from_right',
                duration: 300
            }
        });
        callback && callback();
    }
})
