var config = parent.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId=config.curStaffOrgId;
var curStaffId=config.curStaffId;
$(function(){
	getFlowKyeList();
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
        	//d.linkName = $('#linkNameForDone').val();
        	d.completeTimeStart = $('#startDateForDone').val();
        	d.completeTimeEnd = $('#endDateForDone').val();
        	d.staffId = curStaffId; 
        	d.flowType=$("#flowType").val();
        	d.contractCode=$("#contractCode").val();
        	return d;
		}
	},
	columns: [// 对应列
    	//增加序号列
        {"data" : null,
         "title":"序号",
         "className": "text-center",
		"render" : function(data, type, full, meta){
						var start = App.getDatatablePaging("#searchTableForDone").pageStart;
						return start + meta.row + 1;
				   }
		},
		{"data": "title","title":"主题",className: "text-center whiteSpaceNormal","width": "33%"},
        {"data": "processDefinitionName","title":"流程类型",className: "text-center whiteSpaceNormal","width": "17%"},
//        {"data": "name","title":"环节名称",className: "text-center whiteSpaceNormal","width": "15%"},
//        {"data": "startTime","title":"接收时间",className: "text-center whiteSpaceNormal","width": "15%",
//        	render: function (a, b, c, d) {
//        		return getSmpFormatDateByLong(a, true);
//        	}
//        },
        {"data": "endTime","title":"送出日期",className: "text-center whiteSpaceNormal","width": "15%",
        	render: function (a, b, c, d) {
        		return getSmpFormatDateByLong(a, true);
        	}
        },
        {"data": "nowLinkName","title":"当前环节",className: "text-center","width": "5%"},
        {"data": "nowUserName","title":"当前处理人",className: "text-center","width": "5%"},
        {"data": null,"title":"操作",className: "text-center","width": "5%"}
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
function getFlowKyeList(){
	$.ajax({
		'cache': true,
		'type': "POST",
		'url':serverPath+"workflowrest/getFlowKeyList",
		'async': false,
		'error': function(request) {
			layer.msg("获取流程类型异常，请联系管理员!",{time:1000});
		},
		'success': function(result) {
			var dataArray = result.dataArray;
			console.log(result);
			$("#flowType").append("<option value=''>请选择流程类型</option>");
			$.each(dataArray, function (i, item) {
				$("#flowType").append("<option value='" + item.value + "'>" + item.label + "</option>");
			});
		},
		error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}