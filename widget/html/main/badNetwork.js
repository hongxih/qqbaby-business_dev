define(function (require, exports, module) {
    var Http = require('U/http');
    //alert(JSON.stringify(api.pageParam))
    var opts = api.pageParam
    var pageParam = {}
    for(var key in opts){
        if(key!=='header'&&key!=='name'&&key!=='url'){
            pageParam[key]=opts[key]
        }
    }
    //alert(JSON.stringify(opts.header))
    var forget = new Vue({
        el: '#badNetwork',
        template: _g.getTemplate('main/badNetwork-body-V'),
        data: {},
        methods: {
            onClickTap: function () {
                if(api.connectionType === 'none') return
                _g.openWin({
                    header:opts.header,
                    name:opts.name,
                    url:opts.url,
                    pageParam:pageParam
                })
            }
        }
    })
})