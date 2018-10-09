define(function (require, exports, module) {
    var Http = require('U/http');
    var dtPicker = new mui.DtPicker({
        type: 'date'
    });
    // isClerk有两种情况 店长或店员  "sales" "store_admin"
    var isClerk = '';
    var role = _g.getLS('UserInfo').notes;
    if(role === "sales" || role === "store_admin"){
        isClerk = _g.getLS('UserInfo').user_id;

    }
    // 入口判断:如果是店员功能入口为true(assistantFunction)
    var isAssistantIn = !!api.pageParam.isAssistantIn
    /**
     * entry 1: bossWeekturnover ---> here
     * entry 2: assistantFunction_manager ---> here
     * entry 3: assistantFunction_clerk ---> here
     **/
    var allDetails = new Vue({
        el: '#allDetails',
        template: _g.getTemplate('statistics/allDetails-body-V'),
        data: {
            selectingStore:'',
            selectingStoreId:'',
            selectingClerk: '',
            selectingClerkId: '',
            selectingTime: '',
            isTimeStrLong:'',// vue 的渲染效率和字符串长度有关，请勿超过10
            startDay: '',
            endDay: '',
            isNoResult:false,
            isFirstLoading:true,// 首次加载
            isSearched:false,// 已经按了搜索键
            list: [
                {
                    create_time: "2017-03-03 17:10:49",
                    order_id: 136446,
                    order_no: "0001410006-20170303171050-4938",
                    order_type: "00A",
                    total_sale_price: '3,000.00',

                    clerkName: '小雪',//营业员名字
                    memberName: '大雪',//会员名字

                    formatMonth: '三月',//格式化月份
                    isMonthShow: true,//是否显示已经格式化的月份
                    formatDay: '今天',//格式化日期
                    timeShow: '17:10'//格式化时间
                }
            ]
        },
        created: function () {
            this.list = [];
            this.isFirstLoading = true;
        },
        ready: function () {
            //设置noResultWrap的高度
            var h = api.frameHeight || window.screen.height
            document.getElementById('noResultWrap').style.height = h + 'px'
        },
        watch: {},
        computed: {
            isBarShow: function () {
                //店员店长首次加载默认隐藏

                // 全为空则不显示
                var sta = this.startDay === '' && this.endDay === '' && this.selectingClerkId === '' || this.isNoResult
                sta = !sta
                return sta
            },
            isNoResult: function () {
                if(this.isFirstLoading) return false
                var sta = this.list.length === 0 ? true : false
                return sta
            }
        },
        methods: {
            dtpicker: function (type) {
                var self = this;
                dtPicker.show(function (selectItems) {
                    self[type.toString()] = selectItems.value;
                });
            },
            onClickTap: function (type, id) {
                _g.openWin({
                    header: {
                        data: {
                            title: '销售单详情'
                        }
                    },
                    name: 'statistics-saleTicketDetail',
                    url: '../statistics/saleTicketDetail.html',
                    bounces: false,
                    pageParam: {
                        order_id: id,
                        order_type: type,
                    }
                });
                var _data={
                        order_id: id,
                        order_type: type,
                    };
                logger.log({"Type":"operation","action":"全部销售明细列表点击打开销售单详情页面","Win_name":api.winName,"data":_data});
            }
        }
    });

    /**=========================================================
     *  移动端可以解析 '2017/02/28 22:00:01' 和 '2017-02-28' 格式的字符串为时间对象
     *  但不可以解析 '2017-02-28 22:00:01' 格式的字符串为时间对象
     *  var t = '2017/02/28 22:00:01'
     *  var a = new Date(t)
     *  alert(a)
     * ==========================================================**/
    var getData = function (opts, callback) {
        opts = opts || {};
        var clerkId = allDetails.selectingClerkId
        // 首次加载(未按搜索) 店长角色在‘店员入口’只看自己
        if(isAssistantIn && !allDetails.isSearched && !!isClerk){
            clerkId = isClerk
        }
        // 店员角色无论在哪个入口都只能看到自己
        if(role === "sales"){
            clerkId = isClerk
        }
        var _data= {
                displayRecord: 10,
                page: opts.page || 1,
                max_create_time: allDetails.endDay || '',// 结束时间
                min_create_time: allDetails.startDay || '',// 开始时间
                sale_staff:clerkId,// 营业员
                org_id:allDetails.selectingStoreId,
                sale_price: 0
            };
        var _url='/app/auth/page/retail/listOrderItemV2.do';
        Http.ajax({
            data:_data,
            url:_url,
            success: function (ret) {
                logger.log({"Type":"operation","action":"全部销售明细数据获取","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                allDetails.isFirstLoading = false;
                if (ret.success) {
                    if (opts.page && opts.page > 1) {
                        setTimeout(function () {
                            var list = getItem(ret.object);
                            callback && callback(list);
                        }, 0);
                    } else {
                        /*if(_g.isEmpty(ret.object)){
                            allDetails.isNoResult = true
                            return
                        }
                        allDetails.isNoResult = false*/
                        allDetails.list = getItem(ret.object);
                        isMonthShowFuc();
                    }
                } else {
                    _g.toast(ret.message);
                }
            },
            error: function (err) {
                allDetails.isFirstLoading = false;
                _g.hideProgress();
                _g.toast(err.message);
            }
        });
    };
    var loadmore = new Loadmore({
        callback: function (page) {
            getData({page: page.page}, function (data) {
                if (!data || data.length === 0) {
                    return loadmore.loadend(false);
                } else {
                    allDetails.list = allDetails.list.concat(data);
                    // 是否显示已经格式化的月份
                    isMonthShowFuc();
                    loadmore.loadend(true);
                }
            });
        }
    });
    /**
     * 设置noResultWrap的高度 没有调用
     *
     **/
    var checkData = function () {
        var h = api.frameHeight || window.screen.height;
        document.getElementById('noResultWrap').style.height = h + 'px';
    };
    /**
     * 套接口
     * @param [obj]
     * @return [array]
     **/
    var getItem = function (obj) {
        return _.map(obj, function (item) {
            return {
                create_time: item.create_time,// "2017-03-03 17:10:49",
                order_id: item.order_id,
                order_no: item.order_no,
                order_type: item.order_type,
                total_sale_price: item.total_sale_price,

                clerkName: item.sale_staff_name || '',// 营业员名字
                memberName: item.user_name || '',// 会员名字

                formatMonthLoc: formatMonthFuc(item.create_time),// 格式化月份'三月'
                isMonthShow: '',// 是否显示已经格式化的月份

                formatDayLoc: formatDayFuc(item.create_time),// 格式化日期 '今天'
                timeShow: formatDateFuc(item.create_time)// 格式化时间'17:10'
            }
        })
    }
    /**
     * 判断isMonthShow是否为真
     *
     **/
    var isMonthShowFuc = function () {
        //是否显示已经格式化的月份
        for (var i = 0; i < allDetails.list.length; i++) {
            var curInd = ''
            var lastInd = ''
            if (i === 0) {
                allDetails.list[i].isMonthShow = true
            } else {
                curInd = new Date(allDetails.list[i].create_time.substr(0, 10)).getMonth()
                lastInd = new Date(allDetails.list[i - 1].create_time.substr(0, 10)).getMonth()
                if (curInd === lastInd) {
                    allDetails.list[i].isMonthShow = false
                } else {
                    allDetails.list[i].isMonthShow = true
                }
            }
        }
    }
    /**
     * 格式化月份
     * @param [string]  时间格式字符串：2017-03-03 17:10:49
     * @return [string] 日期：'本月','一月','二月',etc
     **/
    var formatMonthFuc = function (str) {
        //手机端需要去掉时分秒
        str = str.substr(0, 10)
        var monthMap = ['本月', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月',]
        var curMonth = new Date().getMonth() + 1
        var strMonth = new Date(str).getMonth() + 1
        var ind = curMonth === strMonth ? 0 : strMonth
        return monthMap[ind]
    }
    /**
     * 格式化日期
     * @param [string]  时间格式字符串：2017-03-03 17:10:49
     * @return [string] 日期：'今天','昨天','周三',etc
     **/
    var formatDayFuc = function (str) {
        //手机端需要去掉时分秒
        str = str.substr(0, 10)
        var isToday = isTodayFuc(str)
        var isYesterday = isYesterdayFuc(str)
        var dayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        var returnStr = ''
        if (isToday) {
            returnStr = '今天'
        } else if (isYesterday) {
            returnStr = '昨天'
        } else {
            returnStr = dayMap[( new Date(str) ).getDay()]
        }
        return returnStr
    }
    /**
     * 格式化时间
     * @param [string]  时间格式字符串：2017-03-03 17:10:49
     * @return [string] 时间：'17:10','03-03',etc
     **/
    var formatDateFuc = function (str) {
        //手机端需要去掉时分秒
        var localStr = str.substr(0, 10)
        var isToday = isTodayFuc(localStr)
        var isYesterday = isYesterdayFuc(localStr)
        var returnStr = ''
        if (isToday || isYesterday) {
            returnStr = str.substr(11, 5)
        } else {
            returnStr = str.substr(5, 5)
        }
        return returnStr
    }
    /**
     * 判断是否是今天
     * @param [string]  时间格式字符串：2017-03-03 (手机端不支持时分秒解析)
     * @return [Boolean]
     **/
    var isTodayFuc = function (str) {
        var todayObj = new Date()
        var today = new Date(todayObj.getFullYear(),todayObj.getMonth(),todayObj.getDate()).getTime()  //今天零时零分零秒的时间戳
        var confirmDay = new Date(str)
        var confirmDay = new Date(confirmDay.getFullYear(),confirmDay.getMonth(),confirmDay.getDate()).getTime() //str日期零时零分零秒的时间戳
        var sta = today === confirmDay ? true : false
        return sta
    }
    /**
     * 判断是否是昨天
     * @param [string]  时间格式字符串：2017-03-03 (手机端不支持时分秒解析)
     * @return [Boolean]
     **/
    var isYesterdayFuc = function (str) {
        //昨天零时零分零秒的时间戳
        var todayObj = new Date()
        var yesterday = new Date(todayObj.getFullYear(),todayObj.getMonth(),todayObj.getDate()).getTime() - 24 * 60 * 60 * 1000
        //str日期零时零分零秒的时间戳
        var confirmDay = new Date(str)
        var confirmDay = new Date(confirmDay.getFullYear(),confirmDay.getMonth(),confirmDay.getDate()).getTime()
        var sta = yesterday === confirmDay ? true : false
        return sta
    }

    /**
     * 抽出搜索边栏
     **/
    api.addEventListener && api.addEventListener({
        name: 'drawOutSearchSide'
    }, function (ret, err) {
        api.openDrawerPane && api.openDrawerPane({
            type: 'right'
        });
    });

    /**
     * 搜索响应
     **/
    api.addEventListener && api.addEventListener({
        name: 'allDetailsSideSearch'
    }, function (ret, err) {
        logger.log({"Type":"operation","action":"全部销售明细接收侧边栏搜索","Win_name":api.winName});
        var obj = ret.value
        allDetails.selectingStore=obj.storeName;
        allDetails.selectingStoreId=obj.org_id;
        allDetails.selectingClerk = obj.clerkName
        allDetails.selectingClerkId = obj.clerkId
        // vue 的渲染效率和字符串长度有关，每个标签要渲染数据的长度请勿超过10
        // allDetails.selectingTime = obj.sideTime
        allDetails.selectingTime = obj.startTime
        obj.startTime === '' && (allDetails.selectingTime = '全部时间')
        allDetails.startDay = obj.startTime
        allDetails.endDay = obj.endTime
        // obj.startTime === obj.endTime的两种情况: '' 和 今天的时间格式
        allDetails.isTimeStrLong = obj.startTime === obj.endTime ? false : true
        allDetails.isSearched = true // 已经按了搜索
        getData()
        loadmore.reset()
    });

    _g.setPullDownRefresh(function() {
        logger.log({"Type":"operation","action":"向下拉动刷新全部销售列表数据","Win_name":api.winName});
        getData();
        loadmore.reset()
    });

    /**===== invoking function =====**/
    getData()


    module.exports = {};
});
