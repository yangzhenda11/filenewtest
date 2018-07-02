var parm = App.getPresentParm();
var pageType=parm.pageType;
$(function(){
	initData();
	var processDefinitionId = $('#processDefinitionIdForDone').val();
	var processInstanceId = $('#processInstanceIdForDone').val();
	var taskDefinitionKey = $('#taskDefinitionKeyForDone').val();
	var taskId = $('#taskIdForDone').val();
	
	// 加载主业务页面及自定义页面
	loadTaskPath(serverPath, processInstanceId, taskId, taskDefinitionKey, processDefinitionId);
	
	// 载入流转历史
	loadHistoicFlow(serverPath, processInstanceId);
	// 流程图展示
	//$('#diagramImgForDone').attr('src', serverPath + 'workflowrest/flowchart/' + processInstanceId+"/"+parseInt(10*Math.random()));
	var imgurl=serverPath + 'workflowrest/flowchart/' + processInstanceId+"/"+parseInt(10*Math.random());
	var xhr = new XMLHttpRequest();    
    xhr.open("get", imgurl, true);
    xhr.responseType = "blob";
    xhr.onload = function() {
        if (this.status == 200) {
            var blob = this.response;
            var img = document.createElement("img");
            img.onload = function(e) {
              window.URL.revokeObjectURL(img.src); 
            };
            img.src = window.URL.createObjectURL(blob);
　　　　　　　$("#diagramImgForDonediv").html(img);
        } 
    } 
    xhr.send();
    
	// 处理撤回按钮显隐
	var canWithDraw = $('#canWithDrawForDone').val();
	console.log('canWithDraw='+canWithDraw);
	if(canWithDraw == 'true'){
		$('#returnButtonForDone').click(function(){
			returnProcess();
		});
	} else {
		$('#returnButtonForDone').hide();
		//$('#returnButtonForDone').addClass('disabled'); 
	}
	if(pageType=='3'){
		$("#returnListForDone").html("关闭");
	}
});

//根据任务ID获取实际任务办理页面的路径并load到主DIV
function loadTaskPath(serverPath, processInstanceId, taskId, taskDefinitionKey, processDefinitionId) {
	// 请求得到实际业务路径
	$.post(serverPath + "workflowrest/taskhasdonepath/" + processInstanceId + "/" + taskDefinitionKey + "/" + taskId, function(data) {
		
		var success = data.retCode;
		// 返回成功即继续处理，不成功报原因
		if (success == 1){
			// 获取url串及后续参数并赋值给公共参数对象
			var url = data.dataRows[0].url;
			//$('#paramForDone').val(url.substring(url.indexOf("?") + 1));
			$('#paramForDone').val(data.dataRows[0].param);
			
			// 环节类型赋值
			var startLink = data.dataRows[0].startLink;
			var endLink = data.dataRows[0].endLink;
			$('#startLinkForDone').val(startLink);
			$('#endLinkForDone').val(endLink);
			
			// 使用业务办理div加载主办页面
			//$("#businessForDone").load(url);
			$('#businessForDoneiframe').attr("src",url);
			$("#businessForDone").show();
			
		} else if (success == 0){
			alert(data.retVal);
		}
		// 主页面加载完成后加载自定义标签
		//loadCustomTabs(serverPath, $('#paramForDone').val(), processDefinitionId, taskDefinitionKey);
		var processDefinitionKey=$('#processDefinitionKey').val();
		loadCustomTabs(serverPath, $('#paramForDone').val(), processDefinitionKey, taskDefinitionKey);
	});
}

// 加载全部自定义标签
function loadCustomTabs(serverPath, param, processDefinitionKey, taskDefinitionKey){
	
	$.get(serverPath + "workflowrest/taburls/" + processDefinitionKey + "/" + taskDefinitionKey +　"/" + false, 
		function(data) {
			var success = data.retCode;
			// 仅有自定义标签才处理
			if (success == 1){
				for ( var i = 0; i < data.dataRows.length; i++) {
					
					var name = data.dataRows[i].name;
					var url =  data.dataRows[i].url + "?" + param;
					
					var tabName = "custom_tab" + (i + 1);
					var divName = "custom_div" + (i + 1);
					
					var div = "<div role=\"tabpanel\" class=\"tab-pane fade\" id='" + divName + "ForDone'></div>";
					var htmlLi = "<li id='" + tabName + "ForDone' role='presentation'></li>";
					var hrefLi = "<a href='#" + divName + "' aria-controls='" + divName + "' role=\"tab\" data-toggle=\"tab\">" + name + "</a>";
					
					$('#historyForDone').before(div);
					//自定义标签div加载辅助页面
					$("#" + divName+"ForDone").load(url);
					
					$('#historyLiForDone').before(htmlLi);
					$("#" + tabName+"ForDone").append(hrefLi);
				}
			}
		}
	);
}

//根据流程实例ID获取流转历史	
function loadHistoicFlow(serverPath, processInstanceId) {
	
	$.post(serverPath + "workflowrest/histoicflow/" + processInstanceId,
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

					$("#historyContentForDone").html(html);
					if(data.dataRows[0].preProcessInstanceId!="null"&&data.dataRows[0].preProcessInstanceId!=null&&data.dataRows[0].preProcessInstanceId!=""){
						$("#preProcessInstanceIdForDone").val(data.dataRows[0].preProcessInstanceId);
						$("#subTitleForDone").val(data.dataRows[0].orgName);
//						alert(data.dataRows[0].preProcessInstanceId + ":" + data.dataRows[0].orgName);
						getPreHistoryContent();
					}
				} else if (success == 0){
					alert(data.retVal);
				}
			});
}

//流程终止，即仅首环节可以流程作废
function returnProcess(){
	layer.confirm("【撤回】确认后，当前流程将撤回本环节，是否确认？",{icon:7,title:"提示"},function(index){
		layer.close(index);
		// 调用推进方法
		document.getElementById("businessForDoneiframe").contentWindow.modal_return(serverPath, $('#processInstanceIdForDone').val(), $('#taskIdForDone').val());
	});
}

//提供业务主页用户关闭模态窗口的按钮
function modal_close(){
	if(pageType=='3'){
		window.close();
	}else{
		returnListForDone();
	}
}

function returnListForDone(){
	if(pageType=='3'){
		//FF中需要修改配置window.close方法才能有作用，为了不需要用户去手动修改，所以用一个空白页面显示并且让后退按钮失效
		//Opera浏览器旧版本(小于等于12.16版本)内核是Presto，window.close方法有作用，但页面不是关闭只是跳转到空白页面，后退按钮有效，也需要特殊处理

		var userAgent = navigator.userAgent;
		if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Presto") != -1) {
		    window.location.replace("about:blank");
		} else {
		    window.opener = null;
		    window.open("", "_self");
		    window.close();
		}
	}else{
		serarchForDone();
		$("#goTaskToDoDetailForDone").hide();
		$("#businessForDone").show();
		$("#searchContentForDone").show();
	}
}

function initData(){ 
	$.ajax({
		url:serverPath + 'workflowrest/taskHasDoneDetail', 
		type:"POST",
		data:$("#taskHasDoneDetail").serializeArray(),
		async:false,
		success:function(data){
			$('#canWithDrawForDone').val(data.canWithDraw);
		},
		error:function(e){
			alert("获取数据异常"+e);
			App.ajaxErrorCallback(e);
		}
	});
}




function getPreHistoryContent(){
	var preProcessInstanceId = $("#preProcessInstanceIdForDone").val();
	if(preProcessInstanceId){
		$("#subspanForDone").html($("#subTitleForDone").val());
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
				$("#preHistoryContentForDone").html(html);
				// 主流程图展示
				$('#zlc_diagramImgForDone').attr('src', serverPath + 'workflowrest/flowchart/' + preProcessInstanceId+"/"+parseInt(10*Math.random()));
				
				$("#preDivForDone").css({
					display:'inline'
				});
			} else if (success == 0){
				alert(data.retValue);
			}
		});
	}
	
}

function openImagesForDone(temp){
	debugger;
	var previous = document.getElementById(temp);
	var $previous=$(previous); 
	$previous = $previous.find(".active");
	$previous = $previous.find("a");
	var processId = $previous.attr("id").split("_");
	
	$('#z_diagramImgForDone').attr('src', serverPath + 'workflowrest/flowchart/' + processId[1]+"/"+parseInt(10*Math.random()));
	$("#z_ModalForDone").modal("show"); 
		
}

subHistoryTitl();
function subHistoryTitl(){ 
	var processInstanceId = $('#processInstanceIdForDone').val();
	$.get(serverPath + "workflowrest/subHistoryTitl/" + processInstanceId,
			function(data) {
		if(data.retValue==1){
			
			
			var template='<table class="table table-striped table-bordered table-condensed"><thead><tr><th>序号</th><th>环节名称</th><th>受理人</th><th>受理人部门</th><th>处理方式</th><th>任务接收时间</th><th>任务办理时间</th><th>处理意见</th></tr></thead><tbody>';
			var center='</tbody></table>';
			
			
			var temp_a="";
			for(var i=0;i<data.data.length;i++){
				temp_a += '<div class="list-group-item" style="background-color: #A4D3EE;"><table><tr style="width: 100%;"><td style="width: 100%;"><span style="font-size: 14px;color: white;">'+ data.data[i].TITLENAME +'</span></td><td style="width: 100%;" align="right"><div class="btn-group btn-group-xs"><button type="button" class="btn btn-danger" onclick="openImagesForDone(\'b_'+data.data[i].PROC_DEF_ID_+'_ForDone\')" style="text-align: right;">点击查看流程图</button></div></td></tr></table></div><div class="list-group-item"><ul id="b_'+data.data[i].PROC_DEF_ID_+'_ForDone" class="nav nav-tabs">';
				for(var j=0;j<data.data[i].temp.length;j++){ 
					if(j==0){
						temp_a += '<li class="active"><a id="b_'+data.data[i].temp[j].PROC_INST_ID+'" href="#business_'+data.data[i].temp[j].PROC_INST_ID+'_ForDone" aria-controls="business_'+data.data[i].temp[j].PROC_INST_ID+'_ForDone" role="tab" data-toggle="tab">' +data.data[i].temp[j].NAME_+ '</a></li>';
					}else{
						temp_a += '<li ><a id="b_'+data.data[i].temp[j].PROC_INST_ID+'" href="#business_'+data.data[i].temp[j].PROC_INST_ID+'_ForDone" aria-controls="business_'+data.data[i].temp[j].PROC_INST_ID+'_ForDone" role="tab" data-toggle="tab">' +data.data[i].temp[j].NAME_+ '</a></li>';
					}
				}
				temp_a += '</ui><div class="tab-content">';
				for(var j=0;j<data.data[i].temp.length;j++){
					if(j==0){
						temp_a += '<div class="tab-pane active" id="business_'+data.data[i].temp[j].PROC_INST_ID+'_ForDone">'+ template +getTables(data.data[i].temp[j].history)+center+'</div>';
					}else{
						temp_a += '<div class="tab-pane" id="business_'+data.data[i].temp[j].PROC_INST_ID+'_ForDone">'+ template +getTables(data.data[i].temp[j].history)+center+'</div>';
					}
				}
				temp_a += '</div></div>';
			}
			$("#h_contentForDone").append(temp_a);
		}
	});
	

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
}

//业务界面自定义tab方法：addCustomTab({"title":"项目基本信息","url":url4});
/*
function addCustomTab(params){
	var name = params.title;
	var url = params.url;
	var count = $("li").length;
	var tabName = "addcustom_tab" + (count + 1);
	var divName = "addcustom_div" + (count + 1);
	
	var div = "<div role=\"tabpanel\" class=\"tab-pane fade\" id='" + divName + "'></div>";
	var htmlLi = "<li id='" + tabName + "' role='presentation'></li>";
	var hrefLi = "<a href='#" + divName + "' aria-controls='" + divName + "' role=\"tab\" data-toggle=\"tab\">" + name + "</a>";
	
	$('#history').before(div);
	//自定义标签div加载辅助页面
	$("#" + divName).load(url,function(){
		 App.init();
	});
	
	$('#historyLi').before(htmlLi);
	$("#" + tabName).append(hrefLi);
	
}
*/
//业务界面自定义tab方法：addCustomTab({"title":"项目基本信息","url":url4});
function addCustomTab(params){
	var name = params.title;
	var url = params.url;
	var count = $("li").length;
	var tabName = "addcustom_tab" + (count + 1);
	var divName = "addcustom_div" + (count + 1);
	
	var div = "<div role=\"tabpanel\" class=\"tab-pane fade\" id='" + divName + "'></div>";
	var htmlLi = "<li id='" + tabName + "' role='presentation'></li>";
	var hrefLi = "<a href='#" + divName + "' aria-controls='" + divName + "' role=\"tab\" data-toggle=\"tab\">" + name + "</a>";
	
	$('#historyForDone').before(div);
	//自定义标签div加载辅助页面
	$("#" + divName).load(url);
	
	$('#historyLiForDone').before(htmlLi);
	$("#" + tabName).append(hrefLi);
	
			
}