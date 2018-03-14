
$(function(){ 
	$("#startProcess").load("../workflow/startpanel/process-start.html");
});

/*
 * 工作流模块示例：公共发起页面公用脚本文件
 * 
 * author:liyh
 * day:2017-04-21
 */
function modal_start(processDefinitionKey, assignee, taskDefinitionKey){
	alert(processDefinitionKey + "_" + assignee + "_" + taskDefinitionKey);
	
	$.post(serverPath + "business/startProcess", {
		"assignee" : assignee,
		"taskDefinitionKey" : taskDefinitionKey,
		"processDefinitionKey" : processDefinitionKey
	}, function(data) {
		alert(data.sign);
		
		// 成功后回调模态窗口关闭方法
		closeModalForStart();
	});
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


