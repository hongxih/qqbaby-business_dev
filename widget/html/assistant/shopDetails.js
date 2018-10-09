define(function (require,exports,module) {
	var Http = require('U/http');
	var shopId = api.pageParam.entId;
	var role = require('U/account').getRole(),
			roleMap = ['企业','门店'];
	var vm = new Vue({
		el:'#shopDetails',
		template:_g.getTemplate('assistant/shopDetails-body-V'),
		data:{
			 rankInfo:[
             {
                 salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 19,
             },{
                salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 28
             },
             {
                salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 28
             },
             {
                salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 28
             },
             {
                 salesName:'我是店员',
                 shopName : '黄金家园店',
                 salesAchievement : '100%',
                 salesPrice:'10,000.00',
                 salesTarget:'10,000.00',
                 id : 28
             },
             ],
				 achievement : '',
				 rate : '',
				 end_time : '',
				 name : '',
				 range : '',
				 start_time : '',
				 aim : '',
				 unfinish : '',
				 detail : '',
			     target_code : '',
				 roleType : roleMap[role]
		},
		created:function () {
       this.rankInfo = {};
		},
		methods:{
		},
	});

	var getCharData = function(){
		var _data={
					store_goal_setting_id : shopId
					};
		var _url='/app/auth/goal/store/chart.do';
			Http.ajax({
					data:_data,
					api_versions: 'v2',
					url:_url,
					success: function(res) {
						 logger.log({"Type":"operation","action":"获取门店目标图表数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
							if (res.code == 200) {
									setTimeout(function(){
										 vm.achievement = res.object.store_total_amount ? res.object.store_total_amount : 0;
										 vm.rate = res.object.goal_achieved_rate;
										 vm.end_time = res.object.goal_end_time.split(' ')[0];
										 vm.name = res.object.goal_name;
										 vm.range = targetType(res.object.goal_rang);
										 vm.start_time = res.object.goal_start_time.split(' ')[0];
										 vm.aim = res.object.store_goal_amount ? res.object.store_goal_amount : 0;
										 vm.unfinish = res.object.unfinished_amount ? res.object.unfinished_amount : 0;
										 vm.entId = res.object.ent_goal_setting_id;
										 vm.detail = res.object.goal_type_name;
										 vm.target_code = res.object.goal_rang;
										 canvas(res.object.goal_achieved_rate);
									},0)
							} else {
									_g.toast(res.message);
							}
					},
					error: function(err) {}
			});
	}
	getCharData();

	var getData = function(){
		var _data={
						store_goal_setting_id : shopId
				};
		var _url='/app/auth/goal/sales/salesSort.do';
		Http.ajax({
				data:_data,
				api_versions: 'v2',
				url:_url,

				success: function(res) {
					 logger.log({"Type":"operation","action":"获取店员达成率排名","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
						if (res.code == 200) {
								setTimeout(function(){
									 vm.rankInfo = getDetail(res);
								},0)
						} else {
								_g.toast(res.message);
						}
				},
				error: function(err) {}
		});
	}
	var getDetail = function(res){
			return _.map(res.object,function(item){
					return{
							salesName:item.sales_name,
							salesAchievement : item.goal_achieved_rate ? item.goal_achieved_rate : 0,
							salesPrice:item.sales_total_amount ? item.sales_total_amount : 0,
							salesTarget:item.pre_sales_total_amount ? item.pre_sales_total_amount : 0,
							id :item.sales_goal_setting_id,
							sales_id:item.sales_id,
					}
			})
	};
	getData();
	var targetType = function(type){
		switch(type){
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
	//canvas
	var canvas = function(rate){
			var canvas = document.getElementById('canvas'),  //获取canvas元素
					context = canvas.getContext('2d'),  //获取画图环境，指明为2d

					devicePixelRatio = window.devicePixelRatio || 1,
					backingStoreRatio = context.webkitBackingStorePixelRatio ||
																	context.mozBackingStorePixelRatio ||
																	context.msBackingStorePixelRatio ||
																	context.oBackingStorePixelRatio ||
																	context.backingStorePixelRatio || 1,
					ratio = devicePixelRatio / backingStoreRatio,

					centerX = canvas.width/2,   //Canvas中心点x轴坐标
					centerY = canvas.height/2,  //Canvas中心点y轴坐标
					rad = Math.PI*2/100, //将360度分成100份，那么每一份就是rad度
					speed = 0; //加载的快慢就靠它了

					canvas.width = canvas.width * ratio;
					canvas.height = canvas.height * ratio;
					context.scale(ratio, ratio);
			//绘制蓝色外圈
			function blueCircle(n){
					context.save();
					context.strokeStyle = "rgb(82,192,193)"; //设置描边样式
					context.lineWidth = 3; //设置线宽
					context.beginPath(); //路径开始
					context.arc(centerX, centerY, 50 , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
					context.stroke(); //绘制
					context.closePath(); //路径结束
					context.restore();
			}
			//绘制灰色外圈
			function whiteCircle(){
					context.save();
					context.beginPath();
					context.strokeStyle = "rgb(220,220,220)";
					context.arc(centerX, centerY, 50 , 0, Math.PI*2, false);
					context.stroke();
					context.closePath();
					context.restore();
			}
			//绘制最外层外圈
			function lastBlueCircle(n){
					context.save();
					context.beginPath();
					context.strokeStyle = "rgb(163,221,222)";
					context.arc(centerX, centerY, 55 , -Math.PI/2, -Math.PI/2 +n*rad, false);
					context.stroke();
					context.closePath();
					context.restore();
			}
			//百分比文字绘制
			function text(n){
					context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
					context.font = "32px Arial"; //设置字体大小和字体
					context.fillStyle = "rgb(82,192,193)";
					//绘制字体，并且指定位置
					var pos = 0;
		            if(n < 10){
		                pos = 22;
		            }else if(n>=10 && n<100){
		                pos = 28;
		            }else if(n>=100){
		                pos = 36;
		            };
					context.fillText(n.toFixed(0)+"%", centerX- pos, centerY+10);
					context.restore();
			}

			/*var timer = setInterval(function(){
					context.clearRect(0, 0, canvas.width, canvas.height);
					whiteCircle();
					if(speed == rate){
							clearInterval(timer);
					}
					text(speed);
					blueCircle(speed);
					lastBlueCircle(speed);
					speed += 1;
			},20);*/
		var number = Number(rate);
		if (isNaN(number)) number = 0;
		var timeStep = 24, // 每个step需要的时间
			time = 1000, // 总时间
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
			name: 'target-entRank'
	}, function(ret, err) {
		_g.openWin({
			 header: {
					 data: {
							 title:'门店排行',
							 rightText: '店员'
					 },
			 },
			 name: 'targetShop-rank',
			 url: '../assistant/targetShopRank.html',
			 pageParam : {
					entId : vm.entId
			 },
			 bounces: false,
			 slidBackEnabled: false,
	 })
	});
})
