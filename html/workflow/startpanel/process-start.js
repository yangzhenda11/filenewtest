//@ sourceURL=process-start.js
var config = parent.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId=config.curStaffOrgId;
var curStaffId=config.curStaffId;
// 环节下拉列表
function refreshLinkForSart(){
	
	// 当前流程定义Key
	var processDefinitionKey = $("#processDefinitionKey").val();
	var pathSelect=$("#pathSelect").val();
	
	if(processDefinitionKey.length == 0){
		layer.alert("请选择流程模板！");
		return;
	}
	
	//去开始页面上去添加 的数据   如果没有直接 return false   
	var processData = setRelativeData();
	if(!processData){ 
		processData=null;
	}
	$.get(serverPath + "workflowrest/tasklinkforstart/" + processDefinitionKey+"/0"+"/"+pathSelect,processData,
		// @param processDefinitionKey 流程定义key
		// @param isUsePushExpression 推进是否过滤表达式，是的话需要过滤fel表达式,目前都默认写死为0，暂不使用fel表达式
		// @param pathSelect 路由值
		function(data) {
			var success = data.retCode;
			// 返回成功即继续处理，不成功报原因
			if (success == 1){
				var link = data.dataRows;
				
				$("#linkForStart").empty();
				$.each(link, function(i, obj){
					$("#linkForStart").append("<option value='" + obj.value + "'>" + obj.label + "</option>");
				});
				
				/*if (link.length != 0) {
					// 刷新人员
					refreshAssigneeForStart(serverPath, processDefinitionKey, $("#link").val().split(",")[0]);	
				}*/
				clearAssigneeForStart();
				$("#myProcessStartModal").modal("show");
			} else if (success == 0){
				alert(data.retVal);
			}
	});
}

// 20170418剔除此方法
//人员下拉列表
function refreshAssigneeForStart(serverPath, processDefinitionKey, taskDefinitionKey){
	
	$.post(serverPath + "/workflowrest/assigneeforstart/" + processDefinitionKey + "/" + taskDefinitionKey,
		function(data) {
			var success = data.retCode;
			// 返回成功即继续处理，不成功报原因
			if (success == 1){
				var assignee = data.dataRows;
				
				$("#assigneeForStart").empty();
				$.each(assignee, function(i, obj){
					$("#assigneeForStart").append("<option value='" + obj.value + "'>" + obj.label + "</option>");	
				});				
			} else if (success == 0){
				alert(data.retValue);
			}
		});
}

// 点击【提交】按钮，弹出模态窗口
function startProcess(processDefinitionKey, assignee, taskDefinitionKey,withdraw){
	
    if(processDefinitionKey.length == 0){
        layer.msg('请选择办理环节！',{time:2000});
        return;
    }
    if(assignee == null || assignee.length == 0){
        layer.msg('请选择处理人！',{time:2000});
        return;
    }
    var comment = $("#comment").val();
    if(comment == null || comment.length == 0){
        layer.msg('请填写处理意见！',{time:2000});
        return;
    }
    var iscandidate=$("#linkForStart").val().toString().split(",")[3];
    if(iscandidate == null || iscandidate.length == 0){
    	layer.msg('流程异常，无法识别下一步环节是否是需要抢单环节，请联系管理员！',{time:2000});
    	return;
    }
    
	layer.confirm('是否确认提交？', {icon: 3,title: '确认'}, function(index) {
			// 调用发起方法
			modal_start(processDefinitionKey, assignee, taskDefinitionKey,comment,withdraw,iscandidate);
			layer.close(index);
		})
}

//显示流程发起框，选择环节及处理人
function showStartPanel(){
	// 根据用户已确认的业务变量刷新环节
	refreshLinkForSart();
}
// 清空下环节处理人已选择内容
function clearAssigneeForStart(){
	$("#assigneeForStart").val('');
	$("#assigneeNameForStart").val('');
}
// 发起方法modal_start()执行成功后，调用此方法关闭弹出窗口
function closeModalForStart(){
	$("#myProcessStartModal").modal("hide");
}

function selectstaff(){
	var flowKey = $("#processDefinitionKey").val();
    var linkcode = $("#linkForStart").val().toString().split(",")[0];
    //下一步要提交的环节是否是候选人环节
    var idcandidate=$("#linkForStart").val().toString().split(",")[3];
    var prov=$("#wprov").val();
	var staffSelectType=$("#wStaffSelectType").val();
	var callbackFun='getassignee';
	if(idcandidate==1){
		layer.msg("因下一步环节是候选人抢单环节，所以强制切换选人模式为多选！");
		staffSelectType=2;
	}
	if(staffSelectType==2){
		callbackFun="getassignees";
	}
    
    jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType);
}
function jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType){

	var frameSrc ="/html/workflow/assignee/assgigneeList.html"; 
    $("#PandJstaffiframetask").load(frameSrc,function() {
    	$("#PandJstaffiframetask").modal('show');
    	setParam(flowKey,linkcode,prov,callbackFun,staffSelectType);
    	$("#PandJstaffiframetask").off('shown.bs.modal').on('shown.bs.modal', function (e) {
			App.initDataTables('#searchStaffTable', "#searchEforgHome", dataTableConfig);
			$(".checkall").click(function () {
			    var check = $(this).prop("checked");
			    $("#searchStaffTable .checkchild").prop("checked", check);
			    checkAllChildStaffCheckbox();
			});
		})
    });
}
function getassignee(ORG_ID,org_code,full_name,STAFF_NAME,STAFF_ORG_ID){
    // console.log(orgId,orgName,staffId,staffOrgId);
    $("#assigneeForStart").val(STAFF_ORG_ID);
    $("#assigneeNameForStart").val(STAFF_NAME);
    $("#PandJstaffiframetask").modal('hide');
}
function getassignees(STAFF_ORG_IDS,STAFF_NAMES){
	$("#assigneeForStart").val(STAFF_ORG_IDS);
	$("#assigneeNameForStart").val(STAFF_NAMES);
	$("#PandJstaffiframetask").modal('hide');
}
function setAssigneeParam(assigneeParam){
	$("#wprov").val(assigneeParam.prov);
}
//根据业务标识选择流程模板。参数：businesscode:PRO,PDM,ACC
function getProcessDefinitionKey(businesscode){
	
	$.ajax({  
        type : "post",  
     	url : serverPath + "workflowrest/getprocessDefinitionKey/" + businesscode,
        async : false,
        success : function(data){
            var success = data.retCode;
            // 返回成功即继续处理，不成功报原因
            if(success == 1){
                var processDefinitionKey = data.dataRows[0].processDefinitionKey;
                $('#processDefinitionKey').val(processDefinitionKey);
            }else if(success == 0){
                layer.msg(data.retVal,{time:3000});
           	}
        },
        error: function(result) {
			App.ajaxErrorCallback(result);
		}
    }); 
}
function setPathSelect(pathSelect){
	$("#pathSelect").val(pathSelect);
}

function setStaffSelectType(staffSelectType){
	if(staffSelectType.length>0){
		$("#wStaffSelectType").val(staffSelectType);
	}
}











