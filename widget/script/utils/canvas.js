/**
 * [description] canvas生成分享图片
 * @author libinpeng
 * @version v1.0
 */
define(function(require, exports, module) {
	var trans = api && api.require('trans');


    var config = {
        title: '订货单-广州千牵有限公司',
        orderType: {
            'orderType': '已审核',
            'orderNumber': 'PO1223333333333',
            'orderTime': '2017-01-01',
            'orderNo': '20',
            'orderPrice': '1,000.00'
        },
        contact: {
            addr: '广东省广州市天河区建中路60号5楼千牵科技有限公司',
            name: '王思聪',
            phone: '13088888888',
        },
        goods: [{
            product_name: '婴儿奶瓶',
            bar_code: '11111113',
            sku_name: '900g',
			unit: '听',					//增加单位
            buy_amount: 10,
            give_amount: 1,
            retail_price: 398.00,
            total_retail_price: 3980.00,
            remark: '备注'
        },
        {
            product_name: '婴儿奶瓶',
            bar_code: '11111113',
            sku_name: '罐装,800g',
			unit: '听',
            buy_amount: 10,
            give_amount: 0,
            retail_price: 1000.00,
            total_retail_price: 2000.00,
            remark: '广东省广州市天河区建中路60号5楼千牵科技有限公司'
        }

        ],
        supplier:{
            contact: '王思聪',
            supplier_name: '奶粉供应商',
            contact_address: '广东省广州市天河区建中路60号5楼千牵科技有限公司',
            contact_phone: '13509090909',
        },
        maker: '王健林'
    };
    var orderText = ['订货单号', '订货日期', '订货总数', '进货总额'];
    var contact = ['送货地址', '联系人', '联系电话'];
	var supplier = ['供应商名称', '联系人', '联系电话', '地址'];

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    function initImg(config,type,callback){
		var pageLeftPadding = 80, 		//页面左边距
			pageRightPadding = 30,		//页面右边距
			headerHeight = 88, 			//标题栏高度
			topPadding = 24, 			//栏目上边距
			bottomPadding = 9,			//栏目下边距
			leftPadding = pageLeftPadding + 1 + 20,	//栏目左边距，包含页面左边距
			rowHeight = 37, 			//行高
			itemHeight = 247;			//商品项高度

		var width = 640;	//window.innerWidth;				//页面宽度
		var height;

		//为兼容微信分享模块缩略图超出大小问题，生成两种图片，定义type：0 代表分享图，1 代表缩略图（缩略图高度固定，只显示部分，分享图为全图）
		if(type === 0){
			height = 790 + headerHeight + config.goods.length * (itemHeight + 20);	//页面高度
		}else if(type === 1){
			height = 790 + headerHeight;	//页面高度
		}

		var contentWidth = width - pageLeftPadding - pageRightPadding;
		var currentTop = 0;

        canvas.width = width;
        canvas.height = height;

        // 重置背景色
        ctx.fillStyle = '#f3fafa';
        ctx.fillRect(0, 0, width, height);

		//return;
        // 标题
        ctx.font = 'bold 28px 苹方';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
		ctx.fillStyle = '#4cbdbe';
        ctx.fillText(config.title, width/2, headerHeight / 2);

		currentTop += headerHeight + 1; //当前高度

		var arcX = new Array();
		arcX.push(currentTop + (topPadding + bottomPadding + rowHeight * 4) / 2);

        // 订单状态
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pageLeftPadding + 1, currentTop, width - pageLeftPadding - pageRightPadding,
			topPadding + bottomPadding + rowHeight * 4);
        for(var i=0; i<orderText.length; i++){
            drawText(ctx, orderText[i], leftPadding + 110, currentTop + topPadding
				+ i*rowHeight, {textAlign: 'right', fillStyle: '#000'});
        }
        drawText(ctx, config.orderType.orderNumber, leftPadding + 110 + 30, currentTop + topPadding);
        drawText(ctx, config.orderType.orderTime, leftPadding + 110 + 30, currentTop + topPadding + rowHeight);
        drawText(ctx, config.orderType.orderNo, leftPadding + 110 + 30, currentTop + topPadding + rowHeight*2);
        drawText(ctx, config.orderType.orderPrice, leftPadding + 110 + 30, currentTop + topPadding + rowHeight*3);

		currentTop += topPadding + bottomPadding + rowHeight * 4 + 20 + 1;

		//送货地
		arcX.push(currentTop + (topPadding + bottomPadding + rowHeight * 4 + 60) / 2);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pageLeftPadding + 1, currentTop + 1, width - pageLeftPadding - pageRightPadding,
			topPadding + bottomPadding + rowHeight * 4 + 60);

		drawText(ctx, '送货地',pageLeftPadding + (contentWidth / 2), currentTop + 13,
			{textAlign: 'center', font: '28px 苹方', fillStyle: '#000'});
		ctx.beginPath();
		ctx.strokeStyle = '#808080';
		ctx.lineWidth = 1;
		ctx.moveTo(pageLeftPadding + 1, currentTop + 60);
		ctx.lineTo(pageLeftPadding + contentWidth, currentTop + 60);
		ctx.stroke();

		currentTop += 60 + 1;

        for(var i=0; i<contact.length; i++){
            drawText(ctx, contact[i], leftPadding + 110, currentTop +
				topPadding + (i+((i == 0)?0:1))*rowHeight, {textAlign: 'right', fillStyle: '#000'});
        }

		drawText(ctx, config.contact.addr, leftPadding + 110 + 30, currentTop + topPadding);
        drawText(ctx, config.contact.name, leftPadding + 110 + 30, currentTop + topPadding + + rowHeight*2);
        drawText(ctx, config.contact.phone, leftPadding + 110 + 30, currentTop + topPadding + rowHeight*3);
		currentTop += topPadding + bottomPadding + rowHeight * 4 + 20 + 1;

        // 商品信息
        for(var i=0; i<config.goods.length; i++){
			arcX.push(currentTop + itemHeight / 2);

			ctx.fillStyle = "#ffffff";
            ctx.fillRect(pageLeftPadding + 1, currentTop, width - pageRightPadding - pageLeftPadding, itemHeight);

            drawText(ctx, (i + 1) + '. ' + config.goods[i].product_name, leftPadding + 20 ,
				currentTop + topPadding , {fillStyle:'#000'});
			drawText(ctx, '条码: ' + config.goods[i].bar_code, leftPadding + 40, currentTop + topPadding + rowHeight);
            drawText(ctx, '规格: ' + config.goods[i].sku_name, leftPadding + 293, currentTop + topPadding + rowHeight);
			if (config.goods[i].give_amount > 0) {
            	drawText(ctx, '赠送: ' + config.goods[i].give_amount + ' ' + config.goods[i].unit,
					leftPadding + 40, currentTop + topPadding + rowHeight*2);
			}
			drawText(ctx, '数量: ' + config.goods[i].buy_amount + ' ' + config.goods[i].unit,
				leftPadding + 293, currentTop + topPadding + rowHeight*2, {fillStyle:'#000'});
            drawText(ctx, '进货价: ' + config.goods[i].retail_price, leftPadding + 40, currentTop + topPadding + rowHeight*3);
            drawText(ctx, '小计: ' + config.goods[i].total_retail_price, leftPadding + 293, currentTop + topPadding + rowHeight*3);
            drawText(ctx, '备注: ' + config.goods[i].remark, leftPadding + 40, currentTop + topPadding + rowHeight*4);
			currentTop += itemHeight + 20 + 1;
        }

        // 供应商
		arcX.push(currentTop + (topPadding + bottomPadding + rowHeight * 5) / 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pageLeftPadding + 1, currentTop, width - pageRightPadding - pageLeftPadding,
			topPadding + bottomPadding + rowHeight*5);

		for(var i=0; i < supplier.length; i++){
			drawText(ctx, supplier[i], leftPadding + 110, currentTop + topPadding
				+ i*rowHeight, {textAlign: 'right', fillStyle: '#000'});
		}

        drawText(ctx, config.supplier.supplier_name, leftPadding + 110 + 30, currentTop + topPadding);
        drawText(ctx, config.supplier.contact, leftPadding + 110 + 30, currentTop + topPadding + rowHeight);
        drawText(ctx, config.supplier.contact_phone, leftPadding + 110 + 30, currentTop + topPadding + rowHeight*2);
		drawText(ctx, config.supplier.contact_address, leftPadding + 110 + 30, currentTop + topPadding + rowHeight*3);

		currentTop += topPadding + bottomPadding + rowHeight*5 + 20 + 1;

		arcX.push(currentTop + (topPadding + bottomPadding + rowHeight) / 2);

        // 制单人
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pageLeftPadding + 1, currentTop, width - pageRightPadding - pageLeftPadding,
			topPadding + bottomPadding + rowHeight);
		drawText(ctx, '制单人', leftPadding + 110, currentTop + topPadding
			, {textAlign: 'right', fillStyle: '#000'});
        drawText(ctx, config.maker, leftPadding + 110 + 30, currentTop + topPadding);

		//画左边辅助线
		ctx.beginPath();
		ctx.strokeStyle = "#e9f4f4";
		ctx.lineWidth = 2;
		ctx.moveTo(pageLeftPadding / 2, arcX[0]);
		ctx.lineTo(pageLeftPadding / 2, arcX[arcX.length-1]);
		ctx.stroke();

		//画视觉导航圆点
		ctx.fillStyle = "#f3fafa";
		ctx.strokeStyle = "#4cbdbe"
		for (var i = 0; i < arcX.length; i++){
			ctx.beginPath();
			ctx.fillRect(pageLeftPadding / 2 - 1, arcX[i] - 16, 2, (6+10)*2);	//用背景颜色刷掉一段线的颜色，让圆与线之间有10像素的间隙
			ctx.arc(pageLeftPadding / 2, arcX[i], 6, 0, 2*Math.PI);
			ctx.stroke();
		}

        callback && callback();
    }

    function drawText(ctx, text, xAxis, yAxis, param){
		var param = param || {};
        var _opts = {
            fillStyle: '#808080',
            font: '22px 苹方',
            textAlign: 'left',
            textBaseline: 'top'
        };
        for(var key in _opts){
            if(typeof param[key] === 'undefined'){
                param[key] = _opts[key];
            }
        }
        for(var key in param){
            ctx[key] = param[key];
        }

        var lineWidth = 0;
        var initHeight = yAxis;
        var canvasWidth = 640 - 30;
        var lastSubStrIndex = 0;

        for (var i = 0; i < text.length; i++){
    		lineWidth += ctx.measureText(text[i]).width;
            if (lineWidth > canvasWidth - xAxis){
          	    ctx.fillText(text.substring(lastSubStrIndex,i), xAxis, initHeight);
                initHeight += 34;
                lineWidth = 0;
                lastSubStrIndex = i;
            }

        	if (i == text.length - 1){
        		ctx.fillText(text.substring(lastSubStrIndex,i+1), xAxis,initHeight);
        	}
        }
    }

    // 生成图片储存到本地widget://
	function saveImage(param,type){
		var _imgName;
		if(type === 0){
			_imgName = 'share.png';
		}else if(type === 1){
			_imgName = 'share_thumb.png'
		}
		trans.saveImage({
		    base64Str: canvas.toDataURL("image/png").replace('data:image/png;base64,', ''),
		    album: false,
		    imgPath: 'fs://',
		    imgName: _imgName
		}, function(ret, err) {
		    if (ret.status) {
		        // share.init();
		    } else {
		        alert(JSON.stringify(err));
		    }
		});
	}
    module.exports = {
        init: function(param,type){
                initImg(param,type,function(){
                saveImage(param,type);
             });
        }
    }

})
