var serverPath = "/";
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
	$("#goTaskToDoDetailForToDo").load("/html/workflow/taskdetail/task-todo.html");
	
	$("#goTaskToDoDetailForToDo").show();
	$("#searchContentForToDo").hide();
}

function getTaskInfo(){
	var taskData=null;
	$.ajax({
		url:serverPath + 'workflowrest/getTaskInfo?processInstanceId='+processInstanceId+'&taskId='+taskId+'&businessId='+businessId, 
		type:"POST",
		//data:,
		async:false,
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
