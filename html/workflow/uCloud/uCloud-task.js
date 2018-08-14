var config = top.globalConfig;
var serverPath = config.serverPath;
//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
var processInstanceId=parm.processInstanceId;
var taskId=parm.taskId;
var businessId=parm.businessId;
$(function(){
	getTaskInfo();
});

//“处理”按钮触发事件
function handleTaskToDo(taskInfo) {
	var id=taskInfo.taskId;
	var taskDefinitionKey=taskInfo.taskDefinitionKey;
	var name=taskInfo.linkName;
	var processInstanceId=taskInfo.processInstanceId;
	var title=taskInfo.title;
	var processDefinitionId=taskInfo.processDefinitionId;
	var processDefinitionKey=taskInfo.processDefinitionKey;
	var executionId=taskInfo.executionId;
	var assignee=taskInfo.assignee;
	
	$('#taskId').val(id);
	$('#taskDefinitionKey').val(taskDefinitionKey);
	// 环节名称
	$('#name').val(name);
	$('#processInstanceId').val(processInstanceId);
	// 流程实例名称
	$('#title').val(title);
	$('#processDefinitionId').val(processDefinitionId);
	$('#processDefinitionKey').val(processDefinitionKey);
	$('#executionId').val(executionId);
	$('#assigneeId').val(assignee);
	
	if(taskDefinitionKey == "GDCL" || taskDefinitionKey == "GDQR"){
		$("#goTaskToDoDetailForToDo").remove();
		$("#searchContentForToDo").hide();
		$("#businessiframe").show();
		redirectUrl(id,taskDefinitionKey,processInstanceId);
	}else{
		$("#goTaskToDoDetailForToDo").load("/html/workflow/taskdetail/task-todo.html");
		$("#goTaskToDoDetailForToDo").show();
		$("#searchContentForToDo").hide();
	}
}

function getTaskInfo(){
	var taskData=null;
	$.ajax({
		url:serverPath + 'workflowrest/getTaskInfo?processInstanceId='+processInstanceId+'&taskId='+taskId+'&businessId='+businessId, 
		type:"POST",
		async:false,
		global:false,
		success:function(result){
			if (result.success == 1) {
				taskData=result.taskInfo;
				handleTaskToDo(taskData)
			} else {
				layer.msg(result.info);
			};
		},
		error:function(e){
			alert("获取流程参数异常"+e);
			App.ajaxErrorCallback(e);
		}
	});
	return taskData;
}

/*
 * 对taskDefinitionKey为GDCL或GDQR的工单获取businessKey重定向到功能页面
 */
function redirectUrl(taskId,taskDefinitionKey,processInstanceId){
	$.post(serverPath + "workflowrest/tasktodopath/" + processInstanceId + "/" + taskDefinitionKey + "/" + taskId, null, function(data) {
		var success = data.retCode;
		if (success == 1){
			var param = data.dataRows[0].param;
			var resultParam = {};
			param = param.split("&");
			for(var i = 0; i < param.length; i ++) {   
		        resultParam[param[i].split("=")[0]] = param[i].split("=")[1];   
		   	};
		   	var businessKey = resultParam.businessKey;
		   	if(businessKey){
		   		jumpSanCpyQueryDetail(businessKey,taskDefinitionKey,processInstanceId);
		   	}else{
		   		layer.msg("获取不到工单主键");
		   	}
		} else {
			layer.msg(data.retValue);
		}
	});
}
function jumpSanCpyQueryDetail(businessId,taskDefinitionKey,processInstanceId){
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:businessId}, successCallback,null,null,false);
	function successCallback(result) {
		var wcardProcess = result.data.wcardProcess;
		var isPass = false;
		if(taskDefinitionKey == "GDCL"){
			if(wcardProcess == 0 || wcardProcess == 2){
				isPass = true;
			}
		}else if(taskDefinitionKey == "GDQR"){
			if(wcardProcess == 1){
				isPass = true;
			}
		};
		if(isPass == true){
			var src = "/html/contReg/workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey="+taskDefinitionKey+"&wcardId="+businessId+"&processInstanceId="+processInstanceId+"&isucloud=true";
			$('#businessiframe').attr("src",src);
		}else{
			layer.alert("当前工单的状态已经发生变化，请您关闭页面更新数据后处理。",{icon:2,title:"流程状态错误"},function(index){
				layer.close(index);
				closeWindow();
			});
		}
	}
}
function closeWindow(){
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
        window.location.href="about:blank";
        window.close();
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}
