var editCheckLoginName = false;
;(function($) {
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
var staffEditCheckValidator = {
	message : '请核对此字段的输入',
	feedbackIcons : {
		valid : 'glyphicon glyphicon-ok',
		invalid : 'glyphicon glyphicon-remove',
		validating : 'glyphicon glyphicon-refresh'
	},
	submitHandler : function(validator, form, submitButton) {
		updateSysStaff();
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
	}
};

$(function() {
	var curTabstaffKind = $("#curTabstaffKind").val();
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	debugger;
	$.get(serverPath +'staffs/'+staffId,{},function(data){
		var staffInfo = data.data.staffInfo;
		for(var col in staffInfo){
			if(col == 'sex'){
				$("select[name='sex'] option[value='"+staffInfo[col]+"']",$('#staffEditForm'+curTabstaffKind)).attr("selected","selected");
//					$(" select option[value='"+tem+"']").attr("select","selected");
			}else if(col == 'staffStatus'){
				$("select[name='staffStatus'] option[value='"+staffInfo[col]+"']",$('#staffEditForm'+curTabstaffKind)).attr("selected","selected");
			}else if(col == 'hireDate'){
				$("input[name='"+col+"']",$('#staffEditForm'+curTabstaffKind)).val(staffInfo[col]?new Date(staffInfo[col]).format("YYYY-MM-dd"):'');
			}else if(col == 'passwd'){
				continue;
			}else{
				$("input[name='"+col+"']",$('#staffEditForm'+curTabstaffKind)).val(staffInfo[col]);
			}
		}
		var staffOrgs =  data.data.staffOrgs;
		for(var i in staffOrgs){
			if(staffOrgs[i].staffOrgType == 'F'){
				$("input[name='staffOrgId']",$('#staffEditForm'+curTabstaffKind)).val(staffOrgs[i].staffOrgId);
			}
		}
	})
	$("input[name='loginName']","#staffEditForm").blur(function(){
		debugger;
		var loginName = $("input[name='loginName']","#staffEditForm" + curTabstaffKind).val();
		if('' == loginName){
			return;
		}
		debugger;
		$.get(serverPath+'staffs/loginName',{'loginName':loginName},function(data){
			if('' == data){
				editCheckLoginName = true;
			}else{
				if(data.staffId != $("input[name='staffId']","#staffEditForm" + curTabstaffKind).val()){
					$('#staffEditForm'+ curTabstaffKind)
		            .data('bootstrapValidator')
		            .updateStatus('loginName', 'INVALID', 'loginNameCheck');
				}else{
					editCheckLoginName = true;
				}
			}
		});
	});
	
	
	
})

function updateSysStaff() {
	debugger;
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	var curTabstaffKind = $("#curTabstaffKind").val();
	var curTabstaffKind = $("#curTabstaffKind").val();
	var data=$("#staffEditForm" + curTabstaffKind).serializeArray();
	var obj = {};
	$.each(data, function(i, v) {
		obj[v.name] = v.value;
	})
	$.ajax({
		"type":"PUT",
		"url":serverPath +'staffs/'+staffId, 
		"contentType":"application/json",
		"data":JSON.stringify(obj),
	        success:function(data){
				returnStaffList();
				alert("修改成功！");
			},
			error:function(e){
				alert("修改失败o_o请重试...");
			}
	})
}


function getStaffEdit_OrgTree(obj){
	debugger;
	selectOrgTree('staffEdit_OrgTree',obj,curOrgId,getStaffEdit_OrgTreeId,'','1','','');
}

function getStaffEdit_OrgTreeId(orgId, orgName, orgCode){
	debugger;
	$("input[name='orgName']",$('#staffEditForm'+curTabstaffKind)).val(orgName);
	$("input[name='orgId']",$('#staffEditForm'+curTabstaffKind)).val(orgId);
}