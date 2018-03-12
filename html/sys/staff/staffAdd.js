var addCheckLoginName = false;
(function($) {
    $.fn.bootstrapValidator.validators.loginNameCheck = {
        html5Attributes: {
            message: 'message',
            field: 'field'
        },
        validate: function(validator, $field, options) {
            return true;
        }
    };
}(window.jQuery));
var staffAddCheckValidator = {
	message : 'This value is not valid',
	feedbackIcons : {
		valid : 'glyphicon glyphicon-ok',
		invalid : 'glyphicon glyphicon-remove',
		validating : 'glyphicon glyphicon-refresh'
	},
	fields : {
		loginName : {
			validators : {
				notEmpty : {
					message : '请输入账号'
				},
				stringLength : {
					min : 0,
					max : 20,
					message : '请输入不超过20个字符'
				},
				regexp : {
					regexp : /^[a-zA-Z0-9_\-\.]+$/,
					message : '用户名由数字字母-_和.组成'
				},
				loginNameCheck : {
					message : '账号已经被占用'
				}
			}
		},
		passwd : {
			validators : {
				notEmpty : {
					message : '请输入密码'
				},
				stringLength : {
					min : 3,
					max : 20,
					message : '请输入3~20个字符'
				}
			}
		},
		staffName : {
			validators : {
				notEmpty : {
					message : '请输入人员姓名'
				},
				stringLength : {
					min : 0,
					max : 15,
					message : '请输入不超过15个字'
				}
			}
		},
		orgName : {
			validators : {
				notEmpty : {
					message : '请选择所属组织'
				}
			}
		},
		empCode : {
			validators : {
				regexp : {
					regexp : /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
					message : '请输入15或18位身份证号'
				}
			}
		},
		email : {
			validators : {
				emailAddress : {
					message : '请检查Email拼写'
				},
				stringLength : {
					min : 0,
					max : 50,
					message : '请输入不超过50个字符'
				}
			}
		},
		postcode : {
			validators : {
				regexp : {
					regexp : /^[0-9]+$/,
					message : '请检查邮政编码'
				},
				stringLength : {
					min : 0,
					max : 6,
					message : '请输入不超过6位数字'
				}
			}
		},
		mailAddr : {
			validators : {
				stringLength : {
					min : 0,
					max : 20,
					message : '请输入不超过20个字符'
				}
			}
		},
		phone : {
			validators : {
				regexp : {
					regexp : /(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8]{1}[0-9]{9})/,
					message : '请检查电话是否正确'
				}
			}
		},
		mobilPhone : {
			validators : {
				notEmpty : {
					message : '请输入手机号'
				},
				stringLength : {
					min : 11,
					max : 11,
					message : '请输入11位手机号码'
				},
				regexp : {
					regexp : /^1[3|5|7|8]{1}[0-9]{9}$/,
					message : '请输入正确的手机号码'
				}
			}
		},
		staffSort : {
			validators : {
				stringLength : {
					min : 0,
					max : 8,
					message : '请输入不超过8位数字'
				},
				regexp : {
					regexp : /^[0-9]+$/,
					message : '排序只能输入数字'
				}
			}
		}
	},
	submitHandler : function(validator, form, submitButton) {
		saveSysStaff();
	}
};

$(function() {
	debugger;
	$('#staffAddForm').bootstrapValidator(staffAddCheckValidator);
	$("input[name='loginName']","#staffAddForm").blur(function(){
		debugger;
		var curTabstaffKind = $("#curTabstaffKind").val();
		var loginName = $("input[name='loginName']","#staffAddForm" + curTabstaffKind).val();
		if('' == loginName){
			return;
		}
		$.get(serverPath+'staffs/loginName',{'loginName':loginName},function(data){
			if('' == data){
				addCheckLoginName = true;
			}else{
				$('#staffAddForm'+ curTabstaffKind)
				.data('bootstrapValidator')
				.updateStatus('loginName', 'INVALID', 'loginNameCheck');
			}
		});
	});
})


function saveSysStaff() {
	debugger;
	var curTabstaffKind = $("#curTabstaffKind").val();
	var data=$("#staffAddForm" + curTabstaffKind).serializeArray();
	var obj = {};
	$.each(data, function(i, v) {
		obj[v.name] = v.value;
	})
	$.ajax({
		"type":"POST",
		"url":serverPath +'staffs/', 
		"contentType":"application/json",
		"data":JSON.stringify(obj),
        success:function(data){
			returnStaffList();
//				alert("添加成功！");
		},
		error:function(e){
			alert("添加失败o_o请重试...");
		}
	})
}
function getStaffAdd_OrgTree(obj){
	debugger;
	selectOrgTree('staffAdd_OrgTree',obj,curOrgId,getStaffAdd_OrgTreeId,'','1','','');
}

function getStaffAdd_OrgTreeId(orgId, orgName, orgCode){
	debugger;
	var curTabstaffKind = $("#curTabstaffKind").val();
	$("input[name='orgName']",$('#staffAddForm'+curTabstaffKind)).val(orgName);
	$("input[name='orgId']",$('#staffAddForm'+curTabstaffKind)).val(orgId);
}
