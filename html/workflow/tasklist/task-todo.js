var config = parent.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId = config.curStaffOrgId;
var curStaffId = config.curStaffId;
$(function(){
	$("#currentId").val(curStaffOrgId);
	getFlowKyeList();
});
/*
 * 获取流程类型
 */
function getFlowKyeList(){
	var ajaxObj = {
	    "url" :  serverPath + "workflowrest/getFlowKeyList",
	    "type" : "post",
	    "data" : null,
	    "callbackFn": initflowTypeSelect2
	}
	App.initAjaxSelect2("#flowType",ajaxObj,"value","label","全部");
}
function initflowTypeSelect2(){
	App.readCache("searchForm");
	getTableTodo();
}
// 后面构建btn 代码
var btnModel =  '    \
	{{#each func}}\
    <button type="button" class="btn primary btn-outline btn-xs {{this.type}}" {{this.title}} {{this.fn}}>{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);

// 初始化页面信息
function initFrame(){
	$('#searchContent').show();
}
// 查询
function serarchForToDo(resetPaging){
	top.setMessageTipNumber();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	if(!App.checkDate(startDate,endDate)){
		layer.msg("接收开始日期不能早于截止日期");
		return;
	}else{
		var table = $('#searchTableTodo').DataTable();
		if(resetPaging) {
			table.ajax.reload();
		} else {
			table.ajax.reload(null, false);
		}
	}
}
/*
 * 日期修改时监听事件
 */
function dataChangeEvent(dom){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(!App.checkDate(startDate,endDate)){
		layer.msg("接收开始日期不能早于截止日期");
		$(dom).val("");
	};
}

// “处理”按钮触发事件
function handleTaskToDo(id, taskDefinitionKey, name, processInstanceId, title,
		processDefinitionId, processDefinitionKey, executionId, assignee) {
	//if(!checkifdone(id)){	
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
	if(taskDefinitionKey == "GDCL" || taskDefinitionKey == "GDQR" || taskDefinitionKey == "KHQR" || taskDefinitionKey == "GXZZ"){
		redirectUrl(id,taskDefinitionKey,processInstanceId);
	}else{
		$("#goTaskToDoDetailForToDo").load("/html/workflow/taskdetail/task-todo.html");
		$("#goTaskToDoDetailForToDo").show();
		$("#searchContentForToDo").hide();
	}
	//}
}
function applyTaskToDo(id, taskDefinitionKey, name, processInstanceId, title, processDefinitionId, processDefinitionKey, executionId, assignee) {
	var flowParam = {
		"taskDefinitionKey" : taskDefinitionKey,
		"assignee" : assignee,
		"processInstanceId" : processInstanceId,
		"taskId" : id
	}
	
	$.post(serverPath + "workflowrest/applyCandidateTask", flowParam,function(data) {
		if (data.success == 1) {
			//打开通用待办公共界面。
			//layer.msg(data.sign);
			serarchForToDo(true);
			// 打开抢到的待办方法调用
			assignee=assignee.substring(10);
			handleTaskToDo(id, taskDefinitionKey, name, processInstanceId, title,processDefinitionId, processDefinitionKey, executionId, assignee)
		} else {
			layer.msg(data.sign);
		};
	});
}

/*
 * 表格初始化
 */
function getTableTodo(){
	top.setMessageTipNumber();
	App.initDataTables('#searchTableTodo', "#submitBtn", {
		ajax: {
			"type": "GET",
			"url": serverPath + 'workflowrest/taskToDo',
			"data": function(d) {	
				d.staffId = curStaffId;//自定义传入参数
	        	d.title = $('#processTitle').val().trim();
	        	d.createTimeStart = $('#startDate').val();
	        	d.createTimeEnd = $('#endDate').val();
	        	d.flowType=$("#flowType").val();
	        	d.contractCode=$("#contractCode").val().trim();
	        	return d;
			}
		},
		columns: [
	        {"data" : null,"title":"序号","className": "text-center","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#searchTableTodo").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": null,"title":"主题","className": "whiteSpaceNormal","width": "55%",
				"render" : function(a, b, c, d){
					var assignee = c.assignee;
		        	var buttontitle = "";
		        	var fn = "";
		        	var style = "";
		        	if(assignee.indexOf("candidate-") != -1){
		        		//是抢单模式，点击待办标题先申请任务。
		        		assignee=assignee.substring(10);
		        		if(curStaffOrgId == assignee){
		        			buttontitle="当前任务为抢单模式的任务，请及时处理！";
		        			fn = "applyTaskToDo(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
		        		}else{
		        			style = "cursor:not-allowed";
		        			buttontitle = "当前任务属于您的另一个岗位【" + c.staffOrgName + "】,请点击右上角个人信息切换岗位后处理";
		        			fn = "layer.msg(\'"+buttontitle+"\')";
		        		}
		        	}else{
		        		//非抢单模式的正常待办
		        		if(curStaffOrgId == assignee){
	        				fn = "handleTaskToDo(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
		        		}else{
		        			style = "cursor:not-allowed";
		        			buttontitle = "当前任务属于您的另一个岗位【" + c.staffOrgName + "】,请点击右上角个人信息切换岗位后处理";
		        			fn = "layer.msg(\'"+buttontitle+"\')";
		        		}
		        	}
		        	var context = [{"name": c.title,"placement":"right","title": buttontitle,"style": style,"fn": fn}];
		            return App.getDataTableLink(context);
				}
			
			},
	        {"data": "processDefinitionName","title":"流程类型","className": "whiteSpaceNormal","width": "15%"},
	        {"data": "createTime","title":"接收日期","className": "whiteSpaceNormal","width": "15%", 
	        	"render": function (a, b, c, d) {
	        		return getSmpFormatDateByLong(a, true);
	        	}
	        },
	        {"data": "beUserName","title":"发送人","className": "whiteSpaceNormal","width": "10%"}
	    ]
	})
}
//校验待办是否已经办理,true标识已经办理，false标识尚未办理
function checkifdone(taskId){
	var result=false;
	$.ajax({
		'cache': true,
		'type': "POST",
		'url':serverPath+"workflowrest/checktask?taskId="+taskId,
		'async': false,
		'error': function(request) {
			layer.msg("校验待办异常，请联系管理员!",{time:1000});
		},
		'success': function(data) {
			var success=data.success;
			if(success=='1'){
				result=false;
			}else{
				result=true;
				layer.msg(data.info);
			}
		},
		error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
	return result;
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
/*
 * 跳转到工单页面
 */
function jumpSanCpyQueryDetail(businessKey,taskDefinitionKey,processInstanceId){
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:businessKey}, successCallback,null,null,false);
	function successCallback(result) {
		var data = result.data;
		var wcardProcess = data.wcardProcess;
		var wcardStatus = data.wcardStatus;
		var contractStatus = data.contractStatus;
		var isPass = false;
		if(taskDefinitionKey == "GDCL"){
			if(wcardProcess == 0 || wcardProcess == 2){
				isPass = true;
			}
		}else if(taskDefinitionKey == "GDQR"){
			if(wcardProcess == 1){
				isPass = true;
			}
		}else if(taskDefinitionKey == "KHQR" || taskDefinitionKey == "GXZZ"){
			if(wcardStatus == 904030 && contractStatus == 8){
				isPass = true;
			}
		};
		if(isPass == true){
			var src = "/html/contReg/workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey="+taskDefinitionKey+"&wcardId="+businessKey+"&processInstanceId="+processInstanceId;
			App.setCache("searchForm");
			App.changePresentUrl(src);
		}else{
			layer.alert("当前工单的状态已经发生变化，请您重新点击查询更新数据后处理。",{icon:2,title:"流程状态错误"},function(index){
				layer.close(index);
			});
		}
	}
}
