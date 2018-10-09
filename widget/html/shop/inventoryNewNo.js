define(function(require, exports, module) {

    var Http = require('U/http');
    var otPicker=new mui.PopPicker();
    var inventoryNewNo = new Vue({
         el: '#inventoryNewNo',
        template: _g.getTemplate('shop/inventoryNewNo-body-V'),
        data: {
            inventoryStore:"",
            Store_value:null,
        	inventory_range:"",
        	specific_range:"",
        	range_value:null,//typeOption的value
            specific_id:null,
            storeOption:[],
            remark:'',
        	typeOption:[{text:"全盘",value:"Overall"},{text:"抽样",value:"Goods"},{text:"分类",value:"Category"},{text:"品牌",value:"Brand"}]
        },
        methods:{
            onStoreSelect:function(){
                var self=this;
                setTimeout(function(){
                    var otPicker=new mui.PopPicker();
                    $('inventoryNewNo-select__right1').blur();
                    otPicker.setData(inventoryNewNo.storeOption);
                    otPicker.show(function(item){
                        inventoryNewNo.inventoryStore=item[0].text;
                        inventoryNewNo.Store_value=item[0].value;
                        otPicker.dispose();
                    });
                    for(var i=0;i<inventoryNewNo.storeOption.length;i++){
                        if(self.Store_value==inventoryNewNo.storeOption[i].value){
                            otPicker.pickers[0].setSelectedIndex(i,100);
                        }
                    }
                },260);
            },
            onSelectType:function(){
            	var self=this;
            	setTimeout(function(){
            		var otPicker=new mui.PopPicker();
            		$(".inventoryNewNo-select__right1").blur();
            		otPicker.setData(inventoryNewNo.typeOption);
            		otPicker.show(function(item){
            			inventoryNewNo.inventory_range=item[0].text;
            			inventoryNewNo.range_value=item[0].value;
            			if(self.range_value=="Overall"){
            				inventoryNewNo.specific_range="全店";
            			}
            			else if(self.range_value=="Goods"){
            				inventoryNewNo.specific_range="抽样";
            			}
            			else{
            				inventoryNewNo.specific_range="请选择";
            			}
            			otPicker.dispose();
            		});
            		for(var i=0;i<inventoryNewNo.typeOption.length;i++){
            			if(self.range_value == inventoryNewNo.typeOption[i].value){
	                        otPicker.pickers[0].setSelectedIndex(i, 100);
	                    }
            		}
            	},260)
            },
            onTargetFilter:function () {
				if(this.range_value!='Overall' && this.range_value!='Goods' && this.range_value){
					_g.openWin({
	                    header: {
	                        data: {
	                            title: '具体范围',
                                typeText:this.inventory_range,
								placeholder:'请输入内容',
                                isInput:false,
                                isShopIn:false,
                                isAddTargetIn:true
	                        },
							template: '../html/main/scan-header-V'
	                    },
	                    name: 'assistant-targetFilter',
	                    url: '../assistant/targetFilter.html',
						pageParam : {
                            title:this.inventory_range,
							type: this.range_value
						},
	                    bounces: false,
	                    slidBackEnabled: false,
	                });
				}
			},
            onSave:function(){//保存数据
               // if(!check()) return false;
               $(".inventoryNewNo-button").attr("disabled",true);
               var _data={
                        storehouse_id:Number(inventoryNewNo.Store_value),
                        batch_type:valueChange(inventoryNewNo.range_value),
                        remark:inventoryNewNo.remark,
                        batch_key_id:Number(inventoryNewNo.specific_id)
                    };
                var _url='/app/auth/erp/stock/saveErpCheckBatch.do';
                var title = '确认保存？';
                var message = '是否确认保存';
                  _g.confirm(title,message,function () {
                        logger.log({"Type":"operation","action":"新增盘点批号确认","Win_name":api.winName,"data":_data});
                        Http.ajax({
                            data:_data,
                            url:_url,
                            api_versions:'v2',
                            success:function(ret){
                                logger.log({"Type":"operation","action":"保存新增盘点批号","Win_name":api.winName,"data":_data,"message":ret,"requireURL":_url})
                                if(ret.success){
                                    if(ret.message=="保存成功"){
                                         _g.toast(ret.message);
                                        tap();
                                    }else{
                                       _g.toast(ret.message);
                                    }
                                }else{
                                    _g.toast(ret.message);
                                }
                            },
                            error:function(err){
                            }

                        });
                });

            },
        }
    });
    var tap=function(){
       api && api.closeWin();
       api && api.sendEvent({
        name:'inventoryCheckBatch-refresh'
       });
    }
    //获取仓库列表
     var getStore=function(){
        var _url='/app/auth/page/erp/erpStorehouseListAll.do';
        Http.ajax({
            data:{},
            url:_url,
            isSync:true,
            api_versions:'v2',
            success:function(ret){
                logger.log({"Type":"operation","action":"新增盘点批号获取仓库列表","Win_name":api.winName,"message":ret,"requireURL":_url})
                 if(ret.success){
                   setTimeout(function(){
                      for(var i=0;i<ret.object.lists.length;i++){
                        inventoryNewNo.storeOption[i]={};
                        inventoryNewNo.storeOption[i].text=ret.object.lists[i].storehouse_name;
                        inventoryNewNo.storeOption[i].value=ret.object.lists[i].storehouse_id;
                        inventoryNewNo.inventoryStore=inventoryNewNo.storeOption[0].text;
                        inventoryNewNo.Store_value=inventoryNewNo.storeOption[0].value;
                      }
                   },0);
                }else{
                    _g.toast(ret.message);
                }
            },
            error:function(err){}
        });
     }
     //保存时盘点范围参数转换
    var valueChange=function(value){
        if(value=="Overall"){
            value='100';
        }else if(value=="Goods"){
            value='103';
        }else if(value=="Category"){
            value='101';
        }else if(value=="Brand"){
            value='102';
        }
        return value;
    }
    // 监听选择范围返回的数据信息
    api.addEventListener && api.addEventListener({
        name: 'choose'
    }, function(ret, err) {
        chooseName = ret.value;
        inventoryNewNo.specific_range = chooseName.key2;
        inventoryNewNo.specific_id = chooseName.key1;
    });
   //保存前的验证
   // var check=function(){
   //  if(!inventoryNewNo.inventory_range){
   //      _g.toast("请选择盘点范围");
   //      return false;
   //  }
   //  if(!inventoryNewNo.specific_range){
   //      _g.toast("请选择具体范围");
   //       return false;
   //  }
   //  return true;
   // }
    getStore();

})
