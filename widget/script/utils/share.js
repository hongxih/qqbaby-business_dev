/**
 * [description] 初始化分享模块,wx和QQ分享
 * @author libinpeng
 * @version v1.0
 */
define(function(require, exports, module) {
    module.exports = {
        dialogBox: api && api.require('dialogBox'),
        qq: api && api.require('qq'),
        wx: api && api.require('wx'),
        init:function (){
            var self = this;
            this.dialogBox.actionMenu ({
                rect:{
                    h: 170,
                },
                texts:{
                     cancel: '取消'
                },
                items:[
                {
                    text: '微信',
                    icon: 'widget://image/store/share_wx.png'
                },
                {
                    text: 'QQ好友',
                    icon: 'widget://image/store/share_qq.png'
                }
                ],
                styles:{
                    bg:'#FFF',
                    column: 2,
                    itemText: {
                        color: '#000',
                        size: 12,
                        marginT:8
                    },
                    itemIcon:{
                        size:60
                    },
                    cancel:{
                        bg: 'fs://icon.png',
                        color:'#000',
                        h: 44 ,
                        size: 14
                    }
                },
                tapClose:true,
            }, function(ret){
                if(ret.eventType == 'cancel'){
                    self.dialogBox.close({
                        dialogName:'actionMenu'
                    });
                };
                if(ret.index == 0){
                    self.share2wx();
                    self.dialogBox.close({
                        dialogName:'actionMenu'
                    });
                }else if(ret.index == 1){
                    self.share2QQ();
                    self.dialogBox.close({
                        dialogName:'actionMenu'
                    });
                }
            });
        },
        share2QQ:function (){
            var self = this;
            self.qq.installed(function(ret, err) {
                if (ret.status) {
                    self.qq.shareImage({
                        title: '千牵商户助手',
                        description: '千牵商户助手-采购订单',
                        imgPath: 'fs://share.png',
                        type: 'QFriend'
                    },function(ret, err){
                        if (ret.status) {
                            // alert('分享成功');
                        } else {
                            // alert(JSON.stringify(err));
                        }
                    });
                } else {
                    _g.toast('您还没有安装QQ客户端');
                }
            });
        },
        share2wx: function(){
            var self = this;
            self.wx.isInstalled(function(ret, err){
                if(ret.installed){
                self.wx.shareImage({
                    apiKey: 'wxadab294bd0c8c170',
                    scene: 'session',
                    thumb: 'fs://share_thumb.png',
                    contentUrl: 'fs://share.png'
                }, function(ret, err) {
                    if (ret.status) {
                        // alert('分享成功');
                    } else {
                        // alert(JSON.stringify(err));
                    }
                });
                }else{
                    _g.toast('您还没有安装微信客户端');
                }
            });
        }
    };
});
