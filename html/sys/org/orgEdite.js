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
	$('#orgUpdateForm'+curTabOrgKind).bootstrapValidator(orgUpdateCheckValidator);
	$("input[name='orgCode']","#orgUpdateForm").blur(function(){
		debugger;
		var orgCode = $("input[name='orgCode']","#orgUpdateForm" + curTabOrgKind).val();
		if('' == orgCode){
			return;
		}
		$.get(serverPath+'orgs/orgCode',{'orgCode':orgCode},function(data){
			if("1" == data.status){
				if('' == data.data || null == data.data){
					var updateCheckorgCode = true;
				}else{
					var updateCheckorgCode;
					if(data.data.orgId != $("input[name='orgId']","#orgUpdateForm" + curTabOrgKind).val()){
						$('#orgUpdateForm'+ curTabOrgKind)
			            .data('bootstrapValidator')
			            .updateStatus('orgCode', 'INVALID', 'orgCodeCheck');
						updateCheckorgCode = false;
					}else{
						updateCheckorgCode = true;
					}
				}
			}else{
				alert(data.message);
			}

		});
	});
})

var orgUpdateCheckValidator = {
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
	            }
	        },
	        submitHandler: function(validator, form, submitButton) {
	        	orgUpdateSave();
	        }

	};
$(function() {

	
})

//保存修改组织信息
function orgUpdateSave(){
	var curTabOrgKind = $('#curTaborgKind').val();
	var data = $('#orgUpdateForm'+curTabOrgKind).serializeArray();
	var obj = {};
	$.each(data, function(i, v) {
		obj[v.name] = v.value;
	})
	obj.orgKind = curTabOrgKind;
	obj.staffOrgId = curStaffOrgId;
	$.ajax({
		"type":"PUT",
		"url":serverPath +'orgs/', 
		"contentType":"application/json",
		"data":JSON.stringify(obj),
	     success:function(data){
	    	 
	    	 	alert("组织修改" + data.message);
	    	 	loadOrgKindTab(curTabOrgKind);
				
			},
			error:function(e){
				alert("组织修改失败");
			}
	})
}


function orgUpdateBackFun(orgId,orgName,orgCode){
	var curTabOrgKind = $('#curTaborgKind').val();
	$("input[name='parentName']",$("#orgUpdateForm"+curTabOrgKind)).val(orgName);
	$("input[name='parentId']",$("#orgUpdateForm"+curTabOrgKind)).val(orgId);
	$("input[name='parentCode']",$("#orgUpdateForm"+curTabOrgKind)).val(orgCode);
}