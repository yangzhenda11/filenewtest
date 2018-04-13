
$(function(){ 
	$("#startProcess").load("/html/workflow/startpanel/process-start.html",function() {
		// 根据业务标识选择流程模板。
		getProcessDefinitionKey("contract_ReleasePoint");
    });
});

/*
 * 工作流模块示例：公共发起页面公用脚本文件
 * 
 * author:liyh
 * day:2017-04-21
 */
function modal_start(processDefinitionKey, assignee, taskDefinitionKey,comment){
	//alert(processDefinitionKey + "_" + assignee + "_" + taskDefinitionKey);
	
	$.post(serverPath + "business/startProcess", {
		"processDefinitionKey" : processDefinitionKey,
		"assignee" : assignee,
		"taskDefinitionKey" : taskDefinitionKey,
		"comment":comment, 
		"title":"此待办为流程测试专用，表动哦，如需待办请通过需求管理自己启动哦。",
		"businessKey":""//业务主键,
	}, function(data) {
		alert(data.sign);
		// 成功后回调模态窗口关闭方法
		closeModalForStart();
	}).error(function() { alert("流程发起异常，请联系管理员！"); });
}

//待办公共页面点击选人按钮触发方法
function selectAssigneeForStart(flowLinkid){
	alert("业务侧示例，将公共页面“下环节处理人信息”处理完成，本次接受到的环节ID为：" + flowLinkid);
	$("#assigneeForStart").val(10001);
	$("#assigneeNameForStart").val("示例：处理人");
}

function setRelativeData(){
	return false;
}
function setFlowKey(){
	var processDefinitionKeyForStart = $("#processDefinitionKeyForStart").val();
	var processDefinitionKey = $("#processDefinitionKey").val();
	$("#processDefinitionKey").val(processDefinitionKeyForStart);
}
function flowStart(){
	//1,业务侧表单校验
	
	
	
	//2,传递选人参数
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
			}
	setAssigneeParam(assigneeParam);
	
	//3,调用以下方法打开下一步公共界面。传递参数为业务类型，比如合同类型，后台获取与之匹配的流程模板。
	showStartPanel();
}

