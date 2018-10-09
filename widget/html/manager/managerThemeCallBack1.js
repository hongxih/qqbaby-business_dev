define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var entId = api.pageParam.entId
    var type = '';
    if (api.pageParam.title == '日常关怀' || api.pageParam.title == '复购提醒'){
        type='usual';
    }else{
        type='special'
    }
    var Time = require('U/getTime');
    var Http = require('U/http');
    var vm = new Vue({
        el: '#managerThemeCallBack1',
        template: _g.getTemplate('manager/managerThemeCallBack1-body-V'),
        data: {
            list: [
                {
                    achieved_rate: '',//
                    care_id: '',//主题ID	number
                    sales_name: '无人回访',//	回访人名称	string
                    user_count: '',//
                    visit_count: '0',//	已回访人数	number
                    visit_time: ''
                }
            ]
        },
        created: function () {
            this.list=[];
        },
        watch: {},
        filters: {
            roundOff: function (value) {
                if (parseFloat(value) === 0) {
                    return 0;
                }
                return value * 100 | 0;
            },
            toPercent: function (value) {
                var v = Math.round(value * 10);
                var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                return arr[v];
            }
        },
        methods: {}
    });

    //获取数据
    var getData = function () {
        console.log(Time.getToday(), Time.getLastWeek())
        var _data= {
                care_id: entId,//   关怀主题ID  number  日常主题没有主题ID
                care_type: type,//  主题类型    string  日常 usual 专题 special
                end_time: Time.getToday(),//    最近七天的结束时间   string  格式：2017-02-10 23:59:59
                start_time: Time.getLastWeek()//    最近七天的开始时间   string  格式：2017-02-10 00:00:00
            };
        var _url='/app/auth/crm/care/listCareVisit.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"获取主题关怀数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    console.log(res)
                    vm.list = getItem(res);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        })
    };
    var getItem = function (res) {
        return _.map(res.object, function (item) {
            return {
                achieved_rate: item.achieved_rate,//
                care_id: item.care_id,//主题ID	number
                sales_name: item.sales_name || "无人回访",//	回访人名称	string
                user_count: item.user_count,//
                visit_count: item.visit_count || "0",//	已回访人数	number
                visit_time: item.visit_time
            }
        })
    }
    getData();
    _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        }, 0)
    });

    module.exports = {};
});
