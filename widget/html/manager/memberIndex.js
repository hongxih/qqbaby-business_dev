define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#memberIndex',
        template: _g.getTemplate('manager/memberIndex-body-V'),
        data: {
            consumeAverage: '',//会员累计平均消费
            consumeSum: '',//会员累计总消费
            memberCount: '',//会员总数
            graphList: [
                {
                    date: '',	//数据格式：2017-02-08
                    userCount: ''
                }
            ],
            themeList: [
                {
                    achieved_rate: '',	//完成率	number
                    care_id: '',	//主题ID	number
                    deploy_time: '',	//发布时间	string
                    end_time: '',		//string
                    status: '',	//状态	string
                    title: '',	//标题	string
                    type: '',	//主题类型	string	日常 usual 专题 special
                    user_count: '',	//目标数	number
                    visit_count: '',	//回访人数	number
                }
            ],
            dayCare: {
                achieved_rate: '',
                care_id: '',
                deploy_time: '',
                end_time: '',
                status: '',
                title: '',
                type: '',	//主题类型	string	日常 usual 专题 special
                user_count: '',
                visit_count: '',	//回访人数	number
            },
            rePurchase: {
                title: '',
                visit_count: 0,
                deploy_time: '',
                careId: null
            }
        },
        created: function () {
            this.consumeAverage = '--';
            this.consumeSum = '--';
            this.memberCount = '--';
            this.graphList = [];
            this.themeList = [];
            this.dayCare = {};
        },
        filters: {
            roundOff: function (value) {
                if (parseFloat(value) === 0) {
                    return 0;
                }
                return value * 100 | 0;
            },
            toPercent: function (value) {
                var v = Math.round(value * 10);
                var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                return arr[v];
            }
        },
        methods: {
            alertContent: function (ind) {
                event.stopPropagation()
                if(this.themeList[ind].content === '') return
                var str = JSON.stringify(this.themeList[ind].content)
                api.alert({
                    title: '内容',
                    msg: str,
                }, function(ret, err) {
                });
            },
            onAllThemeV2:function (sTittle, careId) {
                //和会员共用一套日常主题页面
                var rightPane_url = '../clerk/clerkThemeNameSide.html';
                if (careId == 7) {
                    rightPane_url = '../manager/managerThemeNameSide.html'
                }
                _g.openDrawerLayout({
                    header: {
                        data: {
                            title: sTittle,
                            rightText: '进度',
                        }
                    },
                    pageParam:{
                        title: sTittle,
                        careId: careId || '',
                    },
                    name: 'manager-managerThemeName', 
                    url: '../manager/managerThemeName.html',
                    rightPane: {
                        name: 'rightPane',
                        url: rightPane_url,
                    }
                });
            },
            /*--- 跳转至专项主题 ---*/
            onAllTheme: function (sTittle,tId) {
                var rightPane_url = '../clerk/clerkThemeNameSide.html';
                if (tId == 7) {
                    rightPane_url = '../manager/managerThemeNameSide.html'
                }
                _g.openDrawerLayout({
                    header: {
                        data: {
                            title: sTittle,
                            rightText: '进度',
                        }
                    },
                    pageParam:{
                        themeId:tId,
                        statue:'spacial',
                        title:sTittle,
                    },
                    name: 'manager-managerThemeName',
                    url: '../manager/managerThemeName.html',
                    rightPane: {
                        name: 'rightPane',
                        url: rightPane_url,
                    }
                })
            },

            onThemeList: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '主题关怀'
                        }
                    },
                    name: 'member-theme',
                    url: '../manager/managerTheme.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },

            /*--- 跳转至会员信息 ---*/
            onMemberMessage: function () {
                _g.openDrawerLayout({
                    header: {
                        data: {
                            title: '会员信息',
                            searchInput: ''
                        },
                        template: '../html/header/header-search-V'
                    },

                    name: 'member-memberMessage',
                    url: '../member/memberMessage.html',
                    rightPane: {
                        name: 'rightPane',
                        url: '../member/managerMemberSide.html',
                    }
                });
            }
        }
    });

    //会员统计数据
    var getData = function () {
        var _url='/app/auth/crm/user/getConsumStat.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取会员统计数据","Win_name":api.winName,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    var obj = res.object;
                    setTimeout(function () {
                        vm.consumeAverage = obj.consumeAverage;//	会员累计平均消费
                        vm.consumeSum = obj.consumeSum;//	会员累计总消费
                        vm.memberCount = obj.memberCount;	//会员总数
                    }, 0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        })
    };

    var initChart = function (data) {
        var myChart = echarts.init(document.getElementById('echart'));
            // 指定图表的配置项和数据
            var option = {
                backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#4cbdbe'
                }, {
                  offset: 1, color: '#1793da'
                }], false),
                title: {
                    show: false,
                    top: 0
                },
                tooltip:{
                    trigger:'axis',
                    triggerOn:'click',
                    position:function (point, params, dom){
                        //兼容提示框飘出问题
                        var location = 0;

                        if(params[0].dataIndex == 0){
                            location = point[0]+2;
                        }else if(params[0].dataIndex == 6 || params[0].dataIndex == 5){
                            location = point[0] - dom.offsetWidth -2;
                        }else{
                            location = point[0]+2
                        }

                        return [location,'10%']

                    },
                    axisPointer:{
                        type:'line',
                        lineStyle:{
                            color:'#fff',
                        }
                    },
                    formatter: function (params) {
                        return formatTip(data,'x')[params[0].dataIndex] + '</br>新增会员数:' + formatTip(data,'y')[params[0].dataIndex] ;
                    }
                },
                legend: {
                    show: false,
                    top: 0
                },
                grid: {
                    show: true,
                    left:30,
                    top: 34,
                    bottom: 30,
                    right: 30,
                    borderColor:"#84ccdd",
                    borderWidth:2,
                },
                xAxis: {
                    data: formatData(data,'x'),
                    axisLabel: {
                        show:true,
                        interval: 0,
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    splitLine: {
                    show: true,
                    lineStyle:{
                        color:['#84ccdd'],
                        type:'dashed',
                        },
                        interval:0,
                    },
                    boundaryGap:false,
                    axisLine:{
                        show:false,
                    },
                    axisTick:{
                        show:false,
                    }
                },
                yAxis: {
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        // interval: 1
                    },
                    min: 0,
                    // name: '',
                    nameLocation:'end',
                    axisLine:{
                        show:false,
                    }
                },
                series: [{
                    name: '新增会员数',
                    coordinateSystem: 'cartesian2d',
                    type: 'line',
                    data: formatData(data,'y'),
                    lineStyle:{
                        normal:{
                            color:'#fff',
                            shadowColor:'#666',
                            shadowOffsetX:0,
                            shadowOffsetY:0,
                            shadowBlur:6,
                        }
                    },
                    markArea:{
                        silent:false,
                    },
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top'
                    //     }
                    // },
                    clipOverflow: false,
                    symbolSize: 10,
                    hoverAnimation:false,
                }],
            };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //图表数据转换
    var formatData = function (data,type) {
        if(type == 'x'){
            return _.map(data, function(item,i){
                if(i == 0 || i == 6){
                        return item.date.split('-')[1] + '月' +item.date.split('-')[2] + '日';
                    }else{
                        return '';
                    }
            });
        }else if(type == 'y'){
            return _.map(data,function (item) {
                return item.userCount;
            })
        }
    }

    //格式化提示框数据
    function formatTip(data, axias){
        var array = [];
        if(axias === 'x'){
                return _.map(data, function(item){
                    return item.date.split('-')[1] + '月' +item.date.split('-')[2] + '日';
                });
        }else{
            return _.map(data, function(item){
                return item.userCount;
            });
        }
    }

    //获取七天新增会员曲线图数据
    var getGraph = function () {
        //new Date().toLocalDateString 会有格式化的问题
        var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()+ 1000*60*60*24
        var week = today - 1000 * 60 * 60 * 24 * 7;
        var _data= {
                endAt: today,
                startAt: week
            };
        var _url='/app/auth/crm/user/listChart.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取七天新增会员曲线图数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    var obj = res.object;
                    setTimeout(function () {
                        initChart(res.object);
                     }, 0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        })
    };


    /**
     * [获取专题关怀数据]
     * @param  {[obj]}   opts     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    var getThemeGo = function (opts, callback) {
        opts = opts || {};
        var _data={
                displayRecord: 100, //行数    number
                include_usual: false,//是否包含日常关怀主题   boolean 值为：true
                lastest_day: 7, //最近时间  number  值为：7
                ongoing_status: 'ongoing',
                page: 1,
                type: 'special',//日常 usual 专题 special
            };
        var _url='/app/auth/crm/care/listCrmCare.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取专题关怀数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    vm.themeList = getItemList(res);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (res) {
            }
        });
    };

    /**
     * 数据转换
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    var getItemList = function (res) {
        return _.map(res.object, function (item) {
            return {
                achieved_rate: item.achieved_rate,	//完成率	number
                care_id: item.care_id,	//主题ID	number
                deploy_time: item.deploy_time.substring(5, 16),	//发布时间	string
                end_time: item.end_time,		//string
                status: item.status,	//状态	string
                title: item.title,	//标题	string
                type: item.type,	//主题类型	string	日常 usual 专题 special
                user_count: item.user_count,	//目标数	number
                visit_count: item.visit_count,	//回访人数	number
                content:item.content
            }
        })
    };

    /**
     * 获取日常关怀
     * @param  {[obj]}   opts     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    var getDayCare = function (opts, callback) {
        opts = opts || {};
        var _data= {
                include_usual: true,//是否包含日常关怀主题    boolean 值为：true
                lastest_day: 7, //最近时间  number  值为：7
                ongoing_status: 'ongoing',
                type: 'usual',//日常 usual 专题 special
            };
        var _url='/app/auth/crm/care/listCrmCare.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取日常关怀","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    var obj = res.object[0];
                    vm.dayCare={};
                    vm.dayCare.visit_count = obj.visit_count;	//回访人数	number
                    vm.dayCare.deploy_time = obj.deploy_time;
                    vm.dayCare.title = obj.title;

                    vm.rePurchase.title = res.object[1].title || '';
                    vm.rePurchase.visit_count = res.object[1].visit_count;	//回访人数	number
                    vm.rePurchase.deploy_time = res.object[1].deploy_time;
                    vm.rePurchase.careId = res.object[1].care_id;
                } else {
                    _g.toast(res.message);
                }
            }
        });
    };

    getGraph();
    getThemeGo();
    getDayCare();
    getData();

     _g.setPullDownRefresh(function() {
         getData();
         getGraph();
         getThemeGo();
         getDayCare();
     });
    module.exports = {};
});
