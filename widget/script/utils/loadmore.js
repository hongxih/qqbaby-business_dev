;!function (undefined) {
    var defaultOpts = {
        animate:".loadmore",
        switch:true,
        page:2,
        size:10,
        callback:function(){},
        threshold:150 //距离底部还有多少就触发回调
    };
    function getDefaultOpts(opts){
        opts = opts || {};
        for(var key in defaultOpts){
            if(typeof opts[key] == "undefined"){
                opts[key] = defaultOpts[key];
            }
        }
        return opts;
    }





    function Loadmore(opts){
        this._init(opts);
    }
    Loadmore.fn = Loadmore.prototype = {
        constructor:Loadmore,
        _opts:null,
        _bindEvent:function(){
            var self = this;
            var opts = self._opts;

            $(document).on('tap',opts.animate,function(){
                if(!$(this).is(".none")) return;
                var $dom = $(opts.animate);
                $dom.removeClass("ready");
                $dom.removeClass("none");
                $dom.addClass("loading");
                self.loadend(opts.callback.bind(self)(opts));
            });
            function loadmore(){
                if(!self._opts.switch) return;
                var $dom = $(opts.animate);
                if($dom.length == 0) return;
                if(!$dom.is(".ready")) return;
                $dom.removeClass("ready");
                $dom.removeClass("hide");
                $dom.addClass("loading");
                self.loadend(opts.callback.bind(self)(opts));
            }
            if(window.api && api.addEventListener){
                api.addEventListener({
                    name:'scrolltobottom',
                    extra:{
                        threshold:opts.threshold            //设置距离底部多少距离时触发，默认值为0，数字类型
                    }},loadmore);
            }else{
                $(document).scroll(function(){
                    var value =$(document).height() - $(window).height() - $('body').scrollTop();
                    if(value < opts.threshold){
                        loadmore();
                    }
                });
            }
        },
        toggleSwitch:function(s){
            if(typeof s == "undefined"){
                this._opts.switch = !this._opts.switch;
            }else{
                this._opts.switch = s;
            }
        },
        reset:function(){
            this._opts.page = 2;
            var $dom = $(this._opts.animate);
            $dom.removeClass("loading");
            $dom.removeClass("none");
            $dom.addClass("ready");
            $dom.addClass("hide");
        },
        loadend:function(state){
            var self = this;
            var opts = self._opts;
            var $dom = $(opts.animate);
            if($dom.length == 0) return;
            if(!$dom.is(".loading")) return;
            if(state === false){
                $dom.removeClass("loading");
                $dom.addClass("none");
            }else if(state === true){
                $dom.removeClass("loading");
                $dom.addClass("ready");
                $dom.addClass("hide");
                opts.page++;
            }
        },
        _init:function(opts){
            var self = this;
            self._opts = getDefaultOpts(opts);
            self._bindEvent();
        }
    };

    window.Loadmore = Loadmore;

}();

/*
{
        callback: function(page){



            getData({page: page.page}, function(data){
                if(!data || _.isEmpty(data)){
                    return loadmore.loadend(false);
                }else{
                    _.map(data,function (item,i) {
                        var length = purchaseOrderList.list.length-1;
                        console.log(purchaseOrderList.list)
                        if(item.month_time == purchaseOrderList.list[length].month_time){
                            purchaseOrderList.list[length].list = purchaseOrderList.list[length].list.concat(item.list);
                        }else{
                            purchaseOrderList.list = purchaseOrderList.list.concat(item);
                        }
                    })
                    loadmore.loadend(true);
                }
            });





        }
    }

*/
