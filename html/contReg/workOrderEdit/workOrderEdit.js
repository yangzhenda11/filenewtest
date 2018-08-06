//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var formSubmit = false;				//全局加载成功标识位
var provinceCode = "";				//合同所属省份
var wcardId = null;					//工单主键ID
var wcardTypeCode = null;			//工单类型，0：其他，1：收入类-租线合同，2：支出类-采购合同
var wcardProcess = null;			//工单处理状态  0:草稿/1:复核/2:退回/3:激活
var contractId = null;				//合同ID
var contractNumber = null;			//合同编号
var contractStatus = null;			//合同状态
var contracType = null;				//合同类型
var isEdit = false;					//是否可以编辑标识位
var fileUploadEdit = true;			//*特殊* 文件上传域是否可以编辑标识位
var isCancelApproved = false;		//是否为退回状态标识位
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
 * 页面是待办且为工单处理时才可以编辑
 */
if(parm.taskDefinitionKey == "GDCL" && parm.taskFlag == "db"){
	isEdit = true;
};

$(function() {
	if(parm.pageType == 1) {		//工作流页面进入
		wcardId = parm.businessKey;
		$(".page-content,.portlet-body").css("padding", '0px');
		$(".portlet").css("cssText", "border:none !important;padding:0px");
		$("#toolbarBtn").remove();
		$pageContent.removeClass("hidden");
		if(parm.taskFlag == "db"){
			if(parm.taskDefinitionKey == "GDCL"){
				//工单处理环节将提交按钮改为“注册完成” btId：passButton   
				parent.setUserBtName("passButton","注册完成");
				//工单处理环节将返回待办列表改为“关闭” btId：backTolist
				parent.setUserBtName("backTolist","关闭");
			}else if(parm.taskDefinitionKey == "GDQR"){
				//工单确认环节将提交按钮改为“工单激活” btId：passButton   
				parent.setUserBtName("passButton","激活合同");
				//工单处理环节将回退按钮改为“退回承办人” btId：backButton
				parent.setUserBtName("backButton","退回承办人");
				//工单处理环节将返回待办列表改为“关闭” btId：backTolist
				parent.setUserBtName("backTolist","关闭");
			};
		}
		if(parm.taskDefinitionKey == "GDCL"){
			$("#flowLable").text("工单处理");
		}else if(parm.taskDefinitionKey == "GDQR"){
			$("#flowLable").text("工单确认");
		};
	} else if(parm.pageType == 2) {		//工单处理和工单激活页面进入
		wcardId = parm.wcardId;
		$("#flowNote").remove();
		if(parm.taskDefinitionKey == "GDCL" && parm.taskFlag == "db"){
			$(".sendBackBtn,.activateBtn,.returnBtn").remove();
		}else if(parm.taskDefinitionKey == "GDQR" && parm.taskFlag == "db"){
			$(".register,.cancelApprovedBtn,.returnBtn").remove();
		};
		$pageContent.removeClass("hidden");
		App.fixToolBars("toolbarBtnContent", 0);
	} else if(parm.pageType == 0) {		//关联合同页面点击进入
		wcardId = parm.wcardId;
		$("#toolbarBtn,#flowNote").remove();
		$pageContent.removeClass("hidden");
	} else if(parm.pageType == 4) {		//工单查询页面进入
		wcardId = parm.wcardId;
		$("#flowNote").remove();
		$("#toolbarButton button").not(".closeBtn").remove();
		$pageContent.removeClass("hidden");
		App.fixToolBars("toolbarBtnContent", 0);
	} else if(parm.pageType == 3) {		//已办页面进入
		wcardId = parm.wcardId;
		$("#flowNote").remove();
		$("#toolbarButton button").not(".returnBtn,.flowhistoryBtn,.flowchartBtn,.closeBtn").remove();
		if(parm.canWithDraw != "true"){
			$(".returnBtn").remove();
		}
		$pageContent.removeClass("hidden");
		App.fixToolBars("toolbarBtnContent", 0);
	};;
	//加载验证壳
	validate();
	//请求工单模块，获取基本信息及各模块的url
	getWorkOrderInfo();
})

/*
 * 工作流相关
 */
//通过或退回回调的方法1(包括：工单注册，工单退回，工单激活)@工作流
function businessDispose(pass){
	var result = true;
	if(formSubmit){
		if(checkWcardIschange(true)){
			if(parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
					checkWcardIschange();
	    		});
	    	}else{
	    		checkWcardIschange();
	    	}
			result = false;
		};
		//删除表格内多余的数据
		removeMoreThanTablecontent();
		//检查是否长度超长
		if(checkDomOverlength(true)){
			if(parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
					checkDomOverlength();
	    		});
	    	}else{
	    		checkDomOverlength();
	    	}
			result = false;
		};
	}else{
		formSubmitFalse();
		result = false;
	};
	if(result){
		orderLayerIndex = layer.msg('表单验证中,请稍后...', {icon: 16,shade: 0.01,time:false});
	};
	return result;
}

//通过或退回回调的方法2(包括：工单注册，工单退回，工单激活)@工作流
function beforePushProcess(pass){
	var result = true;
	var pathSelect = 0;
	//手动触发表单验证	
	if(parm.taskDefinitionKey == "GDCL" && pass == true){
		var bootstrapValidator = $workOrderContentForm.data('bootstrapValidator');
	    bootstrapValidator.validate();
	    var customValiNoPass = customValidator();
	    layer.close(orderLayerIndex);
	    if(!bootstrapValidator.isValid() || customValiNoPass){
	    	if(parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
	    			showLayerErrorMsg("当前工单表单校验未通过，请检查");
		        	srolloOffect($workOrderContentForm.find(".has-error:first")[0],1);
	    		});
	    	}else{
	    		showLayerErrorMsg("当前工单表单校验未通过，请检查");
	        	srolloOffect($workOrderContentForm.find(".has-error:first")[0],1);
	    	}
	    	return false;
	    }
	};
	layer.close(orderLayerIndex);
	if(pass == true){
		var submitData = getContentValue(true);
		if(!submitData){
			if(parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
	    			getContentValue(true);
	    		});
	    	}else{
	    		getContentValue(true);
	    	}
	    	return false;
		};
	};
	if($("#contractScanCopyUpload")[0]){
		if(pass == true){
    		if(!submitData.contractScanCopyUpload.bodyDoc.bodyDocStoreId){
    			if(wcardTypeCode == 2){
    				var ms = "请上传合同签订盖章页扫描件后进行";
				}else{
					var ms = "请上传合同正文扫描件后进行";
				};
    			if(parm.taskDefinitionKey == "GDQR"){
    				ms = ms + "工单激活";
    			}else{
    				ms = ms + "工单注册";
    			};
    			if(parent.getActiveMyTab() != 0){
		    		parent.cutMyTab(0,function(){
		    			showLayerErrorMsg(ms);
						srolloOffect("#contractScanCopyUpload");
		    		});
		    	}else{
		    		showLayerErrorMsg(ms);
					srolloOffect("#contractScanCopyUpload");
		    	}
				return false;
			}
    	}
	}
	if(parm.taskDefinitionKey == "GDQR" && pass == true){
		var adminCommitmentValue = $("#adminCommitmentContent input[name='adminCommitment']:checked").val();
		if(adminCommitmentValue == null){
			if(parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
	    			showLayerErrorMsg("请勾选合同管理员确认信息");
					srolloOffect("#adminCommitmentContent");
	    		});
	    	}else{
	    		showLayerErrorMsg("请勾选合同管理员确认信息");
				srolloOffect("#adminCommitmentContent");
	    	};
			return false;
		};
	}
	//2,设置下一步选人的参数，用于匹配通用规则选人。	
	var assigneeParam = {
		prov: provinceCode,
		city: "",
		contracType: "",
		attrA: "",
		attrB: "",
		attrC: ""
	}
	parent.setAssigneeParam(assigneeParam);
	
	//3,设置路由值
	parent.setPathSelect(pathSelect);
	
	//4,设置选人单选还是多选。
	//var staffSelectType=$("#staffSelectType").val();
	//parent.setStaffSelectType(staffSelectType);
	
	return result;
}
//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_pass(root, taskDefinition, assignee, processInstanceId, taskId, comment, handleType, withdraw){
	var postData = {
		"processInstanceId" : processInstanceId,//当前流程实例
		"taskId" : taskId,//当前任务id
		"taskDefinitionKey" : taskDefinition,//下一步任务code
		"assignee" : assignee,//下一步参与者
		"comment" : comment,//下一步办理意见
		"handleType" : handleType,//处理类型，1为通过，2为回退
		"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
		//"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
		"title":""//可不传，如果需要修改待办标题则传此参数。
	};
	if(handleType == 1 && parm.taskDefinitionKey == "GDCL"){		//工单注册点击@工作流
		var datas = getContentValue(true);
		postData = $.extend(postData, datas);
		postData.wcardId = wcardId;
		postData.wcardType = wcardTypeCode;
		postData.contractName = $("#contractName").val();
		if($("#wcardTagContent")[0]){
			postData.wcardTag = $("#wcardTagContent input[name='wcardTag']:checked").val();
		};
		parent.$("#in-footer").modal("hide");
		parent.$("#out-footers button").not("#backTolist").attr("disabled",true);
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorProcess", "post", JSON.stringify(postData), successCallbackFn1, improperCallbackFn1);
		function successCallbackFn1(result) {
			parent.$("#out-footers button").not("#backTolist").attr("disabled",false);
			var data = result.data;
			if(data.success == "000"){
				showLayerErrorMsg(data.message);
			}else{
				parent.layer.alert("注册成功！",{icon:1},function(){
					parent.modal_close();
				});
			}
		}
		function improperCallbackFn1(result){
			parent.$("#out-footers button").not("#backTolist").attr("disabled",false);
			showLayerErrorMsg(result.message);
		}
	}else if(handleType == 2 && parm.taskDefinitionKey == "GDQR"){		//工单退回点击@工作流
		var pinfoContent = $('#comment', parent.document).val();
		postData.pinfoContent = pinfoContent;
		postData.busiId = wcardId;
		parent.$("#in-footer").modal("hide");
		parent.$("#out-footers button").not("#backTolist").attr("disabled",true);
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderFallbackProcess", "post", JSON.stringify(postData), successCallbackFn2, improperCallbackFn2);
		function successCallbackFn2(result) {
			parent.$("#out-footers button").not("#backTolist").attr("disabled",false);
			var data = result.data;
			parent.layer.alert("退回成功！",{icon:1},function(){
				parent.modal_close();
			});
		}
		function improperCallbackFn2(result){
			parent.$("#out-footers button").not("#backTolist").attr("disabled",false);
			showLayerErrorMsg(result.message);
		}
	}else if(handleType == 1 && parm.taskDefinitionKey == "GDQR"){		//工单激活点击@工作流
		parent.layer.confirm("注意：合同激活后将进入履行阶段。",{icon:7,title:"提示"},function(index){
			parent.layer.close(index);
			postData.validity = {};
			if($("#contractScanCopyUpload")[0]){
	    		postData.contractScanCopyUpload = getValue_contractScanCopyUpload(true);
	    	};
			postData.validity.adminCommitment = 1;
			postData.validity.validityId = $("#validityId").val();
			postData.wcardId = wcardId;
			postData.contractId = contractId;
			parent.$("#in-footer").modal("hide");
			parent.$("#out-footers button").not("#backTolist").attr("disabled",true);
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcess", "post", JSON.stringify(postData), successCallbackFn3, improperCallbackFn3);
			function successCallbackFn3(result) {
				parent.$("#out-footers button").not("#backTolist").attr("disabled",false);
				var data = result.data;
				parent.layer.alert("激活成功！",{icon:1},function(){
					parent.modal_close();
				});
			}
			function improperCallbackFn3(result){
				parent.$("#out-footers button").not("#backTolist").attr("disabled",false);
				showLayerErrorMsg(result.message);
			}
		});
	}
}
//工单处理取消审批按钮点击@工作流
function modal_passQxsp(flowParam){
	if(formSubmit){
		if(checkWcardIschange(true)){
			if(parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
					checkWcardIschange();
	    		});
	    	}else{
	    		checkWcardIschange();
	    	}
			return false;
		};
		if(flowParam){
			var postData = flowParam;
		}else{
			var postData = {};
		};
		parent.layer.confirm("请确认是否取消该工单的审批。",{icon:7,title:"提示"},function(index){
			parent.layer.close(index);
			postData.wcardId = wcardId;
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderCancelApprovalProcess", "post", JSON.stringify(postData), successCallback, improperCallback);
			function successCallback(result) {
				parent.layer.alert("取消成功。",{icon:1},function(index){
					parent.modal_close();
				});
			}
			function improperCallback(result){
				showLayerErrorMsg(result.message);
			}
		});
	}else{
		formSubmitFalse();
		return false;
	}
}
//保存回调业务侧实现的方法@工作流
function modal_save(){
	if(formSubmit){
		if(checkWcardIschange(true)){
			if(parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
					checkWcardIschange();
	    		});
	    	}else{
	    		checkWcardIschange();
	    	}
			return false;
		}else{
			saveContent();
		}
	}else{
		formSubmitFalse();
		return false;
	}
}
//撤回代码示例，业务界面需要实现，可以拼接业务参数到后台，数据的更新和流程的撤回放在业务侧方法里，保持事务同步@工作流
function modal_return(root, processInstanceId, taskId){
	if(formSubmit){
		if(checkWcardIschange()){
			return false;
		};
		var postData = {
			"processInstanceId": processInstanceId,	//流程实例
			"taskId": taskId,	//任务id
			"wcardId": wcardId	//工单ID
		}
		App.formAjaxJson(serverPath+"contractOrderEditorController/saveOrderWithdrawProcess", "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			parent.layer.alert("工单撤回成功",{icon:1},function(index){
				parent.modal_close();
			});
		}
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 页面加载失败时工作流提示
 */
function formSubmitFalse(){
	if(parent.getActiveMyTab() != 0){
		parent.cutMyTab(0,function(){
			showLayerErrorMsg("页面加载失败");
		});
	}else{
		showLayerErrorMsg("页面加载失败");
	};
}
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
 * 注册按钮点击@功能页面
 */
function submitContent(){
	if(formSubmit){
		if(checkWcardIschange()){
			return false;
		};
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
	    	}
    		var flowKey = "Contractproject2Process";
    		var linkcode = "GDQR";
    		var prov = provinceCode;
    		var callbackFun = "submitContentPost";
    		var staffSelectType = 1;
    		var contracType = "";
    		var city = "",attrA = "",attrB = "",attrC = "";	    		
			jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType,city,contracType,attrA,attrB,attrC);
		}
	}
}
/*
 * 工单注册后台提交@功能页面
 */
function submitContentPost(ORG_ID,org_code,full_name,STAFF_NAME,STAFF_ORG_ID,callbackFun){
	if(checkWcardIschange()){
		return false;
	};
	var postData = App.getFlowParam(serverPath,parm.wcardId,1,0);
	postData.assignee = STAFF_ORG_ID;
	postData.wcardId = wcardId;
	postData.wcardType = wcardTypeCode;
	postData.contractName = $("#contractName").val();
	var datas = getContentValue(true);
	postData = $.extend(postData, datas);
	if($("#wcardTagContent")[0]){
		postData.wcardTag = $("#wcardTagContent input[name='wcardTag']:checked").val();
	};
	$("#PandJstaffiframetask").modal("hide");
	$("#toolbarButton button").not(".closeBtn").attr("disabled",true);
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
		var ms = result.message;
		showLayerErrorMsg(ms);
		$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
	}
}
/*
 * 调出选人页面（参考工作流）
 */
function jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType,city,contracType,attrA,attrB,attrC){
	var frameSrc ="/html/workflow/assignee/assgigneeList.html"; 
    $("#PandJstaffiframetask").load(frameSrc,function() {
    	$("#PandJstaffiframetask").modal('show');
    	setParam(flowKey,linkcode,prov,callbackFun,staffSelectType,city,contracType,attrA,attrB,attrC);
    	$("#PandJstaffiframetask").off('shown.bs.modal').on('shown.bs.modal', function (e) {
			App.initDataTables('#searchStaffTable', "#searchEforgHome", dataTableConfig);
			$(".checkall").click(function () {
			      var check = $(this).prop("checked");
			      $(".checkchild").prop("checked", check);
			});
		})
    });
}
/*
 * 激活按钮点击@功能页面
 */
function activateContract(){
	if(formSubmit){
		if(checkWcardIschange()){
			return false;
		};
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
		layer.confirm("注意：合同激活后将进入履行阶段。",{icon:7,title:"提示"},function(index){
			layer.close(index);
			var postData = App.getFlowParam(serverPath,parm.wcardId,1,0);
			postData.validity = {};
			if($("#contractScanCopyUpload")[0]){
				postData.contractScanCopyUpload = getValue_contractScanCopyUpload(true);
	    	};
			postData.validity.adminCommitment = adminCommitment;
			postData.validity.validityId = $("#validityId").val();
			postData.wcardId = wcardId;
			postData.contractId = contractId;
			$("#toolbarButton button").not(".closeBtn").attr("disabled",true);
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcess", "post", JSON.stringify(postData), successCallback, improperCallback);
			function successCallback(result) {
				$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
				var data = result.data;
				layer.alert("激活成功！",{icon:1},function(){
					backPage();
				});
			}
			function improperCallback(result){
				$("#toolbarButton button").not(".closeBtn").attr("disabled",false);
				showLayerErrorMsg(result.message);
			}
		});
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 取消审批点击@功能页面
 */
function cancelApproved(){
	if(formSubmit){
		if(checkWcardIschange()){
			return false;
		};
		layer.confirm("请确认是否取消该工单的审批。",{icon:7,title:"提示"},function(index){
			layer.close(index);
			var flowParam = App.getFlowParam(serverPath,parm.wcardId,8,1);
			flowParam.wcardId = wcardId;
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderCancelApprovalProcess", "post", JSON.stringify(flowParam), successCallback);
			function successCallback(result) {
				layer.alert("取消成功。",{icon:1},function(index){
					layer.close(index);
					window.location.reload();
				});
			}
		});
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 退回点击@功能页面
 */
function sendBack(){
	if(formSubmit){
		if(checkWcardIschange()){
			return false;
		};
		$("#pinfoContentModal").modal("show");
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 退回确定按钮点击@功能页面
 */
function setPinfoContent(){
	var pinfoContent = $("#pinfoContent").val();
	if(pinfoContent == ""){
		layer.msg("请输入退回原因",{offset: '130px'});
	}else{
		if(checkWcardIschange()){
			return false;
		};
		var flowParam = App.getFlowParam(serverPath,parm.wcardId,2,0);
		$("#pinfoContentModal").modal("hide");
		flowParam.pinfoContent = pinfoContent;
		flowParam.busiId = wcardId;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderFallbackProcess", "post", JSON.stringify(flowParam), successCallback);
		function successCallback(result) {
			var data = result.data;
			layer.alert("退回成功！",{icon:1},function(){
				backPage();
			});
		}
	};
}
//撤回@功能页面
function returnProcess(){
	if(formSubmit){
		if(checkWcardIschange()){
			return false;
		};
		layer.confirm("当前流程将撤回本环节，是否确认？",{icon:7,title:"提示"},function(index){
			layer.close(index);
			var postData = {
				"processInstanceId": parm.processInstanceId,
				"taskId": parm.taskId,
				"wcardId": parm.wcardId
			};
			App.formAjaxJson(serverPath+"contractOrderEditorController/saveOrderWithdrawProcess", "post", JSON.stringify(postData), successCallback);
			function successCallback(result) {
				layer.alert("工单撤回成功",{icon:1},function(index){
					backPage();
				});
			}
		});
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
/*
 * 检查工单状态和合同状态是否发生了改变
 * 改变了返回true，没有改变返回false
 */
function checkWcardIschange(checked){
	var isChangeWcardProvess = true;
	var isChangeContractStatus = true;
	var wcardIschange = true;
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:wcardId}, successCallbackFn,null,null,null,false);
	function successCallbackFn(result) {
		var data = result.data;
		var nowContractStatus = data.contractStatus;
		var nowWcardProcess = data.wcardProcess;
		if(nowWcardProcess == wcardProcess){
			isChangeWcardProvess =  false;
		};
		if(nowContractStatus == 1){
			isChangeContractStatus =  false;
		};
		if(isChangeWcardProvess == false && isChangeContractStatus == false){
			wcardIschange = false;
		}else{
			if(!checked){
				if(isChangeWcardProvess == true){
					if(parm.pageType == 1){
						parent.layer.alert("当前工单的状态已经发生变化，请您关闭当前页面，点击查询更新数据后处理。",{icon:2,title:"提示",closeBtn:0},function(index){
							parent.modal_close();
						});
					}else{
						layer.alert("当前工单的状态已经发生变化，请您关闭当前页面，点击查询更新数据后处理。",{icon:2,title:"提示",closeBtn:0},function(index){
							backPage();
						});
					}
				}else{
					if(contractStatusObj[nowContractStatus] == undefined){
						showLayerErrorMsg('当前合同状态未知，请稍后操作');
					}else{
						showLayerErrorMsg('当前合同处于"'+contractStatusObj[nowContractStatus]+'"状态，不能进行下一步操作');
					}
				}
			}
		}
	}
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
		//删除多于表格内的数据
		removeMoreThanTablecontent();
		//检查是否长度超长
		if(parm.pageType == 1){
			if(checkDomOverlength(true)){
				if(parent.getActiveMyTab() != 0){
		    		parent.cutMyTab(0,function(){
						checkDomOverlength();
		    		});
		    	}else{
		    		checkDomOverlength();
		    	}
				return false;
			}
		}else{
			if(checkDomOverlength()){
				return false;
			}
		};
		var submitData = getContentValue();
		if(submitData){
			if($("#wcardTagContent")[0]){
				submitData.wcardTag = $("#wcardTagContent input[name='wcardTag']:checked").val();
			};
			saveContentPost(submitData,"GDCL");
		}else{
			if(parm.pageType == 1 && parent.getActiveMyTab() != 0){
	    		parent.cutMyTab(0,function(){
					getContentValue();
	    		});
			}
		}
	}
}
/*
 * 保存提交后台
 */
function saveContentPost(data,type){
	if(parm.pageType == 1){
		parent.$("#saveButton").attr("disabled",true);
	}else{
		$("#saveBtn").attr("disabled",true);
	};
	var postData = JSON.stringify(data);
	if(type == "GDCL"){
		var url = serverPath + "contractOrderEditorController/saveOrderEditorInfo";
	}else if(type == "GDQR"){
		var url = serverPath + "contractOrderEditorController/saveOrderEditorApprovalInfo"
	}
	App.formAjaxJson(url, "post", postData, successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		if(data.success == "000"){
			showLayerErrorMsg(data.message);
		}else{
			setPageIdCallback(data);
			if(parm.pageType == 1){
	    		parent.layer.msg("保存成功");
	    		parent.$("#saveButton").attr("disabled",false);
			}else{
				layer.msg("保存成功");
				$("#saveBtn").attr("disabled",false);
			}
		}
	}
	function improperCallback(result){
		var ms = result.message;
		showLayerErrorMsg(ms);
		if(parm.pageType == 1){
    		parent.$("#saveButton").attr("disabled",false);
		}else{
			$("#saveBtn").attr("disabled",false);
		}
	}
}
/*
 * 请求工单模块，获取基本信息及各模块的url
 */
var getContractOrderBaseInfoData = null;
function getWorkOrderInfo(){
	App.formAjaxJson(serverPath + "contractOrderEditorController/listDomainInfo", "post", JSON.stringify({wcardId:wcardId}), successCallback);
	function successCallback(result) {
		var data = result.data;
		var wcardType = "未知类型";
		if(data.length > 0){
			var domObj = [];
			contractId = data[0].contractId;
			contractNumber = data[0].contractNumber;
			wcardTypeCode = data[0].wcardTypeCode;
			wcardProcess = data[0].wcardProcess;
			if(isEdit== true && wcardProcess == 2 && data[0].wcardStatus == 904020){
				isCancelApproved = true;
				if(parm.pageType == 1){
					//显示取消审批按钮
					parent.setQxspButton(true,parm.businessKey);
				}
				if(parm.pageType == 2){
					$("#cancelApprovedBtn").removeClass("hidden");
				}
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
			var postData = JSON.stringify({wcardId:wcardId,wcardType:wcardTypeCode});
			App.formAjaxJson(serverPath + "contractOrderEditorController/getContractOrderBaseInfoId", "post", postData, contractBaseInfoCallback);
			function contractBaseInfoCallback(resultData) {
				var baseData = resultData.data;
				if(baseData){
					getContractOrderBaseInfoData = baseData;
					contractStatus = baseData.contractStatus;
					provinceCode = baseData.provinceCode;
					contractType = baseData.contractType;
					if(returnContractStatus()){
						isEdit = false;
						fileUploadEdit = false;
					}
					setDomContent(domObj);
				}else{
					showLayerErrorMsg("当前工单暂无信息");
				}
			}
		}else{
			showLayerErrorMsg("当前工单暂无信息");
		};
		$(".wcardType").text(wcardType);
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
 * 检查工单状态是否属于该流程
 */
function checkWcardProcessId(){
	var isPass = false;
	if(parm.taskFlag == "db"){
		var taskDefinitionKey = parm.taskDefinitionKey;
		if(taskDefinitionKey == "GDCL"){
			if(wcardProcess == 0 || wcardProcess == 2){
				isPass = true;
			}
		}else if(taskDefinitionKey == "GDQR"){
			if(wcardProcess == 1){
				isPass = true;
			}
		}
	}else{
		isPass = true;
	};
	return isPass;
}
/*
 * 检查合同状态是否为审批中
 */
function returnContractStatus(){
	if(contractStatus == 1){
		return false;
	}else if(contractStatusObj[contractStatus] == undefined){
		return "当前合同状态未知，请稍后操作。";
	}else{
		return '当前合同处于"'+contractStatusObj[contractStatus]+'"状态，不能进行下一步操作。';
	}
}
/*
 * dom区域全部加载完成后的函数
 */
function loadComplete() {
	var contractStatusMs = returnContractStatus();
	if(!checkWcardProcessId()){
		if(parm.pageType == 1){
			parent.layer.alert("当前工单的状态已经发生变化，请您关闭当前页面，点击查询更新数据后处理。",{icon:2,title:"提示",closeBtn:0},function(index){
				parent.layer.close(index);
				parent.modal_close();
			});
		}else{
			layer.alert("当前工单的状态已经发生变化，请您关闭当前页面，点击查询更新数据后处理。",{icon:2,title:"提示",closeBtn:0},function(index){
				layer.close(index);
				backPage();
			});
		}
	}else if(contractStatusMs){
		if(parm.pageType == 1 && parm.taskFlag == "db"){
			parent.layer.alert(contractStatusMs,{icon:2,title:"提示",closeBtn:0},function(index){
				parent.layer.close(index);
			});
		}else if(parm.pageType == 2){
			layer.alert(contractStatusMs,{icon:2,title:"提示",closeBtn:0},function(index){
				layer.close(index);
			});
		}
	}
	formSubmit = true;
	//页面元素初始化
	App.init();
	//加载意见
	getBusiProcessInfoID();
	//加载快捷跳转
	setSpeedyJump();
	//如果为工单待办激活请求已阅接口
	setHaveRead();
	//增加事件委托，input失去焦点时检查是否maxLength超长
	$workOrderContentForm.on("blur","input,textarea",function(){
		checkMaxLength(this);
	});
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
	var scrollTopParm = 140;
	if(srolloParm == 1){
		if($(el).parents("#incomeLinerentTbody")[0]){
			var scrollLeftValue = $("#incomeLinerentTableContent").scrollLeft() + $(el).offset().left - $pageContent.width() + 630;
			$("#incomeLinerentTableContent").scrollLeft(scrollLeftValue);
		}
	}else if(srolloParm == 2){
		if(parm.pageType == 1) {
			scrollTopParm = 0;
		}else{
			scrollTopParm = 130;
		}
	}else if(srolloParm == 3){
		scrollTopParm = -130;
	}
	var v = $pageContent.scrollTop();
	var scrollTopValue = v + $(el).offset().top - scrollTopParm;
	$pageContent.animate({
		scrollTop:scrollTopValue
	},300)
}
/*
 * 提示错误信息
 * 工作流页面parm.pageType == 1为父级页面提示异常
 * 其余当前页面提示异常
 */
function showLayerErrorMsg(ms,isAlert){
	if(isAlert){
		if(parm.pageType == 1){
			parent.layer.alert(ms,{icon:2,title:"提示"});
		}else{
			layer.alert(ms,{icon:2,title:"提示"});
		}
	}else{
		if(parm.pageType == 1){
			parent.layer.msg(ms);
		}else{
			layer.msg(ms);
		}
	}
	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}
/*
 * 设置快捷跳转
 */
function setSpeedyJump(){
	var data = titleIconList[wcardTypeCode];
	var html = "";
	if(parm.pageType == 1) {
		$.each(data, function(k,v) {
			if($(v.jumpId)[0]){
				html += '<li onclick="srolloOffect(\''+v.jumpId+'\',2)" data-placement="left" data-trigger="hover" data-toggle="tooltip" data-container="body" title="'+ v.title +'"><i class="iconfont '+ v.icon +'"></i></li>';
			}
		});
		$("#workOrderMenu").html(html);
		$("#workOrderMenu [data-toggle='tooltip']").tooltip();
	}else{
		$.each(data, function(k,v) {
			if($(v.jumpId)[0]){
				html += '<button type="button" onclick="srolloOffect(\''+v.jumpId+'\',2);" class="btn primary btn-inline">'+ v.title +'</button>';
			}
		});
		$("#wcardTypeMenuContent").html(html);
	}
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
		}else{
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
		}
    	srolloOffect($workOrderContentForm.find(".has-error:first")[0],1);
    	return false;
	}else if(isPass == true){
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
		var flowParams = App.getFlowParam(serverPath,parm.wcardId,1,0);
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
		var flowParams = App.getFlowParam(serverPath,parm.wcardId,1,0);
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
	if(parm.taskFlag == "db" && parm.taskDefinitionKey == "GDQR" && parm.pageType == 2){
		var flowParams = App.getFlowParam(serverPath,parm.wcardId,1,0);
		$.ajax({
			url:serverPath + 'workflowrest/getTaskInfo?processInstanceId='+flowParams.processInstanceId+'&taskId='+flowParams.taskId+'&businessId='+parm.wcardId, 
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
//$pageContent.on("scroll",function(){
//	if(tipsIndex){
//		layer.close(tipsIndex);
//		tipsIndex = null;
//	}
//})
//返回上一页
function backPage(){
	if(parm.isucloud == "true"){
		top.closeWindow();
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
				var createdName = data[i].createdName == null ? "" : data[i].createdName;
				if(data[i].createdType == 1){
					if(data[i].pinfoContent == "取消审批"){
						busiProcess += "<p>【"+ o +"】  合同承办人-"+createdName+"  取消审批  ("+data[i].ctreatedDate+")</p>";
					}else{
						busiProcess += "<p>【"+ o +"】  合同承办人-"+createdName+"  申报意见："+data[i].pinfoContent+"  ("+data[i].ctreatedDate+")</p>";
					};
				}else{
					busiProcess += "<p>【"+ o +"】  合同管理员-"+createdName+"  审核意见："+data[i].pinfoContent+"  ("+data[i].ctreatedDate+")</p>";
				}
			};
			var html = '<div class="form-fieldset"><div class="form-fieldset-title"><span><i class="iconfont icon-layers"></i> 工单处理意见</span><div class="form-fieldset-tools"></div></div><div class="form-fieldset-body">'+
				'<div class="row">'+busiProcess+'</div></div></div>';
			if(isCancelApproved && parm.taskFlag == "db"){
				$("#workOrderContent").prepend(html);
			}else{
				$("#workOrderContent").append(html);
			}
		}
	}
}