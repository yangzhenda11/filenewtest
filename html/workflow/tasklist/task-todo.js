$(function(){
	// 加载表格
$("#currentId").val(curStaffOrgId);
searchTableTodo = $("#searchTableTodo").DataTable(dataTableConfig); 
});
// 后面构建btn 代码
var btnModel =  '    \
	{{#each func}}\
    <button type="button" class="user-button btn-sm {{this.type}}" {{this.title}} {{this.fn}}>{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
var searchTableTodo;
// 表格配置信息
var dataTableConfig = {
	"ordering": false,// 排序
	"serverSide": true,// 开启服务器模式
	"scrollX": true,// 横向滚动
	"ajax": {
        "type": 'POST',
        "url":serverPath + 'workflowrest/taskToDo',
        "data":function(d){// 查询参数
        	d.title = $('#processTitle').val();
        	d.linkName = $('#linkName').val();
        	d.createTimeStart = $('#startDate').val();
        	d.createTimeEnd = $('#endDate').val();
        	d.staffId = curStaffId;
        	return d;
        }
	},            
	columns: [// 对应列
		{"data": "title","title":"待办标题",className: "text-center"},
        {"data": "processDefinitionName","title":"流程名称",className: "text-center"},
        {"data": "name","title":"环节名称",className: "text-center"},
        {"data": "createTime","title":"接收时间",className: "text-center", 
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
        	var currentId = $("#currentId").val();;
        	var assignee = c.assignee;
        	
        	// 按钮显隐设置及方法设置
        	var disabled = "disabled";
        	var title = "title=当前任务属于【" + c.staffOrgName + "】，请切换岗位后处理";
        	var fn = "";
        	if(currentId == assignee){
        		disabled = "";
        		title = "";
        		fn = "onclick=handleTaskToDo(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
        	}
        	
            var context =
            {
                func: [
                	{"name": "处理", "title": title, "fn": fn, "type": disabled}
                ]
            };
            var html = template(context);
            return html;
        }
    }]
	,"dom":'rt<"pull-left mt5"i><"pull-right mt5"p><"clear">'//'rt<"bottom"ip><"clear">' //生成样式
};
// 初始化页面信息
function initFrame(){
	$('#searchContent').show();
}
// 查询
function serarchForToDo(){
	searchTableTodo.ajax.reload();
}

//重置查询条件
function resetConditionForToDo(){
	$('#processTitle').val('');
	$('#linkName').val('');
	
	$("input[name='startDate']").val('');
	$("input[name='endDate']").val('');
}
 
// “处理”按钮触发事件
function handleTaskToDo(id, taskDefinitionKey, name, processInstanceId, title,
		processDefinitionId, processDefinitionKey, executionId, assignee) {
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
	$("#goTaskToDoDetailForToDo").load("../workflow/taskdetail/task-todo.html");
	
	$("#goTaskToDoDetailForToDo").show();
	$("#searchContentForToDo").hide();
}
