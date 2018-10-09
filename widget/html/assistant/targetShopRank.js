define(function (require, exports, module) {
    var Http = require('U/http'),
        role = require('U/account').getRole();
    var entId = api.pageParam.entId;
    var vm = new Vue({
        el: '#targetShopRank',
        template: _g.getTemplate('assistant/targetShopRank-body-V'),
        data: {
            rankInfo: [
                {
                    shopName: '黄金家园店',
                    shopAchievement: '100%',
                    shopPrice: '10,000.00',
                    shopTarget: '10,000.00',
                    id: 19,
                }, {
                    shopName: '黄金家园店',
                    shopAchievement: '100%',
                    shopPrice: '10,000.00',
                    shopTarget: '10,000.00',
                    id: 28
                },
                {
                    shopName: '黄金家园店',
                    shopAchievement: '100%',
                    shopPrice: '10,000.00',
                    shopTarget: '10,000.00',
                    id: 28
                },
                {
                    shopName: '黄金家园店',
                    shopAchievement: '100%',
                    shopPrice: '10,000.00',
                    shopTarget: '10,000.00',
                    id: 28
                },
                {
                    shopName: '黄金家园店',
                    shopAchievement: '100%',
                    shopPrice: '10,000.00',
                    shopTarget: '10,000.00',
                    id: 28
                },
            ],
            achievement: '',
            rate: '',
            end_time: '',
            name: '',
            range: '',
            start_time: '',
            aim: '',
            unfinish: '',
            details: '',
            target_code: '',
            role: role
        },
        created: function () {
            this.rankInfo = {};
        },
        methods: {
            onAllDetail: function () {
                _g.openWin({
                    header: {
                        data: {
                            title: '目标详情',
                            rightText: null,
                        }
                    },
                    name: 'targetShop-targetDetails',
                    url: '../boss/targetDetails.html',
                    pageParam: {
                        entId: entId
                    },
                    bounces: false,
                    slidBackEnabled: false
                });
            },
            turnToDetail: function (shopId) {
                if (role == 0) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '门店详情'
                            }
                        },
                        name: 'targetShop-detail',
                        url: '../assistant/shopDetails.html',
                        pageParam: {
                            entId: shopId
                        },
                        bounces: false,
                        slidBackEnabled: false,
                    })
                }
            }
        },
    });


    var getCharData = function () {
        var _data= {
                ent_goal_setting_id: entId
            };
        var _url='/app/auth/goal/chart.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取图表数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.achievement = res.object.ent_total_amount;
                        vm.rate = res.object.goal_achieved_rate;
                        vm.end_time = res.object.goal_end_time.split(' ')[0];
                        vm.name = res.object.goal_name;
                        vm.range = targetType(res.object.goal_rang);
                        vm.target_code = res.object.goal_rang;
                        vm.start_time = res.object.goal_start_time.split(' ')[0];
                        vm.aim = res.object.pre_ent_total_amount;
                        vm.unfinish = res.object.unfinished_amount;
                        vm.details = res.object.goal_type_name;
                        canvas(res.object.goal_achieved_rate);
                    }, 0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    }
    if (role == 0) {
        getCharData();
    }
    var targetType = function (type) {
        switch (type) {
            case 'Overall':
                return '全场目标';
            case 'Goods':
                return '单品目标';
            case 'Brand':
                return '品牌目标';
            default:
                return '品类目标';
        }
    };
    var getData = function () {
        var _data= {
                ent_goal_setting_id: entId
            };
        var _url='/app/auth/goal/storeSort.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取门店排行数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function () {
                        vm.rankInfo = getDetail(res);
                    }, 0)
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    }
    var getDetail = function (res) {
        return _.map(res.object, function (item) {
            return {
                shopName: item.store_name,
                shopPrice: item.store_total_amount ? item.store_total_amount : 0,
                id: item.store_goal_setting_id,
                shopAchievement: item.goal_achieved_rate,
                shopTarget: item.store_goal_amount ? item.store_goal_amount : 0
            }
        })
    };
    getData();
    //canvas
    var canvas = function (rate) {
        var canvas = document.getElementById('canvas'),  //获取canvas元素
            context = canvas.getContext('2d'),  //获取画图环境，指明为2d

            devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1,
            ratio = devicePixelRatio / backingStoreRatio,

            centerX = canvas.width / 2,   //Canvas中心点x轴坐标
            centerY = canvas.height / 2,  //Canvas中心点y轴坐标
            rad = Math.PI * 2 / 100, //将360度分成100份，那么每一份就是rad度
            speed = 0; //加载的快慢就靠它了

        canvas.width = canvas.width * ratio;
        canvas.height = canvas.height * ratio;
        context.scale(ratio, ratio);
        //绘制蓝色外圈
        function blueCircle(n) {
            context.save();
            context.strokeStyle = "rgb(82,192,193)"; //设置描边样式
            context.lineWidth = 3; //设置线宽
            context.beginPath(); //路径开始
            context.arc(centerX, centerY, 50, -Math.PI / 2, -Math.PI / 2 + n * rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
            context.stroke(); //绘制
            context.closePath(); //路径结束
            context.restore();
        }

        //绘制灰色外圈
        function whiteCircle() {
            context.save();
            context.beginPath();
            context.strokeStyle = "rgb(220,220,220)";
            context.arc(centerX, centerY, 50, 0, Math.PI * 2, false);
            context.stroke();
            context.closePath();
            context.restore();
        }

        //绘制最外层外圈
        function lastBlueCircle(n) {
            context.save();
            context.beginPath();
            context.strokeStyle = "rgb(163,221,222)";
            context.arc(centerX, centerY, 55, -Math.PI / 2, -Math.PI / 2 + n * rad, false);
            context.stroke();
            context.closePath();
            context.restore();
        }

        //百分比文字绘制
        function text(n) {
            context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
            context.font = "32px Arial"; //设置字体大小和字体
            context.fillStyle = "rgb(82,192,193)";
            //绘制字体，并且指定位置
            var pos = 0;
            if (n < 10) {
                pos = 22;
            } else if (n >= 10 && n < 100) {
                pos = 28;
            } else if (n >= 100) {
                pos = 36;
            }
            ;
            context.fillText(n.toFixed(0) + "%", centerX - pos, centerY + 10);
            context.restore();
        }

        /*var timer = setInterval(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            whiteCircle();
            if (speed == rate) {
                clearInterval(timer);
            }
            text(speed);
            blueCircle(speed);
            lastBlueCircle(speed);
            speed += 1;
        }, 20);*/

        var number = Number(rate);
        if (isNaN(number)) number = 0;
        var timeStep = 24, // 每个step需要的时间
            time = 2000, // 总时间
            num = number, //要显示的真实数值
            step = num * timeStep / time, // 每24ms增加的数值 speed = L / t * 24 (num/24ms)
            start = 0, // 计数器
            interval, // 定时器
            showNum = '0';
        interval = setInterval(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            whiteCircle();
            start = start + step;
            if (start >= num) {
                start = num;
                clearInterval(interval);
                interval = null;
            }
            showNum = start | 0 //不能影响start的值
            text(start);
            blueCircle(start);
            lastBlueCircle(start);
        }, timeStep);

    };

    api.addEventListener({
        name: 'target-saleRank'
    }, function (ret, err) {
        _g.openWin({
            header: {
                data: {
                    title: '店员排行',
                    rightText: '门店'
                },
            },
            name: 'assistant-salesRank',
            url: '../assistant/targetSalesRank.html',
            pageParam: {
                id: entId
            },
            bounces: false,
            slidBackEnabled: false,
        })
    });

});
