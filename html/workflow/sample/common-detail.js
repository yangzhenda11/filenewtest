
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
function modal_start(processDefinitionKey, assignee, taskDefinitionKey,comment){
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
		"title":"此待办为流程测试专用，表动哦，如需待办请通过需求管理自己启动哦。",// 待办标题，需要业务侧提供，一般为业务名称，需求为需求名称。
		"businessKey":""//业务主键，需要业务侧提供，必传，需求为需求ID，楼宇为楼宇主键等。
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

//该方法为业务编制界面的“发起”按钮方法，方法名随意，首先进行业务校验等业务处理，然后调用流程公共界面中js方法传递流程相关的参数。
function flowStart(){
	//1,业务侧表单校验等。
	
	
	//2,调用流程公共界面js根据业务类型后台查询匹配的流程模板。该方法也可以放在流程初始化的时候。
	getProcessDefinitionKey("contract_ReleasePoint");
	
	//3,传递选人参数，用于个性选人等。
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
			}
	setAssigneeParam(assigneeParam);
	
	//4,调用流程公共方法下一步路由值默认为0，特殊场景业务侧调用此方法设置路由值
	//setPathSelect(1);
	
	//5,调用流程公共方法打开下一步公共界面。传递参数为业务类型，比如合同类型，后台获取与之匹配的流程模板。
	showStartPanel();
}

