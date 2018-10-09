define(function (require, exports, module) {
	console.log('进入页面-------------------- '); //便于调试
	var Http = require('U/http');

	var dtPicker = new mui.DtPicker({
        beginDate: new Date(1900, 1, 1),
        type: 'date'
    });
	var otPicker = new mui.PopPicker();
	var entId=api.pageParam.uId;
	var vm = new Vue({
		el: '#editMemberInformation',
		template: _g.getTemplate('member/editMemberInformation-body-V'),
		data: {
			btnShow: true,
			clerkName:'',//无接口
			phone: '',
			uName: '',
			uSex: '',
			uLevel: '',
			cartId: '',//会员卡号
			uBirthday: '',
			referee: '',
			uLevelId:'',//会员ID
			memberOld:'',
			babyList: [
                {
                    bodyNumber: '大宝',//大宝，二宝，三宝
                    bName: '',
                    bSex: null,
                    bBirthday: '',
                    bFeeding: ''
                }
            ]
		},
		created: function () {

		},
		watch: {},
		filters: {
			toBabyNumberName: function (val) {
				var arr=['大宝','二宝','三宝'];
				return arr[val];
			}
		},
		methods: {
			addBobyInfo: function () {
				var bData = {};
                var num = this.babyList.length;
                var arr = ['二宝', '三宝']
                bData.bName = '';
                bData.bSex = null;
                bData.bBirthday = '';
                bData.bFeeding = '';
                bData.bodyNumber = arr[num - 1];
                this.babyList.push(bData);
                if (num === 2) this.btnShow = false;

			},
			onSelectDate: function (type) {
				var self = this;
				dtPicker.show(function (selectItems) {
					if (type.toString() == 'babyBrithday') {
						self[type.toString()] = selectItems.value;
					}
				});
			},
			selectLevel: function(){
                var self = this;
                var otPicker = new mui.PopPicker();
                otPicker.setData(levelData);
                otPicker.show(function(selectItem){
                    self.uLevel = selectItem[0].text;
                    self.uLevelId = selectItem[0].value;
                    otPicker.dispose();
                });
            },
			onMemDate: function (type) {
				dtPicker.show(function (selectItems) {
					this[type] = selectItems.value;
					this.memberOld = getMemberOld(this[type])
				}.bind(this));
			},
			onSelectDate: function (type, ind) {
				var strB = type.split(".")[1]
				var strL = type.split('[')[0];
				dtPicker.show(function (selectItems) {
					this[strL][ind][strB] = selectItems.value;
				}.bind(this));
			},
			onChooseSex:function(sex){
				if(sex==1){
					this.uSex=1;
				}else{
					this.uSex=0;
				}
			},
			onSubmit: function () {
				if(isNaN(this.cartId)){
                    _g.toast("卡号应为数字")
                    return false;
                }
                if(this.phone==""){
                    _g.toast("会员手机不能为空！")
                    return false;
                }
                if(!(/^1[0-9]{10}$/.test(this.phone))){
                    _g.toast('手机号格式错误')
                    return false;
                }
                if(this.uSex==null){
                    _g.toast("会员性别不能为空")    
                    return false;
                }
                if(this.phone.length!=11){
                    _g.toast("手机号应为11位")
                }
                if(this.uLevel==""){
                    _g.toast("会员等级不能为空！")
                    return false;
                }
                if(this.uName==""){
                    _g.toast("会员名称不可为空！")
                    return false;
                }
				// var data = {
				// 		birthday: this.uBirthday,
				// 		card_no: this.cartId,
				// 		phone: this.phone,
				// 		referee_name: this.referee,
				// 		sex: this.uSex,
				// 		user_level_id:this.uLevelId,
				// 		user_name: this.uName,
				// 		user_id:entId,
				// 		baby_list: this.getItemList(this.babyList)
				// };
				// console.log(data);
				var _data= {
						birthday: this.uBirthday,
						card_no: this.cartId,
						phone: this.phone,
						referee_name: this.referee,
						sex: this.uSex,
						user_level_id:this.uLevelId,
						user_name: this.uName,
						user_id:entId,
						baby_list: this.getItemList(this.babyList)
						};
				var _url='/app/auth/crm/user/editCrmUser.do';
				Http.ajax({
					data:_data,
					api_versions: 'v2',
					url:_url,
					success: function (res) {
						logger.log({"Type":"operation","action":"保存会员数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
						if(res.code==200){
							api && api.closeWin();
							api.sendEvent({
                                name: 'refresh-editMember',
                            });
						}else{
							_g.toast(res.message);
						}
					},
					error: function (err) {
						_g.hideProgress();
					}
				})
			},

			getItemList: function (res) {
				return _.map(res, function (item) {
					return {
						baby_name: item.bName,
						baby_id:item.baby_id,
						baby_sex: item.bSex,
						birthday: item.bBirthday,
						feeding_pattern:item.bFeeding?"00" + item.bFeeding:"00"
					}
				})
			}
		}
	});

	!function () {
		api.addEventListener && api.addEventListener({
			name: 'save-editMemberInfo'
		}, function (ret, err) {
			vm.onSubmit();
			// api && api.closeWin();
		});
	}()

	var getData = function (opts, callback) {
		var opts = opts || {};
		var _data= {
				user_id: entId,
			};
		var _url='/app/auth/crm/user/getDetail.do';
		Http.ajax({
			data:_data,
			api_versions: 'v2',
			url:_url,
			success: function (res) {
				logger.log({"Type":"operation","action":"编辑会员信息页面获取数据","Win_name":api.winName,"data":_data,"message":res,"requireURL":_url})
				if (res.code == 200) {
					if (res.object === null) return;
					var obj = res.object;
					vm.clerkName = '薛小姐';//无接口
					vm.phone = obj.phone;
					vm.cartId = obj.card_no;//会员卡号
					vm.uName = obj.user_name;
					vm.uSex = obj.sex;
					vm.memberOld = getMemberOld(obj.birthday);//本地转换
					vm.uLevel = obj.user_level_name;
					vm.uLevelId = obj.user_level_id;
					vm.uBirthday = obj.birthday;
					vm.referee = obj.referee_name;
					vm.babyList = getItemList(obj.baby_list);
					if(vm.babyList.length>=3){
						vm.btnShow = false;
					}else{
						vm.btnShow = true;
					}
				} else {
					_g.toast(res.message);
				}
			},
			error: function (err) {
				_g.hideProgress();
			}
		})
	};
	getData();
	var getItemList = function (res) {
		return _.map(res, function (item,i) {
			return {
				bName: item.baby_name,
				baby_id:item.baby_id,
                bSex: item.baby_sex,
                bBirthday: item.birthday,
                bFeeding: item.feeding_pattern?item.feeding_pattern.split("")[2]:""
			}
		})
	};
    var getLevelData = function(){
    	var _url='/app/auth/crm/user/listCrmUserLevel.do';
        Http.ajax({
            url:_url,
            data: {},
            api_versions: 'v2',
            success: function(ret){
            	 logger.log({"Type":"operation","action":"获取会员等级","Win_name":api.winName,"message":ret,"requireURL":_url})
                if(ret.success){
                    levelData = _.map(ret.object, function(item){
                        return {
                            value: item.user_level_id,
                            text: item.user_level_name
                        };
                    });
                    levelData.reverse();
                }else{
                    _g.toast(ret.message);
                }
            }
        });
    };
    getLevelData();
	var getMemberOld = function(res){
		if(res){
			var selfYear = res.split("-")[0];
			var num = selfYear.split("");
			return num[2]+"0后";
		}
	};
	module.exports = {};
});
