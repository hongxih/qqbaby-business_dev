define(function(require, exports, module) {

    module.exports = {
        weekOver : false,
        formatTime : function(type){
            return _.map(this.transDateRange(type).split('-'), function(value){
                return value.length >= 2 ? value : '0'+value;
            }).join('-');
        },
    // 起始日期，区间
        transDateRange : function(type){
            var now = new Date();
            if(type === 'DAY'){
                return now.Format('yyyy-MM-dd');
            }else if(type === 'WEEK'){
                var timeStamp = now.getTime() - (24*60*60*1000)*(now.getDay() == 0 ? 6 : (now.getDay()-1));
                var weekDate = new Date(timeStamp);
                return weekDate.getFullYear()+'-'+this.formatDay((weekDate.getMonth() + 1))+'-'+weekDate.getDate();
            }else if(type === 'MONTH'){
                return now.getFullYear()+'-'+this.formatDay((now.getMonth() + 1))+'-01';
            }
        },
        //传入时间戳进行时间调整(类型,要的时间戳，当前时间戳)
        getCurrentTime : function(type,currentTime,addOrSubtract){
            var stamp,
                weekDate,
                startTime,
                endDate,
                endTime;

            stamp = this.getStartStamp(type,currentTime,addOrSubtract);
            weekDate = new Date(stamp);
            startTime = weekDate.getFullYear()+'-'+this.formatDay((weekDate.getMonth() + 1))+'-'+this.formatDay(weekDate.getDate());

            endDate = new Date(Number(this.getEndStamp(type,stamp)));
            endTime = endDate.getFullYear()+'-'+this.formatDay((endDate.getMonth() + 1))+'-'+this.formatDay(endDate.getDate());
            return startTime + '|' + endTime + '|' + stamp;
        },

        //返回所需开始时间戳
        getStartStamp : function(type,currentTime,addOrSubtract){
            switch (type){
                case 'DAY':
                    currentTime -=  (24*60*60*1000)*[(addOrSubtract == 'add' ? -1 : (addOrSubtract == 'subtract' ? 1 : 0))];
                    break;
                case 'WEEK':
                    var day = new Date(Number(currentTime)).getDay();
                    currentTime -= (24*60*60*1000)*[(day == 0 ? 6 : (day - 1)) + (addOrSubtract == 'add' ? -7 : (addOrSubtract == 'subtract' ? 7 : 0))];
                    break;
                case 'MONTH':
                    //返回月份第一天时间戳
                    var dt = new Date(currentTime);
                    dt.setDate(1);
                    dt.setMonth(dt.getMonth() + (addOrSubtract == 'add' ? 1 : (addOrSubtract == 'subtract' ? -1 : 0)));
                    currentTime = new Date(dt.getTime());
                    break;
            }
            return currentTime;
        },
        //返回所需结束时间戳
        getEndStamp : function(type,currentTime){
            var endTimeStamp = null;
            switch (type){
                case 'DAY':
                    endTimeStamp = currentTime;
                    break;
                case 'WEEK':
                    endTimeStamp = currentTime + (24*60*60*1000)*6;
                    break;
                case 'MONTH':
                    //返回月份第一天时间戳
                    var dt = new Date(currentTime);
                    dt.setMonth(dt.getMonth() + 1);
                    endTimeStamp = new Date(dt.getTime() - 24*60*60*1000);
                    break;
            }
            return endTimeStamp;
        },

        //格式化日期
        formatDay : function(time){
            time = Number(time);
            return time < 10 ? '0' + time : time;
        },

        //取今天和七天前时间格式，如：今天2017-02-10 23:59:59，七天前2017-02-04 00:00:00
        getToday:function () {
            var today;
            today = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).Format("yyyy-MM-dd hh:mm:ss");
            return today;
        },

        getLastWeek:function () {
            var lastWeek;
            lastWeek = new Date(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000 * 6).Format("yyyy-MM-dd hh:mm:ss");
            return lastWeek;
        },
    }

});

