define(function(require, exports, module){
    window.console.log('------------------------------------------------------------------');
    //创建美洽
    var mq = api.require('meiQia');
    //配置初始化美洽需要的appkey
    var param = {
        appkey: "9a560c1acf61196e9d20b4b1e2f873dd"
    };
    // 初始化美洽
    mq.initMeiQia(param, function (ret, err) {
        window.console.log('初始化meiqia!--------------');
        if (ret) {
            //初始化成功
            mq.show();
        } else {
            //初始化失败
            alert(JSON.stringify(err));
        }
    })


});
