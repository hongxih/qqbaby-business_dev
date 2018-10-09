define(function(require, exports, module) {
    var Http = require('U/http');

    var chartData = [];
    var weekturnover = new Vue({
        el: '#weekturnover',
        template: _g.getTemplate('statistics/weekturnover-body-V'),
        data: {
            type: 'DAY',
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
            list: [{
                order_id: '',
                order_id: 0,
                create_time: '',
                total_sale_price: 0,
            }, ],
        },
        created: function(){
            this.list = [];
            _g.setLS('dimensionType', this.type);
        },
        watch: {
            type: function(){
                // 监听type值的改变
                getChartData();
                getOrderList();
                getStatic();
                storageType();
                loadmore.reset();
            }
        },
        filters: {
            transNegative: function(value){
                if(!value && value !== 0 ) return;
                return value >= 0 ? '+' + value : value;
            }
        },
        methods: {
            // 点击跳转到销售单详情页
            onDetailTap: function(order_id, order_type) {
                _g.openWin({
                    header: {
                        data: {
                            title: '销售单详情',
                        }
                    },
                    name: 'statistics-saleTicketDetail',
                    url: '../statistics/saleTicketDetail.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        order_id: order_id,
                        order_type: order_type
                    }
                });
            },
            // 点击跳转到销售明细筛选页面
            onAllDetails: function () {
                _g.openDrawerLayout({
                    header:{
                        data:{
                            title:"全部销售明细"
                        },
                        template:'../html/header/header-hasScreen-V'
                    },
                    name: "statistics-allDetails",
                    url:"../statistics/allDetails.html",
                    rightPane: {
                        name: 'rightPane',
                        url: '../statistics/allDetailsSide.html'
                    }
                });
            },
        }
    });

    var dateMap = ['DAY', 'WEEK', 'MONTH'];

    function storageType(){
        _g.setLS('dimensionType', weekturnover.type);
    }


    function formatTime(time){
        return _.map(transDateRange().split('-'), function(value){
            return value.length >= 2 ? value : '0'+value;
        }).join('-');
    }
    // 起始日期，区间
    function transDateRange(){
        var now = new Date();
        var timeStamp;
        if(weekturnover.type === 'DAY'){
            return now.Format('yyyy-MM-dd');
        }else if(weekturnover.type === 'WEEK'){
            if(now.getDay() == 0){
                timeStamp = now.getTime() - (24*60*60*1000)*6;
            }else{
                timeStamp = now.getTime() - (24*60*60*1000)*(now.getDay()-1);
            }
            var weekDate = new Date(timeStamp);
            return weekDate.getFullYear()+'-'+(weekDate.getMonth() + 1)+'-'+weekDate.getDate();
        }else if(weekturnover.type === 'MONTH'){
            return now.getFullYear()+'-'+(now.getMonth() + 1)+'-01';
        }
    };
    // console.log('测试');
    // console.log(formatTime());

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
                    triggerOn:'mousemove',
                    position:function (point, params, dom){
                        var points = _.clone(chartData).reverse()[params[0].dataIndex].point;
                        // console.log(param.dataIndex);
                        var opts = {};
                        if(weekturnover.type === 'DAY'){
                            var min = points;
                            var max = points;
                        }else if(weekturnover.type === 'WEEK' || weekturnover.type === 'MONTH'){
                            var min = points.split('~')[0];
                            var max = points.split('~')[1];
                        }
                        opts = {
                            min: min,
                            max: max
                        }
                        Http.abort('getStatic');
                        Http.abort('getOrderList');
                        getStatic(opts);
                        getOrderList(opts);

                        //兼容提示框飘出问题
                        var location = 0;
                        if(weekturnover.type === 'DAY'){
                            if(params[0].dataIndex == 0){
                                location = point[0]+2;
                            }else if(params[0].dataIndex == 7 || params[0].dataIndex == 6){
                                location = point[0] - dom.offsetWidth - 2;
                            }else{
                                location = point[0]+2
                            }
                        }else if(weekturnover.type === 'WEEK'){
                            if(params[0].dataIndex == 0){
                                location = point[0]+2;
                            }else if(params[0].dataIndex == 4 || params[0].dataIndex == 3){
                                location = point[0] - dom.offsetWidth-2;
                            }else{
                                location = point[0]+2
                            }
                        }else if(weekturnover.type === 'MONTH'){
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
        //     // console.log(param);
        //     var point = _.clone(chartData).reverse()[param.dataIndex].point;
        //     // console.log(param.dataIndex);
        //     var opts = {};
        //     if(weekturnover.type === 'DAY'){
        //         var min = point;
        //         var max = point;
        //     }else if(weekturnover.type === 'WEEK' || weekturnover.type === 'MONTH'){
        //         var min = point.split('~')[0];
        //         var max = point.split('~')[1];
        //     }
        //     opts = {
        //         min: min,
        //         max: max
        //     }
        //     getStatic(opts);
        //     getOrderList(opts);
        // });
    };
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
            if(weekturnover.type === 'DAY'){
                return _.map(data, function(item){
                    return item.point.split('-')[1] + '月' +item.point.split('-')[2] + '日';
                }).reverse();
            }else if(weekturnover.type === 'WEEK'){
                return _.map(data, function(item){
                    return item.point.split('~')[0].split('-')[1] + '月' + item.point.split('~')[0].split('-')[2] + '日' + '~' + item.point.split('~')[1].split('-')[1] + '月' + item.point.split('~')[1].split('-')[2] + '日'
                }).reverse();
            }else if(weekturnover.type === 'MONTH'){
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

    //格式化图表数据
    function formatChart(data, axias){
        var array = [];
        if(axias === 'x'){
            if(weekturnover.type === 'DAY'){
                return _.map(data, function(item,i){
                    if(i == 0 || i == 7){
                        return item.point.split('-')[1] + '月' +item.point.split('-')[2] + '日';
                    }else{
                        return '';
                    }
                }).reverse();
            }else if(weekturnover.type === 'WEEK'){
                return _.map(data, function(item,i){
                    if(i == 0){
                        console.log(item.point)
                        return item.point.split('~')[1].split('-')[1] + '月' + item.point.split('~')[1].split('-')[2] + '日';
                    }else if(i == 4){
                        console.log(item.point)

                        return item.point.split('~')[0].split('-')[1] + '月' + item.point.split('~')[0].split('-')[2] + '日';
                    }else{
                        return '';
                    }
                }).reverse();
            }else if(weekturnover.type === 'MONTH'){
                return _.map(data, function(item,i){
                    if(i == 0){
                        console.log(item.point)
                        return item.point.split('~')[1].split('-')[0] + '年' + item.point.split('~')[1].split('-')[1] + '月';
                   }else if(i == 6){
                        return item.point.split('~')[0].split('-')[0] + '年' + item.point.split('~')[0].split('-')[1] + '月';
                   }else{
                        return '';
                   }
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

    // 获取图表数据
    var getChartData = function(){
        var _data={
                date_type: weekturnover.type,
                max_create_time: new Date().Format('yyyy-MM-dd'),
                min_create_time: formatTime()
            };
        var _url='/app/auth/page/retail/sumChart.do';
        Http.ajax({
            url:_url,
            data:_data,
            tag:'getChartData',
            success: function(res){
                logger.log({"Type":"operation","action":"营业数据页面获取图表数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    // console.log(formatChart(res.object, 'x'));
                    chartData = res.object;
                    // console.log(chartData);
                    initChart(res.object);
                }else{
                    console.log(res);
                    _g.toast(res.message);
                }
            },
            error: function(err){ }
        })
    };

    // 获取门店的统计数据
    function getStatic(opts){
        opts = opts || {};
        console.log(opts);
        var _data={
                date_type: weekturnover.type,
                max_create_time: opts.max || new Date().Format('yyyy-MM-dd'),
                min_create_time: opts.min || formatTime()
            };
        var _url='/app/auth/page/retail/sumRetail.do';
        Http.ajax({
            url:_url,
            data:_data,
            tag:'getStatic',
            success: function(res){
                logger.log({"Type":"operation","action":"营业数据页面获取门店的统计数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    weekturnover.detail = res.object;
                }else{
                    console.log(res);
                    _g.toast(res.message);
                }
            },
            error: function(){ }
        })
    }

    // 获取销售单列表
    function getOrderList(opts,callback){
        opts = opts || {};
        var _data= {
                displayRecord: 10,
                page: opts.page || 1,
                sale_price: 100000,
                min_create_time: opts.min || formatTime(),
                max_create_time: opts.max || new Date().Format('yyyy-MM-dd')
            };
        var _url='/app/auth/page/retail/listOrderItemV2.do';
        Http.ajax({
            url:_url,
            data:_data,
            tag:'getOrderList',
            success: function(res){
                logger.log({"Type":"operation","action":"营业数据页面获取大单销售列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    if(opts.page && opts.page > 1){
                        callback && callback(res.object)
                    }else{
                        weekturnover.list = res.object;
                    }
                }else{
                    console.log(res);
                    _g.toast(res.message);
                }
            }
        });
    }

    var loadmore = new Loadmore({
        callback: function(page){
            getOrderList({page: page.page}, function(data){
                if(!data || data.length === 0){
                    return loadmore.loadend(false);
                }else{
                    weekturnover.list = weekturnover.list.concat(data);
                    loadmore.loadend(true);
                }
            });
        }
    });

    setTimeout(function(){
        getChartData();
        getOrderList();
        getStatic();
    }, 0);

    // _g.setPullDownRefresh(function() {
    //     setTimeout(function(){
    //         getChartData();
    //         getOrderList();
    //         getStatic();
    //         loadmore.reset()
    //     }, 0);
    // });

    // 日，周，月，切换
    api.addEventListener && api.addEventListener({
        name: 'toggleDate',
    }, function(ret, err) {
        logger.log({"Type":"operation","action":"营业数据日，周，月，切换","Win_name":api.winName});
        weekturnover.type = dateMap[ret.value.type];
    });

    window.app = weekturnover;
    module.exports = {};
});
