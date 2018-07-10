var config = parent.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId = config.curStaffOrgId;
var curStaffId = config.curStaffId;
$(function(){
	getTableTodo();
	getFlowKyeList();
	// 加载表格
	$("#currentId").val(curStaffOrgId);
});
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
function serarchForToDo(retainPaging){
	var startDate = $('#startDate').val().trim();
	var endDate = $('#endDate').val().trim();
	if(!checkDate(startDate,endDate)){
		layer.msg("接收开始日期不得大于截止日期！");
		return;
	}else{
		var table = $('#searchTableTodo').DataTable();
		if(retainPaging) {
			table.ajax.reload();
		} else {
			table.ajax.reload(null, false);
		}
	}
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
	$("#goTaskToDoDetailForToDo").load("/html/workflow/taskdetail/task-todo.html");
	
	$("#goTaskToDoDetailForToDo").show();
	$("#searchContentForToDo").hide();
	//}
}
function applyTaskToDo(id, taskDefinitionKey, name, processInstanceId, title,
		processDefinitionId, processDefinitionKey, executionId, assignee) {
	
	var flowParam = {
		"taskDefinitionKey" : taskDefinitionKey,
		"assignee" : assignee,
		"processInstanceId" : processInstanceId,
		"taskId" : id
	}
	$.post(serverPath + "workflowrest/applyCandidateTask", flowParam,
			function(data) {
				if (result.success == 1) {
					//currentTask=result.flowdata;
					layer.msg(data.sign);
					// 成功后刷新列表
					serarchForToDo(true);
				} else {
					layer.msg(data.sign);
				};
			});
}

/*
 * 表格初始化
 */
function getTableTodo(){
	App.initDataTables('#searchTableTodo', "#submitBtn", {
		ajax: {
			"type": "GET",					//请求方式
			"url": serverPath + 'workflowrest/taskToDo',	//请求地址
			"data": function(d) {	
				d.staffId = curStaffId;//自定义传入参数
	        	d.title = $('#processTitle').val().trim();
	        	//d.linkName = $('#linkName').val().trim();
	        	d.createTimeStart = $('#startDate').val().trim();
	        	d.createTimeEnd = $('#endDate').val().trim();
	        	d.flowType=$("#flowType").val();
	        	d.contractCode=$("#contractCode").val().trim();
	        	return d;
			}
		},
		columns: [// 对应列
	    	//增加序号列
	        {"data" : null,"title":"序号","className": "text-center","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#searchTableTodo").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "title","title":"主题","className": "whiteSpaceNormal","width": "49%"},
	        {"data": "processDefinitionName","title":"流程类型","className": "whiteSpaceNormal","width": "15%"},
	        {"data": "createTime","title":"接收日期","className": "whiteSpaceNormal","width": "15%", 
	        	"render": function (a, b, c, d) {
	        		return getSmpFormatDateByLong(a, true);
	        	}
	        },
	        {"data": "beUserName","title":"发送人","className": "whiteSpaceNormal","width": "10%"},
	        {"data": null,"title":"操作","className": "text-center","width": "6%"}
	    ],
	    "columnDefs": [
	       {// 最后一列添加按钮
	        targets: -1,
	        render: function (a, b, c, d) {
	        	var currentId = $("#currentId").val();;
	        	var assignee = c.assignee;
	        	var buttontitle = "";
	        	var fn = "";
	        	var style = "";
	        	if(currentId == assignee){
	        		fn = "handleTaskToDo(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
	        	}else{
	        		style = "cursor:not-allowed";
	        		buttontitle = "当前任务属于您的另一个岗位【" + c.staffOrgName + "】,请点击右上角个人信息切换岗位后处理";
	        		fn = "layer.msg(\'"+buttontitle+"\')";
	        	}
	        	var context = [{"name": "处理","placement":"left","title": buttontitle,"style": style,"fn": fn}];
	        	if(assignee.indexOf("candidate-") != -1){
	        		buttontitle = "该任务为抢单任务，如需处理请先点【申领】按钮领取任务！";
	        		fn = "applyTaskToDo(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
	        		context = [{"name": "申领","placement":"left","title": buttontitle,"style": style,"fn": fn}];
	        	}
	            return App.getDataTableBtnTooltip(context);
	        }
	    }]
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

function getFlowKyeList(){
	var ajaxObj = {
	    "url" :  serverPath + "workflowrest/getFlowKeyList",
	    "type" : "post",
	    "data" : null
	}
	App.initAjaxSelect2("#flowType",ajaxObj,"value","label","全部");
}
/**
 * 校验开始时间是否大于截止时间
 * */
function checkDate(strDate1,strDate2){  
    var t1 = new Date(strDate1);     
    var t2 = new Date(strDate2);    
              
    if(Date.parse(t1) - Date.parse(t2) > 0){     
        return false;   
    }else{  
        return true;  
    }  
}