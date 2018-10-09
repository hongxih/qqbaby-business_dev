// define(function(require, exports, module) {

    // var Http = require('U/http');
;!function(win, doc){

    var config = {
    	title: '订货单-广州千牵有限公司',
    	orderType: {
    		'orderType': '已审核',
    		'orderNumber': '1223333333333',
    		'orderTime': '2017-1-1 14:03:20',
    		'orderNo': '1234',
    		'orderPrice': '1,000,000'
    	},
        contact: {
            addr: '广东省广州市天广东省广州市天广东省广州市天',
            name: '王思聪',
            phone: '13088888888',
        },
        goods: [{
            product_name: '婴儿奶瓶',
            bar_code: '11111113',
            sku_name: '灌装,800g',
            buy_amount: 10,
            give_amount: 0,
            retail_price: 1000,
            total_retail_price: 2000,
            remark: '备注'
        },
        {
            product_name: '婴儿奶瓶',
            bar_code: '11111113',
            sku_name: '灌装,800g',
            buy_amount: 10,
            give_amount: 0,
            retail_price: 1000,
            total_retail_price: 2000,
            remark: '备注'
        }

        ],
        supplier:{
            contact: '王思聪',
            supplier_name: '奶粉供应商',
            contact_address: '广东省广州市天河区科韵路8号广东省广州市天河区科韵路8号',
            contact_phone: '13509090909',
        },
        maker: '王健林'
    };
    var orderText = ['订单状态', '订单号', '订货日期', '订货总数', '进货价总额'];
    var contact = ['联系人', '送货地址', '联系人', '手机'];

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var width = window.innerWidth;
    var height = 630 + config.goods.length * 250;
    var supplier_top = 356 + config.goods.length * 240 + 20;
    canvas.width = width;
    canvas.height = height;

    // 重置背景色
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // title
    ctx.font = 'bold 16px 苹方';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(config.title, width/2, 91/4);
    ctx.fillText(config.title, 0, 100);


    // 订单状态
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 91/2, width, 310/2);
    for(var i=0; i<orderText.length; i++){
        drawText(ctx, orderText[i], 90, 60+i*28,{textAlign: 'right', fillStyle: '#999999'});
    }
    drawText(ctx, config.orderType.orderType, 110, 60);
    drawText(ctx, config.orderType.orderNumber, 110, 88);
    drawText(ctx, config.orderType.orderTime, 110, 116);
    drawText(ctx, config.orderType.orderNo, 110, 144);
    drawText(ctx, config.orderType.orderPrice, 110, 172);

    // 联系人
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 210, width, 310/2);
    for(var i=0; i<contact.length; i++){
        if(i >= 2){
            drawText(ctx, contact[i], 90, 230+i*28+28, {textAlign: 'right'});
        }else{
            drawText(ctx, contact[i], 90, 230+i*28, {textAlign: 'right'});
        }
    }
    // drawText(ctx, config.contact.addr, 110, 258);
    if(ctx.measureText(config.contact.addr).width > (width - 110)){
        var textUnit = ctx.measureText(config.contact.addr.substring(0,1)).width;
        var subStr =  Math.floor((width - 110)/textUnit);
        drawText(ctx, config.contact.addr.substring(0, subStr), 110, 258);
        drawText(ctx, config.contact.addr.substring(subStr), 110, 286);
    }else{
        drawText(ctx, config.contact.addr, 110, 258);
    }
    drawText(ctx, config.contact.name, 110, 314);
    drawText(ctx, config.contact.phone, 110, 342);


    // 商品信息
    for(var i=0; i<config.goods.length; i++){
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 375 + i*240, width, 230);
        drawText(ctx, (i + 1) + '. ' + config.goods[i].product_name, 20, 375 + 18 + i*240);
        drawText(ctx, config.goods[i].bar_code, 20, 375 + 43 + i*240);
        drawText(ctx, config.goods[i].sku_name, 20, 375 + 68 + i*240);
        drawText(ctx, '数量: ' + config.goods[i].buy_amount, 20, 375 + 93 + i*240);
        drawText(ctx, '赠送: ' + config.goods[i].give_amount, 20, 375 + 118 + i*240);
        drawText(ctx, '进货价: ' + config.goods[i].retail_price, 20, 375 + 143 + i*240);
        drawText(ctx, '进货价小计：' + config.goods[i].total_retail_price, 20, 375 + 168 + i*240);
        drawText(ctx, '备注: ' + config.goods[i].remark, 20, 375 + 193 + i*240);
    }




    // 供应商

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, supplier_top, width, 170);
    drawText(ctx, '供应商', 20, supplier_top + 18);
    drawText(ctx, '供应商名称     ' + config.supplier.supplier_name, 20, supplier_top + 43);
    // drawText(ctx, '地址     ' + config.supplier.contact_address, 20, supplier_top + 68);
    drawText(ctx, '联系人     ' + config.supplier.contact, 20, supplier_top + 113);
    drawText(ctx, '手机     ' + config.supplier.contact_phone, 20, supplier_top + 138);

    if(ctx.measureText(config.supplier.contact_address).width > (width - 20)){
        var textUnit = ctx.measureText(config.supplier.contact_address.substring(0,1)).width;
        var subStr =  Math.floor((width - 110)/textUnit);
        drawText(ctx, '地址     ' + config.supplier.contact_address.substring(0, subStr), 20, supplier_top + 68);
        drawText(ctx, '         ' + config.supplier.contact_address.substring(subStr), 20, supplier_top + 93);
    }else{
        drawText(ctx, '地址     ' + config.supplier.contact_address, 20, supplier_top + 68);
    }



    // 制单人
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, supplier_top + 180, width, 50);
    drawText(ctx, '制单人:    ' + config.maker, 20, supplier_top + 198);






    function drawText(ctx, text, xAxis, yAxis, param){
        var param = param || {};
        var _opts = {
            fillStyle: '#cccccc',
            font: '16px sans-serif',
            textAlign: 'left',
            textBaseline: 'top',
        };
        for(var key in _opts){
            if(typeof param[key] === 'undefined'){
                param[key] = _opts[key];
            }
        }
        for(var key in param){
            ctx[key] = param[key];
        }
        // console.log(param);
        ctx.fillText(text, xAxis, yAxis);
        ctx.strokeText(text, xAxis, yAxis);
    }

}(window, document);

// });
