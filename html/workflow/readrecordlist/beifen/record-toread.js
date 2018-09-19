$(function(){
	$("#currentIdToread").val(curStaffOrgId);
	// 加载表格
	searchTableToread = $("#searchTableToread").DataTable(dataTableConfig);
	//searchTableToread.ajax.reload();
});
// 后面构建btn 代码
var btnModel = '    \
	{{#each func}}\
    <button type="button" class="user-button btn-sm {{this.type}}" {{this.title}} {{this.fn}}>{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
var searchTableToread;
// 表格配置信息
var dataTableConfig = {
	"ordering": false,// 排序
	"serverSide": true,// 开启服务器模式
	"scrollX": true,// 横向滚动
	ajax: {
        "type": "POST",
        "url":serverPath + 'flowReadRecord/recordToRead',//请求路径
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType":'json',
        "data":function(d){// 查询参数

        	d.title = $('#processTitleToread').val();
        	d.name = $('#linkNameToread').val();
        	d.createTimeStart = $('#startDateToread').val();
        	d.createTimeEnd = $('#endDateToread').val();
        	
        	return d;
        }
	},            
	columns: [// 对应列
		{"data": "title","title":"流程标题",className: "text-center"},
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
        	
        	var currentId = $('#currentIdToread').val();
        	var assignee = c.receiverId;
        	
        	// 按钮显隐设置及方法设置
        	var disabled = "disabled";
        	var title = "title=当前任务属于【" + c.orgName + "】，请切换岗位后查看";
        	var fn = "";
        	if(currentId == assignee){
        		disabled = "";
        		title = "";
        		fn = "onclick=handleTaskToread(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\',\'" + c.recordId + "\')";
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
function serarchToread(){
	searchTableToread.ajax.reload();
}

//重置查询条件
function resetCondition(){
	$('#processTitleToread').val('');
	$('#linkNameToread').val('');
	
	$("input[name='startDateToread']").val('');
	$("input[name='endDateToread']").val('');
}

//“查看”按钮触发事件
function handleTaskToread(id, taskDefinitionKey, name, processInstanceId, title,
		processDefinitionId, processDefinitionKey, executionId, assignee, recordId) {
	
	// 表单加入接收的参数
	// 阅读记录Id
	$('#recordIdToread').val(recordId);
	// 待阅页面中，实际为阅读记录对应的任务ID
	$('#idToread').val(id);
	$('#taskDefinitionKeyToread').val(taskDefinitionKey);
	// 环节名称
	$('#nameToread').val(name);
	$('#processInstanceIdToread').val(processInstanceId);
	// 流程实例名称
	$('#titleToread').val(title);
	$('#processDefinitionIdToread').val(processDefinitionId);
	$('#processDefinitionKeyToread').val(processDefinitionKey);
	$('#executionIdToread').val(executionId);
	$('#assigneeIdToread').val(assignee);
	
	$("#goRecordToReadDetailToread").load("../workflow/readrecorddetail/record-toread.html");
	
	$("#goRecordToReadDetailToread").show();
	$("#searchContentToread").hide();
}