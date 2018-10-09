define(function (require, exports, module) {
    console.log('进入页面----------------------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#managerThemeNameSide',
        template: _g.getTemplate('manager/managerThemeNameSide-body-V'),
        data: {
            startNum: '',
            endNum: '',
            selectorMemberValue: '全部会员',
            selectorProductValue: '单品',
            PBC: '单品',
            choosingPBCName: '',
            PBCId: '',//product,brand,class的id
            skuCode: '',
            query_type: 1,//单品，品牌，分类
            searchPBCMsg: '请输入条码',
            pNumber: '',
            leftDaysFrom: '',
            leftDaysTo: '',
        },
        mounted: function () {
            
        },
        created: function () {
            this.listenChoose();
        },
        watch: {},
        filters: {},
        methods: {
            listenChoose: function () {
                //chooseSth
                api.addEventListener({
                    name: 'chooseSth'
                }, function(ret, err) {
                    if(ret.value.chooseType == 1) {
                        vm.selectorMemberValue = ret.value.statusName;
                    }else if(ret.value.chooseType == 2){
                        vm.choosingPBCName = '';
                        vm.PBCId = '';
                        vm.selectorProductValue = vm.PBC = ret.value.statusName;
                        if(ret.value.statusName == '单品') {
                            vm.searchPBCMsg = '请输入条码';
                            vm.query_type = 1;
                        }else if(ret.value.statusName == '品牌') {
                            vm.searchPBCMsg = '请输入品牌';
                            vm.query_type = 2;
                        }else if(ret.value.statusName == '分类') {
                            vm.searchPBCMsg = '请输入分类';
                            vm.query_type = 3;
                        }
                    }
                });
                //单品、品牌、分类信息
                api.addEventListener({
                    name: 'chooseOnePBC'
                }, function(ret, err) {
                    // alert(JSON.stringify(ret));
                    // alert(ret.value.PBCId);
                    vm.PBCId = ret.value.PBCId;
                    vm.skuCode = ret.value.skuCode;
                    vm.choosingPBCName = ret.value.goodsName;
                });
            },
            onChooseSth:function (type) {
                api.openFrame && api.openFrame({
                    name: "manager-chooseSthSideBar",
                    url: '../manager/chooseSthSideBar.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        type: type
                    },
                    bounces: false,
                    animation:{
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            },
            onChoosePBC:function (PBC) {
                api.openFrame && api.openFrame({
                    name: "manager-choosePBC",
                    url: "../manager/choosePBC.html",
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        PBC: PBC
                    },
                    bounces: false,
                    animation:{
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            },
            onAgreeClose: function () {
                if(this.startNum!==''&&this.endNum!==''){
                    if(!/^[0-9]*$/.test(this.startNum) || !/^[0-9]*$/.test(this.endNum)){
                        _g.toast("请输入数字!");
                        return
                    }
                    if (parseInt(this.startNum) > parseInt(this.endNum)) {
                        this.startNum = ''
                        this.endNum = ''
                        _g.toast('序号起始值不能大于终止值')
                        return
                    }
                }
                if(this.leftDaysFrom!==''&&this.leftDaysTo!==''){
                    if(!/^(\-|\+)?\d+(\.\d+)?$/.test(this.leftDaysFrom) || !/^(\-|\+)?\d+(\.\d+)?$/.test(this.leftDaysTo)){
                        _g.toast("请输入数字!");
                        return
                    }
                    if (parseInt(this.leftDaysFrom) > parseInt(this.leftDaysTo)) {
                        this.leftDaysFrom = ''
                        this.leftDaysTo = ''
                        _g.toast('序号起始值不能大于终止值')
                        return
                    }
                }
                //传出的数据
                var extra = {
                    startNum: this.startNum ? this.startNum : '',
                    endNum: this.endNum ? this.endNum : '',
                    pNumber: this.pNumber ? this.pNumber : '',
                    leftDaysFrom: this.leftDaysFrom ? this.leftDaysFrom : '',
                    leftDaysTo: this.leftDaysTo ? this.leftDaysTo : ''
                }
                if(this.selectorMemberValue == '全部会员') {
                    extra.user_type = 'all_user';
                }else if(this.selectorMemberValue == '专属会员') {
                    extra.user_type = 'exclusive_user';
                }
                if(this.query_type == 1) {
                    extra.product_id = this.PBCId;
                    extra.sku_code = this.skuCode;
                }else if(this.query_type == 2) {
                    extra.brand_id = this.PBCId;
                }else if(this.query_type == 3) {
                    extra.class_id = this.PBCId;
                }
                console.log(JSON.stringify(extra));
                api.sendEvent && api.sendEvent({
                    name: 'themeNameSearch',
                    extra: extra,
                });
                api.closeDrawerPane && api.closeDrawerPane();
            },
            onCloseDrawer: function () {
                api.closeDrawerPane();
            },
            onReset: function () {
                this.startNum = '';
                this.endNum = '';
                this.pNumber = "";
                this.leftDaysFrom = "";
                this.leftDaysTo = "";
                this.selectorMemberValue = "全部会员";
                this.selectorProductValue = "单品";
                this.PBCId = "";
                this.skuCode = "";
                this.PBC = '单品';
                this.query_type = 1;
                this.choosingPBCName = '',
                this.searchPBCMsg = '请输入条码';
            }
        }
    });
});
