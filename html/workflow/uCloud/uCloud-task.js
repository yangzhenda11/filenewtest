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
	if(assignee.indexOf("candidate-") != -1){
		//是抢单模式抢到后的待办，处理人需要去掉前缀。
		assignee=assignee.substring(10);
	};
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
	var specialList = ["GDCL","GDQR","BMQR","GSQR","GZGZ","HTGD","KHQR","GXZZ"];
	if(specialList.indexOf(taskDefinitionKey) != -1){
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
	$.ajax({
		url:serverPath + 'workflowrest/getTaskInfo?processInstanceId='+processInstanceId+'&taskId='+taskId+'&businessId='+businessId, 
		type:"POST",
		async:false,
		global:false,
		success:function(result){
			if (result.success == 1) {
				taskData=result.taskInfo;
				var assignee=taskData.assignee;
				if(assignee.indexOf("candidate-") != -1){
					//抢单任务，先抢单再打开待办
					applyTaskToDo(taskData);
				}else{
					//普通待办打开
					handleTaskToDo(taskData);
				}
			} else {
				errorInfoSolve(result.info);
			};
		},
		error:function(e){
			App.ajaxErrorCallback(e);
		}
	});
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
		   		errorInfoSolve("获取不到工单主键");
		   	}
		} else {
			errorInfoSolve(data.retValue);
		}
	});
}
function jumpSanCpyQueryDetail(businessId,taskDefinitionKey,processInstanceId){
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:businessId}, successCallback,null,null,false);
	function successCallback(result) {
		var data = result.data;
		var wcardProcess = data.wcardProcess;
		var wcardStatus = data.wcardStatus;
		var contractStatus = data.contractStatus;
		var isPass = false;
		var GDQRSpecialList = ["GDQR","BMQR","GSQR","GZGZ","HTGD"];
		var editTaskDefinitionKey = "";
		if(taskDefinitionKey == "GDCL"){
			if(wcardProcess == 0 || wcardProcess == 2){
				isPass = true;
				editTaskDefinitionKey = "GDCL";
			}
		}else if(GDQRSpecialList.indexOf(taskDefinitionKey) != -1){
			if(wcardProcess == 1){
				isPass = true;
				editTaskDefinitionKey = "GDQR";
			}
		}else if(taskDefinitionKey == "KHQR" || taskDefinitionKey == "GXZZ"){
			if(wcardStatus == 904030 && contractStatus == 8){
				isPass = true;
				editTaskDefinitionKey = taskDefinitionKey;
			}
		};
		if(isPass == true){
			var src = "/html/contReg/workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey="+editTaskDefinitionKey+"&wcardId="+businessId+"&processInstanceId="+processInstanceId+"&isucloud=true";
			$('#businessiframe').attr("src",src);
		}else{
			errorInfoSolve("当前工单的状态已经发生变化，请您关闭页面更新数据后处理。");
		}
	}
}

function applyTaskToDo(taskInfo) {
	var id=taskInfo.taskId;
	var taskDefinitionKey=taskInfo.taskDefinitionKey;
	var processInstanceId=taskInfo.processInstanceId;
	var assignee=taskInfo.assignee;
	
	var flowParam = {
		"taskDefinitionKey" : taskDefinitionKey,
		"assignee" : assignee,
		"processInstanceId" : processInstanceId,
		"taskId" : id
	}
	
	$.post(serverPath + "workflowrest/applyCandidateTask", flowParam,function(data) {
		if (data.success == 1) {
			//抢单成功了，顺便打开待办页面，特殊环节不走通用打开待办模式，打开单独个性待办页面。
			// 打开抢到的待办方法调用
			handleTaskToDo(taskInfo)
		} else {
			errorInfoSolve(data.sign);
		};
	});
}
