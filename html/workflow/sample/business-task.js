$(function(){
	//调用流程公共js添加tab示例
	var url='/html/workflow/sample/business-task-tab.html';
	parent.addCustomTab({"title":"多tab测试","url":url});
	var url1='/html/workflow/sample/business-task-tab.html';
	parent.addCustomTab({"title":"多tab测试1","url":url1});

	
	console.log('businessKey='+getQueryString("businessKey"));
	
	var taskDefinitionKey=getQueryString("taskDefinitionKey")
	
	if(taskDefinitionKey=='YZQR'){
		//调用流程公共方法让“重新上传扫描件”按钮展示，并把业务主键传过去。方便按钮绑定的方法根据业务主键封装流程实体flowpassbean，并回调返回给业务界面
		parent.setUserButton(true,getQueryString("businessKey"))
	}
	
	if(taskDefinitionKey=='GDCL'){
		//显示取消审批按钮
		parent.setQxspButton(true,getQueryString("businessKey"))
		
		//工单处理环节将提交按钮改为“注册完成” btId：passButton   
		parent.setUserBtName("passButton","注册完成");
		
		//工单处理环节将返回待办列表改为“关闭” btId：backTolist
		parent.setUserBtName("backTolist","关闭");
	}
	if(taskDefinitionKey=='GDQR'){
		//工单确认环节将提交按钮改为“工单激活” btId：passButton   
		parent.setUserBtName("passButton","工单激活");
		//工单处理环节将回退按钮改为“退回承办人” btId：backButton
		parent.setUserBtName("backButton","退回承办人");
	}
	
	parent.addCustomBt("cjgdButton","创建工单","creatGd")
	
});
function creatGd(){
	alert("创建工单哦，你点了我要消失了哦！");
	parent.showOrhideButton("cjgdButton",false);
}
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

function modal_passBybuss(flowParam){
	console.log("flowParam:"+flowParam);
	alert(flowParam);
	debugger;
	
	$.post(serverPath + "business/breakAndStartProcess", flowParam, function(data) {
		layer.alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
		// 成功后回调模态窗口关闭方法
		//parent.modal_close();
	});
}

//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_pass(root, taskDefinitionKey, assignee, processInstanceId, taskId, comment, handleType, withdraw,iscandidate){
	//alert( "目标任务定义：" + taskDefinitionKey + "_目标受理人：" + assignee + "_流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_审批意见：" + comment + "_处理方式：" + handleType + "_是否可回撤" + withdraw);
		$.post(root + "business/pushProcess", {
			"processInstanceId" : processInstanceId,//当前流程实例
			"taskId" : taskId,//当前任务id
			"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
			"assignee" : assignee,//下一步参与者
			"comment" : comment,//下一步办理意见
			"handleType" : handleType,//处理类型，1为通过，2为回退
			"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
			"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
			"title":$("#BusinessTile").val(),//可不传，如果需要修改待办标题则传此参数。
			"iscandidate":iscandidate //是否是多候选人的抢单环节
		}, function(data) {
			layer.msg(data.sign);
			
			// 成功后回调模态窗口关闭方法
			parent.modal_close();   
		});
}

//撤回代码示例，业务界面需要实现，可以拼接业务参数到后台，数据的更新和流程的撤回放在业务侧方法里，保持事务同步。
function modal_return(root, processInstanceId, taskId){
	//alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId);
	
	$.post(root + "business/withdrawProcess", {
		"processInstanceId" : processInstanceId,//流程实例
		"taskId" : taskId //任务id
	}, function(data) {
		layer.msg(data.sign + "（业务开发人员自定义提示消息有无及内容）");
		// 成功后回调模态窗口关闭方法
		parent.modal_close();
	});
}

//中止代码示例，业务jsp页面代码需实现此方法供业务java类处理完成流程流转及业务数据更新
function modal_stop(root, processInstanceId, taskId, comment){
	
	//alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_用户意见：" + comment);

	$.post(root + "business/breakProcess", {
		"processInstanceId" : processInstanceId,//流程实例
		"taskId" : taskId,//任务id
		"comment" : comment//办理意见
	}, function(data) {
		layer.alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
		// 成功后回调模态窗口关闭方法
		parent.modal_close();
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
//查找下一步环节的时候会调用业务侧此方法返回数据。
function setRelativeData(){ 
	return false; 
}

//流程点“通过”或“回退”回调业务侧此方法，业务侧完成表单校验并设置流程参数。
function beforePushProcess(pass){
	var result=true;
	//1，业务侧的校验，校验不通过则返回false
	
	//2,设置下一步选人的参数，用于匹配通用规则选人。
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
			}
	parent.setAssigneeParam(assigneeParam);
	
	//3,设置路由值，默认为0，对于有分支的场景需要单独设置路由值
	var pathSelect=$("#ifshenpi").val();
	parent.setPathSelect(pathSelect);
	
	//4,设置选人单选还是多选。
	var staffSelectType=$("#staffSelectType").val();
	parent.setStaffSelectType(staffSelectType);
	
	return result;
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
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 
function setStaffSelectType(){
	var staffSelectType=$("#staffSelectType").val();
	parent.setStaffSelectType(staffSelectType);
}

//设置办理意见
function setComment(pass){
	var userComment=$("#BusinessInfo").val();
	return userComment;
}

function pushProcessByuser(){
	parent.setUserButton(true);
}

//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_passBybuss(flowParam){
	//typeof(tmp) == "undefined"
	var root=serverPath;//flowParam.root
	var taskDefinitionKey=flowParam.taskDefinitionKey;
	var assignee=flowParam.assignee;
	var processInstanceId=flowParam.processInstanceId;
	var taskId=flowParam.taskId;
	var comment=flowParam.comment;
	var handleType=flowParam.handleType;
	var withdraw=flowParam.withdraw;
	var iscandidate=flowParam.iscandidate;
    
	//alert( "目标任务定义：" + taskDefinitionKey + "_目标受理人：" + assignee + "_流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_审批意见：" + comment + "_处理方式：" + handleType + "_是否可回撤" + withdraw);
		$.post(root + "business/breakAndStartProcess", {
			"processInstanceId" : processInstanceId,//当前流程实例
			"taskId" : taskId,//当前任务id
			"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
			"assignee" : assignee,//下一步参与者
			"comment" : comment,//下一步办理意见
			"handleType" : handleType,//处理类型，1为通过，2为回退
			"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
			"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
			"title":"",//可不传，如果需要修改待办标题则传此参数。
			"iscandidate":iscandidate //是否是多候选人的抢单环节
		}, function(data) {
			layer.msg(data.sign);
			
			// 成功后回调模态窗口关闭方法
			parent.modal_close();   
		});
}
//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_passQxsp(flowParam){
	//typeof(tmp) == "undefined"
	var root=serverPath;//flowParam.root
	var taskDefinitionKey=flowParam.taskDefinitionKey;
	var assignee=flowParam.assignee;
	var processInstanceId=flowParam.processInstanceId;
	var taskId=flowParam.taskId;
	var comment=flowParam.comment;
	var handleType=flowParam.handleType;
	var withdraw=flowParam.withdraw;
	var iscandidate=flowParam.iscandidate;
	
	//alert( "目标任务定义：" + taskDefinitionKey + "_目标受理人：" + assignee + "_流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_审批意见：" + comment + "_处理方式：" + handleType + "_是否可回撤" + withdraw);
	$.post(root + "business/qxspAndpushProcess", {
		"processInstanceId" : processInstanceId,//当前流程实例
		"taskId" : taskId,//当前任务id
		"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
		"assignee" : assignee,//下一步参与者
		"comment" : comment,//下一步办理意见
		"handleType" : handleType,//处理类型，1为通过，2为回退
		"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
		"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
		"title":"",//可不传，如果需要修改待办标题则传此参数。
		"iscandidate":iscandidate //是否是多候选人的抢单环节
	}, function(data) {
		layer.msg(data.sign);
		
		// 成功后回调模态窗口关闭方法
		parent.modal_close();
	});
}