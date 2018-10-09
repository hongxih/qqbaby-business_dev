define(function (require,exports,module) {
	var Http = require('U/http');
	var saleId = api.pageParam.entId;
	var interval = null; // 定时器
	var isAndroid = _g.isAndroid ? 1 : 0;
	var vm = new Vue({
		el:'#shopDetails',
		template:_g.getTemplate('assistant/shopDetails_clerk-body-V'),
		data:{
			isAndroid:isAndroid,
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
                 id : 28,
								 entId : 0
             }
             ],
						 achievement : '',
						 rate : '',
						 end_time : '',
						 name : '',
						 range : '',
						 start_time : '',
						 aim : '',
						 unfinish : '',
						 target_type:'个人',
						 currentIdx : 0,
						 detail : '',
						 target_code : '',
						 entId:null,
						 shopId:null,
						 saleId:null
		},
		created:function () {
       this.rankInfo = {};
		},
		methods:{
			onToggle : function(idx){

				if(idx == this.currentIdx){
					return;
				}else{
					clearInterval(interval);
					switch (idx){
						case 0:
						Http.abort("getCharDataShop");
						Http.abort("getCharDataSale");
						  this.target_type = '个人';
							getCharDataSale(saleId);
							break;
						default:
						Http.abort("getCharDataShop");
						Http.abort("getCharDataSale");
							this.target_type = '门店';
							getCharDataShop(vm.shopId);
							break;
					}
				}
				this.currentIdx = idx;
			}
		},
	});
  //门店图表
	var getCharDataShop = function(id){
		var _data={
					   store_goal_setting_id : id
					};
		var _url='/app/auth/goal/store/chart.do'
			Http.ajax({
					data:_data,
					api_versions: 'v2',
					url:_url,
					tag:"getCharDataShop",
					success: function(res) {
						 logger.log({"Type":"operation","action":"店员角色门店图表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
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
	//店员图表
	var getCharDataSale = function(id){
		var _data= {
					   sales_goal_setting_id : id
					};
		var _url='/app/auth/goal/sales/chart.do';
			Http.ajax({
					data:_data,
					api_versions: 'v2',
					url:_url,
					tag:"getCharDataSale",
					success: function(res) {
						 logger.log({"Type":"operation","action":"店员角色店员图表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
							if (res.code == 200) {
									setTimeout(function(){
										 vm.achievement = res.object.sales_total_amount ? res.object.sales_total_amount : 0;
										 vm.rate = res.object.goal_achieved_rate;
										 vm.end_time = res.object.goal_end_time.split(' ')[0];
										 vm.name = res.object.goal_name;
										 vm.range = targetType(res.object.goal_rang);
										 vm.start_time = res.object.goal_start_time.split(' ')[0];
										 vm.aim = res.object.sales_goal_amount ? res.object.sales_goal_amount : 0;
										 vm.unfinish = res.object.unfinished_amount ? res.object.unfinished_amount : 0;
										 vm.entId = res.object.ent_goal_setting_id;
										 vm.shopId = res.object.store_goal_setting_id;
										 vm.detail = res.object.goal_type_name;
										 vm.target_code = res.object.goal_rang;
										 canvas(res.object.goal_achieved_rate);
										 getData(res.object.store_goal_setting_id);
									},0)
							} else {
									_g.toast(res.message);
							}
					},
					error: function(err) {}
			});
	}
	getCharDataSale(saleId);

  //店员达成率排行
	var getData = function(shopId){
		var _data= {
						store_goal_setting_id : shopId
				};
		var _url='/app/auth/goal/sales/salesSort.do';
		Http.ajax({
				data:_data,
				api_versions: 'v2',
				url:_url,
				tag:"getData",
				success: function(res) {
					 logger.log({"Type":"operation","action":"店员达成率排行查询","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
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
							id :item.sales_goal_setting_id
					}
			})
	};


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
	var canvas = document.getElementById('canvas'),  //获取canvas元素
			context = canvas.getContext('2d'),  //获取画图环境，指明为2d

			devicePixelRatio = window.devicePixelRatio || 1,
			backingStoreRatio = context.webkitBackingStorePixelRatio ||
															context.mozBackingStorePixelRatio ||
															context.msBackingStorePixelRatio ||
															context.oBackingStorePixelRatio ||
															context.backingStorePixelRatio || 1,
			ratio = devicePixelRatio / backingStoreRatio;
			// var centerX = _g.isAndroid ? canvas.width/2 : canvas.width/4;  //Canvas中心点x轴坐标
			// var centerY = _g.isAndroid ? canvas.height/2 : canvas.height/5.2; //Canvas中心点y轴坐标
			centerX = canvas.width/2,   //Canvas中心点x轴坐标
			centerY = canvas.height/2.4,  //Canvas中心点y轴坐标
			canvas.width = canvas.width * ratio;
			canvas.height = canvas.height * ratio;
			context.scale(ratio, ratio);
	var canvas = function(rate){
		  rate = rate ? rate : 0;
          var canvas = document.getElementById('canvas');
					rad = Math.PI*2/100, //将360度分成100份，那么每一份就是rad度
					speed = 0; //加载的快慢就靠它了
					context.clearRect(0, 0, canvas.width, canvas.height);
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
					var pos = 0;
		            if(n < 10){
		                pos = 22;
		            }else if(n>=10 && n<100){
		                pos = 28;
		            }else if(n>=100){
		                pos = 36;
		            }
					//绘制字体，并且指定位置
					context.fillText(n.toFixed(0)+"%", centerX- pos, centerY+10);
					context.restore();
			}

				/*timer = setInterval(function(){
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

//企业排行跳转
	api.addEventListener({
    name: 'target-entRank'
}, function(ret, err) {
	_g.openWin({
		header: {
			data: {
				title: '门店排行',
				rightText:'店员',
			}
		},
		name: 'targetShop-rank',
		url:  '../assistant/targetShopRank.html',
		pageParam: {
				entId : vm.entId
		},
		bounces: false,
		slidBackEnabled: false,
	})
});
})
