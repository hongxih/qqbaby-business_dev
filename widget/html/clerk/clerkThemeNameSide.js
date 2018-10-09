define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var vm = new Vue({
        el: '#clerkThemeNameSide',
        template: _g.getTemplate('clerk/clerkThemeNameSide-body-V'),
        data: {
            startNum:'',
            endNum:'',
            pNumber:''
        },
        created: function () {

        },
        watch: {},
        filters: {},
        methods: {
            onAgreeClose: function () {
                if(this.startNum!==''&&this.endNum!==''){
                    if(!/^[0-9]*$/.test(this.startNum) || !/^[0-9]*$/.test(this.endNum)){
                        _g.toast("请输入数字!");
                    }
                    if (this.startNum > this.endNum) {
                        this.startNum = ''
                        this.endNum = ''
                        _g.toast('起始积分不能大于终止积分')
                        return
                    }
                }
                api.sendEvent && api.sendEvent({
                    name: 'themeNameSearch',
                    extra:{
                        startNum:this.startNum,
                        endNum:this.endNum,
                        pNumber:this.pNumber
                    }
                });
                api.closeDrawerPane();
            },
            onCloseDrawer:function() {
                api.closeDrawerPane();
            },
            onReset: function () {
                this.startNum='';
                this.endNum='';
                this.pNumber='';
            }
        }
    });
});
