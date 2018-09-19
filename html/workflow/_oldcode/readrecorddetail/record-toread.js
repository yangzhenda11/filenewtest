$(function(){
	
	var processDefinitionId = $('#processDefinitionIdToread').val();
	var processInstanceId = $('#processInstanceIdToread').val();
	var taskDefinitionKey = $('#taskDefinitionKeyToread').val();
	var taskId = $('#idToread').val();
	// 加载主业务页面及自定义页面
	loadTaskPath(serverPath, processInstanceId, taskId, taskDefinitionKey, processDefinitionId);
	
	// 载入流转历史
	loadHistoicFlow(serverPath, processInstanceId);
	// 流程图展示
	$('#diagramImgToread').attr('src', serverPath + 'workflowrest/flowchart/' + processInstanceId+"/"+parseInt(10*Math.random()));
	
});

//根据任务ID获取实际任务办理页面的路径并load到主DIV
function loadTaskPath(serverPath, processInstanceId, taskId, taskDefinitionKey, processDefinitionId) {
	// 请求得到实际业务路径
	$.post(serverPath + "flowReadRecord/findRecordPath/" + processInstanceId + "/" + taskId + "/" + taskDefinitionKey, function(data) {
		
		var success = data.retCode;
		// 返回成功即继续处理，不成功报原因
		if (success == 1){
			// 获取url串及后续参数并赋值给公共参数对象
			var url = serverPath + "/" + data.dataRows[0].url;
			$('#paramToread').val(url.substring(url.indexOf("?") + 1));
			
			// 使用业务办理div加载主办页面
			$("#businessToread").load(url);
			
		} else if (success == 0){
			alert(data.retVal);
		}
		// 主页面加载完成后加载自定义标签
		loadCustomTabs(serverPath, $('#paramToread').val(), processDefinitionId, taskDefinitionKey);
	});
}

// 加载全部自定义标签
function loadCustomTabs(serverPath, param, processDefinitionId, taskDefinitionKey){
	
	$.get(serverPath + "workflowrest/taburls/" + processDefinitionId + "/" + taskDefinitionKey +　"/" + false, 
		function(data) {
			var success = data.retCode;
			// 仅有自定义标签才处理
			if (success == 1){
				for ( var i = 0; i < data.dataRows.length; i++) {
					
					var name = data.dataRows[i].name;
					var url = serverPath + data.dataRows[i].url + "?" + param;
					
					var tabName = "custom_tab" + (i + 1);
					var divName = "custom_div" + (i + 1);
					
					var div = "<div role=\"tabpanel\" class=\"tab-pane fade\" id='" + divName + "Toread'></div>";
					var htmlLi = "<li id='" + tabName + "Toread' role='presentation'></li>";
					var hrefLi = "<a href='#" + divName + "Toread' aria-controls='" + divName + "' role=\"tab\" data-toggle=\"tab\">" + name + "</a>";
					
					$('#historyToread').before(div);
					//自定义标签div加载辅助页面
					$("#" + divName + "Toread").load(url);
					
					$('#historyLiToread').before(htmlLi);
					$("#" + tabName + "Toread").append(hrefLi);
				}
			}
		}
	);
}

//根据流程实例ID获取流转历史	
function loadHistoicFlow(serverPath, processInstanceId) {
	
	$.get(serverPath + "/workflowrest/histoicflow/" + processInstanceId,
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
						
						var assigneeName = data.dataRows[i].assigneeName
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

					$("#historyContentToread").html(html);
				} else if (success == 0){
					alert(data.retVal);
				}
			});
}

//已阅按钮处罚功能
function doRead(recordId){
	var r = confirm("【已阅】确认后，请在已阅菜单查看，是否确认？")
	if (r == true) {
		// 调用推进方法
		$.post(serverPath +"flowReadRecord/signRecord",{
			"recordId" : recordId
		}, function(data){
			if (data == 1){
				alert("标记成功，请往已阅菜单查看!");
				modal_close();
			}
		});
	}
}

//提供业务主页用户关闭模态窗口的按钮
function modal_close(){
	showToReadList();
}

function showToReadList(){
	serarchToread();
	$("#goRecordToReadDetailToread").hide();
	$("#searchContentToread").show();
}