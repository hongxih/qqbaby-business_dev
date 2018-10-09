define(function (require,exports,module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var type = api.pageParam.type;
    var tday = api.pageParam.day;
    var clerk = api.pageParam.clerk||"";

    var vm = new Vue({
		el:'#managerExpenditureDetails',
		template:_g.getTemplate('manager/managerExpenditureDetails-body-V'),
		data:{
            isFirstLoading:true,
            isNoResult:false,
			isClerk:_g.getLS('UserInfo').notes,
            isLook:false,
            time:"",
            chooseType:"",
			list:{
				month_time:"",
				lists:[
					{
						kpi_name:"",
						kpi_price:null,
						kpi_store_name:"",
						kpi_time:"",
						kpi_type:"",
						sales_name:"",
						sales_price:null,
						store_id:1,
						week_time:""
					}
				]
			}

		},
        computed:{
            isNoResult: function () {
                console.log(this.list)
                if(this.isFirstLoading) return false
                if(this.list === null) return true
                var sta = this.list[0].lists.length === 0 ? true : false

                return sta
            }
        },
		methods:{

        },
		created:function () {
		  this.list=[];
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },

        filters:{
        	formatDate: function (val) {
                if(val){
                    var month = val.split('-')[1];
                    var beforeM = new Date().getMonth()+1;
                    if(month == beforeM){
                        return '本月'
                    }else{
                        if(month == '01'){
                            return '一月';
                        }else if(month == '02'){
                            return '二月';
                        }else if(month == '03'){
                            return '三月';
                        }else if(month == '04'){
                            return '四月';
                        }else if(month == '05'){
                            return '五月';
                        }else if(month == '06'){
                            return '六月';
                        }else if(month == '07'){
                            return '七月';
                        }else if(month == '08'){
                            return '八月';
                        }else if(month == '09'){
                            return '九月';
                        }else if(month == '10'){
                            return '十月';
                        }else if(month == '11'){
                            return '十一月';
                        }else if(month == '12'){
                            return '十二月';
                        }
                    }
                }
            },
            formatTime : function(res){
                 if(res){
                    //  alert()
                     var data = parseInt(res.split(" ")[0].split('-')[2]);
                     var dateTime = new Date().getDate();
                     var beforeDay = new Date().getMonth()+1;
                     var yesterday = (new Date(new Date().Format('yyyy-MM-dd')).getTime()) - 60*60*1000*24;
                     var dataYesterday = new Date(res.split(' ')[0]).getTime();
                     if(res.split("-")[1]==beforeDay){
                         if(data == dateTime){
                             return '今天';
                         }if(yesterday == dataYesterday){
                             return '昨天';
                         }else{
                             var time = new Date(res.split(' ')[0]).getDay();
                             switch(time){
                                 case 0:
                                     return '周日';
                                 case 1:
                                     return '周一';
                                 case 2:
                                     return '周二';
                                 case 3:
                                     return '周三';
                                 case 4:
                                     return '周四';
                                 case 5:
                                     return '周五';
                                 case 6:
                                     return '周六';
                             }
                         }
                     }else{
                         var time = new Date(res.split(' ')[0]).getDay();
                             switch(time){
                                 case 0:
                                     return '周日';
                                 case 1:
                                     return '周一';
                                 case 2:
                                     return '周二';
                                 case 3:
                                     return '周三';
                                 case 4:
                                     return '周四';
                                 case 5:
                                     return '周五';
                                 case 6:
                                     return '周六';
                             }
                     }

                 }
             },
            formatDay : function(res){
                 var data = parseInt(res.split(" ")[0].split('-')[2]);
                 var dateTime = new Date().getDate();
                 var beforeDay = new Date().getMonth()+1;
                 var yesterday = (new Date(new Date().Format('yyyy-MM-dd')).getTime()) - 60*60*1000*24;
                 var dataYesterday = new Date(res.split(' ')[0]).getTime();
                 if(res.split("-")[1]==beforeDay){
                     if(data == dateTime || yesterday == dataYesterday){
                         var time =  res.split(' ')[1].split(':')[0] + ":" + res.split(' ')[1].split(':')[1];
                         return time;
                     }else{
                         var time2 = res.split(' ')[0].split('-')[1] + "-" + res.split(' ')[0].split('-')[2];
                         return time2;
                     }
                 }else{
                     var time3 = res.split(' ')[0].split('-')[1] + "-" + res.split(' ')[0].split('-')[2];
                     return time3;
                 }
             },
         formatType:function(val){
         	switch(val){
         		case "001":
         			return "单品";
         		case "002":
         			return "品牌";
         		case "003":
         			return "分类";
         		case "004":
         			return "新客开发";
         		case "005":
         			return "新会员";
         		case "006":
         			return "总额";
                case "007":
                    return "调整"
         	}
         },
         formatType1:function(val){
            switch(val){
                case "001":
                    return "单品提成";
                case "002":
                    return "品牌提成";
                case "003":
                    return "品类提成";
                case "004":
                    return "新客开发提成";
                case "005":
                    return "新会员提成";
                case "006":
                    return "总额提成";
                case "":
                    return "全部类型";
            }
         },
        }
	});
    var kpi_start_time = "";
    var kpi_end_time = "";
    var kpi_type = "";
    var class_id = null;
    var brand_id = null;
    var class_level=null;
	var getData = function(opts,callback){
        if(type == "today"){
            var date = new Date();
            kpi_start_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+"00:00:00";
            kpi_end_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+"23:59:59";
        }else if(type == "Month"){
            var date = new Date();
            var day = new Date(date.getFullYear(),date.getMonth()+1,0);
            kpi_start_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+"01"+" "+"00:00:00";
            kpi_end_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+day.getDate()+" "+"23:59:59";
        }else if(type == "yesMonth"){
            var date = new Date();
            var day = new Date(date.getFullYear(),date.getMonth(),0);
            kpi_start_time = date.getFullYear()+"-"+date.getMonth()+"-"+"01"+" "+"00:00:00";
            kpi_end_time = date.getFullYear()+"-"+date.getMonth()+"-"+day.getDate()+" "+"23:59:59";
        }else if(type == "yestoday"){
            var date = new Date();
            date.setTime(date.getTime()-24*60*60*1000);
            kpi_start_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+"00:00:00";
            kpi_end_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+"23:59:59";
        }else if(type == "001"){
            kpi_type = "001";
        }
        else if(type == "002"){
            kpi_type = "002";
        }
        else if(type == "003"){
            kpi_type = "003";
        }
        else if(type == "004"){
            kpi_type = "004";
        }
        else if(type == "005"){
            kpi_type = "005";
        }
        else if(type == "006"){
            kpi_type = "006";
        }
        else if(type == "007"){
            kpi_type = "007";
        }

        if(clerk=="clerk"){
            if(tday){
                if(tday.split("~").length==1){
                    kpi_start_time = tday.split("~")[0]+" "+"00:00:00";
                    kpi_end_time = tday.split("~")[0]+" "+"23:59:59";
                }else if(tday.split("~").length>1){
                    kpi_start_time = tday.split("~")[0]+" "+"00:00:00";
                    kpi_end_time = tday.split("~")[1]+" "+"23:59:59";
                }
            }
        }
        opts = opts || {};
        var _data={
                displayRecord : 10,
                page : opts.page || 1,
                kpi_start_time:kpi_start_time,
                kpi_end_time:kpi_end_time,
                kpi_type:kpi_type,
                class_id:class_id,
                brand_id:brand_id,
                sales_id:_g.getLS('UserInfo').user_id,
                class_level:class_level
            };
        var _url='/app/auth/kpi/listStoreDetailV2.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,

            success: function(res) {
                logger.log({"Type":"operation","action":"店长的提成明细列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                _g.hideProgress();
                vm.isFirstLoading = false
                 //console.log(res);
                if (res.success) {
                    if(opts.page && opts.page > 1){
                        setTimeout(function(){
                            callback && callback(res);
                        }, 0);
                    }else{
                        setTimeout(function(){
                            vm.list = res.object;
                        },0)
                    }
                } else {
                    _g.toast(res.message);
                }
                //console.log(res.object)

            },
            error: function(err) {
                vm.isFirstLoading = false
                _g.hideProgress();
                _g.toast(err.message);

            }
        });
    };
    getData();
     var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data.object || _.isEmpty(data.object)){
                    return loadmore.loadend(false);
                }else{
                    for(var i = 0;i<data.object.length;i++){
                        if(vm.list[vm.list.length-1].month_time == data.object[i].month_time){
                            vm.list[vm.list.length-1].lists = vm.list[vm.list.length-1].lists.concat(data.object[i].lists);
                        }else{
                            vm.list = vm.list.concat(data.object[i]);
                        }
                    }
                    loadmore.loadend(true);
                }
            });
        }
    });
    _g.setPullDownRefresh(function() {
        vm.isLook = false;
        kpi_start_time = "";
        kpi_end_time = "";
        kpi_type = "";
        class_id = null;
        brand_id = null;
        class_level=null;
        getData();
        loadmore.reset();
    });

     api.addEventListener && api.addEventListener({
        name: 'manager-sideList'
    }, function (ret, err) {
        api.openDrawerPane({
            type: 'right'
        });
    });
     api.addEventListener && api.addEventListener({
        name: 'manager-saveScreen1'
    }, function (ret, err) {
        // alert(ret.value.key1);
        vm.isLook=true;
        vm.time = ret.value.key2?ret.value.key2:"全部时间";
        vm.chooseType = ret.value.key1?ret.value.key1:"";
        type = null;
        kpi_type = ret.value.key1;
        var time = ret.value.key2;
        class_id = ret.value.key3|| null;
        brand_id = ret.value.key4|| null;
        class_level=ret.value.class_level||null;
        if(time){
            if(time.split("至").length==2){
            kpi_start_time = time.split("至")[0]+" "+"00:00:00";
            kpi_end_time = time.split("至")[1]+" "+"23:59:59";
            }else if(time.split("至").length==1){
                kpi_start_time = time+" "+"00:00:00";
                kpi_end_time = time+" "+"23:59:59";
            }
        }
        getData();
    });

})
