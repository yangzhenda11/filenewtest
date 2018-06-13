//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var isLoad = false;					//全局加载成功标识位
var id = parm.businessKey;			//主键ID
console.log(parm);

$(function() {
	$(".page-content,.portlet-body").css("padding", '0px');
	$(".portlet").css("cssText", "border:none !important;padding:0px");
	$(".page-content").removeClass("hidden");
	//获取合同信息
	getContractBaseInfo();
})

/*
 * 获取合同信息
 */
function getContractBaseInfo(){
	App.formAjaxJson(serverPath + "contractBaseInfo/getContractById?id="+1, "post", null, successCallback);
	function successCallback(result){
		var data = result.data;
		if(data){
			var valueCallback = {'approveDate':function(value){return App.formatDateTime(value,"yyyy-mm-dd")}}
			App.setFormValues("#contractBaseInfo",data,valueCallback);
		}else{
			parent.layer.msg("合同基本信息为空，请联系管理员");
		}
	}
}







/*
 * 工作流相关
 */
//通过或退回回调的方法@工作流
function beforePushProcess(pass){
	var result = true;
	var pathSelect = 0;
	//1，业务侧的校验，校验不通过则返回false
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus();
		if(!wcardCanSubmit){
			return false;
		};
		//删除表格内多余的数据
		removeMoreThanTablecontent();
		//手动触发表单验证
		var bootstrapValidator = $('#workOrderContentForm').data('bootstrapValidator');
	    bootstrapValidator.validate();
	    if(!bootstrapValidator.isValid()){
	    	showLayerErrorMsg("当前工单表单校验未通过，请检查");
	        srolloOffect($("#workOrderContentForm").find(".has-error")[0],1);
	    	return false;
	    }else{
	    	var submitData = getContentValue(true);
	    	if(!submitData){
				return false;
			};
    	};
    	if($("#contractScanCopyUpload")[0]){
    		if(pass == true){
	    		if(!submitData.contractScanCopyUpload.bodyDoc.storeId){
	    			if(parm.taskDefinitionKey == "GDQR"){
	    				var ms = "请上传合同正文扫描件后进行工单激活";
	    			}else{
	    				var ms = "请上传合同正文扫描件后进行工单注册";
	    			}
					showLayerErrorMsg(ms);
					srolloOffect("#contractScanCopyUpload");
					return false;
				}
	    	}
    	}
    	if(parm.taskDefinitionKey == "GDQR" && pass == true){
    		var adminCommitmentValue = $("input[name='adminCommitment']:checked").val();
			if(adminCommitmentValue == null){
				showLayerErrorMsg("请勾选合同管理员确认信息");
				srolloOffect("#adminCommitmentContent");
				return false;
			};
    	}
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
	//2,设置下一步选人的参数，用于匹配通用规则选人。
	var assigneeParam = { 
		"prov": "sd",  //省分，来自需求工单，必传
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
function modal_pass(root, taskDefinitionKey, assignee, processInstanceId, taskId, comment, handleType, withdraw){
	var postData = {
		"processInstanceId" : processInstanceId,//当前流程实例
		"taskId" : taskId,//当前任务id
		"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
		"assignee" : assignee,//下一步参与者
		"comment" : comment,//下一步办理意见
		"handleType" : handleType,//处理类型，1为通过，2为回退
		"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
		"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
		"title":""//可不传，如果需要修改待办标题则传此参数。
	};
	if(handleType == 1 && parm.taskDefinitionKey == "GDCL"){		//工单注册点击@工作流
		var datas = getContentValue(true);
		postData = $.extend(postData, datas);
		postData.wcardId = wcardId;
		postData.wcardType = wcardTypeCode;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorProcess", "post", JSON.stringify(postData), successCallback, improperCallback);
		function successCallback(result) {
			var data = result.data;
			if(data.success == "000"){
				showLayerErrorMsg(data.message);
			}else{
				parent.layer.alert("注册成功！",{icon:1},function(){
					parent.modal_close();
				});
			}
		}
		function improperCallback(result){
			showLayerErrorMsg(result.message);
		}
	}else if(handleType == 2 && parm.taskDefinitionKey == "GDQR"){		//工单退回点击@工作流
		var pinfoContent = $('#comment', parent.document).val();
		postData.pinfoContent = pinfoContent;
		postData.busiId = wcardId;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderFallbackProcess", "post", JSON.stringify(postData), successCallback, improperCallback);
		function successCallback(result) {
			var data = result.data;
			parent.layer.alert("退回成功！",{icon:1},function(){
				parent.modal_close();
			});
		}
		function improperCallback(result){
			showLayerErrorMsg(result.message);
		}
	}else if(handleType == 1 && parm.taskDefinitionKey == "GDQR"){		//工单激活点击@工作流
		parent.layer.confirm("注意：合同激活后将进入履行阶段。",{icon:7,title:"提示"},function(index){
			parent.layer.close(index);
			postData.validity = {};
			postData.contractScanCopyUpload = getValue_contractScanCopyUpload(true);
			postData.validity.adminCommitment = 1;
			postData.validity.validityId = $("#validityId").val();
			postData.wcardId = wcardId;
			postData.contractId = contractId;
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcess", "post", JSON.stringify(postData), successCallback, improperCallback);
			function successCallback(result) {
				var data = result.data;
				parent.layer.alert("激活成功！",{icon:1},function(){
					parent.modal_close();
				});
			}
			function improperCallback(result){
				showLayerErrorMsg(result.message);
			}
		});
	}
}
//工单处理取消审批按钮点击@工作流
function modal_passQxsp(flowParam){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus();
		if(!wcardCanSubmit){
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
					//parent.layer.close(index);
					//window.location.reload();
					parent.modal_close();
				});
			}
			function improperCallback(result){
				showLayerErrorMsg(result.message);
			}
		});
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
//保存回调业务侧实现的方法@工作流
function modal_save(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus();
		if(!wcardCanSubmit){
			return false;
		};
		saveContent();
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
//转派前回调业务侧实现的方法，业务进行必要的校验等操作@工作流
function beforeTransfer(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus();
		if(!wcardCanSubmit){
			return false;
		};
		var result=true;
		//1,业务侧的校验
		
		//2，设置转派选人的参数
		var assigneeParam = { 
				"prov": "sd",  //省分，来自需求工单，必传
		}
		parent.setAssigneeParam(assigneeParam);
		return result;
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
//撤回代码示例，业务界面需要实现，可以拼接业务参数到后台，数据的更新和流程的撤回放在业务侧方法里，保持事务同步@工作流
function modal_return(root, processInstanceId, taskId){
	if(formSubmit){
		//alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId);
		var wcardCanSubmit = checkContractStatus();
		if(!wcardCanSubmit){
			return false;
		};
		$.post(root + "business/withdrawProcess", {
			"processInstanceId" : processInstanceId,//流程实例
			"taskId" : taskId //任务id
		}, function(data) {
			alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
			// 成功后回调模态窗口关闭方法
			parent.modal_close();
		});
	}else{
		showLayerErrorMsg("页面加载失败");
		return false;
	}
}
