

/**
 * 重置查询条件
 * @author cuiy 2017/7/14
 */
function orgReset(){
	 var curTabOrgKind = $('#curTaborgKind').val();
	 $("input[name='orgName']",$("#orgSearchForm"+curTabOrgKind)).val("");
	 $("input[name='orgCode']",$("#orgSearchForm"+curTabOrgKind)).val("");
	 $("select[name='orgType']",$("#orgSearchForm"+curTabOrgKind)).val("");
	 $("select[name='orgStatus']",$("#orgSearchForm"+curTabOrgKind)).val("");
}
/**
 * 组织管理新增按钮
 * @author cuiy 2017/7/17
 */
function orgAddOrg(){
	var curTabOrgKind = $('#curTaborgKind').val();
	debugger;
	$("#orgTabOrg"+curTabOrgKind).load("../org/orgAdd.html",function(){
		$("#orgAddModle").attr("id","orgAddModle"+curTabOrgKind);
		$("#orgAddModleTitle").attr("id","orgAddModleTitle"+curTabOrgKind);
		$("#orgAddForm").attr("id","orgAddForm"+curTabOrgKind);
		$("#orgAddSaveBtn").attr("id","orgAddSaveBtn"+curTabOrgKind);
		if("1" == curTabOrgKind){
			$("#orgAddModleTitle"+curTabOrgKind).html("新增联通组织");
		}else if("2" == curTabOrgKind){
			$("#orgAddModleTitle"+curTabOrgKind).html("新增乙方组织");
		}
		resetValidator();
		if(null == $('#orgAddForm'+curTabOrgKind ).data('bootstrapValidator')) {
			$('#orgAddForm'+curTabOrgKind ).bootstrapValidator(orgAddCheckValidator);
		}
		$("#orgAddModle"+curTabOrgKind).removeClass("HdClass");
		
	});
}

/**
 * bootstrapvalidator 验证
 * @ cuiy 2017/7/24
 */
function resetValidator(){
	var curTabOrgKind = $('#curTaborgKind').val();
	if($('#orgAddForm'+curTabOrgKind ).data('bootstrapValidator')){
		$('#orgAddForm'+curTabOrgKind ).data('bootstrapValidator').resetForm(false);
	}
}




