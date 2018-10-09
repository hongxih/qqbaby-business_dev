define(function(require,exports,module){

    var Http = require('U/http');
    var vm = new Vue({
       el:'#getNewCustom',
       template : _g.getTemplate('shop/getNewCustom-body-V'),
       data : {
            isShow:true,
            personInfo : [{
                name : '王思聪',
                time : '2017-01-01 12:12:12',
                phone : '134XXXXXXXX',
                checkNum:0,
                checkType : '已审核',
                code : '1238979-3409-1230-12080'
            },{
                name : '王fei',
                time : '2012-01-01 12:12:12',
                phone : '134XXXXXXXX',
                checkNum : 1,
                checkType : '不通过',
                code : '12379-3409-1230-12080'
            },{
                name : '王fei',
                time : '2012-01-01 12:12:12',
                phone : '134XXXXXXXX',
                checkNum : 2,
                checkType : '审核中',
                code : '12379-3409-1230-12080'
            }
            ]
       },
       created:function(){
         this.personInfo = {};
       },
       methods:{

       },
       filters:{
           formatTime : function(res){
               if(res){
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
                           console.log(time)
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
               if(res){
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
               }
           }
       }
    });

    var getData = function(opts,callback){
        opts = opts || {};
        var _data= {
                displayRecord : 10,
                page : opts.page || 1
            };
        var _url='/app/auth/cumstomer/list.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function(res) {
              logger.log({"Type":"operation","action":"新客开发列表","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    setTimeout(function() {
                        if(opts.page && opts.page > 1){
                            setTimeout(function(){
                                callback && callback(res);
                            }, 0);
                        }else{
                              if(res.object){
                                vm.isShow=true;
                              }else{
                               vm.isShow=false;
                              }
                            var lists = getDetail(res);
                            if(lists.length<1){
                                loadmore.toggleSwitch();
                            }
                            vm.personInfo = lists;
                        }
                        api && api.hideProgress();
                    }, 0);
                } else {
                    _g.toast(res.message);
                    api && api.hideProgress();
                }
            },
            error: function(err) {
                _g.hideProgress();
            },
        });
    }
    var getDetail = function(res){
        return _.map(res.object,function(item){
            return {
                name :item.cumstomer_name,
                time : item.kpi_time,
                phone : item.cumstomer_phone,
                checkNum:item.audit_status == '00N' ? 2 : (item.audit_status == '00P' ? 0 : 1),
                checkType :item.audit_status == '00N' ? '审核中' : (item.audit_status == '00P' ? '已审核' : '不通过'),
                code : item.order_no,
            }
        })
    };
    getData();

    api && api.addEventListener({
        name: 'reload-newCustom'
    }, function() {
        location.reload();
    });
    var loadmore = new Loadmore({
        callback: function(page){
            getData({page: page.page}, function(data){
                if(!data.object || data.object.length === 0){
                    return loadmore.loadend(false);
                }else{
                    vm.personInfo = vm.personInfo.concat(getDetail(data));
                    loadmore.loadend(true);
                }
            });
        }
    });

    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        },0)
        loadmore.reset();
    });
    module.exports = {};
});
