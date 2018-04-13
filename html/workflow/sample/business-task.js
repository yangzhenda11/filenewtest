//推进代码示例，业务jsp页面代码需实现此方法供业务java类处理完成流程流转及业务数据更新
function modal_pass(root, taskDefinitionKey, assignee, processInstanceId, taskId, comment, handleType, withdraw){
	//alert( "目标任务定义：" + taskDefinitionKey + "_目标受理人：" + assignee + "_流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_审批意见：" + comment + "_处理方式：" + handleType + "_是否可回撤" + withdraw);
	
		$.post(root + "business/pushProcess", {
			"processInstanceId" : processInstanceId,
			"taskId" : taskId,
			"taskDefinitionKey" : taskDefinitionKey,
			"assignee" : assignee,
			"comment" : comment,
			"handleType" : handleType,
			"withdraw" : withdraw,
			"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),
			"title":""//可不传，如果需要修改待办标题则传此参数。
		}, function(data) {
			layer.open({
				  content: data.sign,
				  success: function(layero, index){
				    // 成功后回调模态窗口关闭方法
				    modal_close();
				  }
				});   
		});
}

//撤回代码示例，业务jsp页面代码需实现此方法供业务java类处理完成流程流转及业务数据更新
function modal_return(root, processInstanceId, taskId){
	alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId);
	
	$.post(root + "business/withdrawProcess", {
		"processInstanceId" : processInstanceId,
		"taskId" : taskId
	}, function(data) {
		alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
		// 成功后回调模态窗口关闭方法
		modal_close();
	});
}

//中止代码示例，业务jsp页面代码需实现此方法供业务java类处理完成流程流转及业务数据更新
function modal_stop(root, processInstanceId, taskId, comment){
	
	alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_用户意见：" + comment);

	$.post(root + "business/breakProcess", {
		"processInstanceId" : processInstanceId,
		"taskId" : taskId,
		"comment" : comment
	}, function(data) {
		alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
		// 成功后回调模态窗口关闭方法
		modal_close();
	});
}

// 待办公共页面点击选人按钮触发方法，两参数分别对应：1.是否为转派操作；2.目标环节linkId，转派模式下，flowLinkid为空串
function selectAssignee(turnAssignee, flowLinkid){
	
	if (turnAssignee){
		alert("业务侧示例，转派操作，将公共页面“下环节处理人信息”处理完成");
	} else {
		alert("业务侧示例，将公共页面“下环节处理人信息”处理完成，本次接受到的环节ID为：" + flowLinkid);
	}
	
	$("#assignee").val(10001);
	$("#assigneeName").val("示例：处理人");
}

function setRelativeData(){ 
	return false; 
}

function beforePushProcess(pass){
	var result=true;
	//1，业务侧的校验，校验不通过则返回false
	
	//2,设置下一步选人的参数，用于匹配通用规则选人。
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
			}
	setAssigneeParam(assigneeParam);
	//setAssignee("10001","admin","1");//"85023","侯玲","1"
	return result;
}
