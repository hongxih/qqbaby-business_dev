define(function(require, exports, module) {
    var Http = require('U/http');
    var vm = new Vue({
        el: '#costChartMain',
        template: _g.getTemplate('cost/costChartMain-body-V'),
          data: {
            type:1
        },
        methods:{
            onSelec:function(i){
               this.type=i;
            },
            onClick:function(type){
                 _g.openWin({
                        header:{
                            data:{
                                title:"费用图表",
                                 type:type
                            },
                             template:'../html/header/header-detailCost',
                        },
                        name:'cost-costChart',
                        url:'../cost/costChart.html',
                });
            }

        }
    });

    var drawCanvas = function(data) {
        //初始化数据
        var deviceWidth = document.documentElement.clientWidth;
        var deviceHeight = (305*document.documentElement.clientHeight/667);
        var canvas = document.getElementById("canvas");
        canvas.width = deviceWidth;
        canvas.height = deviceHeight;
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var arc = {
            x:canvas.width/2,
            y:canvas.height/2,
            r:86,
        };
        ctx.save();

        //画圆弧
        var drawArc = function (n) {
            //数据处理
            var _data = _.map(n,function (item) {
                return Number(item.substring(0,item.length-1))
            })
                ctx.lineWidth = 20;
                ctx.strokeStyle = '#4fdbc6';
                ctx.beginPath();
                ctx.arc(arc.x,arc.y,arc.r,(-Math.PI/2),(_data[0]*2*Math.PI/100-Math.PI/2));
                ctx.stroke();

                ctx.lineWidth = 20;
                ctx.strokeStyle = '#3da7f2';
                ctx.beginPath();
                ctx.arc(arc.x,arc.y,arc.r,(_data[0]*2*Math.PI/100-Math.PI/2),(_data[0]*2*Math.PI/100-Math.PI/2)+(_data[1]*2*Math.PI/100));
                ctx.stroke();
                //
                ctx.lineWidth = 20;
                ctx.strokeStyle = '#8379f2';
                ctx.beginPath();
                ctx.arc(arc.x,arc.y,arc.r,(_data[0]*2*Math.PI/100-Math.PI/2)+(_data[1]*2*Math.PI/100),(_data[0]*2*Math.PI/100-Math.PI/2)+(_data[1]*2*Math.PI/100)+(_data[2]*2*Math.PI/100))
                ctx.stroke();
        }
        drawArc(data);
    };
    drawCanvas(["10%","70%","20%"]);
    module.exports = {};
})
