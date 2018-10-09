define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var entId = api.pageParam.entId;//1180
    var vm = new Vue({
        el: '#essentialInformation',
        template: _g.getTemplate('member/essentialInformation-body-V'),
        data: {
            clerkName: '',
            memberPhone: '18800000000',
            memberCard: '123456789',
            memberName: '方先生',
            memberSex: 1,
            memberVip: 1,
            memberBrithday: '2017-01-01',
            memberOld: '80后',
            referees: '赵薇',
            babyList: [
                {
                    index: 0,
                    babyId:'',
                    babyName: '小红',
                    babySex: 1,
                    babyBrithday: '2017-02-02',
                    babyFeed: '母乳',
                    babyOld:''
                },
                {
                    index: 1,
                    babyId:'',
                    babyName: '小红',
                    babySex: 1,
                    babyBrithday: '2017-02-02',
                    babyFeed: '母乳',
                    babyOld:''
                },
                {
                    index: 2,
                    babyId:'',
                    babyName: '小红',
                    babySex: 1,
                    babyBrithday: '2017-02-02',
                    babyFeed: '母乳',
                    babyOld:''
                }
            ]
        },
        created: function () {
            this.clerkName = _g.getLS('UserInfo').user_name;
            this.memberPhone = '';
            this.memberCard = '';
            this.memberName = '';
            this.memberSex = '';
            this.memberVip = '';
            this.memberBrithday = '';
            this.memberOld = '';
            this.referees = '';
            this.babyList = [];
        },
        watch: {},
        filters: {
            toChinese: function (val) {
                var i=Number(val)-1;
                var arr=['母乳喂养','人工喂养','混合喂养'];
                return arr[i]
            },
            toBabyNumber: function (val) {
                var arr=['大宝','二宝','三宝'];
                return arr[val];
            },
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

        }
    });
    

    var getData = function (opts, callback) {
        opts = opts || {};
        var _data={
                user_id: entId,
            };
        var _url='/app/auth/crm/user/getDetail.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"essentialInformation获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    if (res.object === null) return;
                    var obj = res.object;
                    vm.memberPhone = obj.phone;
                    vm.memberCard = obj.card_no;
                    vm.memberName = obj.user_name?obj.user_name:1;
                    vm.memberSex = (obj.sex==1||obj.sex==0)?obj.sex:3;
                    vm.memberOld = getMemberOld(obj.birthday);//本地转换
                    vm.memberVip = obj.user_level_name;
                    vm.memberBrithday = obj.birthday?obj.birthday:1;
                    vm.referees = obj.referee_name?obj.referee_name:1;
                    vm.memberId = obj.user_id;
                    vm.babyList = getItemList(obj.baby_list);
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
            }
        })
    };
    getData();
    var getItemList = function (res) {
        return _.map(res, function (item,i) {
            return {
                index:i,//本地排序：大宝，二宝，三宝
                babyId: item.baby_id,
                babyName: item.baby_name?item.baby_name:"未填写",
                babySex: item.baby_sex,
                babyBrithday: item.birthday?item.birthday:1,
                babyFeed: item.feeding_pattern,
                babyOld:getState(item.birthday)
            }
        })
    };
     var getState = function (res) {
        if (res) {
            var data = new Date();//格式化时间
            var year = data.getFullYear(); //年
            var mouth = data.getMonth() + 1;//月
            var babyYear = res.split("-")[0];//宝宝年份
            var babyMouth = res.split("-")[1];//宝宝月份
            var beforeY = data.getFullYear()+"-"+(data.getMonth()+1)+"-"+data.getDate();//当前年份
            beforeY = new Date(Date.parse(beforeY));
            beforeY = beforeY.getTime();//格式化时间戳
            var afterY = new Date(Date.parse(res));//宝宝年份
            afterY =afterY.getTime();//格式化时间戳
                if(afterY>=beforeY){
                    return "预产期"
                }else{
                    if (year == babyYear) {
                        if (mouth - babyMouth <= 6) {
                            return "婴儿";
                        } else {
                            return "较大婴儿";
                        }
                    } else if (year - babyYear >= 1 && year - babyYear <= 3) {
                            return "幼儿";
                        } else {
                            return "儿童";
                        }

                    }
                }
        
            }

    var getMemberOld = function(res){
        if(res!=""&&res){
            var selfYear = res.split("-")[0];
            var num = selfYear.split("");
            return num[2]+"0后";
        }
    }
    /*-- 点击编辑跳转 --*/
    api.addEventListener && api.addEventListener({
        name: 'edit-memberInfo'
    }, function (ret, err) {
            _g.openWin({
                header: {
                    data: {
                        title: '编辑会员',
                        rightText: '保存'
                    },
                },
                pageParam:{
                    uId:entId
                },
                bounces:false,
                name: 'member-editMemberInformation',
                url: '../member/editMemberInformation.html',
            });
    });
    //编辑后退刷新
    api.addEventListener && api.addEventListener({
        name: 'refresh-editMember'
    }, function(ret, err) {
        getData();
    });
    module.exports = {};
});
