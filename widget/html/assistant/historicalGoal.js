define(function (require,exports,module) {
	var Http = require('U/http');
	
	var vm = new Vue({
		el:'#historicalGoal',
		template:_g.getTemplate('assistant/historicalGoal-body-V'),
		data:{
			isShow:false,
            showImg : '',
            selectIdx:0,
            defaultType:'单品目标',
            type:[
                {
                    typeName:"单品目标",
                    typeNum :'001'
                },
                {
                    typeName:"品牌目标",
                    typeNum :'002'
                },
                {
                    typeName:"品类目标",
                    typeNum :'003'
                },
                {
                    typeName:"全场目标",
                    typeNum :'004'
                },
            ],
			item:[
				{
					target_name:"十一月第一阶段目标",
					stage:"进行中",
					target_num:'￥100,000.00',
					target_achievement:"50%",
					time:'2015-05-05至2015-06-05',
                    target_type:'全场目标'
				},
				{
					target_name:"十一月第一阶段目标",
					stage:"进行中",
					target_num:'￥100,000.00',
					target_achievement:"50%",
					time:'2015-05-05至2015-06-05',
                    target_type:'全场目标'
				},
			]
		},
		created:function () {

		},
		methods:{
			onShowType:function () {
                this.isShow = !this.isShow;
            },

            onSelectType:function (index,num,type) {

                this.selectIdx = index;
                this.defaultType = type;
                this.isShow = !this.isShow;

                this.typeNum = num;
            },
		}
	})
})