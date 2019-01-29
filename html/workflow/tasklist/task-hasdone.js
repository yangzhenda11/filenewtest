var config = parent.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId=config.curStaffOrgId;
var curStaffId=config.curStaffId;
$(function(){
	$("#currentIdForDone").val(curStaffOrgId);
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
	getTableForDone();
}

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
		        if(c.staffOrgStatus=='0'){	
        			style = "cursor:not-allowed";
        			buttontitle = "当前待办对应的合同属于您已经失效的岗位【"+c.staffOrgName+"】，因此您无法处理该待办。您可以通过在合同系统将该合同转交给新的承办人或者自己的新岗位把当前待办移交给相应的人员来处理。";
        			fn = "layer.msg(\'"+buttontitle+"\')";
		        }else{
		        	
		        	if(curStaffOrgId == assignee){
		        		var specialList = ["GDCL","GDQR","BMQR","GSQR","GZGZ","HTGD","KHQR","GXZZ","TJKH","ZZFQ","GDFQ","SEALAPPLY","SEALED"];
		        		if(specialList.indexOf(c.taskDefinitionKey) != -1){
		        			fn = "redirectUrl(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee +"\')";
		        		}else{
		        			fn = "handleTaskForDone(\'" + c.id + "\',\'" + c.taskDefinitionKey + "\',\'" + c.name + "\',\'" + c.processInstanceId  + "\',\'" + c.title + "\',\'" + c.processDefinitionId + "\',\'" + c.processDefinitionKey + "\',\'" + c.executionId + "\',\'" + c.assignee + "\')";
		        		}
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
	        {"data": "endTime","title":"送出日期","className": "whiteSpaceNormal","width": "20%",
	        	render: function (a, b, c, d) {
	        		return getSmpFormatDateByLong(a, true);
	        	}
	        },
	        {"data": "nowLinkName","title":"当前环节","className": "whiteSpaceNormal","width": "10%"},
	        {"data": "nowUserName","title":"当前处理人","className": "whiteSpaceNormal","width": "10%"}
	    ]
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
		processDefinitionId, processDefinitionKey, executionId, assignee,staffOrgName) {

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

/*
 * 对taskDefinitionKey为GDCL或GDQR的工单获取businessKey重定向到功能页面
 */
function redirectUrl(taskId, taskDefinitionKey, name, processInstanceId, title, processDefinitionId, processDefinitionKey, executionId, assignee,staffOrgName){
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
		   		var GDQRSpecialList = ["GDQR","BMQR","GSQR","GZGZ","HTGD"];
				var editTaskDefinitionKey = "";
				if(GDQRSpecialList.indexOf(taskDefinitionKey) != -1){
					editTaskDefinitionKey = "GDQR";
				}else{
					editTaskDefinitionKey = taskDefinitionKey;
				};
		   		var src = "/html/contReg/workOrderEdit/workOrderEdit.html?pageType=3&taskFlag=yb&taskDefinitionKey="+editTaskDefinitionKey+"&wcardId="+businessKey+"&processInstanceId="+processInstanceId+"&canWithDraw="+canWithDraw+"&taskId="+taskId;
		   		App.setCache("searchForm");
		   		App.changePresentUrl(src);
		   	}else{
		   		layer.msg("获取不到工单主键");
		   	}
		} else {
			layer.msg(data.retValue);
		}
	});
}
//校验待办岗位是否已经失效，如果已经失效了则给出提示，不允许打开待办。true标识已经失效了，false标识岗位正常
//--已弃用，前台判断影响效率，改为后台判断返回标识
function checkAssignee(assignee){
	var result=false;
	$.ajax({
		'cache': true,
		'type': "POST",
		'url':serverPath+"workflowrest/checkAssignee?assignee="+assignee,
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
