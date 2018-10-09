/**
 * [description] echart图表模块
   在模板页面插入
   <div id="main" style="width: 200px;height:200px;"></div>大小自定义
   在html页面引入
   <script src="../../script/lib/echarts.min.js"></script>
 * @author sunzhibin
 * @version v2.0
 */

define(function (require,exports,module) {
    module.exports = {
        bar:function (name,data) {
            // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));
                //根据数据设定高度
                var _height = name.length*60+"px";
                // 指定图表的配置项和数据
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    barWidth:8,
                    itemStyle:{
                        normal:{
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: '#4fdbc6' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#4cbcbe' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                    grid: {
                        left:15,
                        right: 35,
                        top: 10,
                        bottom:20,
                        containLabel: true,
                        width:"auto",
                        height:"auto",
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0],
                        axisTick:{
                            show:false,
                        },
                        axisLabel:{
                            formatter:"{value}%",
                            textStyle:{
                                color:"#999",
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#ddd'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: name,
                        axisLabel:{
                            textStyle:{
                                color:"#999",
                            }
                        },
                        axisTick:{
                            show:false,
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#ddd'
                            }
                        }
                    },
                    series: [

                        {
                            name: '2012年',
                            type: 'bar',
                            data: data,
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //根据数据设定的高度调整图表大小
                $("#main").css("height",_height);
                myChart.resize({
                    height:_height
                })
        }
    }
})
