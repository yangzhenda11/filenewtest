$(function(){
	$("#currentIdForDone").val(curStaffOrgId);
	// 加载表格
	searchTableForDone = $("#searchTableForDone").DataTable(dataTableConfig);
	//searchTable.ajax.reload();
});
// 后面构建btn 代码
var btnModel = '    \
	{{#each func}}\
    <button type="button" class="user-button btn-sm {{this.type}}" {{this.title}} {{this.fn}}>{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
var searchTableForDone;
// 表格配置信息
var dataTableConfig = {
	"ordering": false,// 排序
	"serverSide": true,// 开启服务器模式
	"scrollX": true,// 横向滚动
	ajax: {
        "type": "POST",
        "url":serverPath + 'workflowrest/taskHasDone',//请求路径
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType":'json',
        "data":function(d){// 查询参数
        	d.title = $('#processTitleForDone').val();
        	d.linkName = $('#linkNameForDone').val();
        	d.completeTimeStart = $('#startDateForDone').val();
        	d.completeTimeEnd = $('#endDateForDone').val();
        	d.staffId = curStaffId; 
        	return d;
        }
	},            
	columns: [// 对应列
		{"data": "title","title":"已办标题",className: "text-center"},
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
        },
        {"data": null,"title":"操作",className: "text-center"}
    ],
    "columnDefs": [
		{// 所有列默认值
			"targets": "_all",
			"defaultContent": ''
		},
       {// 最后一列添加按钮
        targets: -1,
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
    }]
	,"dom": 'rt<"pull-left mt5"i><"pull-right mt5"p><"clear">'//'rt<"bottom"ip><"clear">' //生成样式
};
// 查询
function serarchForDone(){
	searchTableForDone.ajax.reload();
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
	$("#goTaskToDoDetailForDone").load("../workflow/taskdetail/task-hasdone.html");
	
	$("#goTaskToDoDetailForDone").show();
	$("#searchContentForDone").hide();
}