define(function (require, exports, module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var userId=api.pageParam.entId//	会员ID	number
    var vm = new Vue({
        el: '#memberTag',
        template: _g.getTemplate('clerk/memberTag-body-V'),
        data: {
            AllTagNum: 0,
            sent: true,
            chooseTag:false,
            list: [
                {
                    tagName: '标签1',
                    index: 1,
                    check: false,
                },
                {
                    tagName: '标签2',
                    index: 2,
                    check: false,
                },
                {
                    tagName: '标签3',
                    index: 3,
                    check: false,
                },
                {
                    tagName: '标签4',
                    index: 4,
                    check: false,
                }
            ]
        },
        created: function () {
            this.list = [];
            this.sent = true;
        },
        watch: {},
        filters: {},
        methods: {
            //单个标签
            onClickTag: function (idx) {
                this.list[idx].check = !this.list[idx].check;
                this.countNum()
                },
            onchooseTag : function(){
                this.chooseTag = !this.chooseTag;
                if(this.chooseTag){
                    _.map(this.list, function(item) {
                        item.check =true;
                    });
                    this.countNum();
                }else{
                    _.map(this.list, function(item) {
                        item.check =false;
                    });
                    this.countNum();
                }
            },
            countNum: function () {
                var num = 0;
                for (key in this.list) {
                    if (this.list[key].check) num++
                }
                this.AllTagNum = num;
            },
            onAgree: function () {
                if (!this.sent) return
                this.sent = false;
                var arr = [];
                for (key in this.list) {
                    if (this.list[key].check) arr.push(this.list[key].index);
                }
                if (arr.length === 0) {
                    arr = '';
                }else{
                    arr = '['+arr+']';
                }
                var _data= {
                        tag_list:arr,
                        user_id: userId
                    };
                var _url='/app/auth/crm/user/saveCrmUserTag.do';
                Http.ajax({
                    data:_data,
                    api_versions: 'v2',
                    url:_url,
                    success: function (res) {
                        logger.log({"Type":"operation","action":"memberTag保存数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                        if (res.success) {
                            this.sent = true;
                            api.sendEvent && api.sendEvent({
                                name: 'memberTagReload',
                            });
                            api.closeWin && api.closeWin();
                        } else {
                            this.sent = true;
                            _g.toast(res.message);
                        }
                    }
                })
            }

        }
    });
    var getData = function (opts, callback) {
        opts = opts || {};
        var _data= {
                displayRecord: 20,
                page: opts.page || 1,
                user_id: userId//   会员ID    number
            };
        var _url='/app/auth/crm/user/listCrmUserTag.do';
        Http.ajax({
            data:_data,
            api_versions: 'v2',
            url:_url,
            success: function (res) {
                logger.log({"Type":"operation","action":"memberTag获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
                if (res.code == 200) {
                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            callback && callback(res);

                        }, 0)
                    } else {
                        setTimeout(function () {
                            vm.list = getItemList(res);
                            vm.countNum();
                        }, 0)
                    }
                } else {
                    _g.toast(res.message);
                }
            },
            error: function (err) {
                _g.hideProgress();
            }
        })
    };
    getData()
    var loadmore = new Loadmore({
        callback: function (page) {
            getData({page: page.page}, function (data) {
                if (!data.object || data.object.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    vm.list = vm.list.concat(getItemList(data));
                    loadmore.loadend(true);
                }
            });
        }
    });
    var getItemList = function (res) {
        return _.map(res.object, function (item) {
            return {
                tagName: item.tag_name,
                index: item.tag_id,
                check: item.is_selected
            }
        })
    }
      _g.setPullDownRefresh(function () {
        setTimeout(function () {
            getData();
        },0)
        loadmore.reset();
    });
    module.exports = {};
});
