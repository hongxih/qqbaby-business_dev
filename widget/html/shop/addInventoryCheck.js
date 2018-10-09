define(function (require, exports, module) {
    var Http = require('U/http');
    var FNScanner = api.require('FNScanner');
    // var FNScanner = require('U/scanner');
    var check_batch_id=api && api.pageParam.check_batch_id;
    var check_order_id=api && api.pageParam.check_order_id || null;
    var style='cumulative';
    var keyCode=null;
    var product_name='';
    var bar_code='';
    var check_amount='';
    var product_id='';
    var sku_code='';
    var sku_name='';
    var unit='';
    var keyevent = function(e){
        keyCode=e.keyCode;
        // alert(keyCode)
     }
    document.onkeydown = keyevent;
    var vm = new Vue({
        el: '#addInventoryCheck',
        template: _g.getTemplate('shop/addInventoryCheck-body-V'),
        data: {
            type:1,
            query_name:'',
            item:[],
            itemLength:null,
            i:0,
            isSuccess:true,
        },
        methods: {
            selectFunction:function (i) {
                this.type=i;
                if(i===3){
                    logger.log({"Type":"operation","action":"选择替换模式","Win_name":api.winName});
                    style="replace";
                    this.item=[];
                    setTimeout(function () {
                        //发送事件到头部切换成输入模式
                        api && api.sendEvent({
                            name: 'baseWin-index-addInventoryCheckChangeMode',
                            extra: {
                                searchInput:'',
                                placeholder:'条码/自编码/助记码',
                                mode:'search',
                                type:1
                            }
                        });
                    },0);
                };
                if(i===2){
                     logger.log({"Type":"operation","action":"选择连扫模式","Win_name":api.winName});
                    style="cumulative";
                    this.item=[];
                    setTimeout(function () {
                        //发送事件到头部切换成输入模式
                        api && api.sendEvent({
                            name: 'baseWin-index-addInventoryCheckChangeMode',
                            extra: {
                                searchInput:'',
                                placeholder:'条码/自编码/助记码',
                                mode:'search',
                                type:1
                            }
                        });
                    },0);
                };
                if(i===1){
                     logger.log({"Type":"operation","action":"选择累加模式","Win_name":api.winName});
                    style="cumulative";
                    this.item=[];
                    setTimeout(function () {
                        //发送事件到头部切换成输入模式
                        api && api.sendEvent({
                            name: 'baseWin-index-addInventoryCheckChangeMode',
                            extra: {
                                searchInput:'',
                                placeholder:'条码/自编码/助记码',
                                mode:'search',
                                type:1
                            }
                        });
                    },0);
                }
            },
            save:function(product_id,sku_code,input_value,i){
                var itemLength=this.itemLength;
                var item=this.item;
                setTimeout(function(){
                    if(!input_value){
                        logger.log({"Type":"operation","action":"输入框没有数据失去焦点保存","Win_name":api.winName});
                        _g.toast("请输入盘点数量");
                        return false;
                    }else if(Number(input_value) > 9999){
                        logger.log({"Type":"operation","action":"输入框数据大于9999失去焦点保存","Win_name":api.winName});
                         item[i].value=null;
                        _g.toast("请检查输入是否有误");
                        return false;
                    }else{
                        this.i=i;
                          saveData(product_id,sku_code,input_value,i);
                          
                        // if(_g.isAndroid){
                        //     logger.log({"Type":"operation","action":"安卓输入框失去焦点保存","Win_name":api.winName});
                            // saveData(product_id,sku_code,input_value,i);
                            // if(this.i==itemLength-1){
                            //     api && api.sendEvent({
                            //         name: 'baseWin-index-addInventoryCheckChangeMode',
                            //         extra: {
                            //             searchInput:'',
                            //             placeholder:'条码/自编码/助记码',
                            //             mode:'search',
                            //             type:1
                            //         }
                            //     });
                            //      // $(".ui-addInventoryCheck_count").eq(i).css("borderColor","#4cbcbe");
                            // }     
                            // $(".ui-addInventoryCheck_count").eq(i+1).focus();//自动跳转到下一个
                            // $(".ui-addInventoryCheck_count").eq(i+1).css("borderColor","red");
                        // }else if(_g.isIOS){
                        //     logger.log({"Type":"operation","action":"苹果输入框失去焦点保存","Win_name":api.winName});
                            // saveData(product_id,sku_code,input_value,i);
                             // api && api.sendEvent({
                             //        name: 'baseWin-index-addInventoryCheckChangeMode',
                             //        extra: {
                             //            searchInput:'',
                             //            placeholder:'条码/自编码/助记码',
                             //            mode:'search',
                             //            type:1
                             //        }
                             //    });
                            // $(".ui-addInventoryCheck_count").css("borderColor","#4cbcbe");
                            // $(".ui-addInventoryCheck_count").eq(i+1).focus();
                            // $(".ui-addInventoryCheck_count").eq(i+1).css("borderColor","red");
                        // }
                    }
                },0);
            },
            onSelect:function (i) {
                logger.log({"Type":"operation","action":"输入框获取焦点","Win_name":api.winName});
                this.i = i;
                $(".ui-addInventoryCheck_count").css("borderColor","#4cbcbe");
                $(".ui-addInventoryCheck_count").eq(this.i).css("borderColor","red");
                  api && api.sendEvent({
                       name: 'baseWin-index-addInventoryCheckChangeMode',
                       extra: {
                           searchInput:'',
                           placeholder:'请输入数量',
                           mode:'input',
                           type:2
                       }
                  });
            },
        }
    });
    var getGoods=function(callback){
        var _data={
                check_batch_id:check_batch_id,
                check_order_id:check_order_id,
                query_name:vm.query_name
            };
        var _url='/app/auth/erp/stock/listInputQueryGoods.do';
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            success:function(ret){
                console.log("获取商品信息============", ret);
               logger.log({"Type":"operation","action":"获取商品信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
              if(ret.success){
                   vm.i = 0;
                   vm.isSuccess=true;//用于判断
                   vm.item=dataChange(ret.object);
                   vm.itemLength = ret.object.length;
                   callback();
                   if(vm.type === 1 || vm.type === 3){
                      logger.log({"Type":"operation","action":"累加和替换模式，发送事件到头部切换成输入模式","Win_name":api.winName});
                       setTimeout(function () {
                           $(".ui-addInventoryCheck_count").eq(0).css("borderColor","red");
                           //发送事件到头部切换成输入模式
                           api && api.sendEvent({
                               name: 'baseWin-index-addInventoryCheckChangeMode',
                               extra: {
                                   searchInput:'',
                                   placeholder:'请输入数量',
                                   mode:'input',
                                   type:2
                               }
                           });
                       },0);
                   }
               }else{
                   api && api.sendEvent({     
                    name:"clearInput",
                     extra:{
                        searchInput:''
                     }
                });
                   vm.isSuccess=false;
                  _g.toast(ret.message);
               }
            },
            error:function(err){}
        });
    }

    var dataChange=function(data){
        return _.map(data,function(item){
            return{
                isShow:true,
                value:vm.type===2 ? 1 : null,
                product_name:item.product_name,
                bar_code:item.bar_code,
                check_amount:item.check_amount,
                product_id:item.product_id,
                sku_code:item.sku_code,
                sku_name:item.sku_name,
                unit:item.unit,
                inventory: item.stock_amount, //lzh 库存数量
                showInventory: item.is_show_stock  //是否显示库存，1：显示，0：不显示
            }
        });
    }
    //提交数据
    var saveData=function(product_id,sku_code,input_value,i){
        var _data={
                check_amount:input_value,
                check_batch_id:check_batch_id,
                check_order_id:check_order_id,
                product_id:product_id,
                sku_code:sku_code,
                check_strategy:style
            };
         var _url='/app/auth/erp/stock/saveErpCheckOrder.do'
        Http.ajax({
            data:_data,
            url:_url,
            api_versions:'v2',
            success:function(ret){
                console.log("添加商品输入框提交数据============", ret);
                 logger.log({"Type":"operation","action":"添加商品输入框提交数据","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url});
                if(ret.success){
                    check_order_id = ret.object.check_order_id;
                     api && api.sendEvent({
                          name: 'baseWin-index-addInventoryCheckChangeMode',
                          extra: {
                              searchInput:'',
                              placeholder:'条码/自编码/助记码',
                              mode:'search',
                              type:1
                          }
                      });
                    if(vm.type === 1){
                        vm.item[i].check_amount=Number(vm.item[i].check_amount)+Number(vm.item[i].value);
                        _g.toast("添加成功，+"+Number(vm.item[i].value))
                    }else if(vm.type === 2 && ret.success===true){
                           vm.item[i].check_amount=Number(vm.item[i].check_amount)+Number(vm.item[i].value);
                          _g.toast("添加成功，+1"); 
                    }else if(vm.type === 3){
                        vm.item[i].check_amount=Number(vm.item[i].value);
                        _g.toast("替换成功，当前数量"+Number(vm.item[i].value))
                    }
                }else{
                    _g.toast(ret.message);
                }

            },
            error:function(){}
        });
    }
    //接收头部发送信息，打开扫码模块
    api.addEventListener && api.addEventListener({
        name: 'shop-addInventoryCheck-openScanner'
    }, function() {
        // FNScanner.openScanner({batchId:check_batch_id,orderId:check_order_id},function (ret,err) {
        //     //发送事件到inventoryCheckScan打开扫码提示框
        //     var content=ret.content;
        //     http(content);
        // })
        logger.log({"Type":"operation","action":"接收头部发送信息，打开扫码模块","Win_name":api.winName});
            FNScanner.openScanner({
            }, function(ret, err) {
                if(ret.content){
                    api && api.sendEvent({
                        name: 'shop-addInventoryCheck-getScanResult',
                        extra: {
                            searchInput:ret.content
                        }
                    });
                }
            });
    });

   var http=function(content){
    var _data={
                    check_batch_id:check_batch_id,
                    check_order_id:check_order_id,
                    query_name:content || "",
                };
    var _url='/app/auth/erp/stock/listScanQueryGoods.do';
      Http.ajax({
                data:_data,
                isSync:false,
                url:_url,
                api_versions:'v2',
                success:function(ret){
                    console.log("盘点扫二维码呈现商品信息============", ret);
                    logger.log({"Type":"operation","action":"盘点扫二维码呈现商品信息","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                    if(ret.success){
                          api && api.sendEvent({
                             name: 'shop-inventoryCheckScan-openAlert',
                             extra:{
                                   batchId:check_batch_id,
                                   orderId:check_order_id,
                                   item:ret.object
                             }
                         });
                       }else{
                          _g.toast(ret.message);
                       }
                },
                error:function(err){}
            })
   }

    // //接收头部发送信息，关闭扫码模块
    // api.addEventListener && api.addEventListener({
    //     name: 'shop-addInventoryCheck-closeScanner'
    // }, function(ret, err) {
    //     FNScanner.closeScanner()
    // });

   //接收头部信息，调用搜索接口
    api.addEventListener && api.addEventListener({
        name:'shop-addInventoryCheck-search'
    },function(ret,err){
        logger.log({"Type":"operation","action":"接收头部信息，调用搜索接口","Win_name":api.winName});
        if(ret.value.searchInput==""){
            _g.toast("请输入搜索内容");
            return false;
        }
        vm.query_name=ret.value.searchInput;
        if(vm.type===2){
            logger.log({"Type":"operation","action":"当模式为连扫时，商品搜索之后，自动添加数量1","Win_name":api.winName});
            getGoods(function(){
                if(vm.isSuccess){
                    if(vm.item.length === 0){
                        return;
                    }else{
                        var product_id=vm.item[0].product_id || "";
                        var sku_code=vm.item[0].sku_code || "";
                        var value=vm.item[0].value || "";
                        if(vm.item.length>1){
                            vm.type=1;
                            for(var i = 0;i < vm.item.length;i++){
                                vm.item[i].value = null;
                            };
                        }else{
                           saveData(product_id,sku_code,value,0);
                        }
                    }
                        //发送事件到头部切换成输入模式
                        api && api.sendEvent({
                            name: 'baseWin-index-addInventoryCheckChangeMode',
                            extra: {
                                searchInput:'',
                                placeholder:'条码/自编码/助记码',
                                mode:'search',
                                type:1
                            }
                        });
                }
             });
        }
        if(vm.type===1||vm.type===3){
             getGoods();
        }
    })
    var elebody=document.getElementById("addInventoryCheckdetail")
        //接收头部信息，把数量输入到输入框
    api && api.addEventListener({
        name: 'shop-addInventoryCheck-input'
    }, function(ret, err) {
         // alert($(".ui-addInventoryCheck_wrap").scrollTop());
         logger.log({"Type":"operation","action":"接收头部信息，把数量输入到输入框，此时头部搜索为输入数量状态","Win_name":api.winName});
        if(vm.i < vm.itemLength){
            //保存数据
            var num= /^[0-9]+.?[0-9]*$/;
            if(Number(ret.value.searchInput) > 9999 || !num.test(ret.value.searchInput)){
                api && api.sendEvent({     
                    name:"clearInput",
                     extra:{
                        searchInput:''
                     }
                });
                _g.toast("请检查输入是否有误");
                return false;
            }else{
                api && api.sendEvent({     
                    name:"clearInput",
                     extra:{
                        searchInput:''
                     }
                });
                vm.item[vm.i].value = ret.value.searchInput;
                var product_id=vm.item[vm.i].product_id || "";
                var sku_code=vm.item[vm.i].sku_code || "";
                var value=vm.item[vm.i].value || "";
                var i = vm.i;
                if(!vm.item[vm.i].value){
                      _g.toast("请输入盘点数量");
                    return false;
                }else{
                    logger.log({"Type":"operation","action":"在头部输入数量，保存盘点数量","Win_name":api.winName});
                     saveData(product_id,sku_code,value,i);
                }
                //样式改变
                // vm.i++; 
                // $(".ui-addInventoryCheck_count").css("borderColor","#4cbcbe");
                // $(".ui-addInventoryCheck_count").eq(vm.i).css("borderColor","red");    
                
                // var high=elebody.scrollHeight-30;
                // var avehigh=high/vm.itemLength;
                // elebody.scrollTop=elebody.scrollTop+avehigh;
                // if(vm.i === vm.itemLength){
                //     setTimeout(function () {
                //         //发送事件到头部切换成输入模式
                //         logger.log({"Type":"operation","action":"最后一个商品已经盘点完，发送事件到头部，切换为搜索商品状态","Win_name":api.winName});
                //         api && api.sendEvent({
                //             name: 'baseWin-index-addInventoryCheckChangeMode',
                //             extra: {
                //                 searchInput:'',
                //                 placeholder:'条码/自编码/助记码',
                //                 mode:'search',
                //                 type:1
                //             }
                //         });
                //     },0);
                //     vm.i = 0;
                // }
            }
        }
    });
    module.exports = {};
});
