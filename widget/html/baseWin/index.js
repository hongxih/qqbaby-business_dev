define(function(require, exports, module) {
    var opts = api && api.pageParam.opts;
    //alert(JSON.stringify(opts))
    // 断网判断
    // opts.name 可以拿到当前页面
    function judgeNetwork(){
        if(!api) return
        //alert(api.connectionType)
        if(api.connectionType === 'none'){ // 无网络
            if(!opts.pageParam){
                opts.pageParam = {}
            }
            opts.pageParam.header = opts.header
            opts.pageParam.name = opts.name
            opts.pageParam.url = opts.url

            opts.url = '../main/badNetwork.html'
        }else {

        }
    }
    judgeNetwork()


    var Func = require('U/func');
    if(opts.header){
        opts.header.methods = opts.header.methods || Func.get(opts.name);

        var header = _g.addHeader(opts.header);

    }
    _g.addContent(opts);
    //需要恢复{template:'../html/header/header-addGoods-V'}

    // 页面打开完成
    api && api.addEventListener({
	    name: 'viewappear'
	}, function(ret, err) {
	    if (api.winName == 'scan-index-win') return;
	    // 关闭扫一扫页面
	});

    api && api.addEventListener({
        name: 'uncheckBillNum'
    }, function(ret, err){
        // 未审核单据数量
        header.rightNum = ret.value.key;
    });

    setTimeout(function(){
    	if (api.winName == 'scan-index-win') return;
    	else _g.closeWins(['scan-index-win']);
    },1000);

    // shop-goodsCostCheck
    api && api.addEventListener({
        name: 'shop-goodsCostCheck-addMessage'
    }, function(ret, err){
        header.searchText = ret.value.searchText;
    });

    //因为每次打开页面都会出发接收事件，所以要确定某页面接收事件，需要用页面名称作判断
    var getPage = function (name,callback) {
        if(name === opts.name){
            callback && callback();
        }
    }

    getPage("shop-addInventoryCheck",function () {
        setTimeout(function () {
            $("#search").focus();
        },1000)
         api.addEventListener({
            name:"clearInput"
        },function(ret,err){
            header.searchInput = ret.value.searchInput;
        });
        //接收shop-addInventoryCheck页面发送过来的信息改变状态
        api && api.addEventListener({
            name: 'baseWin-index-addInventoryCheckChangeMode'
        }, function(ret, err) {
            header.searchInput = ret.value.searchInput;
            header.placeholder = ret.value.placeholder;
            header.mode = ret.value.mode;
            header.type=ret.value.type;
            setTimeout(function () {
                $("#search").focus();
            },500)
        });
        //shop-addInventoryCheck扫码模块扫描结果传送到输入框
        api && api.addEventListener({
            name: 'shop-addInventoryCheck-getScanResult'
        }, function(ret, err) {
            if(ret.value.searchInput){
                header.searchInput = ret.value.searchInput;
                api && api.sendEvent({
                    name:'shop-addInventoryCheck-search',
                    extra:{
                        searchInput:header.searchInput
                    }
                });
            }else{
                return;
            }
        });
        
    })
    //安卓监听物理键，消息中心
    // getPage("assistant-messageCenter",function () {
    //     if(_g.isAndroid){
    //         //刷新消息中心
    //         api && api.addEventListener({
    //             name: 'keyback'
    //         }, function(ret, err) {
    //             api && api.sendEvent({
    //                name: 'refresh-messageCenter',
    //             });
    //
    //             //关闭当前页面
    //             api && api.closeWin();
    //         });
    //
    //
    //     }
    // })


    // logger.log({"Type":"operation","action":"open win","Win_name":api.winName})
    module.exports = {};

});
