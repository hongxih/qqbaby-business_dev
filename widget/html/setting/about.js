define(function(require, exports, module) {

    var Http = require('U/http');
    var Account = require('U/account');
    var vm = new Vue({
        el: '#about',
        template: _g.getTemplate('setting/qq-about-body-V'),
        data: {
        	version: api.appVersion,
            isShow:_g.getLS('UserInfo').notes
        },
        methods:{
        	exitSign : function(){
                Account.logout();
            }
        }
    });
    window.about = vm;
    module.exports = {};
});
