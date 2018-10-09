define(function(require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var pageParam = api && api.pageParam;

    console.log(pageParam);

    var vm = new Vue({
        el: '#managerFilterResult',
        template: _g.getTemplate('manager/managerFilterResult-list-V'),
        data: {
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
        },
        watch: {
            type: function(){
                // 监听type值的改变
                getChartData();
                getStatic();
            }
        },        
        created: function(){

        },
        methods: {
           
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
                return item.total_sale_price / 100;
            }).reverse();
        }
    }
    function formatTime(time){
        return _.map(transDateRange().split('-'), function(value){
            return value.length >= 2 ? value : '0'+value;
        }).join('-'); 
    }
    function transDateRange(){
        var now = new Date();
        var timeStamp;
        if(vm.type === 'DAY'){
            return now.Format('yyyy-MM-dd');
        }else if(vm.type === 'WEEK'){
            if(now.getDay() == 0){
                timeStamp = now.getTime() - (24*60*60*1000)*6;
            }else{
                timeStamp = now.getTime() - (24*60*60*1000)*(now.getDay()-1);
            }
            var weekDate = new Date(timeStamp);
            return weekDate.getFullYear()+'-'+(weekDate.getMonth() + 1)+'-'+weekDate.getDate();
        }else if(vm.type === 'MONTH'){
            return now.getFullYear()+'-'+(now.getMonth() + 1)+'-01';
        }
    }


    // 获取图表数据
    function getChartData(){
        var _data={
                date_type: vm.type,
                max_create_time: new Date().Format('yyyy-MM-dd'),
                min_create_time: formatTime(),
                id: api && api.pageParam.id,
                sum_type: api && api.pageParam.sum_type
            };
        var _url='/app/auth/page/retail/sumChart.do';
        Http.ajax({
            url:_url,
            data:_data,
            success: function(res){
                logger.log({"Type":"operation","action":"店长获取图表数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
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
    function getStatic(opts){
        opts = opts || {};
        console.log(opts);
        var _data= {
                date_type: vm.type,
                max_create_time: opts.max || new Date().Format('yyyy-MM-dd'),
                min_create_time: opts.min || formatTime(),
                id: api && api.pageParam.id,
                sum_type: api && api.pageParam.sum_type
            };
        var _url='/app/auth/page/retail/sumRetail.do';
        Http.ajax({
            url:_data,
            data:_url,
            success: function(res){
                logger.log({"Type":"operation","action":"店长获取门店的统计数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if(res.success){
                    vm.detail = res.object;
                }else{
                    console.log(res);
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
                title: {
                    show: false,
                    top: 0
                },
                legend: {
                    show: false,
                    top: 0
                },
                grid: {
                    show: true,
                    left:30,
                    top: 30,
                    bottom: 30,
                    right: 20
                },
                tooltip: {},
                xAxis: {
                    data: formatChart(data, 'x'),
                    axisLabel: {
                        interval: 0
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
                        // show: false
                    },
                    splitArea: {
                        // interval: 1
                    },
                    min: 0,
                    name: '营业额(元)',
                },
                series: [{
                    name: '营业额',
                    coordinateSystem: 'cartesian2d',
                    type: 'line',
                    data: formatChart(data, 'y'),
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    clipOverflow: false,
                    symbolSize: 15
                }],               
            };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option); 
        myChart.on('click', function(param){
            var point = _.clone(chartData).reverse()[param.dataIndex].point;
            var opts = {};
            if(vm.type === 'DAY'){ 
                var min = point;
                var max = point;
            }else if(vm.type === 'WEEK' || vm.type === 'MONTH'){
                var min = point.split('~')[0];
                var max = point.split('~')[1];
            }
            opts = {
                min: min,
                max: max
            };
            getStatic(opts);
        }); 
    };    
    setTimeout(function(){
        getChartData();
        getStatic();
    }, 0);

    // 日，周，月，切换
    api.addEventListener && api.addEventListener({
        name: 'changeDate',
    }, function(ret, err) {
        vm.type = dateMap[ret.value.type];
    });

    window.app = vm;
    module.exports = {};
});