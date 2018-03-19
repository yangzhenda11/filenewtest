$(function(){
	initData();
	var processDefinitionId = $('#processDefinitionId').val();
	var processInstanceId = $('#processInstanceId').val();
	var taskDefinitionKey = $('#taskDefinitionKey').val();
	var taskId = $('#taskId').val();
	
	// 加载主业务页面及自定义页面
	loadTaskPath(serverPath, processInstanceId, taskId, taskDefinitionKey, processDefinitionId);
	
	// 载入流转历史
	loadHistoicFlow(serverPath, processInstanceId);
	// 流程图展示
	$('#diagramImg').attr('src', serverPath + 'workflowrest/flowchart/' + processInstanceId+"/"+parseInt(10*Math.random()));
	
	// 是否为会签节点
	var isCounterSign = $('#isCounterSign').val();
	// 分别处理回退、简退、转派及中止按钮显隐
	var buttonBack = $('#buttonBack').val();
	var buttonQuick = $('#buttonQuick').val();
	var buttonTurn = $('#buttonTurn').val();
	var buttonBreak = $('#buttonBreak').val();
	
	//是否显示推荐人
	if($('#isUseReferenceMan').val() == 'true'){
		$("#historyDiv").show();
		$("#shenpiDiv").removeClass("col-md-12");
		$("#shenpiDiv").addClass("col-md-8");
	}else{
		$("#historyDiv").hide();
		$("#shenpiDiv").removeClass("col-md-8");
		$("#shenpiDiv").addClass("col-md-12");
	}
	
	
	// 据是否为会签节点处理按钮事件及显隐
	if(isCounterSign == 'true'){
		// 通过按钮事件添加
		$('#passButton').click(function(){
			addCommentForVote(true);
		});
		// 拒绝按钮事件添加及名称
		$('#backButton').text("拒绝");
		$('#backButton').click(function(){
			addCommentForVote(false);
		});
		// 其余按钮隐藏
		$('#quickButton').hide();
		$('#stopButton').hide();
		$('#turnButton').hide();
	} else {
		// 当前环节是否可中止
		if(buttonBreak == 'true'){
			$('#stopButton').click(function(){
				addCommentForStop();
			});
		} else {
			//$('#stopButton').addClass('disabled');
			$('#stopButton').hide();
		}
		// 当前环节是否可转派
		if(buttonTurn == 'true'){
			$('#turnButton').click(function(){
				addCommentForTurn();
			});
		} else {
			//$('#turnButton').addClass('disabled');
			$('#turnButton').hide();
		}
		// 当前环节是否可回退
		if(buttonBack == 'true'){
			$('#backButton').click(function(){
				addComment(false);
			});
		} else {
			//$('#backButton').addClass('disabled');
			$('#backButton').hide();
		}
		// 当前环节是否可进行简退操作（必然为非首环节）
		if(buttonQuick == 'true'){
			$('#quickButton').click(function(){
				addCommentForQuick();
			});
		} else {
			//$('#quickButton').addClass('disabled');
			$('#quickButton').hide();
		}
		
		// 是否为简退的退回首环节以进行直接推进操作
		var canQuickPush = $('#canQuickPush').val();
		if(canQuickPush == 'true'){
			// 开始环节执行简退推进的事件绑定
			$('#passButton').click(function(){
				addCommentForStart();
			});
		} else {
			// 正常环节推进事件绑定
			$('#passButton').click(function(){
				addComment(true);
			});
		}
	}
	
});

// 根据任务ID获取实际任务办理页面的路径并load到主DIV
function loadTaskPath(serverPath, processInstanceId, taskId, taskDefinitionKey, processDefinitionId) {
	var processDefinitionId = $('#processDefinitionId').val();
	var processInstanceId = $('#processInstanceId').val();
	var taskDefinitionKey = $('#taskDefinitionKey').val();
	var taskId = $('#taskId').val();
	// 请求得到实际业务路径
	$.post(serverPath + "workflowrest/tasktodopath/" + processInstanceId + "/" + taskDefinitionKey + "/" + taskId, null, function(data) {
		var success = data.retCode;
		// 返回成功即继续处理，不成功报原因
		if (success == 1){
			// 获取url串及后续参数并赋值给公共参数对象
			var url = serverPath + data.dataRows[0].url;
			$('#param').val(url.substring(url.indexOf("?") + 1));
			// 环节类型赋值
			var startLink = data.dataRows[0].startLink;
			var endLink = data.dataRows[0].endLink;
			$('#startLink').val(startLink);
			$('#endLink').val(endLink);
			
			// 使用业务办理div加载主办页面
			$("#business").load(url);
			
		} else if (success == 0){
			alert(data.retValue);
		}
		// 主页面加载完成后加载自定义标签
		loadCustomTabs(serverPath, $('#param').val(), processDefinitionId, taskDefinitionKey);
	});
}

// 加载全部自定义标签
function loadCustomTabs(serverPath, param, processDefinitionId, taskDefinitionKey){
	
	$.get(serverPath + "workflowrest/taburls/" + processDefinitionId + "/" + taskDefinitionKey +　"/" + true, 
		function(data) {
			var success = data.retCode;
			// 仅有自定义标签才处理
			if (success == 1){
				for ( var i = 0; i < data.dataRows.length; i++) {
					
					var name = data.dataRows[i].name;
					var url = serverPath + "" + data.dataRows[i].url + "?" + param;
					
					var tabName = "custom_tab" + (i + 1);
					var divName = "custom_div" + (i + 1);
					
					var div = "<div role=\"tabpanel\" class=\"tab-pane fade\" id='" + divName + "'></div>";
					var htmlLi = "<li id='" + tabName + "' role='presentation'></li>";
					var hrefLi = "<a href='#" + divName + "' aria-controls='" + divName + "' role=\"tab\" data-toggle=\"tab\">" + name + "</a>";
					
					$('#history').before(div);
					//自定义标签div加载辅助页面
					$("#" + divName).load(url);
					
					$('#historyLi').before(htmlLi);
					$("#" + tabName).append(hrefLi);
				}
			}
		}
	);
}

//根据流程实例ID获取流转历史	
function loadHistoicFlow(serverPath, processInstanceId) {
	
	$.get(serverPath + "workflowrest/histoicflow/" + processInstanceId,
			function(data) {
				var success = data.retCode;
				// 返回成功即继续处理，不成功报原因
				if (success == 1){
					var html = '';
					for ( var i = 0; i < data.dataRows.length; i++) {
						
						var startTime = data.dataRows[i].startTime;
						startTime = getSmpFormatDateByLong(startTime, true);
						var endTime = data.dataRows[i].endTime;
						if (endTime == null){
							endTime = '';
						} else {
							endTime = getSmpFormatDateByLong(endTime, true);
						}
						
						// 循环拼装表格
						var num = i + 1;
						
						var assigneeName = data.dataRows[i].assigneeName;
						var fromUserName = data.dataRows[i].fromUserName;
						if(data.dataRows[i].replace == true){
							assigneeName = assigneeName + "（ "+ fromUserName + "——待办授权）"
						}
						html += "<tr><td>"
								+ num
								+ "</td><td>"
								+ data.dataRows[i].linkName
								+ "</td><td>"
								+ assigneeName
								+ "</td><td>"
								+ data.dataRows[i].orgName
								+ "</td><td>"
								+ data.dataRows[i].handleType
								+ "</td><td>"
								+ startTime
								+ "</td><td>"
								+ endTime
								+ "</td><td style=\"word-wrap:break-word;word-break:break-all;\">"
								+ data.dataRows[i].userComment + "</td></tr>";
					}

					$("#historyContent").html(html);
					
					if(data.dataRows[0].preProcessInstanceId!="null"&&data.dataRows[0].preProcessInstanceId!=null&&data.dataRows[0].preProcessInstanceId!=""){
						$("#preProcessInstanceId").val(data.dataRows[0].preProcessInstanceId);
						$("#subTitle").val(data.dataRows[0].orgName);
//						alert(data.dataRows[0].preProcessInstanceId + ":" + data.dataRows[0].orgName);
						getPreHistoryContent();
					}
					
				} else if (success == 0){
					alert(data.retValue);
				}
			});
}

// 普通环节点击“通过”或“回退”按钮，添加评论
function addComment(pass){
	// 确认按钮仅绑定推进事件
	$("#confirmButton").unbind();
	$('#confirmButton').click(function(){
		pushProcess();
	});
	// 处理人选择按钮方法重置
	$("#selectAssignee").unbind();
	$('#selectAssignee').click(function(){
		selectAssignee(false, $('#link').val().split(',')[2]);
	});
	
	$("#linkDiv").show();
	$("#assigneeDiv").show();
	
	if(pass){
		$("#comment").val("同意");
		$("#handleType").val(1);
	} else {
		$("#comment").val("不同意");
		$("#handleType").val(2);
	}		
	refreshLink();
	
//	$("#out-footer").hide();
	$("#in-footer").show();
//	$("#in-footer").modal("show");
	// 刷新环节及处理人并展现	
}
// 会签环节点击“通过”或“拒绝”按钮，添加评论
function addCommentForVote(pass){
	// 确认按钮事件处理
	$("#confirmButton").unbind();
	$('#confirmButton').click(function(){
		pushProcessForVote();
	});
	// 隐藏环节选择及受理人选择
	$("#linkDiv").hide();
	$("#assigneeDiv").hide();
	// 据按钮类型选择处理方式
	if(pass){
		$("#comment").val("通过");
		$("#handleType").val(1);
	} else {
		$("#comment").val("不通过");
		$("#handleType").val(2);
	}
	
//	$("#out-footer").hide();
	$("#in-footer").show();
//	$("#in-footer").modal("show");
}
//点击“中止”按钮，仅弹出意见填写窗口
function addCommentForStop(){
	// 确认按钮仅绑定推进事件
	$("#confirmButton").unbind();
	$('#confirmButton').click(function(){
		stopProcess();
	});
	
	$("#linkDiv").hide();
	$("#assigneeDiv").hide();
	$("#comment").val("中止流程");
//	$("#out-footer").hide();
	$("#in-footer").show();
//	$("#in-footer").modal("show");
}
// 点击“简退”按钮，仅弹出意见填写窗口
function addCommentForQuick(){
	// 确认按钮仅绑定推进事件
	$("#confirmButton").unbind();
	$('#confirmButton').click(function(){
		quickBackProcess();
	});
	
	$("#linkDiv").hide();
	$("#assigneeDiv").hide();
	$("#comment").val("不同意");
//	$("#out-footer").hide();
	$("#in-footer").show();
//	$("#in-footer").modal("show");
}
//简退环节后的首环节“推进”按钮，仅弹出意见填写窗口
function addCommentForStart(){
	// 确认按钮仅绑定推进事件
	$("#confirmButton").unbind();
	$('#confirmButton').click(function(){
		quickPushProcess();
	});
	
	$("#linkDiv").hide();
	$("#assigneeDiv").hide();
	$("#comment").val("同意");
//	$("#out-footer").hide();
	$("#in-footer").show();
//	$("#in-footer").modal("show");
}
// 点击“转派”按钮，仅弹出处理人选择及意见填写窗口
function addCommentForTurn(){
	// 确认按钮仅绑定推进事件
	$("#confirmButton").unbind();
	$('#confirmButton').click(function(){
		transferTask();
	});
	// 处理人选择按钮方法重置
	$("#selectAssignee").unbind();
	$('#selectAssignee').click(function(){
		selectAssignee(true, '');
	});
	
	$("#linkDiv").hide();
	$("#assigneeDiv").show();
	$("#comment").val("请代处理");
//	$("#out-footer").hide();
	$("#in-footer").show();
//	$("#in-footer").modal("show");
}

//环节下拉列表
function refreshLink(){
	
	var taskId = $("#taskId").val();
	var handleType = $("#handleType").val();
	var isHistoryBack = $('#isHistoryBack').val(); //该环节在进行回退的时候是否进行历史记录进行匹配
	var isUsePushExpression = $('#isUsePushExpression').val();//在流程推进的时候是否使用表达式进行匹配
	var isUseBackExpression = $('#isUseBackExpression').val();//在流程回退的时候是否使用表达式进行匹配
	var processData = setRelativeData();
	if(!processData){ 
		processData = null;
	}
	$.get(serverPath + "workflowrest/tasklink/" + taskId + "/" + handleType + "/branch/"+isHistoryBack+"/"+isUsePushExpression+"/"+isUseBackExpression,processData,
		function(data) {
			var success = data.retCode;
			// 返回成功即继续处理，不成功报原因
			$("#link").empty();
			if (success == 1){
				var link = data.dataRows;
				
				$.each(link, function(i, obj){
					$("#link").append("<option value='" + obj.value + "'>" + obj.label + "</option>");
				});
				// 最后一环节无需通过时无需选择环节与处理人
				if (link.length == 0 || (link.length == 1 && "END" == link[0].value.split(",")[2])) {
					$("#linkDiv").hide();
					$("#assigneeDiv").hide();
				} else {
					$("#linkDiv").show();
					$("#assigneeDiv").show();
					// 刷新人员
					// refreshAssignee(serverPath, processDefinitionKey, $("#link").val().split(",")[0]);	
				}
				if(link.length>0){
					//是否显示推荐人
					if($('#isUseReferenceMan').val() == 'true'){
						historyUser($('#processDefinitionId').val(),$('#taskDefinitionKey').val(),handleType, $("#link").val().split(",")[0]);
					}
				}
			} else if (success == 0){
				// 未找到匹配的可选环节，异常情况
				alert("未找到可流转环节，异常请处理！");
			}
		});
}

// 20170417起变动，工作流公共模块不参与业务系统待办处理人筛选，由业务系统自行控制
//人员下拉列表
function refreshAssignee(serverPath, processDefinitionKey, taskDefinitionKey){
	
	// 获取实例ID环节LINK_ID
	var processInstanceId = $("#processInstanceId").val();
	
	$.post(serverPath + "workflowrest/assignee/" + processDefinitionKey + "/" + taskDefinitionKey + "/" + processInstanceId,
		function(data) {
			var success = data.retCode;
			// 返回成功即继续处理，不成功报原因
			if (success == 1){
				var assignee = data.dataRows;
				
				$("#assignee").empty();
				$.each(assignee, function(i, obj){
					$("#assignee").append("<option value='" + obj.value + "'>" + obj.label + "</option>");	
				});					
			} else if (success == 0){
				alert(data.retValue);
			}
	});	
}

//点击返回按钮，回到默认按钮并情况处理人信息
function selectButton(){
//	$("#out-footer").hide();
	$("#in-footer").hide();
	
	clearAssignee();
}

// 推动流程
function pushProcess(){
	// 需提交处理的参数
	var taskDefinitionKey = '';
	var withdraw = 0;
	var assignee = '';
	
	// 获取目标环节定义及是否可撤回标志
	var link = $("#link").val();
	
	// !(如果环节与人员选择面板隐藏，且无环节可选，即需要默认推进的环节，默认不可退回)
	/*if(!$("#linkDiv").is(":hidden") && !$("#AndAssignee").is(":hidden") && "END" != $("#link").text()){
		// 若环节与人员选择面板未隐藏，即需要校验是否选择完毕
		var linkAndWithdraw = link.split(",");
		taskDefinitionKey = linkAndWithdraw[0];
		withdraw = linkAndWithdraw[1];
		assignee = $("#assignee").val();
		
		if(taskDefinitionKey.length == 0) {
			alert('请选择环节！');
			return;
		}
		if(assignee == null || assignee== '') {
			alert('请选择处理人！');
			return;
		}
	} else {
		taskDefinitionKey = link.split(",")[0];
	}*/
	if(!$("#linkDiv").is(":hidden")){
		var linkAndWithdraw = link.split(",");
		taskDefinitionKey = linkAndWithdraw[0];
		withdraw = linkAndWithdraw[1];
		
		if(taskDefinitionKey.length == 0) {
			alert('请选择环节！');
			return;
		}
	} else {
		taskDefinitionKey = link.split(",")[0];
	}
	if(!$("#assigneeDiv").is(":hidden")){
		assignee = $("#assignee").val();
		
		if(assignee == null || assignee == '') {
			alert('请选择处理人！');
			return;
		}
	}
	
	var comment = $("#comment").val();
	if(comment.length == 0) {
		alert('请填写审批意见！');
		return;
	}
	
	var r = confirm("是否确认提交？");
	if (r == true) {
		// 调用推进方法，通过及回退均调用此方法，如参分别为（目标环节定义，目标处理人，流程实例ID， 任务ID， 用户意见，处理类型， 是否可撤回 ） 
		modal_pass(serverPath, taskDefinitionKey, assignee, $('#processInstanceId').val(), $('#taskId').val(), comment, $('#handleType').val(), withdraw);
	}
}
// 会签环节专用流程推动
function pushProcessForVote(){
	var comment = $("#comment").val();
	if(comment.length == 0) {
		alert('请填写审批意见！');
		return;
	}
	
	var r = confirm("是否确认提交？");
	if (r == true) { 
		alert($('#processInstanceId').val() + ":" + $('#taskId').val() );
		// 调用推进方法，会签环节同意及拒绝均调用此方法，如参分别为（目标环节定义，目标处理人，流程实例ID， 任务ID， 用户意见，处理类型， 是否可撤回 ），非必要参数传空串
		modal_pass(serverPath, '', '', $('#processInstanceId').val(), $('#taskId').val(), comment, $('#handleType').val(), '');
	}
}

//流程终止，即仅首环节可以流程作废
function stopProcess(){
	var comment = $("#comment").val();
	if(comment.length == 0) {
		alert('请填写审批意见！');
		return;
	}
	
	var r = confirm("【终止】确认后，当前流程将在本环节结束，是否确认？");
	if (r == true) {
		// 调用中止方法
		modal_stop(serverPath, $('#processInstanceId').val(), $('#taskId').val(), comment);
	}
}
// 流程简退-退回操作，即不存在业务数据变动的环节回退任务至首环节
function quickBackProcess(){
	
	// 抽取参数
	var processInstanceId = $('#processInstanceId').val();
	var taskId = $('#taskId').val();
	var comment = $("#comment").val();
	if(comment.length == 0) {
		alert('请填写审批意见！');
		return;
	}
	
	var r = confirm("【简退】确认后，当前任务将回退给流程发起人，是否确认？");
	if (r == true) {
		// 调用简退-回退方法
		$.post(serverPath + "workflowrest/pushprocesstostart/" + processInstanceId + "/" + taskId, {
			"comment" : comment
		}, function(data) {
			if(data.retCode == 1){
				alert("任务已回退至流程发起人！");
				// 成功后回调模态窗口关闭方法
				modal_close();
			}
		});
	}
}
//流程简退-首环节推进操作，即不存在业务数据变动的首环节推进至之前回退
function quickPushProcess(){
	
	// 抽取参数
	var processInstanceId = $('#processInstanceId').val();
	var taskId = $('#taskId').val();
	var comment = $("#comment").val();
	if(comment.length == 0) {
		alert('请填写审批意见！');
		return;
	}
	
	var r = confirm("确认后，当前任务将提交至流程简退退回人，是否确认？");
	if (r == true) {
		// 调用简退-回退方法
		$.post(serverPath + "workflowrest/pushprocessreturnback/" + processInstanceId + "/" + taskId, {
			"comment" : comment
		}, function(data) {
			if(data.retCode == 1){
				alert("任务已提交至流程退回人！");
				// 成功后回调模态窗口关闭方法
				modal_close();
			}
		});
	}
}

// 任务转派
function transferTask(){
	
	// 抽取参数
	var processInstanceId = $('#processInstanceId').val();
	var taskId = $('#taskId').val();
	var assignee = $("#assignee").val();
	var comment = $("#comment").val();
	
	if(assignee == null || assignee == '') {
		alert('请选择处理人！');
		return;
	}
	if(comment.length == 0) {
		alert('请填写审批意见！');
		return;
	}
	
	// 示例中只会转派给当前登录人，业务侧需要自行拓展
	var r = confirm("【转派】确认后，当前任务将转派给已选择受理人，是否确认？");
	if (r == true) {
		// 调用转派方法
		$.post(serverPath + "workflowrest/transfertask/" + processInstanceId + "/" + taskId + "/" + assignee, {
			"comment" : comment
		}, function(data) {
			if(data.retCode == 1){
				alert("转派完成！");
				// 成功后回调模态窗口关闭方法
				modal_close();
			}			
		});
	}
}

//清空下环节处理人已选择内容
function clearAssignee(){
	$("#assignee").val('');
	$("#assigneeName").val('');
}
// 提供业务主页用户关闭模态窗口的按钮
function modal_close(){
	returnList();
}
/**
 * 根据选择的环节进行过滤该环节曾经办过的人员，按时间的顺序进行倒序排序
 * @param processDefinitionId 流程定义
 * @param taskDefinitionKey	本机环节的link_key
 * @param handleType	流程的走向 1 通过2 退回 3转派
 * @param selectTaskDefinitionKey 所选择的流程环节的link_key
 * @returns 经过滤查询所有的人员
 */
function historyUser(processDefinitionId,taskDefinitionKey,handleType,selectTaskDefinitionKey){
	$.post(serverPath + "workflowrest/getHistoryUser/" + processDefinitionId + "/" + taskDefinitionKey + "/" + handleType +"/" + selectTaskDefinitionKey, null, function(data) {
		var html;
		for(var i=0;i<data.length;i++){
			html += "<tr><td>"
				+ data[i].userName
				+ "</td><td>"
				+	"<button type='button' class='btn btn-info btn-xs'  onclick='setUser(\""+data[i].userId+"\",\""+data[i].userName+"\")'>选择</button>" 
				+ "</td></tr>";
		}
		$("#historyUser").html(html);
	});
}
function setUser(userId,userName){
	$("#assignee").val(userId);
	$("#assigneeName").val(userName);
}
function initData(){
	$.ajax({
		url:serverPath + 'workflowrest/taskToDoDetail', 
		type:"POST",
		data:$("#taskToDoDetail").serializeArray(),
		async:false,
		success:function(data){
			$('#isCounterSign').val(data.isCounterSign);
			$('#startLink').val(data.startLink);
			$('#endLink').val(data.endLink);
			$('#canQuickPush').val(data.canQuickPush);
			$('#handleType').val(data.handleType);
			$('#buttonBack').val(data.buttonBack);
			$('#buttonTurn').val(data.buttonTurn);
			$('#buttonBreak').val(data.buttonBreak);
			$('#buttonQuick').val(data.buttonQuick);
			$('#isUseReferenceMan').val(data.isUseReferenceMan);
			$('#isHistoryBack').val(data.isHistoryBack);
			$('#isUsePushExpression').val(data.isUsePushExpression);
			$('#isUseBackExpression').val(data.isUseBackExpression);
			$('#isSendRecord').val(data.isSendRecord);
		},
		error:function(e){
			alert("获取数据异常"+e);
		}
	});
}
function returnList(){
	serarchForToDo();
	$("#goTaskToDoDetailForToDo").hide();
	$("#searchContentForToDo").show();
}



function getPreHistoryContent(){
	var preProcessInstanceId = $("#preProcessInstanceId").val();
	if(preProcessInstanceId){
		$("#subspan").html($("#subTitle").val());
		$.get(serverPath + "workflowrest/histoicflow/" + preProcessInstanceId,
				function(data) {
			var success = data.retCode;
			// 返回成功即继续处理，不成功报原因
			if (success == 1){
				var html = '';
				for ( var i = 0; i < data.dataRows.length; i++) {
					
					var startTime = data.dataRows[i].startTime;
					startTime = getSmpFormatDateByLong(startTime, true);
					var endTime = data.dataRows[i].endTime;
					if (endTime == null){
						endTime = '';
					} else {
						endTime = getSmpFormatDateByLong(endTime, true);
					}
					
					// 循环拼装表格
					var num = i + 1;
					
					var assigneeName = data.dataRows[i].assigneeName;
					var fromUserName = data.dataRows[i].fromUserName;
					if(data.dataRows[i].replace == true){
						assigneeName = assigneeName + "（ "+ fromUserName + "——待办授权）"
					}
					html += "<tr><td>"
						+ num
						+ "</td><td>"
						+ data.dataRows[i].linkName
						+ "</td><td>"
						+ assigneeName
						+ "</td><td>"
						+ data.dataRows[i].orgName
						+ "</td><td>"
						+ data.dataRows[i].handleType
						+ "</td><td>"
						+ startTime
						+ "</td><td>"
						+ endTime
						+ "</td><td style=\"word-wrap:break-word;word-break:break-all;\">"
						+ data.dataRows[i].userComment + "</td></tr>";
				}
				$("#preHistoryContent").html(html);
				// 主流程图展示
				$('#zlc_diagramImg').attr('src', serverPath + 'workflowrest/flowchart/' + preProcessInstanceId+"/"+parseInt(10*Math.random()));
				
				$("#preDiv").css({
					display:'inline'
				});
			} else if (success == 0){
				alert(data.retValue);
			}
		});
	}
	
}

function openImages(temp){
	debugger;
	var previous = document.getElementById(temp);
	var $previous=$(previous); 
	$previous = $previous.find(".active");
	$previous = $previous.find("a");
	showImage($previous.attr("id"));
		
}

subHistoryTitl();
function subHistoryTitl(){ 
	var processInstanceId = $('#processInstanceId').val();
	$.get(serverPath + "workflowrest/subHistoryTitl/" + processInstanceId,
			function(data) {
		if(data.retValue==1){
			
			
			
			var template='<table class="table table-striped table-bordered table-condensed"><thead><tr><th>序号</th><th>环节名称</th><th>受理人</th><th>受理人部门</th><th>处理方式</th><th>任务接收时间</th><th>任务办理时间</th><th>处理意见</th></tr></thead><tbody>';
			var center='</tbody></table>';
			
			
			var temp_a="";
			for(var i=0;i<data.data.length;i++){
				temp_a += '<div class="list-group-item" style="background-color: #A4D3EE;"><table><tr style="width: 100%;"><td style="width: 100%;"><span style="font-size: 14px;color: white;">'+ data.data[i].TITLENAME +'</span></td><td style="width: 100%;" align="right"><div class="btn-group btn-group-xs"><button type="button" class="btn btn-danger" onclick="openImages(\'b_'+data.data[i].PROC_DEF_ID_+'\')" style="text-align: right;">点击查看流程图</button></div></td></tr></table></div><div class="list-group-item"><ul id="b_'+data.data[i].PROC_DEF_ID_+'" class="nav nav-tabs">';
				for(var j=0;j<data.data[i].temp.length;j++){ 
					if(j==0){
						temp_a += '<li class="active"><a id="'+data.data[i].temp[j].PROC_INST_ID+'" href="#business_'+data.data[i].temp[j].PROC_INST_ID+'" aria-controls="business_'+data.data[i].temp[j].PROC_INST_ID+'" role="tab" data-toggle="tab">' +data.data[i].temp[j].NAME_+ '</a></li>';
					}else{
						temp_a += '<li ><a id="'+data.data[i].temp[j].PROC_INST_ID+'" href="#business_'+data.data[i].temp[j].PROC_INST_ID+'" aria-controls="business_'+data.data[i].temp[j].PROC_INST_ID+'" role="tab" data-toggle="tab">' +data.data[i].temp[j].NAME_+ '</a></li>';
					}
				}
				temp_a += '</ui><div class="tab-content">';
				for(var j=0;j<data.data[i].temp.length;j++){
					if(j==0){
						temp_a += '<div class="tab-pane active" id="business_'+data.data[i].temp[j].PROC_INST_ID+'">'+ template +getTables(data.data[i].temp[j].history)+center+'</div>';
					}else{
						temp_a += '<div class="tab-pane" id="business_'+data.data[i].temp[j].PROC_INST_ID+'">'+ template +getTables(data.data[i].temp[j].history)+center+'</div>';
					}
				}
				temp_a += '</div></div>';
			}
			
			
			$("#h_content").append(temp_a);
			
			
		}
	});
}

function showImage(processId){
	
	// 流程图展示
	$('#z_diagramImg').attr('src', serverPath + 'workflowrest/flowchart/' + processId+"/"+parseInt(10*Math.random()));
	$("#z_Modal").modal("show");
	
}

function getTables(data){
	var html = '';
	for ( var i = 0; i < data.length; i++) {
		
		
		var startTime = data[i].startTime;
		startTime = getSmpFormatDateByLong(startTime, true);
		var endTime = data[i].endTime;
		if (endTime == null){
			endTime = '';
		} else {
			endTime = getSmpFormatDateByLong(endTime, true);
		}
		
		
		// 循环拼装表格
		var num = i + 1;
		
		var assigneeName = data[i].assigneeName;
		var fromUserName = data[i].fromUserName;
		if(data[i].replace == true){
			assigneeName = assigneeName + "（ "+ fromUserName + "——待办授权）"
		}
		html += "<tr><td>"
			+ num
			+ "</td><td>"
			+ data[i].linkName
			+ "</td><td>"
			+ assigneeName
			+ "</td><td>"
			+ data[i].orgName
			+ "</td><td>"
			+ data[i].handleType
			+ "</td><td>"
			+ startTime
			+ "</td><td>"
			+ endTime
			+ "</td><td style=\"word-wrap:break-word;word-break:break-all;\">"
			+ data[i].userComment + "</td></tr>";
	}
	
	return html;
}
