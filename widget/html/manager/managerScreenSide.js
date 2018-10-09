define(function (require,exports,module) {
    console.log('进入页面-------------------- '); //便于调试
    var Http = require('U/http');
    var isClerkHomeIn = api.pageParam && api.pageParam.opts && api.pageParam.opts.isClerkHomeIn
	var vm = new Vue({
		el:'#managerScreenSide',
		template:_g.getTemplate('manager/managerScreenSide-body-V'),
		data:{
            isClerkHomeIn:!!isClerkHomeIn,
			clerk:"",
			sales_type:"",
			sales_type_id:null,
            brand_id:null,
            class_id:null,
			time:"",
			isBoss:false,
            timeId:null,
            class_level:null
		},
		methods:{
			onMemberAssistant:function(type){
				api.openFrame({
                        name: 'manager-managerScreenList',
                        url: '../manager/managerScreenList.html',
                        rect: {
                            x: 0,
                            y: 0,
                            w: 'auto',
                            h: 'auto'
                        },
                        pageParam: {
                            type:type,
                            sales_type_id:this.sales_type_id,
                            timeId:this.timeId
                        },
                        bounces: false,
                        animation:{
                            type: 'push',
                            subType: 'from_right',
                            duration: 300
                        }
                    });
			},
            onCloseDrawer:function(){
                api.closeDrawerPane && api.closeDrawerPane();
            },
            onReset:function(){
                this.clerk="";
                this.sales_type = "";
                this.sales_type_id = "";
                this.time = "";
                this.class_id=null;
                this.brand_id=null;
                this.class_level=null;
            },
            onAgreeClose:function(){
                api.sendEvent({
                        name: 'manager-saveScreen1',
                        extra: {
                            key1: this.sales_type_id,
                            key2: this.time,
                            key3: this.class_id,
                            key4: this.brand_id,
                            class_level:this.class_level
                        }
                    });

                api.closeDrawerPane && api.closeDrawerPane();
            }
        },
		created:function () {

        },
	});
    //从manager/managerScreenList发来
	api.addEventListener && api.addEventListener({
        name: 'screenList'
    }, function (ret, err) {
        vm.sales_type = ret.value.key1;
        vm.sales_type_id = ret.value.key2;
    });
    //从manager/managerScreenItem发来品牌
    api.addEventListener && api.addEventListener({
        name: 'screenItem'
    }, function (ret, err) {
        vm.sales_type = ret.value.key1;
        vm.brand_id = ret.value.key2;
        vm.sales_type_id = ret.value.key3;
        vm.class_id = null;
        vm.class_level=null;
    });
    //从manager/managerScreenItem发来分类
    api.addEventListener && api.addEventListener({
        name: 'screenItem1'
    }, function (ret, err) {
        vm.sales_type = ret.value.key1;
        vm.class_id = ret.value.key2;
        vm.sales_type_id = ret.value.key3;
        vm.brand_id = null;
        vm.class_level=ret.value.class_level;
    });
    //从manager/managerScreenItem发来
    api.addEventListener && api.addEventListener({
        name: 'screenItemAll'
    }, function (ret, err) {
        vm.sales_type = "全部品牌";
        vm.sales_type_id = "002";
        vm.brand_id =null;
        vm.class_id = null;
        vm.class_level=null;
    });
    //从manager/managerScreenItem发来
    // api.addEventListener && api.addEventListener({
    //     name: 'screenItemPAll'
    // }, function (ret, err) {
    //     vm.sales_type = "全部品类";
    //     vm.sales_type_id = "003";
    //     vm.class_id = null;
    //     vm.brand_id = null;
    // });
    //从manager/managerScreenList发来
    api.addEventListener && api.addEventListener({
        name: 'managerSideTime'
    }, function (ret, err) {
        vm.time = ret.value.key1;
    });
    //从manager/managerScreenList发来
    api.addEventListener && api.addEventListener({
        name: 'screenTimeList'
    }, function (ret, err) {
        vm.timeId = ret.value.key1;
    	var date = new Date();
    	var today = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    	if(ret.value.key1==1){
       		vm.time = today;
        }else if(ret.value.key1==0){
        	date.setTime(date.getTime()-24*60*60*1000);
        	vm.time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"至"+today;
        }else if(ret.value.key1==7){
        	date.setTime(date.getTime()-24*60*60*1000*7);
        	vm.time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"至"+today;
        }
        else if(ret.value.key1==30){
        	date.setTime(date.getTime()-24*60*60*1000*30);
        	vm.time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"至"+today;
       	}
    })

})
