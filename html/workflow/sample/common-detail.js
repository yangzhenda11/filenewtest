//@ sourceURL=common-detail.js
$(function(){ 
	$("#startProcess").load("/html/workflow/startpanel/process-start.html",function() {
		// 根据业务标识选择流程模板。如果编制界面一打开就能确定业务类型和流程的话可以放在此处，否则放在“发起”按钮的方法里。
		//getProcessDefinitionKey("contract_ReleasePoint");
    });
});

/*
 * 工作流模块示例：公共发起页面公用脚本文件
 * 
 * author:ctt
 * day:2018-0416-21
 */
function modal_start(processDefinitionKey, assignee, taskDefinitionKey,comment,withdraw,iscandidate){
	
	//alert(processDefinitionKey + "_" + assignee + "_" + taskDefinitionKey);
/*	业务侧推进流程需要带着表单数据的，参考以下方式和流程参数拼接在一起。
	var jsonDate=$('#remandBaseInfo').serialize()
	+"&taskDefinitionKey="+taskDefinitionKey
	+"&businessKey="+_remandId
	+"&title="+$("#remandName").val()
	+"&comment="+comment
	+"&assignee="+assignee
	+"&processDefinitionKey="+processDefinitionKey;*/
	
	$.post(serverPath + "business/startProcess", {
		"processDefinitionKey" : processDefinitionKey,//流程模板编码，流程回调带过来的，业务侧无需赋值。
		"assignee" : assignee, //下一步参与者，流程回调带过来的，业务侧无需赋值。
		"taskDefinitionKey" : taskDefinitionKey,//下一步环节code，流程回调带过来的，业务侧无需赋值。
		"comment":comment, //办理意见，流程回调带过来的，业务侧无需赋值。
		"title":$("#taskTitle").val(),// 待办标题，需要业务侧提供，一般为业务名称，需求为需求名称。
		"businessKey":$("#taskBusinessKey").val(),//业务主键，需要业务侧提供，必传，需求为需求ID，楼宇为楼宇主键等。
		"iscandidate":iscandidate ,//是否是多候选人的抢单环节
		"withdraw":withdraw //是否允许撤回
	}, function(data) {
		layer.alert(data.sign);
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
function setProjectPath(){
	var projectPathselect = $("#projectPathselect").val();
	$("#pathSelect").val(projectPathselect);
}

//该方法为业务编制界面的“发起”按钮方法，方法名随意，首先进行业务校验等业务处理，然后调用流程公共界面中js方法传递流程相关的参数。
function flowStart(){
	//1,业务侧表单校验等。
	var taskBusinessKey=$("#taskBusinessKey").val();
	var taskTitle=$("#taskTitle").val();
	if(taskBusinessKey.length==0){
		layer.msg("请填写业务主键！");
		return;
	}
	if(taskTitle.length==0){
		layer.msg("请填写待办标题！");
		return;
	}
	
	//2,调用流程公共界面js根据业务类型后台查询匹配的流程模板。该方法也可以放在流程初始化的时候。
	//getProcessDefinitionKey("contract_scan");
	
	//3,传递选人参数，用于个性选人等。
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
			}
	setAssigneeParam(assigneeParam);
	
	//4,调用流程公共方法下一步路由值默认为0，特殊场景业务侧调用此方法设置路由值
	//setPathSelect(1);
	
	//4,设置选人单选还是多选。
	var staffSelectType=$("#staffSelectType").val();
	setStaffSelectType(staffSelectType);
	
	//5,调用流程公共方法打开下一步公共界面。传递参数为业务类型，比如合同类型，后台获取与之匹配的流程模板。
	showStartPanel();
}

function businessPush(){
	
	var taskBusinessKey=$("#taskBusinessKey").val();
	if(taskBusinessKey.length==0){
		layer.msg("请填写业务主键！");
		return;
	}
	//App.getFlowParam 参数，serverPath，业务主键，handletype，pathSelect
	var flowParam=App.getFlowParam(serverPath,taskBusinessKey,1,0);
	App.applyCandidateTask(serverPath,flowParam);
	modal_passBybuss(flowParam);
	
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
		$.post(root + "business/pushProcess", {
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
function pushReceiveTask(){
	
	var taskBusinessKey=$("#taskBusinessKey").val();
	var taskTitle=$("#taskTitle").val();
	var receiveStatus=$("#receiveStatus").val();
	if(taskBusinessKey.length==0){
		layer.msg("请填写业务主键！");
		return;
	}
	if(taskTitle.length==0){
		layer.msg("请填写待办标题！");
		return;
	}
	if(receiveStatus.length==0){
		layer.msg("请选择后台任务的触发状态！");
		return;
	}
	
	var currentTask=null;
		$.ajax({
			type: 'get',
			url: serverPath+'workflowrest/pushReceiveTask?businessId='+$("#taskBusinessKey").val()+'&taskStatus='+receiveStatus,
			//data: null,
			dataType: 'json',
			async: false,
			contentType: "application/json",
			success: function(result){
				var result = result;
				if (result.success == 1) {
					//currentTask=result.flowdata;
					layer.msg(result.info);
				} else {
					layer.msg(result.info);
				};
			},
			error: function(result) {
				layer.alert("接口错误", {icon: 2,title:"错误"});
			}
		});
	console.log(currentTask);
}
function resetStaffSelectType(){
	var staffSelectType=$("#staffSelectType").val();
	setStaffSelectType(staffSelectType);
}

function applyCandidateTask(){
	
	var taskBusinessKey=$("#taskBusinessKey").val();
	if(taskBusinessKey.length==0){
		layer.msg("请填写业务主键！");
		return;
	}
	//App.getFlowParam 参数，serverPath，业务主键，handletype，pathSelect
	var flowParam=App.getFlowParam(serverPath,taskBusinessKey,1,0);
	App.applyCandidateTask(serverPath,flowParam);
	//modal_applyCandidateTask(flowParam);
	
}
function modal_applyCandidateTask(flowParam){
	$.post(serverPath + "business/applyCandidateTask", flowParam, function(data) {
		layer.msg(data.sign);
		
		// 成功后回调模态窗口关闭方法
		parent.modal_close();   
	});
}
function startBybussType(){
	var businessType=$("#businessType").val();
	if(businessType.length==0){
		layer.msg("请填写业务类型，否则无法找到需要启动的流程模板啊！");
		return;
	}
	var taskBusinessKey=$("#taskBusinessKey").val();
	if(taskBusinessKey.length==0){
		layer.msg("请填写业务主键！");
		return;
	}
	$.ajax({
		type: 'get',
		url: serverPath+'business/startBybussType?businessId='+$("#taskBusinessKey").val()+'&businessType='+businessType,
		//data: null,
		dataType: 'json',
		async: false,
		contentType: "application/json",
		success: function(result){
			var result = result;
			if (result.success == 1) {
				//currentTask=result.flowdata;
				layer.msg(result.info);
			} else {
				layer.msg(result.info);
			};
		},
		error: function(result) {
			layer.alert("接口错误", {icon: 2,title:"错误"});
		}
	});
}
