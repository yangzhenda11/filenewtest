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
var staffOrgEditValidator = {
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
		updateSysStaffOrg();
	}
};

var curEditStaffOrgOrgVal;

$(function() {
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	var staffOrgId = $('#selectedStaffOrgId'+curTabstaffKind).val();
	debugger;
	$.get(serverPath +'staffs/'+staffId+"/staffOrg/"+staffOrgId,{},function(data){
		var staffOrg = data.data;
		for(var col in staffOrg){
			curEditStaffOrgOrgVal = staffOrg['orgId'];
			if(col == 'staffOrgType'){
				if(staffOrg[col]=='J'||staffOrg[col]=='T'){
					$("select[name='staffOrgType'] option[value='F']",$('#staffOrgEditForm'+curTabstaffKind)).attr("disabled","disabled");
				}else{
					$("select[name='staffOrgType'] option[value='J']",$('#staffOrgEditForm'+curTabstaffKind)).attr("disabled","disabled");
					$("select[name='staffOrgType'] option[value='T']",$('#staffOrgEditForm'+curTabstaffKind)).attr("disabled","disabled");
				}
				$("select[name='staffOrgType'] option[value='"+staffOrg[col]+"']",$('#staffOrgEditForm'+curTabstaffKind)).attr("selected","selected");
			}else if(col == 'staffOrgStatus'){
				$("select[name='staffOrgStatus'] option[value='"+staffOrg[col]+"']",$('#staffOrgEditForm'+curTabstaffKind)).attr("selected","selected");
			}else if(col == 'hireDate'||col == 'effectStartDate'||col == 'effectEndDate'){
				$("input[name='"+col+"']",$('#staffOrgEditForm'+curTabstaffKind)).val(staffOrg[col]?new Date(staffOrg[col]).format("YYYY-MM-dd"):'');
			}else{
				$("input[name='"+col+"']",$('#staffOrgEditForm'+curTabstaffKind)).val(staffOrg[col]);
			}
		}
	})
	
})

function updateSysStaffOrg() {
	debugger;
	var curTabstaffKind = $("#curTabstaffKind").val();
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	if($("input[name='orgId']","#staffOrgEditForm" + curTabstaffKind).val() == ''){
		alert("请选择组织");
	}else{
	var data=$("#staffOrgEditForm" + curTabstaffKind).serializeArray();
	var obj = {};
	$.each(data, function(i, v) {
		obj[v.name] = v.value;
	})
	$.ajax({
		"type":"PUT",
		"url":serverPath +'staffs/'+staffId+'/staffOrg', 
		"contentType":"application/json",
		"data":JSON.stringify(obj),
	        success:function(data){
				returnStaffOrgList();
				alert("修改成功！");
			},
			error:function(e){
				alert("修改失败o_o请重试...");
			}
	})
	}
}

function getStaffOrgEdit_OrgTree(obj){
	debugger;
	selectOrgTree('staffEdit_OrgTree',obj,curOrgId,getStaffOrgEdit_OrgTreeId,'','1','','');
}

function getStaffOrgEdit_OrgTreeId(orgId, orgName, orgCode){
	debugger;
	$("input[name='orgName']",$('#staffOrgEditForm'+curTabstaffKind)).val(orgName);
	$("input[name='orgId']",$('#staffOrgEditForm'+curTabstaffKind)).val(orgId);
	if(curEditStaffOrgOrgVal!=orgId){
		editCheckSameOrg();
	}
}

function editCheckSameOrg(){
	debugger;
	var staffOrgId = $("input[name='staffOrgId']","#staffOrgEditForm" + curTabstaffKind).val();
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	var orgId = $("input[name='orgId']","#staffOrgEditForm" + curTabstaffKind).val();
	if('' == orgId){
		return;
	}
	$.get(serverPath+'staffs/staffOrgOrgId',{'staffId':staffId,"orgId":orgId},function(data){
		if('' == data){
			$('#staffOrgEditForm'+ curTabstaffKind)
			.data('bootstrapValidator')
			.updateStatus('orgName', 'VALID' );
		}else{
			if(staffOrgId != data.staffOrgId){
				$('#staffOrgEditForm'+ curTabstaffKind)
				.data('bootstrapValidator')
				.updateStatus('orgName', 'INVALID', 'orgIdCheck');
			}
		}
	});
}