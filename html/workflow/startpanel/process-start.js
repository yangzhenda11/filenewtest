// 环节下拉列表
function refreshLinkForSart(){
	
	// 当前流程定义Key
	var processDefinitionKey = $("#processDefinitionKeyForStart").val();
	
	//去开始页面上去添加 的数据   如果没有直接 return false   
	var processData = setRelativeData();
	if(!processData){ 
		processData=null;
	}
	debugger;
	$.get(serverPath + "workflowrest/tasklinkforstart/" + processDefinitionKey+"/0",processData,
		function(data) {
			var success = data.retCode;
			// 返回成功即继续处理，不成功报原因
			if (success == 1){
				var link = data.dataRows;
				
				$("#linkForStart").empty();
				$.each(link, function(i, obj){
					$("#linkForStart").append("<option value='" + obj.value + "'>" + obj.label + "</option>");
				});
				
				/*if (link.length != 0) {
					// 刷新人员
					refreshAssigneeForStart(serverPath, processDefinitionKey, $("#link").val().split(",")[0]);	
				}*/
				clearAssigneeForStart();
				$("#myProcessStartModal").modal("show");
			} else if (success == 0){
				alert(data.retVal);
			}
	});
}

// 20170418剔除此方法
//人员下拉列表
function refreshAssigneeForStart(serverPath, processDefinitionKey, taskDefinitionKey){
	
	$.post(serverPath + "/workflowrest/assigneeforstart/" + processDefinitionKey + "/" + taskDefinitionKey,
		function(data) {
			var success = data.retCode;
			// 返回成功即继续处理，不成功报原因
			if (success == 1){
				var assignee = data.dataRows;
				
				$("#assigneeForStart").empty();
				$.each(assignee, function(i, obj){
					$("#assigneeForStart").append("<option value='" + obj.value + "'>" + obj.label + "</option>");	
				});				
			} else if (success == 0){
				alert(data.retValue);
			}
		});
}

// 点击【提交】按钮，弹出模态窗口
function startProcess(processDefinitionKey, assignee, taskDefinitionKey){
	
	if(processDefinitionKey.length == 0) {
		alert('请选择环节！');
		return;
	}
	if(assignee == null || assignee == '') {
		alert('请选择处理人！');
		return;
	}
	
	var r = confirm("是否确认提交？")
	if (r == true) {
		// 调用发起方法
		modal_start(processDefinitionKey, assignee, taskDefinitionKey);
	}
}

//显示流程发起框，选择环节及处理人
function showStartPanel(){
	// 根据用户已确认的业务变量刷新环节
	refreshLinkForSart();
}
// 清空下环节处理人已选择内容
function clearAssigneeForStart(){
	$("#assigneeForStart").val('');
	$("#assigneeNameForStart").val('');
}
// 发起方法modal_start()执行成功后，调用此方法关闭弹出窗口
function closeModalForStart(){
$("#myProcessStartModal").modal("hide");
}

















