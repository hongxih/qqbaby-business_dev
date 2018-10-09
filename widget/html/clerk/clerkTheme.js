define(function (require,exports,module) {
    console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');
	var vm = new Vue({
		el:'#clerkTheme',
		template:_g.getTemplate('clerk/clerkTheme-body-V'),
		data:{
            /*-- 日常关怀 --*/

            hasRecall:20,
            startTime:'05-15',
            endTime:'06-15',
            // 复购提醒
            rePurchase: {
                title: '复购提醒',
                hasRecall: 20,
                startTime: '07-18',
                careId: ''
            },
			list:[
                {
                    themeName:'主题1',
                    isWorking:true,
                    hasRecall:500,
                    allPerson:5000,
                    startTime:'02-15',
                    endTime:'03-15'
                },
                {
                    themeName:'主题2',
                    isWorking:true,
                    hasRecall:2978,
                    allPerson:5000,
                    startTime:'02-15',
                    endTime:'03-15'
                },
                {
                    themeName:'主题3',
                    isWorking:false,
                    hasRecall:4000,
                    allPerson:5000,
                    startTime:'02-15',
                    endTime:'03-15'
                },
            ]
		},
		created: function(){
            this.list = [];
            this.hasRecall = 0;
            this.startTime = '';
            this.endTime = '';
            this.title = '';
        },
        watch: {

        },
        filters: {

        },
        methods: {
            alertContent: function (ind) {
                event.stopPropagation()
                if(this.list[ind].content === '') return
                var str = JSON.stringify(this.list[ind].content)
                alert(str)
            },
            onAllTheme : function(sTitle,tId,isWorking){
                var rightPane_url = '../clerk/clerkThemeNameSide.html';
                if (tId == 7) {
                    rightPane_url = '../manager/managerThemeNameSide.html'
                }
                if(sTitle===''){
                    sTitle='日常关怀';
                }
                _g.openDrawerLayout({
                    header: {
                        data: {
                            title: sTitle,
                            // rightText: '回访进度',
                        }
                    },
                    pageParam:{
                        themeId:tId,
                        statue:'spacial',
                        title:sTitle,
                        status:isWorking
                    },
                    name: 'clerk-clerkThemeName',
                    url: '../clerk/clerkThemeName.html',
                    rightPane: {
                        name: 'rightPane',
                        url: rightPane_url
                    }
                })
            }
        },
        filters: {
            roundOff : function(value){
                if(parseFloat(value)===0){
                    return 0;
                }
                return value * 100 | 0;
            },
            toPercent: function (value) {
                var v= Math.round( value*10 );
                var arr=[0,1,2,3,4,5,6,7,8,9,10];
                return arr[v];
            },
            formatTime : function(val){
               if(val!=""||val){
                var date = val.split(" ");
                var day = date[0].split("-")[1]+"-"+date[0].split("-")[2];
                var time = date[1].split(":")[0]+":"+date[1].split(":")[1];
                return day+" "+time;
               }
            }
        }

	});

  var getSpecialData = function (opts,callback) {
        var opts = opts || {};
        var _data= {
                displayRecord:10,
                end_status:"end",
                include_usual:true,
                lastest_day:7,
                ongoing_status:"ongoing",
                page:opts.page,
                type:"special",
            };
        var _url='/app/auth/crm/care/listCrmCare.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2', 
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"clerkTheme获取具体信息","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    if(opts.page && opts.page > 1){
                        setTimeout(function () {
                            callback && callback(res);
                        },0)
                    }else{
                        setTimeout(function () {
                            vm.list = getSpecialDetails(res.object)
                        },0)
                    }
                } else {
                    // _g.toast(res.message);
                    setTimeout(function () {
                        callback && callback(res);
                    },0);
                }
            },
            error: function (err) {
            }
        });
    }

    var getSpecialDetails = function (data) {
        return _.map(data,function (item) {
            return {
                themeName: item.title,
                isWorking: item.status==='ongoing'?true:false,
                hasRecall: item.visit_count,
                allPerson: item.user_count,
                startTime: item.deploy_time,
                endTime: item.end_time,
                care_id:item.care_id,
                content:item.content || ''
            }
        })
    }
    getSpecialData();

    var getUsualData = function () {
        var _data= {
                displayRecord:10,
                end_status:"end",
                include_usual:true,
                lastest_day:7,
                ongoing_status:"ongoing",
                page:1,
                type:"usual",
            };
        var _url='/app/auth/crm/care/listCrmCare.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"clerkTheme获取日常关怀","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    vm.title = res.object[0].title || '日常关怀';
                    vm.hasRecall = res.object[0].visit_count || 0;
                    vm.startTime = res.object[0].deploy_time || '';
                    // vm.endTime = res.object.item.end_time || ''; 

                    vm.rePurchase.title = res.object[1].title || '复购提醒';
                    vm.rePurchase.hasRecall = res.object[1].visit_count || 0;
                    vm.rePurchase.startTime = res.object[1].deploy_time || '';
                    vm.rePurchase.themeType = res.object[1].type;
                    vm.rePurchase.careId = res.object[1].care_id;
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    }
    getUsualData();

    var loadmore = new Loadmore({
        callback: function(page){
            getSpecialData({page: page.page}, function(data){
                if(!data.object || data.object.length === 0){
                    return loadmore.loadend(false);
                }else{
                    vm.list = vm.list.concat(getSpecialDetails(data.object));
                    loadmore.loadend(true);
                    console.log(data)
                }
            });
        }
    });

    _g.setPullDownRefresh(function () {
        getSpecialData();
        getUsualData();
        loadmore.reset();
    });
});
