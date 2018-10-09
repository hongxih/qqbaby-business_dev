define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#bossThemeNameSide',
        template: _g.getTemplate('boss/bossThemeNameSide-body-V'),
        data: {
            clerkName: '',
            ind: '',//数组下标
            orgId: '',//org id
            number: '',
            orgList:[
                {
                    sName:'',
                    id: '',
                    isChecked: 0
                }
            ]
        },
        created: function () {

        },
        watch: {},
        filters: {
            toFormat: function (val) {
                var str = $.trim(val) === "" ? "全部门店" : val;
                return str;
            }
        },
        methods: {
            onAgreeClose: function () {
                api.sendEvent && api.sendEvent({
                    name: 'search',
                    extra: {
                        orgId: this.orgId,//orgId
                        number: this.number,
                        storeId: this.storeId
                    }
                });
                api.closeDrawerPane();
            },
            onCloseDrawer: function () {
                this.onReset();
                api.closeDrawerPane();

            },
            onReset: function () {
                this.clerkName = '';
                this.ind = '';
                this.number = '';
            },
            onStoreSide: function () {
                api.openFrame({
                    name: 'boss-bossStoreSide',
                    url: './../boss/bossStoreSide.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        cName: this.clerkName,
                        cId: this.ind,
                        from: 'bossThemeNameSide'
                    },
                    bounces: false,
                    animation:{
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            }
        }
    });
    //
    //接收数据
    !function () {
        api.addEventListener && api.addEventListener({
            name: 'refreshStore-bossThemeNameSide'
        }, function (ret, err) {
            vm.clerkName = ret.value.key1 || "";
            vm.ind = ret.value.key2;
            vm.orgId = ret.value.orgId//orgId
        });
    }()
    /*
     初始化
     */
    var getData = function () {
        var _url='/app/auth/store/list.do';
        Http.ajax({
            data: {},
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"bossThemeNameSide门店列表获取","Win_name":api.winName,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    vm.orgList=getDetail(res)
                    vm.ind=0
                    vm.clerkName=vm.orgList[0].sName
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
            }
        });
    };
    var getDetail = function (res) {
        return _.map(_.filter(res.object, function (item) {
            return item.org_type === '002';
        }), function (item) {
            return {
                sName: item.org_name,
                id: item.org_id,
                isChecked: 0
            };
        });
    };

    /*
     初始化
     */
    if(typeof vm.ind!=="number"){
        getData();
    }

});
