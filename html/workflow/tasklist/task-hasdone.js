var config = parent.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId=config.curStaffOrgId;
var curStaffId=config.curStaffId;
$(function(){
	$("#currentIdForDone").val(curStaffOrgId);
	getTableForDone();
	getFlowKyeList();
});
//后面构建btn 代码
var btnModel =  '    \
	{{#each func}}\
    <button type="button" class="btn primary btn-outline btn-xs {{this.type}}" {{this.title}} {{this.fn}}>{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
/*
 * 表格初始化
 */
function getTableForDone(){
	App.initDataTables('#searchTableForDone', "#submitBtn", {
		ajax: {
			"type": "GET",
			"url": serverPath + 'workflowrest/taskHasDone',
			"data": function(d) {	//自定义传入参数
				d.staffId = curStaffId; 
	        	d.title = $('#processTitleForDone').val().trim();
	        	//d.linkName = $('#linkNameForDone').val().trim();
	        	d.completeTimeStart = $('#startDateForDone').val().trim();
	        	d.completeTimeEnd = $('#endDateForDone').val().trim();
	        	d.flowType=$("#flowType").val();
	        	d.contractCode=$("#contractCode").val().trim();
	        	return d;
			}
		},
		columns: [
	        {	"data" : null,
	         	"title":"序号",
	         	"className": "text-center",
	         	"width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#searchTableForDone").pageStart;
					return start + meta.row + 1;
			   	}
			},
			{"data": null,"title":"主题","className": "whiteSpaceNormal","width": "40%",
				"render" : function(a, b, c, d){
					var assignee = c.assignee;
		        	var buttontitle = "";
		        	var fn = "";
		        	var style = "";
		        	if(curStaffOrgId == assignee){
		        		if(c.taskDefinitionKey == "GDCL" || c.taskDefinitionKey == "GDQR"){
		        			fn = "redirectUrl(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
		        		}else{
		        			fn = "handleTaskForDone(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
		        		}
		        	}else{
		        		style = "cursor:not-allowed";
		        		buttontitle = "当前任务属于您的另一个岗位【" + c.staffOrgName + "】,请点击右上角个人信息切换岗位后处理";
		        		fn = "layer.msg(\'"+buttontitle+"\')";
		        	}
		        	var context = [{"name": c.title,"placement":"right","title": buttontitle,"style": style,"fn": fn}];
		            return App.getDataTableLink(context);
				}
			},
	        {"data": "processDefinitionName","title":"流程类型","className": "whiteSpaceNormal","width": "15%"},
	        {"data": "endTime","title":"送出日期","className": "whiteSpaceNormal","width": "20%",
	        	render: function (a, b, c, d) {
	        		return getSmpFormatDateByLong(a, true);
	        	}
	        },
	        {"data": "nowLinkName","title":"当前环节","className": "whiteSpaceNormal","width": "10%"},
	        {"data": "nowUserName","title":"当前处理人","className": "whiteSpaceNormal","width": "10%"}
//	        {"data": null,"title":"操作","className": "text-center","width": "5%"}
	    ]
//	    "columnDefs": [
//	       	{
//	        targets: -1,
//	        render: function (a, b, c, d) {
//	        	var assignee = c.assignee;
//	        	var buttontitle = "";
//	        	var fn = "";
//	        	var style = "";
//	        	if(curStaffOrgId == assignee){
//	        		fn = "onclick=handleTaskForDone(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
//	        	}else{
//	        		style = "cursor:not-allowed";
//	        		buttontitle = "当前任务属于您的另一个岗位【" + c.staffOrgName + "】,请点击右上角个人信息切换岗位后处理";
//	        		fn = "layer.msg(\'"+buttontitle+"\')";
//	        	}
//	        	var context = [{"name": "查看","placement":"left","title": buttontitle,"style": style,"fn": fn}];
//	            return App.getDataTableBtnTooltip(context);
//	        }
//	    }]
	})
}
// 查询
function serarchForDone(resetPaging){
	var startDateForDone = $('#startDateForDone').val();
	var endDateForDone = $('#endDateForDone').val();
	if(!App.checkDate(startDateForDone,endDateForDone)){
		layer.msg("送出开始日期不能早于截止日期");
		return;
	}else{
		var table = $('#searchTableForDone').DataTable();
		if(resetPaging){
			table.ajax.reload();
		}else{
			table.ajax.reload(null, false);
		}
	}
}
/*
 * 日期修改时监听事件
 */
function dataChangeEvent(dom){
	var startDateForDone = $("#startDateForDone").val();
	var endDateForDone = $("#endDateForDone").val();
	if(!App.checkDate(startDateForDone,endDateForDone)){
		layer.msg("送出开始日期不能早于截止日期");
		$(dom).val("");
	};
}
//“查看”按钮触发事件
function handleTaskForDone(id, taskDefinitionKey, name, processInstanceId, title,
		processDefinitionId, processDefinitionKey, executionId, assignee) {
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
function getFlowKyeList(){
	var ajaxObj = {
	    "url" :  serverPath + "workflowrest/getFlowKeyList",
	    "type" : "post",
	    "data" : null
	}
	App.initAjaxSelect2("#flowType",ajaxObj,"value","label","全部");
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
//获取工单主键
function getRedirectUrl(taskId,taskDefinitionKey,processInstanceId,canWithDraw){
	$.post(serverPath + "workflowrest/taskhasdonepath/" + processInstanceId + "/" + taskDefinitionKey + "/" + taskId, function(data) {
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
		   		var src = "/html/contReg/workOrderEdit/workOrderEdit.html?pageType=3&taskFlag=yb&taskDefinitionKey="+taskDefinitionKey+"&wcardId="+businessKey+"&processInstanceId="+processInstanceId+"&canWithDraw="+canWithDraw+"&taskId="+taskId;
		   		App.changePresentUrl(src);
		   	}else{
		   		layer.msg("获取不到工单主键");
		   	}
		} else {
			layer.msg(data.retValue);
		}
	});
}
