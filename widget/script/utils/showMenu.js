/**
 * [description] 下拉菜单
 * @author sunzhibin
 * @version v1.0
 */
define(function(require, exports, module) {
    var mnPopups = api && api.require('MNPopups');
    module.exports = {
        /*opts:[{
                    title: '单品',
                    icon: 'widget://image/store/costCheck01.png'
                },]
        */
        showMenu:function (opts,callback) {
            mnPopups.open({
                rect: {
                    w: 100,
                    h: 160
                },
                position: {
                    x: 58,
                    y: 54
                },
                styles: {
                    mask: 'rgba(0,0,0,0.2)',
                    bg: 'rgba(0,0,0,0.7)',
                    corner: 5,
                    cell: {
                        bg: {
                            normal: 'rgba(255,255,255,0)',
                            highlight: 'rgba(124,124,124,0.5)'
                        },
                        h: 38,
                        title: {
                            marginL: 35,
                            color: '#fff',
                            size: 13,
                        },
                        icon: {
                            marginL: 8,
                            w: 14,
                            h: 14,
                            corner: 0
                        },
                        separateLine: {              //（可选项）JSON 类型；分割线的样式设置
                            width: 0,                //（可选项）数字类型；分割线的粗细，默认为1
                            marginLR: 0,              //（可选项）数字类型；分割线距离左右的间距，默认为0
                            bg: 'rgba(255,255,255,0)',           //（可选项）字符类型；分割线的背景颜色，支持rgb、rgba、#；默认：#C0C0C0 
                            hideLastSeparateLine: true //(可选项)布尔类型；是否隐藏最后一条分割线，默认false                    
                        }
                    },
                    pointer: {
                        size: 10,
                        xPercent: 14,
                        yPercent: 0,
                        orientation: 'downward'
                    }
                },
                datas: opts,
                animation: false,
            }, function(ret) {
                if(ret.eventType == 'click'){
                    callback(ret);
                }else{
                    return;
                }
            });
        }         	
    };
});
