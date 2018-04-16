var config = parent.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId=config.curStaffOrgId;
var curStaffId=config.curStaffId;
$(function(){
	$("#currentIdForDone").val(curStaffOrgId);
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
App.initDataTables('#searchTableForDone', "#submitBtn", {
	ajax: {
		"type": "GET",					//请求方式
		"url": serverPath + 'workflowrest/taskHasDone',	//请求地址
		"data": function(d) {							//自定义传入参数
        	d.title = $('#processTitleForDone').val();
        	d.linkName = $('#linkNameForDone').val();
        	d.completeTimeStart = $('#startDateForDone').val();
        	d.completeTimeEnd = $('#endDateForDone').val();
        	d.staffId = curStaffId; 
        	return d;
		}
	},
	columns: [// 对应列
		{"data": null,"title":"操作",className: "text-center",
			render: function (a, b, c, d) {
	        	var currentId = $('#currentIdForDone').val();
	        	var assignee = c.assignee;
	        	
	        	// 按钮显隐设置及方法设置
	        	var disabled = "disabled";
	        	var title = "title=当前任务属于【" + c.staffOrgName + "】，请切换岗位后查看";
	        	var fn = "";
	        	if(currentId == assignee){
	        		disabled = "";
	        		title = "";
	        		fn = "onclick=handleTaskForDone(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
	            }
	            var context =
	            {
	                func: [
	                	{"name": "查看", "title": title, "fn": fn, "type": disabled}
	                ]
	            };
	            var html = template(context);
	            return html;
	        }
		},
		{"data": "title","title":"已办标题",className: "text-center",'render': $.fn.dataTable.render.ellipsis(20, true)},
        {"data": "processDefinitionName","title":"流程名称",className: "text-center"},
        {"data": "name","title":"环节名称",className: "text-center"},
        {"data": "startTime","title":"接收时间",className: "text-center",
        	render: function (a, b, c, d) {
        		return getSmpFormatDateByLong(a, true);
        	}
        },
        {"data": "endTime","title":"办理时间",className: "text-center",
        	render: function (a, b, c, d) {
        		return getSmpFormatDateByLong(a, true);
        	}
        }
    ]
});	
// 查询
function serarchForDone(resetPaging){
	var table = $('#searchTableForDone').DataTable();
	if(resetPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}


//重置查询条件
function resetConditionForDone(){
	$('#processTitleForDone').val('');
	$('#linkNameForDone').val('');
	$("#startDateForDone").val('');
	$("#endDateForDone").val('');
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