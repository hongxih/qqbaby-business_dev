define(function(require, exports, module) {
    var Http = require('U/http');
    var pageParam = api && api.pageParam;
    var getTime = require('U/getTime');
    var typeMap = ['DAY', 'WEEK', 'MONTH'];
    var dayMap = ['今日','本周','本月'];
    var dayTypeMap = ['日','周','月'];
    var day = new Date();
    var vm = new Vue({
        el: '#filterResult',
        template: _g.getTemplate('statistics/filterResult-body-V'),
        data: {
            item_name:api && api.pageParam.name,
            role:_g.getLS('UserInfo').notes,
            type: _g.getLS('dimensionType') || 'DAY',
            detail: {
               add_customer:0,
               add_estimate_profit:0,
               add_sale_price: 0,
               add_sale_profit: 0,
               avg_sale_price: 0,
               estimate_profit: 0,
               total_customer: 0,
               total_sale_price: 0,
               total_sale_profit: 0
            },
            dayDes : '今日',
            dayType:'日',
            currentTime:getTime.transDateRange('DAY'),

            currentStamp : day.getTime(),

            startTime : new Date().Format('yyyy-MM-dd'),
            endTime : new Date().Format('yyyy-MM-dd')
        },
        watch: {

        },
        created: function(){

        },
        methods: {
            onGetDayData : function(type,time,addOrSubtract){
                getFormatTime(type,time,addOrSubtract);
            }
        }
    });
    var dateMap = ['DAY', 'WEEK', 'MONTH'];
    // 格式化横轴
    function replaceYear(time, type){
        // 为了兼容WEEK的显示
        var time = time ? time : '';
        if(type && type === 'WEEK'){
            return time.split('-')[2];
        }

        return time.split('-')[1] + '.' + time.split('-')[2];
    }

    //格式化提示框数据
    function formatTip(data, axias){
        var array = [];
        if(axias === 'x'){
            if(vm.type === 'DAY'){
                return _.map(data, function(item){
                    return item.point.split('-')[1] + '月' +item.point.split('-')[2] + '日';
                }).reverse();
            }else if(vm.type === 'WEEK'){
                return _.map(data, function(item){
                    return item.point.split('~')[0].split('-')[1] + '月' + item.point.split('~')[0].split('-')[2] + '日' + '~' + item.point.split('~')[1].split('-')[1] + '月' + item.point.split('~')[1].split('-')[2] + '日'
                }).reverse();
            }else if(vm.type === 'MONTH'){
                return _.map(data, function(item){
                    return item.point.split('~')[0].split('-')[0] + '年' + item.point.split('~')[0].split('-')[1]+'月';
                }).reverse();
            }
        }else{
            return _.map(data, function(item){
                return formatPrice(item.total_sale_price);
            }).reverse();
        }
    }

    function formatChart(data, axias){
        var array = [];
        if(axias === 'x'){
            if(vm.type === 'DAY'){
                return _.map(data, function(item){
                    return item.point.split('-')[1] + '.' +item.point.split('-')[2];
                }).reverse();
            }else if(vm.type === 'WEEK'){
                return _.map(data, function(item){
                    return replaceYear(item.point.split('~')[0]) + '~' +replaceYear(item.point.split('~')[1], 'WEEK');
                }).reverse();
            }else if(vm.type === 'MONTH'){
                return _.map(data, function(item){
                    return item.point.split('~')[0].split('-')[1] + '月';
                }).reverse();
            }
        }else{
            return _.map(data, function(item){
                return (item.total_sale_price /100);
            }).reverse();
        }
    }

    //格式化图表营业额(00,000.00)
    var formatPrice = function (s) {
        s = Number(s);
        if(s == 0){
            return s = '0.00';
        }else if(!s){
            return s = '--';
        }else if(s < 0){
            s = Math.abs(s);
            return format(s,1);
        }else{
            return format(s);
        }

        function format(s,p){
          var z = s.toString();
          if(z.length == 1){
            s = '0.0' + z;
          }else if(z.length == 2){
            s = '0.'+z;
          }else{
            var t = z.substr(z.length - 2);
            g = z.substring(0, z.length - 2);
            s = g.replace(/^(\d*)$/, "$1,");
            var re = /(\d)(\d{3},)/;
            while (re.test(s))
                s = s.replace(re, "$1,$2");
            s = s.replace(/,$/,'.'+t);
          }
          return (p ? '-' : '') + s;
        }
    }

    //function formatTime(time){
    //    return _.map(transDateRange().split('-'), function(value){
    //        return value.length >= 2 ? value : '0'+value;
    //    }).join('-');
    //}
    //function transDateRange(){
    //    var now = new Date();
    //    if(vm.type === 'DAY'){
    //        return now.Format('yyyy-MM-dd');
    //    }else if(vm.type === 'WEEK'){
    //        var timeStamp = now.getTime() - (24*60*60*1000)*(now.getDay()-1);
    //        var weekDate = new Date(timeStamp);
    //        return weekDate.getFullYear()+'-'+(weekDate.getMonth() + 1)+'-'+weekDate.getDate();
    //    }else if(vm.type === 'MONTH'){
    //        return now.getFullYear()+'-'+(now.getMonth() + 1)+'-01';
    //    }
    //}


    // 获取图表数据
    function getChartData(min_create_time,max_create_time){
        var _data= {
                date_type: vm.type,
                max_create_time: max_create_time ? max_create_time : new Date().Format('yyyy-MM-dd'),
                min_create_time: min_create_time ? min_create_time : new Date().Format('yyyy-MM-dd'),
                id: api && api.pageParam.id,
                sum_type: api && api.pageParam.sum_type
            };
        var _url='/app/auth/page/retail/sumChart.do';
        Http.ajax({
            url:_url,
            data:_data,
            tag:'getChartData',
            success: function(res){
                logger.log({"Type":"operation","action":"营业数据页面刷选之后获取图表数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    chartData = res.object;
                    initChart(res.object);
                }else{
                    console.log(res);
                    _g.toast(res.message);
                }
            },
            error: function(err){ }
        });
    };


    // 获取门店的统计数据
    function getStatic(opts,min_create_time,max_create_time){
        // opts = opts || {};
        var _data= {
                date_type: vm.type,
                max_create_time: opts ? opts.max : max_create_time,
                min_create_time: opts ? opts.min : min_create_time,
                id: api && api.pageParam.id,
                sum_type: api && api.pageParam.sum_type
            };
        var _url='/app/auth/page/retail/sumRetail.do';
        Http.ajax({
            url:_url,
            data:_data,
            tag:'getStatic',
            success: function(res){
                logger.log({"Type":"operation","action":"营业数据页面刷选之后门店的统计数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    vm.detail = res.object;
                }else{
                    _g.toast(res.message);
                }
            },
            error: function(){ }
        });
    }


    var initChart = function(data, type){
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
                        var points = _.clone(chartData).reverse()[params[0].dataIndex].point;
                        // console.log(param.dataIndex);
                        var opts = {};
                        if(vm.type === 'DAY'){
                            var min = points;
                            var max = points;
                        }else if(vm.type === 'WEEK' || vm.type === 'MONTH'){
                            var min = points.split('~')[0];
                            var max = points.split('~')[1];
                        }
                        opts = {
                            min: min,
                            max: max
                        }
                        Http.abort('getStatic');
                        getStatic(opts);
                        // getOrderList(opts);

                        //兼容提示框飘出问题
                        var location = 0;
                        if(vm.type === 'DAY'){
                            if(params[0].dataIndex == 0){
                                location = point[0]+2;
                            }else if(params[0].dataIndex == 7 || params[0].dataIndex == 6){
                                location = point[0] - dom.offsetWidth - 2;
                            }else{
                                location = point[0]+2
                            }
                        }else if(vm.type === 'WEEK'){
                            if(params[0].dataIndex == 0){
                                location = point[0]+2;
                            }else if(params[0].dataIndex == 4 || params[0].dataIndex == 3){
                                location = point[0] - dom.offsetWidth-2;
                            }else{
                                location = point[0]+2
                            }
                        }else if(vm.type === 'MONTH'){
                            if(params[0].dataIndex == 0){
                                location = point[0]+2;
                            }else if(params[0].dataIndex == 6 || params[0].dataIndex == 5){
                                location = point[0] - dom.offsetWidth-2;
                            }else{
                                location = point[0]+2
                            }
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
                        return formatTip(data,'x')[params[0].dataIndex] + '</br>营业额:' + formatTip(data,'y')[params[0].dataIndex] ;
                    }
                },
                legend: {
                    show: false,
                    top: 0
                },
                grid: {
                    show: true,
                    left:36,
                    top: 30,
                    bottom: 30,
                    right: 36,
                    borderColor:"#84ccdd",
                    borderWidth:2,
                },
                xAxis: {
                    data: formatChart(data, 'x'),
                    axisLabel: {
                        show:true,
                        interval: 0,
                        textStyle:{
                            color:'#fff',
                        },
                        margin:8,
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
                    // name: '营业额(元)',
                    axisLine:{
                        show:false,
                    }
                },
                series: [{
                    name: '营业额',
                    coordinateSystem: 'cartesian2d',
                    type: 'line',
                    data: formatChart(data, 'y'),
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
        // myChart.on('click', function(param){
        //     var point = _.clone(chartData).reverse()[param.dataIndex].point;
        //     var opts = {};
        //     if(vm.type === 'DAY'){
        //         var min = point;
        //         var max = point;
        //     }else if(vm.type === 'WEEK' || vm.type === 'MONTH'){
        //         var min = point.split('~')[0];
        //         var max = point.split('~')[1];
        //     }
        //     opts = {
        //         min: min,
        //         max: max
        //     };
        //     getStatic(opts,vm.startTime,vm.endTime);
        // });
    };
    setTimeout(function(){
        getChartData(getTime.transDateRange(vm.type),new Date().Format('yyyy-MM-dd'));
        getStatic(null,getTime.transDateRange(vm.type),new Date().Format('yyyy-MM-dd'));
    }, 0);


    var getFormatTime = function(type,time,addOrSubtract){
        var dayArr = getTime.getCurrentTime(type,time,addOrSubtract).split('|');
        switch(type){
            case 'DAY':
                vm.currentTime = dayArr[0];
                break;
            case 'WEEK':
                vm.currentTime = dayArr[0]+'~'+dayArr[1];
                break;
            case 'MONTH':
                vm.currentTime = dayArr[0]+'~'+dayArr[1];
                break;
        }
        vm.currentStamp = dayArr[2];
        vm.dayDes = null;
        getChartData(dayArr[0],dayArr[1]);
        getStatic(null,dayArr[0],dayArr[1]);
    };

    // 日，周，月，切换
    api.addEventListener && api.addEventListener({
        name: 'changeDate',
    }, function(ret, err) {
        logger.log({"Type":"operation","action":"营业数据页面日，周，月，切换","Win_name":api.winName});
        if(vm.type == typeMap[ret.value.type])return;
        vm.type = typeMap[ret.value.type];
        vm.currentStamp = day.getTime();
        vm.currentTime = getTime.transDateRange(typeMap[ret.value.type]);
        getFormatTime(vm.type,vm.currentStamp,0);
        vm.dayDes = dayMap[ret.value.type];
    });
    window.app = vm;
    module.exports = {};
});
