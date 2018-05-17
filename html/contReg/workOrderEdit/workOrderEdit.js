//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var formSubmit = false;
var wcardId = null;
var contractId = null;				//合同ID
var wcardTypeCode = null;			//合同类型
var contractNumber = null;			//合同编号
var isEdit = false;						//是否可以编辑

if(parm.taskDefinitionKey == "GDCL" && parm.taskFlag == "db"){
	isEdit = true;
};

$(function() {
	if(parm.pageType == 1) {
		wcardId = parm.businessKey;
		$(".portlet-title").remove();
		$(".page-content,.portlet-body").css("padding", '0px');
		$(".portlet").css("cssText", "border:none !important;padding:0px");
		$(".toolbarBtn").remove();
		$(".page-content").removeClass("hidden");
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
		};
	} else if(parm.pageType == 2) {
		wcardId = parm.wcardId;
		if(parm.taskDefinitionKey == "GDCL" && parm.taskFlag == "db"){
			$("#toolbarBtnContent button").addClass("hidden");
			$(".saveBtn,.register,.closeBtn").removeClass("hidden");
		}else if(parm.taskDefinitionKey == "GDQR" && parm.taskFlag == "db"){
			$("#toolbarBtnContent button").addClass("hidden");
			$(".sendBackBtn,.activateBtn,.closeBtn").removeClass("hidden");
		};
		$(".page-content").removeClass("hidden");
		//固定操作按钮在70px的高度
		App.fixToolBars("toolbarBtnContent", 70);
	} else if(parm.pageType == 0) {
		wcardId = parm.wcardId;
		$(".toolbarBtn").remove();
		$(".page-content").removeClass("hidden");
	} else if(parm.pageType == 4) {
		wcardId = parm.wcardId;
		$("#toolbarBtnContent button").addClass("hidden");
		$(".closeBtn").removeClass("hidden");
		$(".page-content").removeClass("hidden");
		//固定操作按钮在70px的高度
		App.fixToolBars("toolbarBtnContent", 70);
	};
	
	getWorkOrderInfo();
})
/*
 * 工作流相关
 */
//通过或退回回调的方法
function beforePushProcess(pass){
	var result = true;
	var pathSelect = 0;
	//1，业务侧的校验，校验不通过则返回false
	if(formSubmit){
	//手动触发表单验证
		var bootstrapValidator = $('#workOrderContentForm').data('bootstrapValidator');
	    bootstrapValidator.validate();
	    if(!bootstrapValidator.isValid()){
	        parent.layer.alert("当前工单表单校验未通过，请检查",{icon:2,title:"错误"});
	        $($("#workOrderContentForm").find(".has-error")[0]).find("input,select").focus();
	    	return false;
	    }else{
	    	var submitData = getContentValue(true,false);
	    	if(!submitData){
				return false
			};
    	}
	}else{
		parent.layer.alert("页面加载失败",{icon:2,title:"错误"});
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
		"wcardId":wcardId,
		"title":""//可不传，如果需要修改待办标题则传此参数。
	};
	if(handleType == 1 && parm.taskDefinitionKey == "GDCL"){
		var datas = getContentValue(true);
		postData = $.extend(postData, datas);
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
		function successCallback(result) {
			var data = result.data;
			if(data.success == "000"){
				parent.layer.alert(data.message,{icon:2});
			}else{
				parent.layer.alert("注册成功！",{icon:1},function(){
					parent.modal_close();
				});
			}
		}
		function improperCallback(result){
			parent.layer.alert(result.message,{icon:2});
		}
	}else if(handleType == 2 && parm.taskDefinitionKey == "GDQR"){
		var pinfoContent = $('#comment', parent.document).val();
		postData.pinfoContent = pinfoContent;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderFallbackProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
		function successCallback(result) {
			var data = result.data;
			parent.layer.alert("退回成功！",{icon:1},function(){
				parent.modal_close();
			});
		}
		function improperCallback(result){
			parent.layer.alert(result.message,{icon:2});
		}
	}
}
//取消审批
function modal_passQxsp(flowParam){
	if(flowParam){
		var postData = flowParam;
	}else{
		var postData = {};
	};
	parent.layer.confirm("请确认是否取消该工单的审批。",{icon:7,title:"提示"},function(index){
		parent.layer.close(index);
		postData.wcardId = wcardId;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderCancelApprovalProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
		function successCallback(result) {
			parent.layer.alert("取消成功。",{icon:1},function(){
				//parent.modal_close();
			});
		}
		function improperCallback(result){
			parent.layer.alert(result.message,{icon:2});
		}
	});
}
//保存回调业务侧实现的方法。
function modal_save(){
	saveContent();
}
//转派前回调业务侧实现的方法，业务进行必要的校验等操作。
function beforeTransfer(){
	var result=true;
	//1,业务侧的校验
	
	//2，设置转派选人的参数
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
	}
	parent.setAssigneeParam(assigneeParam);
	return result;
}
//撤回代码示例，业务界面需要实现，可以拼接业务参数到后台，数据的更新和流程的撤回放在业务侧方法里，保持事务同步。
function modal_return(root, processInstanceId, taskId){
	//alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId);
	
	$.post(root + "business/withdrawProcess", {
		"processInstanceId" : processInstanceId,//流程实例
		"taskId" : taskId //任务id
	}, function(data) {
		alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
		// 成功后回调模态窗口关闭方法
		parent.modal_close();
	});
}


/*
 * 请求工单模块，获取基本信息及各模块的url
 */
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
			if(isEdit== true && data[0].wcardProcess == 2 && data[0].wcardStatus == 904020){
				if(parm.pageType == 1){
					//显示取消审批按钮
					parent.setQxspButton(true,parm.businessKey)
				}
				if(parm.pageType == 2){
					$("#cancelApprovedBtn").removeClass("hidden");
				}
			}else{
				$("#cancelApprovedBtn").remove();
			};
			
			if(wcardTypeCode == 1){
				wcardType = "收入类-租线合同";
			}else if(wcardTypeCode == 2){
				wcardType = "支出类-采购合同";
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
			setDomContent(domObj);
		}else{
			layer.alert("当前工单暂无信息",{icon:2,title:"错误"})
		};
		$("#wcardType").text(wcardType);
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
		var domHtml = '<div id="' + k + '" class="form-wrapper" data-target="' + k + '">';
		$("#workOrderContent").append(domHtml);
		$("#" + k + "").load(v + "?" + App.timestamp(), function() {
			loadFlag++;
			if(loadFlag == loadEndLen) {
				loadComplete();
			}
		});
	};
}
/*
 * dom区域全部加载完成后的函数
 */
function loadComplete() {
	formSubmit = true;
	App.init();
	validate();
}
/*
 * 获取表单信息
 * 验证各页面返回值，页面内的方法判断都错误时返回false，会阻止提交操作
 * 若都无错误进行下一步操作
 * isSubmit == true 子页面会收到此参数进行逻辑上的判断
 */
function getContentValue(isSubmit,isBack) {
	var submitData = {};
	var isPass = true;
    //各页面返回信息验证
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("getValue_" + targetObj)){
			return true;
		};
		var itemFn = eval('getValue_' + targetObj);
		var itemValue = itemFn(isSubmit,isBack);
		if(itemValue){
			submitData[targetObj] = itemValue;
		}else{
			isPass = false;
			return;
		}
	});
	if(isPass){
		return submitData;
	}else{
		return false;
	};
}
/*
 * 保存按钮点击
 */
function saveContent(){
	if(formSubmit){
		var submitData = getContentValue();
		if(submitData){
			console.log(submitData);
			var postData = JSON.stringify(submitData);
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorInfo", "post", postData, successCallback);
			function successCallback(result) {
				var data = result.data;
				setPageIdCallback(data);
				layer.msg("保存成功")
			}
		}
	}
}

/*
 * 提交按钮点击
 */
function submitContent(){
	if(formSubmit){
	//手动触发表单验证
		var bootstrapValidator = $('#workOrderContentForm').data('bootstrapValidator');
	    bootstrapValidator.validate();
	    if(!bootstrapValidator.isValid()){
	        layer.alert("当前工单表单校验未通过，请检查",{icon:2,title:"错误"});
	        $($("#workOrderContentForm").find(".has-error")[0]).find("input,select").focus();
	    	return false;
	    }else{
	    	var submitData = getContentValue(true);
	    	if(submitData){
				console.log(submitData);
				layer.msg("模拟提交");
			}
    	}	
	}
}
/*
 * 取消审批点击
 */
function cancelApproved(){
	layer.confirm("请确认是否取消该工单的审批。",{icon:7,title:"提示"},function(index){
		layer.close(index);
		var flowParam = App.getFlowParam(serverPath,parm.wcardId,8,1);
		flowParam.wcardId = wcardId;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderCancelApprovalProcess", "post", JSON.stringify(flowParam), successCallback,improperCallback);
		function successCallback(result) {
			layer.alert("取消成功。",{icon:1},function(){
				//parent.modal_close();
			});
		}
		function improperCallback(result){
			layer.alert(result.message,{icon:2});
		}
	});
}
/*
 * 退回确定点击
 */
function setPinfoContent(){
	var pinfoContent = $("#pinfoContent").val();
	if(pinfoContent == ""){
		layer.alert("请输入取消审批")
	}else{
		setPinfoContentFlowParam.pinfoContent = pinfoContent;
	};
	
}
/*
 * 表单验证
 * 每个页面中单独往里增加内容，提交时先验证表单
 */
function validate() {
	$('#workOrderContentForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup change',
		message: '校验未通过',
		container: 'popover',
		fields: {}
	});
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
//返回上一页
function backPage(){
	window.history.go(-1);
}
