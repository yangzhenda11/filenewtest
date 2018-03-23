(function($) {
    $.fn.bootstrapValidator.validators.orgCodeCheck = {
        html5Attributes: {
            message: 'message',
            field: 'field'
        },
        validate: function(validator, $field, options) {
            return true;
        }
    };
}(window.jQuery));
$(function() {
	debugger;
	var curTabOrgKind = $('#curTaborgKind').val();
	$('#orgAddForm'+curTabOrgKind).bootstrapValidator(orgAddCheckValidator);
	$("input[name='orgCode']","#orgAddForm").blur(function(){
		debugger;
		var orgCode = $("input[name='orgCode']","#orgAddForm" + curTabOrgKind).val();
		if('' == orgCode){
			return;
		}
		$.get(serverPath+'orgs/orgCode',{'orgCode':orgCode},function(data){
			if("1" == data.status){
				if('' == data.data || null == data.data){
					var addCheckorgCode = true;
				}else{
					var addCheckorgCode = false;
					$('#orgAddForm'+ curTabOrgKind)
					.data('bootstrapValidator')
					.updateStatus('orgCode', 'INVALID', 'orgCodeCheck');
				}
			}else{
				alert(data.message);
			}

		});
	});
})


//组织新增的bootstrapvalidator的验证配置
var orgAddCheckValidator = {
			message: 'This value is not valid',
	        feedbackIcons: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	orgName: {
	                validators: {
	                    notEmpty: {
	                        message: '请输入组织名称'
	                    },
	                    stringLength: {
	                         min: 0,
	                         max: 64,
	                         message: '组织名称不能超过64个字符'
	                     }
	                }
	            },
	           orgCode: {
	                validators: {
	                    notEmpty: {
	                        message: '请输入组织编码'
	                    },
	    				 stringLength: {
	                         min: 0,
	                         max: 64,
	                         message: '组织编码不能超过64位'
	                     },
	                     orgCodeCheck : {
	    					message : '此组织编号已经存在'
	    				}
	                }
	            },
	            orgType: {
	                validators: {
	                    notEmpty: {
	                        message: '请选择组织类型'
	                    }
	                }
	            },
	            parentName: {
	                validators: {
	                    notEmpty: {
	                        message: '请选择父级组织'
	                    }
	                }
	            }
	        },
	        submitHandler: function(validator, form, submitButton) {
	        	debugger;
	        	orgAddSave();
	        }

	};


//保存新增组织信息
function orgAddSave(){
	var curTabOrgKind = $('#curTaborgKind').val();
	var data = $('#orgAddForm'+curTabOrgKind).serializeArray();
	var obj = {};
	$.each(data, function(i, v) {
		obj[v.name] = v.value;
	})
	obj.orgKind = curTabOrgKind;
	obj.staffOrgId = curStaffOrgId;
	$.ajax({
		"type":"POST",
		"url":serverPath +'orgs/', 
		"contentType":"application/json",
		"data":JSON.stringify(obj),
	     success:function(data){
	    	 
	    	 	alert("组织添加" + data.message);
	    	 	loadOrgKindTab(curTabOrgKind);
				
			},
			error:function(e){
				alert("组织添加失败");
			}
	})
}

function orgAddBackFun(orgId,orgName,orgCode){
	debugger;
	var curTabOrgKind = $('#curTaborgKind').val();
	$("input[name='parentName']",$("#orgAddForm"+curTabOrgKind)).val(orgName);
	$("input[name='parentId']",$("#orgAddForm"+curTabOrgKind)).val(orgId);
	$("input[name='parentCode']",$("#orgAddForm"+curTabOrgKind)).val(orgCode);
	if($('#orgAddForm'+curTabOrgKind).data('bootstrapValidator')){
		$('#orgAddForm'+curTabOrgKind).data('bootstrapValidator').updateStatus('parentName', 'NOT_VALIDATED', null).validateField('parentName');
	  }
}

function orgAddGetOrgTree(obj){
	var orgId = curOrgId;
	debugger;
	selectOrgTree('orgTree',obj,orgId,orgAddBackFun,'','1','','');
}

