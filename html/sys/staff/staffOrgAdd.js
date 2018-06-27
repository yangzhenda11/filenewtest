var staffOrgAddValidator = {
	message : 'This value is not valid',
	feedbackIcons : {
		valid : 'glyphicon glyphicon-ok',
		invalid : 'glyphicon glyphicon-remove',
		validating : 'glyphicon glyphicon-refresh'
	},
	fields : {
		orgName : {
			validators : {
				notEmpty : {
					message : '请点击选择组织'
				},
				orgIdCheck : {
					message : '此组织已存在岗位'
				}
			}
		},
		hireDate: {
			validators : {
				notEmpty : {
					message : '请点击选择入职日期'
				}
			}
		},
		duty : {
			validators : {
				stringLength : {
					min : 0,
					max : 100,
					message : '请输入不超过100个字符'
				}
			}
		}
	},
	submitHandler : function(validator, form, submitButton) {
		saveStaffOrg();
	}
};
;(function($) {
    $.fn.bootstrapValidator.validators.orgIdCheck = {
        html5Attributes: {
            message: 'message',
            field: 'field'
        },
        validate: function(validator, $field, options) {
            return true;
        }
    };
}(window.jQuery));
var curAddStaffOrgOrgVal;
$(function(){
	debugger;
	var curTabstaffKind = $("#curTabstaffKind").val();
	curAddStaffOrgOrgVal = $("#staffOrgAddForm input[name='orgId']").val();
	$("input[name='hireDate']","#staffOrgAddForm").blur(function(){
		var hireDate = $("input[name='hireDate']","#staffOrgAddForm" + curTabstaffKind).val();
		if('' == hireDate){
			$('#staffOrgAddForm'+ curTabstaffKind)
			.data('bootstrapValidator')
			.updateStatus('hireDate', 'INVALID');
		}else{
			$('#staffOrgAddForm'+ curTabstaffKind)
			.data('bootstrapValidator')
			.updateStatus('hireDate', 'VALID');
		}
	});
})
function saveStaffOrg() {
	debugger;
	var curTabstaffKind = $("#curTabstaffKind").val();
	if($("input[name='orgId']","#staffOrgAddForm" + curTabstaffKind).val() == ''){
		alert("请选择组织");
	}else{
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	var data=$("#staffOrgAddForm" + curTabstaffKind).serializeArray();
	var obj = {};
	$.each(data, function(i, v) {
		obj[v.name] = v.value;
	})
	$.ajax({
		"type" : "POST",
		"url" : serverPath + 'staffs/' + staffId + "/staffOrg",
		"contentType" : "application/json",
		"data" : JSON.stringify(obj),
		success : function(data) {
			returnStaffOrgList();
			alert("添加成功！");
		},
		error : function(e) {
			alert("添加失败o_o请重试...");
		}

	})
	}
}
function getStaffOrgAdd_OrgTree(obj){
	debugger;
	selectOrgTree('staffOrgAdd_OrgTree',obj,curOrgId,getStaffOrgAdd_OrgTreeId,'','1','','');
}

function getStaffOrgAdd_OrgTreeId(orgId, orgName, orgCode){
	debugger;
	$("input[name='orgName']",$('#staffOrgAddForm'+curTabstaffKind)).val(orgName);
	$("input[name='orgId']",$('#staffOrgAddForm'+curTabstaffKind)).val(orgId);
	if(curAddStaffOrgOrgVal!=orgId){
		addCheckSameOrg();
	}
}
function addCheckSameOrg(){
	debugger;
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	var orgId = $("input[name='orgId']","#staffOrgAddForm" + curTabstaffKind).val();
	curAddStaffOrgOrgVal = orgId;
	if('' == orgId){
		return;
	}
	$.get(serverPath+'staffs/staffOrgOrgId',{'staffId':staffId,"orgId":orgId},function(data){
		debugger;
		if('' == data){
			$('#staffOrgAddForm'+ curTabstaffKind)
			.data('bootstrapValidator')
			.updateStatus('orgName', 'VALID');
		}else{
			$('#staffOrgAddForm'+ curTabstaffKind)
			.data('bootstrapValidator')
			.updateStatus('orgName', 'INVALID', 'orgIdCheck');
		}
	});
}
