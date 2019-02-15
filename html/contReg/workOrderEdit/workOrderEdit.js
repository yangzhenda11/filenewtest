//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var formSubmit = false;				//全局加载成功标识位
var wcardId = null;					//工单主键ID
var wcardTypeCode = null;			//工单类型，0：其他，1：收入类-租线合同，2：支出类-采购合同
var wcardProcess = null;			//工单处理状态  0:草稿/1:复核/2:退回/3:激活
var wcardStatus = null;				//工单状态
var contractId = null;				//合同ID
var contractNumber = null;			//合同编号
var contractStatus = null;			//合同状态
var contracType = null;				//合同类型
var isEdit = false;					//是否可以编辑标识位
var specialDomEdit = true;			//*特殊* 特殊DOM（不受isEdit管控）编辑标识位（文件上传，合同管理员确认）（contractStatus!=1为false）
var isCancelApproved = false;		//*特殊* 是否为退回状态标识位
var contractAttr = {
	provinceCode: null,				//合同所属省份
	city: null,						//合同所属城市
	executeDeptCode: null			//承办人所在部门编码
};
var editIdentify = {						//2阶段新增标志位
	isCanUpdateExpiryDate: false,			//*特殊* 是否可以更新终止日期
	isCanUpdateCustomerManager: false		//*特殊* 是否可以更新客户经理
};	
var contractStatusObj = {
	1: "已审批",
	2: "作废",
	3: "作废申请中",
	4: "变更补充",
	5: "终止解除",
	7: "办结",
	8: "履行中"
}
var curStaffOrgId = config.curStaffId;	//工作流需要用户ID
var orderLayerIndex = null;				//layer提示index
//预定义dom元素
var $workOrderContentForm = $("#workOrderContentForm"),$pageContent = $("#page-content");
/*
 * 页面标志位修改
 * 页面是待办且为工单处理时才可以编辑
 */
if(parm.taskFlag == "db"){
	if(parm.taskDefinitionKey == "GDCL"){
		isEdit = true;
	}else if(parm.taskDefinitionKey == "GXZZ"){
		editIdentify.isCanUpdateExpiryDate = true;
	}else if(parm.taskDefinitionKey == "TJKH"){
		editIdentify.isCanUpdateCustomerManager = true;
	}else if(parm.taskDefinitionKey == "SEALAPPLY"){
		specialDomEdit = false;
		$("#sealApplyBtn").click(saveOrderApplySealFlow);
	}else if(parm.taskDefinitionKey == "SEALED"){
		specialDomEdit = false;
		$("#sealApplyBtn span").text("盖章完成");
		$("#sealApplyBtn").click(saveOrderStampFlow);
	}
}
$(function() {
	wcardId = parm.wcardId;
	if(parm.pageType == 1) {		//工作流页面进入
		layer.alert("入参错误",{icon:2});
	} else if(parm.pageType == 2) {		//工单处理和工单激活页面进入
		if(parm.taskFlag == "db"){
			if(parm.taskDefinitionKey == "GDCL"){
				$("#toolbarButton button").not(".saveBtn,.registerBtn,.cancelApprovedBtn,.flowhistoryBtn,.flowchartBtn,.closeBtn").remove();
			}else if(parm.taskDefinitionKey == "GDQR"){
				$("#toolbarButton button").not(".saveBtn,.sendBackBtn,.activateBtn,.flowhistoryBtn,.flowchartBtn,.closeBtn").remove();
			}else if(parm.taskDefinitionKey == "GXZZ"){
				$("#toolbarButton button").not(".closeBtn,.changeExpiryDateBtn,.flowhistoryBtn,.flowchartBtn").remove();
			}else if(parm.taskDefinitionKey == "KHQR"){
				$("#toolbarButton button").not(".closeBtn").remove();
			}else if(parm.taskDefinitionKey == "TJKH"){
				$("#toolbarButton button").not(".closeBtn").remove();
			}else if(parm.taskDefinitionKey == "SEALAPPLY"){
				$("#toolbarButton button").not(".sealApplyBtn,.flowhistoryBtn,.flowchartBtn,.closeBtn").remove();
			}else if(parm.taskDefinitionKey == "SEALED"){
				$("#toolbarButton button").not(".sealApplyBtn,.hiReturnBtn,.flowhistoryBtn,.flowchartBtn,.closeBtn").remove();
			};
		}else{
			showLayerErrorMsg("入参错误");
		};
		fixToolBars();
	} else if(parm.pageType == 0) {		//关联合同页面点击进入
		$("#toolbarButton").remove();
		$("#toolbarBtn").css("height","90px");
		$pageContent.removeClass("hidden");
		fixToolBars();
	} else if(parm.pageType == 4) {		//工单查询页面进入
		$("#toolbarButton button").not(".closeBtn").remove();
		$pageContent.removeClass("hidden");
		fixToolBars();
	} else if(parm.pageType == 3) {		//已办页面进入
		$("#toolbarButton button").not(".returnBtn,.flowhistoryBtn,.flowchartBtn,.closeBtn").remove();
		if(parm.canWithDraw != "true"){
			$(".returnBtn").remove();
		}
		$pageContent.removeClass("hidden");
		fixToolBars();
	};
	//加载验证壳
	validate();
	//请求工单模块，获取基本信息及各模块的url
	getWorkOrderInfo();
})
/*
 * 保存按钮点击@功能页面
 */
function saveBtnClick(){
	if(formSubmit){
		if(checkWcardIschange()){
			return false;
		}else{
			saveContent();
		}
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 推动工作流打开填写意见选择环人员页面
 */
function chooseFlowLink(handleType,pathSelect,isBackFlow,isCommon,callback){
	$("#flowPushBtn").attr("disabled",false);
	if(isCommon){
		$("#commentLable").html('<i class="iconfont icon-mi required"></i>');
	};
	if(isBackFlow){
		$("#assigneeNameForStartDom").hide();
	}else{
		$("#assigneeNameForStartDom").show();
	};
	$("#isBackFlow").val(isBackFlow);
	$("#isCommon").val(isCommon);
	$("#workFlowLinkCallback").val(callback);
	var taskId = parm.taskId;
	var isHistoryBack = false; //该环节在进行回退的时候是否进行历史记录进行匹配
	var isUsePushExpression = false;//在流程推进的时候是否使用表达式进行匹配
	var isUseBackExpression = false;//在流程回退的时候是否使用表达式进行匹配
	var processData = null;
	$.ajax({
		type: 'get',
		url: serverPath + "workflowrest/tasklink/" + taskId + "/" + handleType + "/branch/"+isHistoryBack+"/"+isUsePushExpression+"/"+isUseBackExpression+"/"+pathSelect,
		data: processData,
		dataType: 'json',
		contentType: "application/json",
		success: function(result){
			if(result.retCode == 0){
				layer.alert("未找到可流转环节，异常请处理！",{icon:2});
			}else{
				var data = result.dataRows;
				if(data){
					var linkForStartHtml = "<option value=''>请选择下一步办理步骤</option>";
					$.each(data, function(k,v) {
						linkForStartHtml += "<option value='"+v.value+"'>"+ v.label +"</option>";
					});
					$("#linkForStart").html(linkForStartHtml);
	                var select2Options = {
	                    placeholder:"请选择下一步办理步骤",
	                    language: 'zh-CN',
	                    width: '100%',
	                    allowClear: true,
	                    minimumResultsForSearch: -1
	                };
	                $("#linkForStart").select2(select2Options);
	                if(data.length == 1){
	                	$("#linkForStart").val(data[0].value).trigger("change");
	                };
				};
				$("#workFlowChooseLinkModal").modal("show");
			}
		},
		error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}
/*
   * 下一步多环节时的下拉框选择
   */
function chooseAssigneeChange(){
	var chooseLink = $("#linkForStart").val();
	var isBackFlow = $("#isBackFlow").val();
	if(chooseLink){
		var linkcode = chooseLink.split(",")[0];
		if(linkcode == "endevent1" || isBackFlow == "true"){
			$("#assigneeNameForStartDom").hide();
			$("#assigneeNameForStart").val("");
			$("#assigneeIdForStart").val("");
		}else{
			$("#assigneeNameForStartDom").show();
		}
	}else{
		$("#assigneeNameForStartDom").show();
		$("#assigneeNameForStart").val("");
		$("#assigneeIdForStart").val("");
	}
}
/*
 * 下一步多环节时的选人
 */
function chooseAssignee(){
	var chooseLink = $("#linkForStart").val();
	var isBackFlow = $("#isBackFlow").val();
	if(chooseLink){
		var linkcode = chooseLink.split(",")[0];
		if(linkcode == "endevent1"){
			layer.msg("下一步环节为结束时不需要选人",{offset: '170px'});
		}else if(isBackFlow == "true"){
			layer.msg("退回时不需要选人",{offset: '170px'});
		}else{
			var flowKey = parm.processDefinitionKey;
			var prov = contractAttr.provinceCode;
			var city = contractAttr.city
			var callbackFun = "setAssigneeIdForStart";
			var staffSelectType = 1;
			var flowOrgCodes = contractAttr.executeDeptCode;
			var contracType = "",attrA = "",attrB = "",attrC = "";	    		
			jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType,city,contracType,attrA,attrB,attrC,flowOrgCodes);
		}
	}else{
		layer.msg("请选择下一步环节",{offset: '170px'});
	}
}
/*
 * 下一步多环节时的选人回调
 */
function setAssigneeIdForStart(ORG_ID,org_code,full_name,STAFF_NAME,STAFF_ORG_ID,callbackFun){
	$("#assigneeNameForStart").val(STAFF_NAME);
	$("#assigneeIdForStart").val(STAFF_ORG_ID);
	$("#PandJstaffiframetask").modal("hide");
}
/*
 * 下一步多环节时的modal确认按钮点击
 */
function chooseAssigneeConfirm(){
	var chooseLink = $("#linkForStart").val();
	if(chooseLink){
		var isCommon = $("#isCommon").val();
		var commentVal = $("#comment").val();
		if(isCommon == "true" && (commentVal == "")){
			layer.msg("请填写意见",{offset: '170px'});
		}else{
			var isBackFlow = $("#isBackFlow").val();
			var linkcode = chooseLink.split(",")[0];
			var workFlowLinkCallback = $("#workFlowLinkCallback").val();
			var staffOrgId = $("#assigneeIdForStart").val();
			if(linkcode == "endevent1" || isBackFlow == "true"){
				$("#flowPushBtn").attr("disabled",true);
				if(App.checkTaskIdIsDone(serverPath,parm.taskId)){
					return false;
				};
				if(checkWcardIschange()){
					return false;
				};
				var workFlowLinkCallbackFn = eval(workFlowLinkCallback);
				var obj = {
					commentVal: commentVal,
					linkcode: linkcode
				};
				workFlowLinkCallbackFn(obj);
				$("#flowPushBtn").attr("disabled",false);
			}else{
				if(staffOrgId){
					$("#flowPushBtn").attr("disabled",true);
					if(App.checkTaskIdIsDone(serverPath,parm.taskId)){
						return false;
					};
					if(checkWcardIschange()){
						return false;
					};
					var workFlowLinkCallbackFn = eval(workFlowLinkCallback);
					var obj = {
						staffOrgId: staffOrgId,
						commentVal: commentVal,
						linkcode: linkcode
					};
					workFlowLinkCallbackFn(obj);
					$("#flowPushBtn").attr("disabled",false);
				}else{
					layer.msg("请选择下一步环节办理人员",{offset: '170px'});
				}
			}
		}
	}else{
		layer.msg("请选择下一步环节",{offset: '170px'});
	}
}
/*
 * 调出选人页面（参考工作流）
 */
function jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType,city,contracType,attrA,attrB,attrC,orgCodes){
	var frameSrc ="/html/workflow/assignee/assgigneeList.html"; 
    $("#PandJstaffiframetask").load(frameSrc,function() {
    	setParam(flowKey,linkcode,prov,callbackFun,staffSelectType,city,contracType,attrA,attrB,attrC,orgCodes);
    	$("#PandJstaffiframetask").off('shown.bs.modal').on('shown.bs.modal', function (e) {
			App.initDataTables('#searchStaffTable', "#searchEforgHome", dataTableConfig);
			$(".checkall").click(function () {
		      	var check = $(this).prop("checked");
		      	$(".checkchild").prop("checked", check);
		      	checkAllChildStaffCheckbox();
			});
		})
    	$("#PandJstaffiframetask").modal('show');
    });
}

/*
 * 注册按钮点击@功能页面
 */
function submitContent(){
	if(formSubmit){
		//删除表格内多余的数据
		removeMoreThanTablecontent();
		//检查是否长度超长
		var isOverlength = checkDomOverlength();
		if(isOverlength){
			return false;
		};
		orderLayerIndex = layer.msg('表单验证中,请稍后...', {icon: 16,shade: 0.01,time:false});
		var timer = setTimeout(submitContentFn, 100);
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
function submitContentFn(){
	//手动触发表单验证
	var bootstrapValidator = $workOrderContentForm.data('bootstrapValidator');
    bootstrapValidator.validate();
    var customValiNoPass = customValidator();
   	layer.close(orderLayerIndex);
    if(!bootstrapValidator.isValid() || customValiNoPass){
    	showLayerErrorMsg("当前工单表单校验未通过，请检查");
        srolloOffect($workOrderContentForm.find(".has-error:first")[0],1);
    	return false;
    }else{
    	var submitData = getContentValue(true);
    	if(submitData){
    		if($("#contractScanCopyUpload")[0]){
	    		if(!submitData.contractScanCopyUpload.bodyDoc.bodyDocStoreId){
					if(wcardTypeCode == 2){
	    				var ms = "请上传合同签订盖章页扫描件后进行工单注册";
					}else{
						var ms = "请上传合同正文扫描件后进行工单注册";
					};
					showLayerErrorMsg(ms);
					srolloOffect("#contractScanCopyUpload");
					return false;
				}
	    	};
	    	var pathSelect = 0;
	    	if(contractAttr.executeDeptCode == "00450080365"){
	    		pathSelect = 1;
	    	};
	    	chooseFlowLink(1,pathSelect,false,false,"submitContentPost");
		}
	}
}
/*
 * 工单注册后台提交@功能页面
 */
function submitContentPost(chooseObj){
	var pathSelect = 0;
	if(contractAttr.executeDeptCode == "00450080365"){
		pathSelect = 1;
	};
	var postData = App.getFlowParam(serverPath,wcardId,1,pathSelect,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
	postData.assignee = chooseObj.staffOrgId;
	postData.wcardId = wcardId;
	postData.wcardType = wcardTypeCode;
	postData.contractName = $("#contractName").val();
	var datas = getContentValue(true);
	postData = $.extend(postData, datas);
	$("#toolbarButton button").not(".closeBtn").attr("disabled",true);
	postData.comment = chooseObj.commentVal;
	postData.taskDefinitionKey = chooseObj.linkcode;
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
		var data = result.data;
		if(data.success == "000"){
			showLayerErrorMsg(data.message);
		}else{
			layer.alert("注册成功！",{icon:1,closeBtn:0},function(){
				backPage();
			});
		}
	}
	function improperCallback(result){
		layer.alert(result.message,{icon:2,closeBtn:0});
		$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
	}
}
/*
 * 合同激活
 */
function activateContract(){
	if($("#contractScanCopyUpload")[0]){
		var scanCopyUploadData = getValue_contractScanCopyUpload(true);
		if(!scanCopyUploadData.bodyDoc.bodyDocStoreId){
			if(wcardTypeCode == 2){
				var ms = "请上传合同签订盖章页扫描件后进行工单激活";
			}else{
				var ms = "请上传合同正文扫描件后进行工单激活";
			};
			showLayerErrorMsg(ms);
			srolloOffect("#contractScanCopyUpload");
			return false;
		}
	};
	var adminCommitmentValue = $("#adminCommitmentContent input[name='adminCommitment']:checked").val();
	if(adminCommitmentValue == 1){
		var adminCommitment = 1;
	}else{
		var adminCommitment = 0;
	};
	if(adminCommitment == 0){
		showLayerErrorMsg("请勾选合同管理员确认信息");
		srolloOffect("#adminCommitmentContent");
		return false;
	};
	chooseFlowLink(1,0,false,false,"activateContractPost");
}
/*
 * 激活提交@功能页面
 */
function activateContractPost(chooseObj){
	layer.confirm("注意：合同激活后将进入履行阶段。",{icon:7,title:"提示"},function(index){
		layer.close(index);
		var postData = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
		postData.validity = {};
		if($("#contractScanCopyUpload")[0]){
			postData.contractScanCopyUpload = getValue_contractScanCopyUpload(true);
    	};
    	postData.performerList = getValue_performerList(true,true);
		postData.validity.adminCommitment = 1;
		postData.validity.validityId = $("#validityId").val();
		postData.wcardId = wcardId;
		postData.contractId = contractId;
		postData.taskDefinitionKey = chooseObj.linkcode;
		postData.comment = chooseObj.commentVal;
		$("#toolbarButton button").not(".closeBtn").attr("disabled",true);
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcess", "post", JSON.stringify(postData), successCallback, improperCallback);
		function successCallback(result) {
			$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
			var data = result.data;
			layer.alert("激活成功！",{icon:1,closeBtn:0},function(){
				backPage();
			});
		}
		function improperCallback(result){
			$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
			layer.alert(result.message,{icon:2,closeBtn:0});
		}
	});
}
/*
 * 工单确认第一种类型（保存业务信息，推动流程）
 * 推下一步判断是否点击确认信息和是否上传扫描件然后调出选人
 */
function pushGDQRWorkflowOfDepart(){
	if(formSubmit){
		if($("#contractScanCopyUpload")[0]){
			var scanCopyUploadData = getValue_contractScanCopyUpload(true);
			if(!scanCopyUploadData.bodyDoc.bodyDocStoreId){
				if(wcardTypeCode == 2){
    				var ms = "请上传合同签订盖章页扫描件后进行工单激活";
				}else{
					var ms = "请上传合同正文扫描件后进行工单激活";
				};
				showLayerErrorMsg(ms);
				srolloOffect("#contractScanCopyUpload");
				return false;
			}
    	};
    	var adminCommitmentValue = $("#adminCommitmentContent input[name='adminCommitment']:checked").val();
		if(adminCommitmentValue == 1){
			var adminCommitment = 1;
		}else{
			var adminCommitment = 0;
		};
		if(adminCommitment == 0){
			showLayerErrorMsg("请勾选合同管理员确认信息");
			srolloOffect("#adminCommitmentContent");
			return false;
		};
    	chooseFlowLink(1,0,false,false,"pushGDQRDataOfDepart");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 工单确认第一种类型（保存业务信息，推动流程）
 * 推下一步提交后台@功能页面
 */
function pushGDQRDataOfDepart(chooseObj){
	var postData = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
	postData.wcardId = wcardId;
	postData.contractId = contractId;
	postData.assignee =  chooseObj.staffOrgId;
	postData.validity = {};
	postData.validity.adminCommitment = 1;
	postData.validity.validityId = $("#validityId").val();
	if($("#contractScanCopyUpload")[0]){
		postData.contractScanCopyUpload = getValue_contractScanCopyUpload(true);
	};
	postData.taskDefinitionKey = chooseObj.linkcode;
	postData.comment = chooseObj.commentVal;
	postData.performerList = getValue_performerList(true,true);
	$("#toolbarButton button").not(".closeBtn").attr("disabled",true);
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcessDepart", "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
		var data = result.data;
		if(data){
			if(data.success == "000"){
				showLayerErrorMsg(data.message);
			}else{
				layer.alert("已提交到下一环节！",{icon:1,closeBtn:0},function(){
					backPage();
				});
			}
		}else{
			layer.alert("已提交到下一环节！",{icon:1,closeBtn:0},function(){
				backPage();
			});
		}
		
	}
	function improperCallback(result){
		$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
		layer.alert(result.message,{icon:2,closeBtn:0});
	}
}
/*
 * 工单确认第二种类型（推动流程，激活合同）
 * 激活合同
 */
function pushGDQRWorkflowOfCompany(){
	if(formSubmit){
		chooseFlowLink(1,0,false,false,"pushGDQRWorkflowOfCompanyPost");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 工单确认第二种类型（推动流程，激活合同）
 * 激活合同提交
 */
function pushGDQRWorkflowOfCompanyPost(chooseObj){
	layer.confirm("注意：合同激活后将进入履行阶段。",{icon:7,title:"提示"},function(index){
		layer.close(index);
		var postData = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
		postData.wcardId = wcardId;
		postData.contractId = contractId;
		postData.comment = chooseObj.commentVal;
		postData.taskDefinitionKey = chooseObj.linkcode;
		postData.performerList = getValue_performerList(true,true);
		$("#toolbarButton button").not(".closeBtn").attr("disabled",true);
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcessCompany", "post", JSON.stringify(postData), successCallback, improperCallback);
		function successCallback(result) {
			$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
			var data = result.data;
			layer.alert("激活成功！",{icon:1,closeBtn:0},function(){
				backPage();
			});
		}
		function improperCallback(result){
			$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
			layer.alert(result.message,{icon:2,closeBtn:0});
		}
	});
}
/*
 * 工作流多环节时打开选择环节页面
 */
function chooseWorkflowLink(){
	if(formSubmit){
		if($("#contractScanCopyUpload")[0]){
			var scanCopyUploadData = getValue_contractScanCopyUpload(true);
			if(!scanCopyUploadData.bodyDoc.bodyDocStoreId){
				if(wcardTypeCode == 2){
    				var ms = "请上传合同签订盖章页扫描件后进行工单激活";
				}else{
					var ms = "请上传合同正文扫描件后进行工单激活";
				};
				showLayerErrorMsg(ms);
				srolloOffect("#contractScanCopyUpload");
				return false;
			}
    	};
    	var adminCommitmentValue = $("#adminCommitmentContent input[name='adminCommitment']:checked").val();
		if(adminCommitmentValue == 1){
			var adminCommitment = 1;
		}else{
			var adminCommitment = 0;
		};
		if(adminCommitment == 0){
			showLayerErrorMsg("请勾选合同管理员确认信息");
			srolloOffect("#adminCommitmentContent");
			return false;
		};
		chooseFlowLink(1,0,false,false,"chooseWorkflowLinkPost");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
function chooseWorkflowLinkPost(chooseObj){
	if(chooseObj.staffOrgId){
		pushGDQRDataOfDepart(chooseObj);
	}else{
		activateContractPost(chooseObj);
	}
}
/*
 * 取消审批点击@功能页面
 */
function cancelApproved(){
	if(formSubmit){
		chooseFlowLink(8,1,true,false,"cancelApprovedPost");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 取消审批提交@功能页面
 */
function cancelApprovedPost(chooseObj){
	layer.confirm("请确认是否取消该工单的审批。",{icon:7,title:"提示"},function(index){
		layer.close(index);
		var flowParam = App.getFlowParam(serverPath,wcardId,8,1,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
		flowParam.wcardId = wcardId;
		flowParam.comment = chooseObj.commentVal;
		flowParam.taskDefinitionKey = chooseObj.linkcode;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderCancelApprovalProcess", "post", JSON.stringify(flowParam), successCallback);
		function successCallback(result) {
			layer.alert("取消成功。",{icon:1,closeBtn:0},function(index){
				layer.close(index);
				window.location.reload();
			});
		}
	});
}
/*
 * 退回承办人点击@功能页面
 */
function sendBack(){
	if(formSubmit){
		chooseFlowLink(2,0,true,true,"setPinfoContent");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 退回承办人点击确定按钮点击@功能页面
 */
function setPinfoContent(chooseObj){
	var flowParam = App.getFlowParam(serverPath,wcardId,2,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
	flowParam.comment = chooseObj.commentVal;
	flowParam.taskDefinitionKey = chooseObj.linkcode;
	flowParam.busiId = wcardId;
	if(flowParam.processDefinitionKey == "ContractprojectHNProcess2"){
		flowParam.contractName = $("#contractName").val();
	};
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderFallbackProcess", "post", JSON.stringify(flowParam), successCallback);
	function successCallback(result) {
		layer.alert("退回成功！",{icon:1,closeBtn:0},function(){
			backPage();
		});
	}
}
/*
 * 工单确认为第三环节时退回上一步
 */
function sendBackLastStep(){
	if(formSubmit){
		chooseFlowLink(2,1,true,false,"sendBackLastStepPost");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 工单确认为第三环节时退回上一步提交
 */
function sendBackLastStepPost(chooseObj){
	var btnData = $("#sendBackBtn").data("btnname");
	layer.confirm("是否要退回"+btnData+"？",{icon:7,title:"提示"},function(index){
		layer.close(index);
		var postData = App.getFlowParam(serverPath,wcardId,2,1,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
		postData.wcardId = wcardId;
		postData.comment = chooseObj.commentVal;
		postData.taskDefinitionKey = chooseObj.linkcode;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveWorkflowBackLastStep", "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.alert("退回成功",{icon:1,closeBtn:0},function(index){
				backPage();
			});
		}
	});
}
//撤回@功能页面
function returnProcess(){
	if(formSubmit){
		if(parm.taskDefinitionKey == "SEALAPPLY" || parm.taskDefinitionKey == "GDCL"){
			if(checkWcardIschange()){
				return false;
			};
			layer.confirm("当前流程将撤回本环节，是否确认？",{icon:7,title:"提示"},function(index){
				layer.close(index);
				if(parm.taskDefinitionKey == "SEALAPPLY"){
	                var postData = {
	                    "processInstanceId": parm.processInstanceId,
	                    "taskId": parm.taskId,
	                    "wcardId": wcardId,
	      				"contractName": $("#contractName").val()
	                };
	   				var processUrl = "contractOrderEditorController/saveApplySealFlowWithdrawProcess";
				}else if(parm.taskDefinitionKey == "GDCL"){
					var postData = {
						"processInstanceId": parm.processInstanceId,
						"taskId": parm.taskId,
						"wcardId": wcardId
					};
					if(parm.processDefinitionKey == "ContractprojectHNProcess2"){
						postData.contractName = $("#contractName").val();
					};
					var processUrl = "contractOrderEditorController/saveOrderWithdrawProcess";
				};
				App.formAjaxJson(serverPath + processUrl, "post", JSON.stringify(postData), successCallback);
				function successCallback(result) {
					layer.alert("工单撤回成功",{icon:1},function(index){
						backPage();
					});
				}
			});
		}else{
			showLayerErrorMsg("请求错误");
		}
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 海南新流程--用印申请
 */
function saveOrderApplySealFlow(){
	if(formSubmit){
		chooseFlowLink(1,0,false,false,"saveOrderApplySealFlowPost");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 海南新流程--用印申请提交
 */
function saveOrderApplySealFlowPost(chooseObj){
	var flowParam = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
	flowParam.comment = chooseObj.commentVal;
	flowParam.taskDefinitionKey = chooseObj.linkcode;
	flowParam.assignee = chooseObj.staffOrgId;
	flowParam.wcardId = wcardId;
	flowParam.contractName = $("#contractName").val();
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApplySealFlowForward", "post", JSON.stringify(flowParam), successCallback);
	function successCallback(result) {
		layer.alert("提交成功",{icon:1,closeBtn:0},function(){
			backPage();
		});
	}
}
/*
 * 海南新流程--盖章管理员同意
 */
function saveOrderStampFlow(){
	if(formSubmit){
		chooseFlowLink(1,0,true,false,"saveOrderStampFlowPost");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 海南新流程--盖章管理员同意提交
 */
function saveOrderStampFlowPost(chooseObj){
	var flowParam = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
	flowParam.comment = chooseObj.commentVal;
	flowParam.taskDefinitionKey = chooseObj.linkcode;
	flowParam.assignee = $("#undertakerId").val();
	flowParam.wcardId = wcardId;
	flowParam.contractName = $("#contractName").val();
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderStampFlowForward", "post", JSON.stringify(flowParam), successCallback);
	function successCallback(result) {
		layer.alert("提交成功",{icon:1,closeBtn:0},function(){
			backPage();
		});
	}
}
/*
 * 海南新流程--盖章管理员退回
 */
function saveOrderStampFlowReturn(){
	if(formSubmit){
		chooseFlowLink(2,0,true,true,"saveOrderStampFlowReturnPost");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 海南新流程--盖章管理员退回提交
 */
function saveOrderStampFlowReturnPost(chooseObj){
	var flowParam = App.getFlowParam(serverPath,wcardId,2,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
	flowParam.comment = chooseObj.commentVal;
	flowParam.taskDefinitionKey = chooseObj.linkcode;
	flowParam.wcardId = wcardId;
	flowParam.contractName = $("#contractName").val();
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderStampFlowReturned", "post", JSON.stringify(flowParam), successCallback);
	function successCallback(result) {
		layer.alert("退回成功",{icon:1,closeBtn:0},function(){
			backPage();
		});
	}
}
/*
 * 检查工单状态和合同状态是否发生了改变
 * 改变了返回true，没有改变返回false
 */
function checkWcardIschange(checked){
	var isChangeWcardProves = true;
	var isChangeContractStatus = true;
	var wcardIschange = true;
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:wcardId}, successCallbackFn,null,null,null,false);
	function successCallbackFn(result) {
		var data = result.data;
		var nowContractStatus = data.contractStatus;
		var nowWcardProcess = data.wcardProcess;
		if(nowWcardProcess == wcardProcess){
			isChangeWcardProves =  false;
		};
		if(nowContractStatus == contractStatus){
			isChangeContractStatus =  false;
		};
		if(isChangeWcardProves == false && isChangeContractStatus == false){
			wcardIschange = false;
		}else{
			if(!checked){
				if(isChangeWcardProves == true){
					var ms = "当前工单的状态已经发生变化，请您关闭当前页面，点击查询更新数据后处理。";
				}else{
					var ms = "当前合同的状态已经发生变化，请您关闭当前页面，点击查询更新数据后处理。";
				};
				layer.alert(ms,{icon:2,title:"提示",closeBtn:0},function(index){
					backPage();
				});
			}
		}
	};
	return wcardIschange;
}
/*
 * 保存操作
 */
function saveContent(){
	if(parm.taskDefinitionKey == "GDQR"){
		var submitData = {};
		var adminCommitment = $("#adminCommitmentContent input[name='adminCommitment']:checked").val();
		if(!adminCommitment){
			adminCommitment = 0;
		};
		submitData.wcardId = wcardId;
		submitData.validity = {};
		submitData.validity.adminCommitment = adminCommitment;
		submitData.validity.validityId = $("#validityId").val();
		submitData.validity.contractNumber = contractNumber;
		if($("#contractScanCopyUpload")[0]){
			submitData.contractScanCopyUpload = getValue_contractScanCopyUpload();
    	};
		saveContentPost(submitData,"GDQR");
	}else{
		//删除多余表格内的数据
		removeMoreThanTablecontent();
		//检查是否长度超长
		if(checkDomOverlength()){
			return false;
		};
		var submitData = getContentValue();
		if(submitData){
			saveContentPost(submitData,"GDCL");
		}
	}
}
/*
 * 保存提交后台
 */
function saveContentPost(data,type){
	$("#saveBtn").attr("disabled",true);
	var postData = JSON.stringify(data);
	if(type == "GDCL"){
		var url = serverPath + "contractOrderEditorController/saveOrderEditorInfo";
	}else if(type == "GDQR"){
		var url = serverPath + "contractOrderEditorController/saveOrderEditorApprovalInfo";
	}
	App.formAjaxJson(url, "post", postData, successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		if(data.success == "000"){
			showLayerErrorMsg(data.message);
		}else{
			setPageIdCallback(data);
			layer.msg("保存成功");
			$("#saveBtn").attr("disabled",false);
		}
	}
	function improperCallback(result){
		var ms = result.message;
		showLayerErrorMsg(ms);
		$("#saveBtn").attr("disabled",false);
	}
}
/*
 * 请求工单模块，获取基本信息及各模块的url
 */
var getContractOrderBaseInfoData = null;
function getWorkOrderInfo(){
	App.formAjaxJson(serverPath + "contractOrderEditorController/listDomainInfo", "post", JSON.stringify({wcardId:wcardId}), successCallback, improperCallback);
	function successCallback(result) {
		var data = result.data;
		var wcardType = "未知类型";
		if(data.length > 0){
			var domObj = [];
			contractId = data[0].contractId;
			contractNumber = data[0].contractNumber;
			wcardTypeCode = data[0].wcardTypeCode;
			wcardProcess = data[0].wcardProcess;
			wcardStatus = data[0].wcardStatus;
			if(isEdit== true && wcardProcess == 2 && data[0].wcardStatus == 904020){
				isCancelApproved = true;
			}else{
				$("#cancelApprovedBtn").remove();
			};
			if(wcardTypeCode == 1){
				wcardType = "收入类";
			}else if(wcardTypeCode == 2){
				wcardType = "支出类";
			}else if(wcardTypeCode == 0){
				wcardType = "其他";
			};
			for(var i = 0; i < data.length; i++){
				var item = {
					key:data[i].domainEntityName,
					value:data[i].domainUrl
				}
				domObj.push(item);
			};
			getContractOrderBaseInfor(domObj,wcardTypeCode);
		}else{
			$pageContent.removeClass("hidden");
			showLayerErrorMsg("当前工单暂无信息");
		};
		$(".wcardType").text(wcardType);
	}
	function improperCallback(result){
		$pageContent.removeClass("hidden");
		showLayerErrorMsg(result.message);
	}
}
/*
 * 请求工单基本信息，加载各区域页面
 */
function getContractOrderBaseInfor(domObj,wcardTypeCode){
	var postData = JSON.stringify({wcardId:wcardId,wcardType:wcardTypeCode});
	App.formAjaxJson(serverPath + "contractOrderEditorController/getContractOrderBaseInfoId", "post", postData, contractBaseInfoCallback, contractBaseInfoimproper);
	function contractBaseInfoCallback(resultData) {
		var baseData = resultData.data;
		if(baseData){
			getContractOrderBaseInfoData = baseData;
			contractStatus = baseData.contractStatus;
			contractAttr.provinceCode = baseData.provinceCode;
			contractAttr.executeDeptCode = baseData.executeDeptCode;
			contractAttr.city = baseData.staffOrgBandOne.orgCode;
			contractType = baseData.contractType;
			if(contractStatus != 1){
				isEdit = false;
				specialDomEdit = false;
			};
			if(parm.taskFlag == "db"){
				var flowParam = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
				parm.processDefinitionKey = flowParam.processDefinitionKey;
				if(!parm.taskId){
					parm.taskId = flowParam.taskId;
				};
				if(parm.taskDefinitionKey == "GDQR"){
					if(contractAttr.executeDeptCode == "00450080365" || contractAttr.provinceCode == "hi" || contractAttr.provinceCode == "sc"){
						//特殊省份GDQR设置自定义规则
						setCustomRule(flowParam);
					}else{
						$("#activateBtn").click(activateContract);		//走原激活方法
						$("#sendBackBtn").click(sendBack);				//走原退回承办人方法
					}
				}
			};
			$pageContent.removeClass("hidden");
			//设置各dom元素
			setDomContent(domObj);
			//客户经理待办确认，不进行任何操作，待办变已办。
			if(parm.taskDefinitionKey == "KHQR"){
				customerManagerFinish();
			};
			//如果为工单待办激活请求已阅接口
			setHaveRead();
		}else{
			$pageContent.removeClass("hidden");
			showLayerErrorMsg("当前工单暂无信息");
		}
	};
	function contractBaseInfoimproper(result){
		$pageContent.removeClass("hidden");
		showLayerErrorMsg(result.message);
	}
}
/*
 * 设置dom元素，并load进入
 */
function setDomContent(domObj) {
	var loadFlag = 0;
	var loadEndLen = domObj.length;
	for(var i = 0; i < domObj.length; i++){
		var k = domObj[i].key;
		var v = domObj[i].value;
		var domHtml = '<div id="' + k + '" class="form-wrapper" data-target="' + k + '"></div>';
		$("#workOrderContent").append(domHtml);
		$("#" + k + "").load(v, function() {
			loadFlag++;
			if(loadFlag == loadEndLen) {
				loadComplete();
			}
		});
	};
}
/*
 * 特殊省份GDQR设置自定义规则
 * contractAttr.executeDeptCode == "00450080365" 广西省本部承办部门为战略客户部（部门编码：00450080365）
 * contractAttr.provinceCode == "hi" 海南省
 * contractAttr.provinceCode == "sc" 四川省
 */
function setCustomRule(flowParam){
	if(contractAttr.executeDeptCode == "00450080365"){
		if(flowParam.nowtaskDefinitionKey == "BMQR"){		//部门合同管理员盖章确认
			customRuleForDepart(1);
		}else if(flowParam.nowtaskDefinitionKey == "GSQR"){	//公司合同管理员盖章确认
			if(flowParam.beforeTaskDefinitionKey == "GDCL"){		//上一步为工单处理
				$("#activateBtn").click(activateContract);
				$("#sendBackBtn").click(sendBack);
			}else if(flowParam.beforeTaskDefinitionKey == "BMQR"){	//上一步为部门合同管理员确认
				customRuleForCompany("部门合同管理员");
			}
		}
	}else if(contractAttr.provinceCode == "hi"){
		if(flowParam.nowtaskDefinitionKey == "GZGZ"){		//公章管理员盖章
			customRuleForDepart(2);
		}else if(flowParam.nowtaskDefinitionKey == "HTGD"){	//合同管理员归档
			customRuleForCompany("公章管理员");
		}else if(flowParam.nowtaskDefinitionKey == "GDQR"){
			$("#activateBtn").click(activateContract);		//走原激活方法
			$("#sendBackBtn").click(sendBack);				//走原退回承办人方法
		}
	}else if(contractAttr.provinceCode == "sc"){
		if(flowParam.nowtaskDefinitionKey == "BMQR"){		//部门合同管理员审核
			customRuleForDepart(1);
		}else if(flowParam.nowtaskDefinitionKey == "GSQR"){	//公司合同管理员审核
			customRuleForCompany("部门合同管理员");
		}
	};
}
function customRuleForDepart(type){
	if(type == 1){
		$("#activateBtn").click(pushGDQRWorkflowOfDepart);
	}else if(type == 2){
		$("#activateBtn").click(chooseWorkflowLink);
	};
	$("#activateBtn span").html("下一步");
	$("#sendBackBtn").click(sendBack);
}
function customRuleForCompany(name){
	specialDomEdit = false;
	$("#saveBtn").remove();
	$("#activateBtn").click(pushGDQRWorkflowOfCompany);
	$("#sendBackBtn span").html("退回上一步");
	$("#sendBackBtn").data("btnname",name);
	$("#sendBackBtn").click(sendBackLastStep);
}
/*
 * 检查工单状态是否属于该流程
 */
function checkWcardProcessId(){
	var isPass = false;
	if(parm.taskFlag == "db"){
		if(parm.taskDefinitionKey == "GDCL"){
			if(wcardProcess == 0 || wcardProcess == 2){
				isPass = true;
			}
		}else if(parm.taskDefinitionKey == "GDQR"){
			if(wcardProcess == 1){
				isPass = true;
			}
		}else if(parm.taskDefinitionKey == "GXZZ" || parm.taskDefinitionKey == "KHQR" || parm.taskDefinitionKey == "TJKH"){
			if(wcardStatus == "904030"){
				isPass = true;
			}
		}else if(parm.taskDefinitionKey == "SEALAPPLY" || parm.taskDefinitionKey == "SEALED"){
			if(wcardProcess == 0){
				isPass = true;
			}
		};
	}else{
		isPass = true;
	};
	return isPass;
}
/*
 * 检查合同状态是否为审批中
 */
function returnContractStatus(){
	if(parm.taskFlag == "db"){
		if(parm.taskDefinitionKey == "GXZZ" || parm.taskDefinitionKey == "KHQR" || parm.taskDefinitionKey == "TJKH"){
			if(contractStatus == 8){
				return false;
			}else if(contractStatusObj[contractStatus] == undefined){
				return "当前合同状态未知，请稍后操作。";
			}else{
				return '当前合同处于"'+contractStatusObj[contractStatus]+'"状态，不能进行下一步操作。';
			}
		}else{
			if(contractStatus == 1){
				return false;
			}else if(contractStatusObj[contractStatus] == undefined){
				return "当前合同状态未知，请稍后操作。";
			}else{
				return '当前合同处于"'+contractStatusObj[contractStatus]+'"状态，不能进行下一步操作。';
			}
		};
	}else{
		return false;
	};
}
/*
 * dom区域全部加载完成后的函数
 */
function loadComplete() {
	var contractStatusMs = returnContractStatus();
	if(!checkWcardProcessId()){
		layer.alert("当前工单的状态已经发生变化，请您关闭当前页面，点击查询更新数据后处理。",{icon:2,title:"提示",closeBtn:0},function(index){
			layer.close(index);
			backPage();
		});
	}else if(contractStatusMs){
		if(parm.pageType == 2){
			layer.alert(contractStatusMs,{icon:2,title:"提示",closeBtn:0},function(index){
				layer.close(index);
			});
		}
	};
	formSubmit = true;
	//页面元素初始化
	App.init();
	//加载意见
	getBusiProcessInfoID();
	//加载快捷跳转
	setSpeedyJump();
	//增加事件委托，input失去焦点时检查是否maxLength超长
	$workOrderContentForm.on("blur","input,textarea",function(){
		checkMaxLength(this);
	});
	if(editIdentify.isCanUpdateExpiryDate){
		srolloOffect("#payerAccountInfo",3);
	}else if(editIdentify.isCanUpdateCustomerManager){
		srolloOffect("#customerManagerList",2);
	};
}

/*
 * 滚动到相应位置高度
 */
function srolloOffect(el,srolloParm){
	var elName = $(el).find("input").attr("name");
	var overviewDomList = ["partyATelephone","partyZTelephone","partyALegalperson","partyZLegalperson","partyARegaddr","partyZRegaddr","partyAContact","partyZContact"];
	if($.inArray(elName,overviewDomList) != -1){
		if($("#partyContent").hasClass("hidden")){
			$("#partyMore").click();
		}
	};
	var scrollTopParm = 170;
	if(srolloParm == 1){
		if($(el).parents("#incomeLinerentTbody")[0]){
			var scrollLeftValue = $("#incomeLinerentTableContent").scrollLeft() + $(el).offset().left - $pageContent.width() + 630;
			$("#incomeLinerentTableContent").scrollLeft(scrollLeftValue);
		}
	}else if(srolloParm == 2){
		scrollTopParm = 130;
	}else if(srolloParm == 3){
		scrollTopParm = -130;
	};
	var v = $pageContent.scrollTop();
	var scrollTopValue = v + $(el).offset().top - scrollTopParm;
	$pageContent.animate({
		scrollTop:scrollTopValue
	},300)
}
/*
 * 提示错误信息
 * 其余当前页面提示异常
 */
function showLayerErrorMsg(ms,isAlert){
	if(isAlert){
		layer.alert(ms,{icon:2,title:"提示"});
	}else{
		layer.msg(ms);
	}
	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}
/*
 * 设置快捷跳转
 */
function setSpeedyJump(){
	var data = titleIconList[wcardTypeCode];
	var html = "";
	$.each(data, function(k,v) {
		if($(v.jumpId)[0]){
			html += '<button type="button" onclick="srolloOffect(\''+v.jumpId+'\',2);" class="btn primary btn-inline">'+ v.title +'</button>';
		}
	});
	$("#wcardTypeMenuContent").html(html);
}
$("#workOrderMenu").hover(function(){
	$(this).css("padding-left","120px");
},function(){
	$(this).css("padding-left","0");
})
/*
 * 获取表单信息
 * 验证各页面返回值，页面内的方法判断都错误时返回false，会阻止提交操作
 * 若都无错误进行下一步操作
 * isSubmit == true 子页面会收到此参数进行逻辑上的判断
 */
function getContentValue(isSubmit) {
	var submitData = {};
	var isPass = true;
    //各页面返回信息验证
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("getValue_" + targetObj)){
			return true;
		};
		var itemFn = eval('getValue_' + targetObj);
		var itemValue = itemFn(isSubmit);
		if(itemValue == "noValidator"){
			isPass = "noValidator";
		}else if(itemValue){
			submitData[targetObj] = itemValue;
		}else if(itemValue == false){
			isPass = false;
			return false;
		}
	});
	if(isPass == "noValidator"){						//保存时JS验证
		var errordata = $workOrderContentForm.find(".has-error:first").data("errordata");
		if(errordata){
			showLayerErrorMsg(errordata);
		}else{
			showLayerErrorMsg("当前工单表单校验未通过，请检查");
		};
    	srolloOffect($workOrderContentForm.find(".has-error:first")[0],1);
    	return false;
	}else if(isPass == true){
		if($("#wcardTagContent")[0]){
			submitData.wcardTag = $("#wcardTagContent input[name='wcardTag']:checked").val();
		};
		submitData.wcardId = wcardId;
		return submitData;
	}else{
		return false;
	};
}

/*
 * 去除表格内多于的行eval子页面
 */
function removeMoreThanTablecontent(){
    //各页面执行相应的方法，若页面无方法跳过
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("removeMorethan_" + targetObj)){
			return true;
		};
		var itemFn = eval('removeMorethan_' + targetObj);
		itemFn();
	});
}
/*
 * 子页面JS验证，不通过返回true
 */
function customValidator(){
	//各页面执行相应的方法，若页面无方法跳过
    var isNoPass = false;
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("customValidator_" + targetObj)){
			return true;
		};
		var itemFn = eval('customValidator_' + targetObj);
		var result = itemFn();
		if(result == false){
			isNoPass = true;
		};
	});
	return isNoPass;
}
/*
 * 保存或提交后更改各模块内对于ID值得callback函数
 * 页面内需声明"setPageId_"+约定各页面返回的ID值，  （约定为domain的name值即保存时的各模块key+ID）
 */
function setPageIdCallback(data){
	$.each(data, function(k,v) {
		if(!App.isExitsFunction("setPageId_" + k)){
			return true;
		};
		var itemCallbackFn = eval('setPageId_' + k);
		itemCallbackFn(v);
	});
}

/*
 * 表单验证
 * 注意！！！！！excluded: [':disabled'],隐藏域也会验证,若有需要请使用App.enableFieldValidators()禁用开启验证
 * 每个页面中单独往里增加内容
 */
function validate() {
	$workOrderContentForm.bootstrapValidator({
		live: 'disabled',		//enabled
		trigger: 'live focus keyup change',
		message: '校验未通过',
		container: 'popover',
		excluded: [':disabled',":not(:visible)"],
		fields: {}
	});
}
/*
 * 下载模板
 */
function exmportTemplate(parm){
	var postData = {
		templateCode: parm
	};
	App.formAjaxJson(serverPath + "contractOrderEditorController/downloadContractExcelTemplate", "get", postData, successCallback);
	function successCallback(result) {
		var key = result.data.fileStoreId;
		if(key){
			var url = serverPath + 'fileload/downloadS3?key='+key;
    		location.href = encodeURI(url);	
		}else{
			showLayerErrorMsg("暂无该模板");
		}
	}
}
/*
 * 不能为空的验证信息
 */
function addNotEmptyValidatorField(name,msg){
	var notEmptyValidatorField = {
		notEmpty : {
			message : msg
		}
	}
   	App.addValidatorField("#workOrderContentForm",name,notEmptyValidatorField);
}
/*
 * 检查页面错误项中是否有超长的元素（不精确，为用户点击触发后才生效）
 */
function checkDomOverlength(checked){
	var overLengthDom = $workOrderContentForm.find(".has-error.overlength:first")[0];
	if(overLengthDom && checked){
		return true;
	}else if(overLengthDom){
		srolloOffect(overLengthDom,1);
		var limitLen = $(overLengthDom).find("input,textarea").attr("maxlength");
		var labelName = $(overLengthDom).find("label").text();
		if(labelName){
			labelName = labelName.substring(0,labelName.length-1);
		}else{
			labelName = "该输入框";
		};
		showLayerErrorMsg(labelName+"限制输入"+limitLen+"个字符");
		$(overLengthDom).find("input").focus();
		return true;
	}else{
		return false;
	}
}
/*
 * 获取字符串长度（汉字算两个字符，字母数字算一个）
 */
function getByteLen(val) {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
	    var a = val.charAt(i);
	    if (a.match(/[^\x00-\xff]/ig) != null) {//\x00-\xff→GBK双字节编码范围
            len += 2;
        }
        else {
            len += 1;
        }
    }
    return len;
}
/*
 * 失去焦点时的触发事件，检查是否超长
 */
function checkMaxLength(dom){
	var len = getByteLen($(dom).val());
	var maxLength = $(dom).attr("maxlength");
	var formGroupDom = $(dom).parents(".form-group");
	if(maxLength < len){
		showLayerErrorMsg("输入字段超长，请输入不超过"+maxLength+"个字符！");
		formGroupDom.addClass("has-error overlength");
	}else{
		if(formGroupDom.hasClass("overlength")){
			formGroupDom.removeClass("overlength has-error");
		}
	}	
}

/*
 * 设置表格input，select的placeholder值，不能编辑时为空
 */
function setPTip(t){
	if(isEdit){
		return t;
	}else{
		return "";
	}
}
/*
 * 获取流程图
 */
function getFlowchart(){
	if(parm.processInstanceId){
		var processInstanceId = parm.processInstanceId;
	}else{
		var flowParams = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
		var processInstanceId = flowParams.processInstanceId;
	};
	if(processInstanceId != undefined && processInstanceId != ""){
		var imgurl = serverPath + 'workflowrest/flowchart/' + processInstanceId+"/"+parseInt(10*Math.random());
		var xhr = new XMLHttpRequest();
	    xhr.open("get", imgurl, true);
	    xhr.responseType = "blob";
	    xhr.onload = function() {
	        if (this.status == 200) {
	        	var blob = this.response;
	            var img = document.createElement("img");
	            img.onload = function(e) {
	            	window.URL.revokeObjectURL(img.src); 
	            };
	            img.src = window.URL.createObjectURL(blob);
　　　　　　　	$("#flowchartImage").html(img);
	        } 
	    } 
	    xhr.send();
		$("#flowchartModal").modal("show");
	}else{
		showLayerErrorMsg("获取流程参数异常");
	}
}
/*
 * 获取流程历史
 */
function getFlowhistory(){
	if(parm.processInstanceId){
		var processInstanceId = parm.processInstanceId;
	}else{
		var flowParams = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
		var processInstanceId = flowParams.processInstanceId;
	};
	if(processInstanceId != undefined && processInstanceId != ""){
		$.get(serverPath + "workflowrest/histoicflow/" + processInstanceId,function(data) {
			if (data.retCode == 1){
				$("#flowhistoryContent").css("max-height",$(".page-content").height() - 200);
				var result = data.dataRows;
				var html = '';
				for (var i = 0; i < result.length; i++) {
					var item = result[i];
					var startTime = item.startTime == null ? '' : App.formatDateTime(item.startTime);
					var endTime = item.endTime == null ? '' : App.formatDateTime(item.endTime);
					var assigneeName = item.assigneeName;
					if(item.replace == true){
						var fromUserName = item.fromUserName;
						assigneeName = assigneeName + "（ "+ fromUserName + "——待办授权）"
					};
					html += "<tr>"+
								"<td class='align-center'>"+(i+1)+"</td>"+
								"<td>"+item.linkName+"</td>"+
								"<td>"+assigneeName+"</td>"+
								"<td>"+item.orgName+"</td>"+
								"<td>"+item.handleType+"</td>"+
								"<td>"+startTime+"</td>"+
								"<td>"+endTime+"</td>"+
								"<td class='whiteSpaceNormal'>"+ item.userComment + "</td>"+
							"</tr>";
				}
				$("#flowhistoryTbody").html(html);
				$("#flowhistoryModal").modal("show");
			} else {
				showLayerErrorMsg(data.retValue);
			};
		});
	}else{
		showLayerErrorMsg("获取流程参数异常");
	}
}
/*
 * 若为工单激活设置已阅
 */
function setHaveRead(){
	if(parm.taskFlag == "db" && (parm.taskDefinitionKey == "GDQR" || parm.taskDefinitionKey == "SEALED") && parm.pageType == 2){
		var flowParams = App.getFlowParam(serverPath,wcardId,1,0,"contract_project2",contractAttr.provinceCode,contractAttr.city,"","","");
		$.ajax({
			url:serverPath + 'workflowrest/getTaskInfo?processInstanceId='+flowParams.processInstanceId+'&taskId='+flowParams.taskId+'&businessId='+wcardId, 
			type:"POST",
			success:function(result){
				if (result.success == 1) {
					var taskInfo = result.taskInfo;
					taskInfo.name = taskInfo.linkName;
					delete taskInfo.linkName;
					$.ajax({
						url:serverPath + 'workflowrest/taskToDoDetail', 
						type: "POST",
						data: taskInfo,
						success:function(data){},
						error:function(e){
							App.ajaxErrorCallback(e);
						}
					});
				} else {
					layer.msg(result.info);
				};
			},
			error:function(e){
				App.ajaxErrorCallback(e);
			}
		});
	}
	
}
/*
 * input双击事件
 */
//var tipsIndex = null;
//$("#workOrderContent").on("dblclick","input,textarea",function(){
//	if($(this).val().length > 0){
//		tipsIndex = layer.tips($(this).val(), this, {
//		  tips: [1, '#3595CC'],
//		  time: 0,
//		  closeBtn :2
//		});
//	}
//	
//})
//返回上一页
function backPage(){
	var isSave = false;
	var customerManagerCompList = [];
	var getCustomerManagerInfoCompList = [];
	if(parm.isucloud == "true"){
		layer.confirm("是否关闭此页面?",{icon:7,title:"提示"},function(index){
			top.closeWindow();
		});
	}else if(editIdentify.isCanUpdateCustomerManager == true){
		var customerManagerList = getValue_customerManagerList(true);
		if(customerManagerList.length != getCustomerManagerInfoList.length){
			layer.confirm("请确认是否需要保存。",{icon:7,title:"提示"},function(index){
				saveCustomerManager();
			}, function(){
				var pageId = self.frameElement.getAttribute('data-id');
				top.closeIfreamSelf(pageId);
			});
		}else{
			for (var i = 0; i < customerManagerList.length; i++) {
				customerManagerCompList.push(customerManagerList[i].managerId);
			}
			for (var j = 0; j < getCustomerManagerInfoList.length; j++) {
				getCustomerManagerInfoCompList.push(getCustomerManagerInfoList[j].managerId);
			}
			customerManagerCompList.sort();
			getCustomerManagerInfoCompList.sort();
			for (var q = 0; q < customerManagerCompList.length; q++) {
				if(customerManagerCompList[q] != getCustomerManagerInfoCompList[q]){
					isSave = true;
				}
			}
			if(isSave == true){
				layer.confirm("请确认是否需要保存。",{icon:7,title:"提示"},function(index){
					saveCustomerManager();
				}, function(){
					var pageId = self.frameElement.getAttribute('data-id');
					top.closeIfreamSelf(pageId);
				});
			}else{
				var pageId = self.frameElement.getAttribute('data-id');
				top.closeIfreamSelf(pageId);
			}
		}
	}else{
		window.history.go(-1);
	}
}
/*
 * 加载意见
 */
function getBusiProcessInfoID(){
	var url = serverPath + "contractOrderEditorController/getBusiProcessInfoID";
	App.formAjaxJson(url, "get", {wcardId:wcardId}, successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data.length > 0){
			var busiProcess = "";
			var o = 0;
			for(var i = data.length-1; i >= 0; i--){
				o++;
				var itemData = data[i];
				var createdName = itemData.createdName == null ? "" : itemData.createdName;
				busiProcess += "<p>【"+ o +"】  "+itemData.createdTypeName+"-"+createdName+"  "+itemData.flowTypeName+"："+itemData.pinfoContent+"  ("+itemData.ctreatedDate+")</p>";
			};
			var html = '<div class="form-fieldset"><div class="form-fieldset-title"><div class="fieldset-title"><p>工单处理意见</p><span></span></div><div class="form-fieldset-tools"></div></div><div class="form-fieldset-body">'+
				busiProcess+'</div></div>';
			if(isCancelApproved && parm.taskFlag == "db"){
				$("#workOrderContent").prepend(html);
			}else{
				$("#workOrderContent").append(html);
			}
		}
	}
}
/*
 * 滚动固定
 */
function fixToolBars(){
	$pageContent.scroll(function(){
		var topScroll = $pageContent.scrollTop();
		if(topScroll > 0){
			$("#scrollTopTool").css("display","block");
			$("#toolbarBtnContent").css({"position":"fixed","top":"0","width":"96.5%","z-index":"1000","background":"#fff","padding-top":"6px"});
		}else{
			$("#scrollTopTool").css("display","none");
			$("#toolbarBtnContent").css({"position":"static","width":"100%","padding-top":"0"});
		}
	});
	$("#scrollTopTool").on("click",function(){
		$pageContent.animate({
			scrollTop:0
		},300)
	})
}
/*
 * 客户经理确认待办变已办
 */
function customerManagerFinish(){
	var postData = App.getFlowParam(serverPath,wcardId,1,0,"Customer_add_Process",contractAttr.provinceCode,contractAttr.city,"","","");
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveCustomerManagerProcess", "post", JSON.stringify(postData));
}
/*
 * 在线查看
 */
function openOnlineView(filekey,filename){
	layer.confirm(filename, {btn: ['打开','保存','取消'],icon:7},function(index){
	  	var filenameList = filename.split(".");
	  	var fileType = filenameList[filenameList.length-1];
	  	var supImgType = ["BMP","JPEG","GIF","PNG","JPG","bmp","jpeg","gif","png","jpg"];
	  	if(fileType == "pdf" || fileType == "PDF"){
	  		if(App.IEVersionVA(9)) {
				layer.alert("您的浏览器版本过低不支持 pdf 在线查看，请使用IE9以上版本或者谷歌、火狐、360极速模式等现代浏览器查看，或点击保存按钮下载文件到本地查看。",{icon:2,area:'450px'});
			}else{
				var viewerUrl = encodeURIComponent(serverPath + "fileload/downloadS3?key=" + filekey);
				openFullWindow('/html/contReg/onlineView/pdf/web/viewer.html?file='+viewerUrl);
				layer.close(index);
			}
	  	}else if(fileType == "doc" || fileType == "docx" || fileType == "DOC" || fileType == "DOCX"){
	  		if(App.IEVersionVA(9)) {
				layer.alert("您的浏览器版本过低不支持 word 在线查看，请使用IE9以上版本或者谷歌、火狐、360极速模式等现代浏览器查看，或点击保存按钮下载文件到本地查看。",{icon:2,area:'450px'});
			}else{
				var viewerUrl = encodeURIComponent(serverPath + "fileload/downloadS3PreviewWord?key=" + filekey);
				openFullWindow('/html/contReg/onlineView/pdf/web/viewer.html?file='+viewerUrl);
				layer.close(index);
			}
	  	}else if(supImgType.indexOf(fileType) != -1){
	  		var viewerUrl = encodeURI('filename='+filename+'&filekey='+filekey+'&serverPath='+serverPath);
	  		openFullWindow('/html/contReg/onlineView/img/image.html?'+viewerUrl);
			layer.close(index);
	  	}else{
	  		layer.msg("系统暂不支持 ."+fileType+" 类型的文件在线查看,请点击保存按钮下载文件到本地查看。",{icon:2})
	  	};
	}, function(index){
		layer.close(index);
		location.href = serverPath + 'fileload/downloadS3?key=' + filekey;
	});
}
function openFullWindow(url){
 	var width = screen.availWidth;  
   	var height = screen.availHeight; 
	window.open(url,"在线预览","height="+height+",top=0,left=0,width="+width+",status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
}