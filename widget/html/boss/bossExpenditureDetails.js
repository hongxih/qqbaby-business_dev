define(function (require,exports,module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var day = api.pageParam.day;
    var id = api.pageParam.id;
    var sales_id = api.pageParam.sales_id||"";
	var vm = new Vue({
		el:'#bossExpenditureDetails',
		template:_g.getTemplate('boss/bossExpenditureDetails-body-V'),
		data:{
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
                    return "调整";
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
                case "007":
                    return "提成调整";
                case "":
                    return "全部类型";
            }
         },

         // formatTime : function(res){
         //         if(res){
         //             var data = parseInt(res.split(" ")[0].split('-')[2]);
         //             var dateTime = new Date().getDate();
         //             var beforeDay = new Date().getMonth()+1;
         //             var yesterday = (new Date(new Date().Format('yyyy-MM-dd')).getTime()) - 60*60*1000*24;
         //             var dataYesterday = new Date(res.split(' ')[0]).getTime();
         //             if(res.split("-")[1]==beforeDay){
         //                 if(data == dateTime){
         //                     return '今天';
         //                 }if(yesterday == dataYesterday){
         //                     return '昨天';
         //                 }else{
         //                     var time = new Date(Date.parse(res)).getDay();
         //                     switch(time){
         //                         case 0:
         //                             return '周日';
         //                         case 1:
         //                             return '周一';
         //                         case 2:
         //                             return '周二';
         //                         case 3:
         //                             return '周三';
         //                         case 4:
         //                             return '周四';
         //                         case 5:
         //                             return '周五';
         //                         case 6:
         //                             return '周六';
         //                     }
         //                 }
         //             }else{
         //                 var time = new Date(Date.parse(res)).getDay();
         //                     switch(time){
         //                         case 0:
         //                             return '周日';
         //                         case 1:
         //                             return '周一';
         //                         case 2:
         //                             return '周二';
         //                         case 3:
         //                             return '周三';
         //                         case 4:
         //                             return '周四';
         //                         case 5:
         //                             return '周五';
         //                         case 6:
         //                             return '周六';
         //                     }
         //             }

         //         }
         //     },
        }
	});
    var kpi_start_time = "";
    var kpi_end_time = "";
    var kpi_type = "";
    var class_id = "";
    var brand_id = "";
    var class_level=null;
    // var sales_id = "";
    var store_id = "";
	var getData = function(opts,callback){
        if(day){
            if(day.split("~").length==1){
               kpi_start_time = day.split("~")[0]+" "+"00:00:00";
               kpi_end_time = day.split("~")[0]+" "+"23:59:59";
            }
            if(day.split("~").length==2){
               kpi_start_time = day.split("~")[0]+" "+"00:00:00";
               kpi_end_time = day.split("~")[1]+" "+"23:59:59";
            }
        }
        if(id){
            store_id = id;
        }
        var opts = opts || {};
        var _data= {
                displayRecord : 10,
                page : opts.page || 1,
                kpi_start_time:kpi_start_time,
                kpi_end_time:kpi_end_time,
                kpi_type:kpi_type,
                class_id:class_id,
                brand_id:brand_id,
                sales_id:vm.isClerk=="sales"?_g.getLS('UserInfo').user_id:sales_id,
                store_id:store_id,
                class_level:class_level
            };
        var _url='/app/auth/kpi/listStoreDetailV2.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
            logger.log({"Type":"operation","action":"获取提成明细","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.success) {
                    if(opts.page && opts.page > 1){
                        setTimeout(function(){
                            callback && callback(res);
                        }, 0);
                    }else{
                        if(_g.isEmpty(res.object)){
                            vm.isNoResult = true
                            return
                        }
                        vm.isNoResult = false
                        setTimeout(function(){
                            vm.list = res.object;
                        },0)
                    }
                } else {
                    vm.isNoResult = true
                    _g.toast(res.message);
                }
            },
            error: function(err) {
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
        vm.isLook =false;
        kpi_start_time = "";
        kpi_end_time = "";
        kpi_type = "";
        class_id = "";
        brand_id = "";
        class_level=null;
        getData();
        loadmore.reset();
    });
     api.addEventListener && api.addEventListener({
        name: 'boss-sideList'
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
        class_id = ret.value.key3||"";
        brand_id = ret.value.key4||"";
        sales_id = ret.value.key5||"";
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