define(function(require, exports, module) {
    var Http = require('U/http');
    var Chart = require("U/chart");
    var name = ['费用A','费用B','费用B','费用B','费用B','费用B'];
    var data = [1, 1.63,2,4,5,3];
    var vm = new Vue({
        el: '#costChart',
        template: _g.getTemplate('cost/costChart-body-V'),
        data: {
        	type:1
        },
        methods:{
        	onSelec:function(i){
               this.type=i;
        	}
        }
    });
    Chart.bar(name,data);
    module.exports = {};
});
