define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#memberMessage',
        template: _g.getTemplate('member/memberMessage-body-V'),
        data: {
            isFirstLoading:true,
            isNoResult:false,
        	list:[
        	{
        		memberPhone:'18800000000',
        		memberCard:'123456789',
        		memberName:'方先生',
        		memberSex:1,
        		memberOld:'80后',
        		memberVip:1,
        		memberIntegral:520,
        		tagList:['80后','小清新','测试一下']
        	},
        	{
        		memberPhone:'18811111111',
        		memberCard:'123456789',
        		memberName:'薛小姐',
        		memberSex:2,
        		memberOld:'90后',
        		memberVip:1,
        		memberIntegral:300,
        		tagList:['80后','老不死','测试一下']
        	}
        	]
        },
        created: function () {
           this.list = [];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        watch: {},
        computed:{
            isNoResult: function () {
                if(this.isFirstLoading) return false
                var sta = this.list.length === 0 ? true : false
                return sta
            }
        },
        filters: {
            encrept: function (val) {
                if(!val) return
                var str = val
                var a = str.slice(0, 3)
                var b = str.slice(7)
                str = a + '****' + b
                return str
            }
        },
        methods: {
            onMemberFiller: function () {
                api.openDrawerPane({
                    type: 'right'
                });
            },
            onMerberItem: function (memberId) {
                _g.openWin({
                    header: {
                        data: {
                            title: '会员详情'
                        }
                    },
                    pageParam: {
						entId : memberId
					},
                    name: 'member-memberDetails',
                    url: '../member/memberDetails.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            ontext: function () {
                //alert(_g.j2s(api.pageParam))
            }
        }
    });
	var start_consume_time='';
	var	end_consume_time='';
	var	tag_list='';
	var	start_integral='';
	var	end_integral='';
	var	user_level_id='';
    var phoneSearch='';
	var getData = function(opts,callback){
        var opts = opts || {};
        var _data={
            displayRecord : 10,
            page : opts.page || 1,
            //搜索用的参数
            end_integral: end_integral,//   结束积分    number
            start_integral: start_integral,//   开始积分    number
            start_consume_time: start_consume_time,
            end_consume_time: end_consume_time,
            tag_list: (tag_list && '[' + tag_list.toString() +']')|| "",//  标签ID    array<number>   格式：tag_list:"[127,126]"
            user_level_id: user_level_id,// 会员等级ID
            search:phoneSearch
        };
        logger.log({"Type":"operation","action":"获取会员数据","Win_name":api.winName,"data":_data});

        var _url='/app/auth/crm/user/listCrmUser.do';
    	Http.ajax({
			data: _data,
			api_versions: 'v2',
			url:_url,

			success: function(res) {
                logger.log({"Type":"operation","action":"获取会员数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                vm.isFirstLoading = false
				if (res.success) {
					if(opts.page && opts.page > 1){
						setTimeout(function(){
							callback && callback(res);
						},0);
					}else{
                        /*if(_g.isEmpty(res.object)){
                            vm.isNoResult = true
                            return
                        }
                        vm.isNoResult = false*/
						setTimeout(function(){
							vm.list = getItemList(res);
						},0);
					}
				} else {
                    _g.toast(res.message);
                    callback && callback(res);
				}
			},
            error: function (err) {
                vm.isFirstLoading = false
                _g.hideProgress();
                _g.toast(err.message);
            }
		});
    };


    //格式化列表
    var getItemList = function(res){
    	return _.map(res.object,function(item){
			return{
				memberPhone:item.phone,//手机
				memberCard:item.card_no,//卡号
				memberName:item.user_name,//名称
				memberOld:getMemberOld(item.birthday),//几零后
				memberId:item.user_id,//会员ID
				memberSex:item.sex,//性别
				memberVip:getVip(item.user_level_name),//会员等级
				memberIntegral:item.integral?item.integral:0,//积分
				tagList:getTagList(item.tag_list)//标签列表

			}
		})
    };
    var getVip = function(res){
        switch(res){
            case 'V1' :
                return 1;
            case 'V2' :
                return 2;
            case 'V3' :
                return 3;
            case 'V4' :
                return 4;
            case 'V5' :
                return 5;
            case 'V6' :
                return 6;
            case 'V7' :
                return 7;
            case 'V8' :
                return 8;
            case 'V9' :
                return 9;
            case 'V10' :
                return 10;
            case 'V11' :
                return 11;

        }
    }
    //标签列表
    var getTagList = function(res){
    	return _.map(res,function(item){
			return{
				tag_name:item.tag_name,//标签名称
				tag_id:item.tag_id,//标签Id
				is_selected:item.is_selected//是否选中
			}
		})
    };
    //格式化是几零后
    var getMemberOld = function(res){
		if(res){
			var selfYear = res.split("-")[0];
			var num = selfYear.split("");
			return num[2]+"0后";
		}
	}
    //分页
    var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data.object || data.object.length === 0){
                    return loadmore.loadend(false);
                }else{
                    vm.list = vm.list.concat(getItemList(data));
                    loadmore.loadend(true);
                }
            });
        }
    });
	//搜索会员信息
	api.addEventListener && api.addEventListener({
		name: 'search'
	}, function (ret, err) {
        logger.log({"Type":"operation","action":"搜索会员信息","Win_name":api.winName});
		start_consume_time = ret.value.start_consume_time || "";
		end_consume_time = ret.value.end_consume_time || "";
		tag_list= (ret.value.tag_list && ret.value.tag_list.length > 0) ? ret.value.tag_list : '';
		start_integral=ret.value.start_integral || "";
		end_integral=ret.value.end_integral || "";
		user_level_id=ret.value.user_level_id || "";
		getData();
	});

    //搜索手机号码卡号
    api.addEventListener && api.addEventListener({
        name: 'search-input'
    }, function (ret, err) {
        logger.log({"Type":"operation","action":"搜索手机号码卡号","Win_name":api.winName});
        phoneSearch=ret.value.searchInput || "";
        getData();
    });

    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        },0)
    });
    //标签返回刷新
    api.addEventListener && api.addEventListener({
        name: 'memberTagReload'
    }, function (ret, err) {
        getData();
    })
    //会员信息新增刷新
    api.addEventListener && api.addEventListener({
        name: 'refresh-addMember'
    }, function(ret, err) {
        getData();
    });
    //编辑刷新
    api.addEventListener && api.addEventListener({
        name: 'refresh-editMember'
    }, function (ret, err) {
        getData();
    })

    getData();

    module.exports = {};
});
