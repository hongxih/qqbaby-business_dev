define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#bossThemeCallBackSide',
        template: _g.getTemplate('boss/bossThemeCallBackSide-body-V'),
        data: {
            themeId: '',
            storeList: [],
            clerkName: '',
            clerkInd: ''//下标
        },
        filters: {},
        methods: {
            onMemberAssistant: function () {
                api.openFrame({
                    name: 'boss-bossStoreSideV2',
                    url: './../boss/bossStoreSideV2.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        cName: this.clerkName,
                        cId: this.clerkInd,//下标
                        from: 'bossThemeCallBackSide',
                        storeList: this.storeList
                    },
                    bounces: false,
                    animation: {
                        type: 'push',
                        subType: 'from_right',
                        duration: 300
                    }
                });
            },
            //确定
            onAgreeClose: function () {
                api.sendEvent && api.sendEvent({
                    name: 'bossThemeCallBackSearch',
                    extra: {
                        key1: this.clerkName,
                        key2: this.clerkInd //下标
                    }
                });
                api.closeDrawerPane();
            },
            onCloseDrawer: function () {
                api.closeDrawerPane();
            },
            //重置
            onReset: function () {
                this.clerkName = this.storeList[0].store_name;
                this.clerkInd = 0
            }
        }
    });

    api.addEventListener && api.addEventListener({
        name: 'refreshStore-bossThemeCallBackSide'
    }, function (ret, err) {
        vm.clerkName = ret.value.key1 ;
        vm.clerkInd = ret.value.key2 ;
    });

    /**
     *  收听主题ID和门店列表
     *  { themeId: ,storeList:[{ store_name: ,store_id: ,org_id: ,}]}
     **/
    api.addEventListener && api.addEventListener({
        name: 'broadcastThemeId'
    }, function (ret, err) {
        vm.themeId = ret.value.themeId
        ret.value.type === 'usual' && (vm.themeId = '')
        vm.storeList = ret.value.storeList
        vm.clerkName = ret.value.storeList[0].store_name
        vm.clerkInd = 0 // 下标
    });

});
