define(function (require, exports, module) {
    var Http = require('U/http');
    var batch_id = api && api.pageParam.id;
    var audit_status=api && api.pageParam.audit_status;
    var vm = new Vue({
        el: '#inventoryCheckBatchDetail',
        template: _g.getTemplate('shop/inventoryCheckBatchDetail-body-V'),
        data: {
            isShow:false,
            type:0,
            isDifferent:true,
            audit_status:audit_status,
            check_batch_id:'',
            check_batch_no:'',
            storehouse_name:'',
            batch_type_name:'',
            batch_key_name:'',
            create_admin_name:'',
            create_time:'',
            audit_admin_name:'',
            remark:''
        },
        created: function () {
        },
        methods: {
            onSelectTap:function (i){
                this.type = i;
                api.setFrameGroupIndex && api.setFrameGroupIndex({
                    name: 'shop-inventoryCheckBatchDetail',
                    index: i,
                    scroll: false,
                    reload: false
                });
            },
            onToggleTap:function () {
                setTimeout(function () {
                    var y = $("#wrapper").offset().height + _g.getBarHeight() + (0.7 * 100 * (document.documentElement.clientWidth / 750));
                    var h = $(window).height() - $("#wrapper").offset().height + (0.22 * 100 * (document.documentElement.clientWidth / 750));
                    api.setFrameGroupAttr && api.setFrameGroupAttr({
                        name: 'shop-inventoryCheckBatchDetail',
                        rect:{
                            x:0,             //左上角x坐标
                            y:y,
                            w:"auto",           //宽度，若传'auto'，frame组从x位置开始自动充满父页面宽度
                            h:h            //高度，若传'auto'，frame组从y位置开始自动充满父页面高度
                        },
                    });
                },0)
                this.isShow = !this.isShow;

            },
        }
    });
    var getData=function(){
        var _data={
                batch_type_attr_code:'ERP_CHECK_TYPE',
                check_batch_id:batch_id || '',
            };
        var _url='/app/auth/erp/stock/getErpCheckBatch.do';
        Http.ajax({
            data:_data,
            // isSync:true,
            api_versions:'v2',
            url:_url,
            isSync:false,
            success:function(ret){
                logger.log({"Type":"operation","action":"获取盘点批号信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                console.log(ret)
                if(ret.code==200){
                    vm.check_batch_id=ret.object.check_batch_id;
                    vm.check_batch_no=ret.object.check_batch_no;
                    vm.storehouse_name=ret.object.storehouse_name;
                    vm.batch_type_name=ret.object.batch_type_name;
                    vm.batch_key_name=detailRange(ret.object.batch_type_name,ret.object.batch_key_name);
                    vm.create_admin_name=ret.object.create_admin_name;
                    vm.create_time=ret.object.create_time;
                    vm.audit_admin_name=ret.object.audit_admin_name===null?"未审核":ret.object.audit_admin_name;
                    vm.remark=ret.object.remark;
                    vm.count_check_order=ret.object.count_check_order;
                    openFrameGroup();
                }
                    else{
                        _g.toast(ret.message);
                    }
            },
            error:function(err){}
        })
    }
    //具体范围显示
    var detailRange=function(all,detail){
       if(detail===null){
          if(all==="全盘盘点"){
            detail="全店";
          }
          else{
            detail="抽样";
          }
       }
       else{
        detail=detail;
       }
       return detail;
    }

    getData();

    var openFrameGroup = function(){
        if(audit_status=="00N" && vm.batch_type_name==="抽样盘点"){
            var y = $("#wrapper").offset().height + _g.getBarHeight() + (0.16 * 100 * (document.documentElement.clientWidth / 750));
            var h = $(window).height() - $("#wrapper").offset().height + (0.74 * 100 * (document.documentElement.clientWidth / 750));
        }else{
            var y = $("#wrapper").offset().height + _g.getBarHeight() + (0.7 * 100 * (document.documentElement.clientWidth / 750));
            var h = $(window).height() - $("#wrapper").offset().height + (0.22 * 100 * (document.documentElement.clientWidth / 750));
        }
        api && api.openFrameGroup({
            name: 'shop-inventoryCheckBatchDetail',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: y,
                w: 'auto',
                h: h,
            },
            index: 0,
            preload: 2,
            frames: [{
                name: 'shop-inventoryCheckBatchDetail-inventoryCheckBatchDifferent',
                url: './inventoryCheckBatchDifferent.html',
                bounces: true,
                pageParam:{
                    id:batch_id,
                    audit_status:audit_status
                }
            }, {
                name: 'shop-inventoryCheckBatchDetail-inventoryCheckBatchLoss',
                url: './inventoryCheckBatchLoss.html',
                bounces: true,
                pageParam:{
                    id:batch_id,
                    audit_status:audit_status,
                }
            }]
        }, function(ret, err) {

        });
    }

//查看盘点单
    api && api.addEventListener({
        name: 'shop-inventoryCheckBatchDetail-openAllBatchList'
    }, function(ret, err) {
        // if(_g.getLS('UserInfo').notes == "company_admin"){
        //      _g.openWin({
        //         header: {
        //             data: {
        //                 title: '盘点单列表',
        //             }
        //         },
        //         pageParam:{
        //             id:batch_id
        //         },
        //         name: 'shop-inventorychecklist',
        //         url: '../shop/inventorychecklist.html',
        //         bounces: false,
        //         slidBackEnabled: false
        //     })
         // }else
         
         if(audit_status!='00N'){
                _g.openWin({
                header: {
                    data: {
                        title: '盘点单列表',
                    }
                },
                pageParam:{
                    id:batch_id
                },
                name: 'shop-inventorychecklist',
                url: '../shop/inventorychecklist.html',
                bounces: false,
                slidBackEnabled: false
            })
         }
         else {
             _g.openWin({
                header: {
                    data: {
                        title: '盘点单列表',
                    },
                    template: '../html/header/header-inventoryCheckList-V',
                },
                pageParam:{
                    id:batch_id
                },
                name: 'shop-inventorychecklist',
                url: '../shop/inventorychecklist.html',
                bounces: false,
                slidBackEnabled: false
            })
         }
    });
    
    module.exports = {};
});
