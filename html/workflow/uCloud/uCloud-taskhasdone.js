var config = top.globalConfig;
var serverPath = config.serverPath;
//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
var processInstanceId=parm.processInstanceId;
var taskId=parm.taskId;
var businessId=parm.businessId;
$(function(){
	getTaskInfoHasdone();
});

//“查看”按钮触发事件
function handleTaskForDone(taskInfo) {
	var id=taskInfo.taskId;
	var taskDefinitionKey=taskInfo.taskDefinitionKey;
	var name=taskInfo.linkName;
	var processInstanceId=taskInfo.processInstanceId;
	var title=taskInfo.title;
	var processDefinitionId=taskInfo.processDefinitionId;
	var processDefinitionKey=taskInfo.processDefinitionKey;
	var executionId=taskInfo.executionId;
	var assignee=taskInfo.assignee;
	
	$('#taskIdForDone').val(id);
	$('#taskDefinitionKeyForDone').val(taskDefinitionKey);
	// 环节名称
	$('#nameForDone').val(name);
	$('#processInstanceIdForDone').val(processInstanceId);
	// 流程实例名称
	$('#titleForDone').val(title);
	$('#processDefinitionIdForDone').val(processDefinitionId);
	$('#processDefinitionKeyForDone').val(processDefinitionKey);
	$('#executionIdForDone').val(executionId);
	$('#assigneeIdForDone').val(assignee);
	$("#goTaskToDoDetailForDone").load("/html/workflow/taskdetail/task-hasdone.html");
	
	$("#goTaskToDoDetailForDone").show();
	$("#searchContentForDone").hide();
}

function getTaskInfoHasdone(){
//	var taskHasdoneData=null;
	$.ajax({
		url:serverPath + 'workflowrest/getTaskInfoHasdone?processInstanceId='+processInstanceId+'&taskId='+taskId+'&businessId='+businessId, 
		type:"POST",
		async:false,
		global:false,
		success:function(result){
			if (result.success == 1) {
				var taskHasdoneData = result.taskInfo;
				var taskId = taskInfo.taskId;
				var taskDefinitionKey = taskInfo.taskDefinitionKey;
				var name = taskInfo.linkName;
				var processInstanceId = taskInfo.processInstanceId;
				var title = taskInfo.title;
				var processDefinitionId = taskInfo.processDefinitionId;
				var processDefinitionKey = taskInfo.processDefinitionKey;
				var executionId = taskInfo.executionId;
				var assignee = taskInfo.assignee;
				redirectUrl(taskId, taskDefinitionKey, name, processInstanceId, title, processDefinitionId, processDefinitionKey, executionId, assignee)
//				handleTaskForDone(taskHasdoneData)
			} else {
				layer.msg(result.info);
			};
		},
		error:function(e){
			alert("获取流程参数异常"+e);
			App.ajaxErrorCallback(e);
		}
	});
	return taskHasdoneData;
}
/*
 * 对taskDefinitionKey为GDCL或GDQR的工单获取businessKey重定向到功能页面
 */
function redirectUrl(taskId, taskDefinitionKey, name, processInstanceId, title, processDefinitionId, processDefinitionKey, executionId, assignee){
	var canWithDrawForDoneData = {
		taskId: taskId,
		taskDefinitionKey: taskDefinitionKey,
		name: name,
		processInstanceId: processInstanceId,
		title: title,
		processDefinitionId: processDefinitionId,
		processDefinitionKey: processDefinitionKey,
		executionId: executionId,
		assigneeId: assignee
	}
	$.ajax({
		url:serverPath + 'workflowrest/taskHasDoneDetail', 
		type: "POST",
		data: canWithDrawForDoneData,
		success:function(data){
			var canWithDraw = data.canWithDraw;
			getRedirectUrl(taskId,taskDefinitionKey,processInstanceId,canWithDraw);
		},
		error:function(e){
			App.ajaxErrorCallback(e);
		}
	});
}
function getRedirectUrl(taskId,taskDefinitionKey,processInstanceId,canWithDraw){
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
		   		var src = "/html/contReg/workOrderEdit/workOrderEdit.html?pageType=3&taskFlag=yb&taskDefinitionKey="+taskDefinitionKey+"&wcardId="+businessKey+"&processInstanceId="+processInstanceId+"&canReturn="+canWithDraw+"&taskId="+taskId;
		   		App.changePresentUrl(src);
		   	}else{
		   		layer.msg("获取不到工单主键");
		   	}
		} else {
			layer.msg(data.retValue);
		}
	});
}