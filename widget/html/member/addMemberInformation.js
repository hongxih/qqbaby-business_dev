define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var levelData = null;
    var shopData = null;

    var dtPicker = new mui.DtPicker({
        beginDate: new Date(1900, 1, 1),
        type: 'date'
    });
    var vm = new Vue({
        el: '#addMemberInformation',
        template: _g.getTemplate('member/addMemberInformation-body-V'),
        data: {
            assistant: _g.getLS('UserInfo').user_name,
            btnShow: true,
            isSelectShop:_g.getLS('UserInfo').notes == "company_admin" ? true:false,//判断是角色是否为老板
            phone: '',
            uName: '',
            uSex: null,
            uLevel: '',
            uLevelId: '',
            uStore:'',
            uStoreID:'',
            cartId: '',
            uBirthday: '',
            referee: '',
            memberOld: '',
            babyList: [
                {
                    bodyNumber: '大宝',//大宝，二宝，三宝
                    bName: '',
                    bSex: null,
                    bBirthday: '',
                    bFeeding: ''
                }
            ]
        },
        created: function () {

        },
        watch: {},
        filters: {},
        methods: {
            //选择门店
            selectShop : function(){
                var  self = this;
                if (!shopData) {
                    getshopData();
                }else{
                    initspPicker();
                }
            },
            
            addBaby: function () {
                var bData = {};
                var num = this.babyList.length;
                var arr = ['二宝', '三宝']
                bData.bName = '';
                bData.bSex = null;
                bData.bBirthday = '';
                bData.bFeeding = '';
                bData.bodyNumber = arr[num - 1];
                this.babyList.push(bData);
                if (num === 2) this.btnShow = false;
            },
            onchooseSex:function(sex){
                if(sex==0){
                    this.uSex =0;
                }else{
                    this.uSex =1;
                }
            },
            onSubmit: function () {
                var _data={
                    birthday: this.uBirthday,
                    card_no: this.cartId,
                    phone: this.phone,
                    referee_name: this.referee,
                    sex: this.uSex,
                    user_level_id:this.uLevelId,
                    user_name: this.uName,
                    baby_list: this.getItemList(this.babyList),
                };
                if (this.isSelectShop) {
                    _data.store_id=this.uStoreID;
                    if(this.uStoreID==""){
                        _g.toast("会员所属门店不能为空！");
                        return false;
                    }
                }
                logger.log({"Type":"operation","action":"新增会员数据提交","Win_name":api.winName,"data":_data})
                if(isNaN(this.cartId)){
                    _g.toast("卡号应为数字");
                    return false;
                }
                if(this.phone==""){
                    _g.toast("会员手机不能为空！");
                    return false;
                }
                if(!(/^1[0-9]{10}$/.test(this.phone))){
                    _g.toast('手机号格式错误');
                    return false;
                }
                if(this.uSex==null){
                    _g.toast("会员性别不能为空");  
                    return false;
                }
                if(this.phone.length!=11){
                    _g.toast("手机号应为11位");
                }
                if(this.uLevel==""){
                    _g.toast("会员等级不能为空！");
                    return false;
                }
                if(this.uName==""){
                    _g.toast("会员名称不可为空！");
                    return false;
                }
                var _url='/app/auth/crm/user/saveCrmUser.do';
                 var title = '确认保存？';
                var message = '是否确认保存';
                 _g.confirm(title,message,function () {
                    logger.log({"Type":"operation","action":"新增会员确认","Win_name":api.winName,"data":_data});
                    Http.ajax({
                        data: _data,
                        api_versions: 'v2',
                        url:_url,
                        success: function (res) {
                            logger.log({"Type":"operation","action":"新增会员数据提交","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                            if(res.success){
                                api && api.closeWin();
                                api.sendEvent({
                                    name: 'refresh-addMember',
                                });

                            }else{
                                _g.toast(res.message);
                            }
                        },
                        error: function (err) {
                        }
                    })
                });
               
            },
           
            getItemList: function (res) {
                return _.map(res, function (item) {
                    return {
                        baby_name: item.bName,
                        baby_sex: item.bSex,
                        birthday: item.bBirthday,
                        feeding_pattern: "00" + item.bFeeding
                    }
                })
            },

            onSelectDate: function (type, ind) {
                var strB = type.split(".")[1];
                var strL = type.split('[')[0];
                dtPicker.show(function (selectItems) {
                    this[strL][ind][strB] = selectItems.value;
                }.bind(this));
            },
            onMemDate: function (type) {
                dtPicker.show(function (selectItems) {
                    this[type] = selectItems.value;
                    this.memberOld = getMemberOld(this[type])
                }.bind(this));
            },
            selectLevel: function(){
                var self = this;
                if (!levelData) {
                    getLevelData();
                }else{
                    initotPicker();
                }
            },
            toggleSex: function(){
                var self = this;


            }
        }
    });

    var getMemberOld = function (res) {
        if (res) {
            var selfYear = res.split("-")[0];
            var num = selfYear.split("");
            return num[2] + "0后";
        }
    }

    api.addEventListener && api.addEventListener({
        name: 'save-memberInfo'
    }, function (ret, err) {
        vm.onSubmit();
    });

    /**
     * [获取会员等级信息]
     * @return {[type]} [description]
     */
    var getLevelData = function(){
        var _url='/app/auth/crm/user/listCrmUserLevel.do';
        Http.ajax({
            url:_url,
            data: {},
            api_versions: 'v2',
            success: function(ret){
                 logger.log({"Type":"operation","action":"获取会员等级信息","Win_name":api.winName,"message":ret,"requireURL":_url})
                if(ret.success){
                    levelData = _.map(ret.object, function(item){
                        return {
                            value: item.user_level_id,
                            text: item.user_level_name
                        };
                    });
                    levelData.reverse();
                    initotPicker();
                }else{
                    _g.toast(ret.message);
                }
            }
        });
    };

    var initotPicker = function(){
        var otPicker = new mui.PopPicker();
        otPicker.setData(levelData);
        otPicker.show(function(selectItem){
            vm.uLevel = selectItem[0].text;
            vm.uLevelId = selectItem[0].value;
            otPicker.dispose();
        });
        for(var i = 0;i<levelData.length;i++){
            if(vm.uLevelId == levelData[i].value){
                otPicker.pickers[0].setSelectedIndex(i, 100);
            }
        }
    }
    /**
     * [获取会员门店信息]
     * @return {[type]} [description]
     */
    var getshopData = function(){
        var _url='/app/auth/store/list.do';
        Http.ajax({
            url:_url,
            data: {},
            api_versions: 'v2',
            success: function(res){
                logger.log({"Type":"operation","action":"获取会员门店信息","Win_name":api.winName,"message":res,"requireURL":_url})
                if(res.success){
                    shopData = _.map(res.object, function(item) {
                        if(item.store_id){
                            return {
                                value:item.store_id,
                                text:item.org_name
                            };
                        }else{
                            return ;
                        }
                    });
                    if (shopData[0]==null) {
                        shopData.shift();
                    }else{
                        for(var i=0;i<shopData.length;i++){
                            if(shopData[i]==null){
                                shopData.splice(i, 1);
                                return;
                            }
                        }
                    }
                    initspPicker();
                }else{
                    _g.toast(res.message);
                }
            }
        });
    }

    var initspPicker=function(){
        var spPicker = new mui.PopPicker();
        spPicker.setData(shopData);
        spPicker.show(function(selectItem){
            vm.uStore = selectItem[0].text;
            vm.uStoreID = selectItem[0].value;
            spPicker.dispose();
        });
        for(var i = 0;i<shopData.length;i++){
            if(vm.uStoreID == shopData[i].value){
                spPicker.pickers[0].setSelectedIndex(i, 100);
            }
        }
    }
    // getLevelData();
    // getshopData();
    module.exports = {};
});
