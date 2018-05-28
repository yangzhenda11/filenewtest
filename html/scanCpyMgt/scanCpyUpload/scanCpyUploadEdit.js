//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
var id = null;
if(parm.pageType==1){
	id = parm.businessKey;
}else if(parm.pageType==2){
	id = parm.id;
}else{
	id=0;
}

//系统的全局变量获取
var config = top.globalConfig;
//console.log(config);
var serverPath = config.serverPath;

var attArray=[];

//页面初始化事件
$(function() {
	
	if(parm.pageType == 1){
		$(".toolbarBtn,.portlet-title").remove();
		$(".page-content,.portlet-body").css("padding",'0px');
		$(".portlet").css("cssText","border:none !important;padding:0px");
		$(".page-content").removeClass("hidden");
	}else if(parm.pageType == 2){
		$(".page-content").removeClass("hidden");
		//固定操作按钮在70px的高度
		App.fixToolBars("toolbarBtnContent", 70);
	}
	
	checkFileIsUpload();
	getContractInfo();
	
	$.ajax({
        "type": "POST",
        "url": serverPath+'contractUpload/listFile?id='+id,
        "success": function(data) {
            var array=data.data;
            var rows=array.length;
            var cols=3;
            var htmlstr="<table class='table table-hover table-bordered table-striped'><thead><tr><th style='text-align:center;'>序号</th><th style='text-align:center;'>文件列表</th><th style='text-align:center;'>操作</th></tr></thead><tbody>";
            for(i=1;i<=rows;i++){
            	if(array[i-1].storeId!=null && array[i-1].storeId!=''){
            		attArray.push(array[i-1]);
            	}
            	htmlstr+="<tr>";
            	if(array[i-1].storeId!=null && array[i-1].storeId!=''){
            		htmlstr+="<td align='center'>" + i +"<input id='att"+array[i-1].attachId+"' type='hidden' value='"+array[i-1].storeId+"' /></td>";
            	}else{
            		htmlstr+="<td align='center'>" + i +"<input id='att"+array[i-1].attachId+"' type='hidden' value='' /></td>";
            	}
            	htmlstr+="<td align='center'>" + array[i-1].displayName +"</td>";
            	if(array[i-1].storeId!=null && array[i-1].storeId!=''){
            		htmlstr+="<td align='center'><button type='button' id='addButton"+array[i-1].attachId+"' style='display:none' onclick='addAttachment(\""+array[i-1].attachId+"\")'>添加</button>";
            		htmlstr+="<button type='button' id='downLoadButton"+array[i-1].attachId+"' onclick='downLoad(\""+array[i-1].attachId+"\")'>下载</button>";
            		//htmlstr+="<button type='button' id='downLoadButton"+array[i-1].attachId+"' onclick='window.location.href=\"/contractUpload/downloadS3?key1="+array[i-1].storeId+"\"'>下载</button>";
            		htmlstr+="<button type='button' id='delButton"+array[i-1].attachId+"' onclick='del(\""+array[i-1].attachId+"\")'>删除</button></td>";
            	}else{
            		htmlstr+="<td align='center'><button type='button' id='addButton"+array[i-1].attachId+"' onclick='addAttachment(\""+array[i-1].attachId+"\")'>添加</button>";
            		htmlstr+="<button type='button' id='downLoadButton"+array[i-1].attachId+"' style='display:none' onclick='downLoad(\""+array[i-1].attachId+"\")'>下载</button>";
            		htmlstr+="<button type='button' id='delButton"+array[i-1].attachId+"' style='display:none' onclick='del(\""+array[i-1].attachId+"\")'>删除</button></td>";
            	}
            	htmlstr+="</tr>";
            }
            htmlstr+="</tbody></table>";
            document.getElementById('scanCpyloadTable').innerHTML=htmlstr;
        },
        error: function(result) {
			App.ajaxErrorCallback(result);
		}
    });
})


//查询该合同下是否上传了扫描件
function checkFileIsUpload(){
	var url = serverPath + 'contractUpload/checkFileIsUpload?id='+id;
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
			if(data.count==1){
				//console.log(data);
				var fileName = data.contractNumber+"正文扫描件.pdf";
				var htmlstr = "<div class='col-sm-12 control-label paddingLR0'><a href='/contractUpload/downloadS3?key1="+data.storeId+"'>"+fileName+"</a></div>";
				document.getElementById('fileNameDiv').innerHTML=htmlstr;
				$("#uploadFileNameshow").val(fileName);
				$("#uploadFile_div2").show();
    			$("#uploadFile_div1").hide();
			}else{
				$("#uploadFile_div2").hide();
    			$("#uploadFile_div1").show();
			}
       },
       error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}

function getContractInfo(){
	var url = serverPath + 'contractUpload/getContractById?id='+id;
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
        	$("#contractNumber").val(data.data.contractNumber);
        	$("#undertakeName").val(data.data.undertakeName);
        	$("#undertakePhone").val(data.data.undertakePhone);
        	$("#undertakeMobile").val(data.data.undertakeMobile);
        	$("#contractName").val(data.data.contractName);
        	$("#executeDeptName").val(data.data.executeDeptName);
        	$("#unicomPartyName").text(data.data.unicomPartyName);
        	$("#oppoPartyName").text(data.data.oppoPartyName);
        	
        	var contractType=data.data.contractType;
        	var label=document.getElementById("contractType");
			label.innerText=contractType;
			$("#contractType").html(contractType);
        },
        error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}

//返回上一页
function backPage(){
	window.history.go(-1);
}

function downLoad(attachId){
	attachId = $("#att"+attachId+"").val();
	//alert(attachId);
	window.location.href="/contractUpload/downloadS3?key1="+attachId;
}

var array=[];
function addAttachment(attachId){
	var setting = {
		title : "文件上传",
		url:'contractUpload/uploadFile',	//上传地址，非空
		maxNumber:1,//最大上传数量
		//uploadAsync : false, //ajax提交是否异步提交，参数:false|true，默认为true,可为空
		//fileExtensions:["pdf"],//上传文件类型，参数:["pdf"]多个["pdf","doc"]，默认不控制，可为空
		extraData:{attachId:attachId}//上传时额外附加的参数,业务为正文扫描件上传时要求加displayname字段，可为空
	};
	function queryCallback(){//点击确定执行的函数，必传。
		var fileInfo = getFileItemInfo();//可以在此获取上传列表的内容，通过内置getFileItem获取；
		$("#commomModal").modal("hide");//模态框关闭
		if(fileInfo.length!=0){
			array.push(fileInfo[0].data);
			$("#att"+attachId+"").val(fileInfo[0].data.storeId);
			$("#addButton"+attachId+"").hide();
			$("#downLoadButton"+attachId+"").show();
			$("#delButton"+attachId+"").show();
		}
	}
	App.getFileUploadModal(setting,queryCallback);
}

/**
 * 附件列表点击删除按钮删除附件
 * */
var deleteArray=[];
function del(attachId){
	console.log(attArray);
	if(attArray.length!=0){
		for(var i=0;i<attArray.length;i++){
			if(attachId==attArray[i].attachId){
				deleteArray.push(attArray[i]);
				attArray.splice(i,1);
			}
		}
	}
	for(var i=0;i<array.length;i++){
		if(attachId==array[i].attachId){
			deleteArray.push(array[i]);
			array.splice(i,1);
		}
	}
	console.log(array);
	console.log(deleteArray);
	$("#addButton"+attachId+"").show();
	$("#downLoadButton"+attachId+"").hide();
	$("#delButton"+attachId+"").hide();
}

/**
 * 点击选择按钮触发事件
 * */
var result={};//保存上传成功后返回的对象
function fileUpload(){
	var fileName = $("#contractNumber").val()+"正文扫描件.pdf";
	var setting = {
		title : "文件上传",
		url:'contractUpload/uploadFile',	//上传地址，非空
		maxNumber:1,//最大上传数量
		//uploadAsync : false, //ajax提交是否异步提交，参数:false|true，默认为true,可为空
		fileExtensions:["pdf"],//上传文件类型，参数:["pdf"]多个["pdf","doc"]，默认不控制，可为空
		extraData:{attachId:'',displayName:fileName}//上传时额外附加的参数,业务为正文扫描件上传时要求加displayname字段，可为空
	};
	function queryCallback(){//点击确定执行的函数，必传。
		var fileInfo = getFileItemInfo();//可以在此获取上传列表的内容，通过内置getFileItem获取；
		//console.log(fileInfo[0].data);
		$("#commomModal").modal("hide");//模态框关闭
		if(fileInfo.length!=0){
			result = fileInfo[0].data;
			console.log(result);
			$("#uploadFileNameshow").val(fileName);
			var htmlstr = "<div class='col-sm-12 control-label paddingLR0'><a href='/contractUpload/downloadS3?key1="+result.storeId+"'>"+fileName+"</a></div>";
			document.getElementById('fileNameDiv').innerHTML=htmlstr;
			$("#uploadFile_div1").hide();
    		$("#uploadFile_div2").show();
		}
	}
	App.getFileUploadModal(setting,queryCallback);
}

/**
 * 删除合同正文扫描件
 * */
function delScan(){
	/*var id = $("#uploadStoreId").val();
	$("#delUploadStoreId").val(id);
	$("#uploadFileNameshow").val('');
	$("#uploadStoreId").val('');*/
	$("#uploadFileNameshow").val('');
	$("#uploadFile_div1").show();
    $("#uploadFile_div2").hide();
    result={};
}

function saveContractText(){
	var jsonStr = JSON.stringify(result);
	$.ajax({
		url : serverPath + 'contractUpload/saveContract',
        type : "post",
        data:{"jsonStr":jsonStr,"id":id},
        success : function(data) {
       		if(data.status=='1'){
       			layer.msg(data.message);
       		}else if(data.status=='0'){
       			layer.msg(data.message);
       		}
       	},
       	error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}

function delContractText(){
	var url = serverPath + 'contractUpload/delContractText?id='+id;
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
       		if(data.status=='1'){
       			//alert("保存成功！");
       		}else if(data.status=='0'){
       			layer.msg(data.message);
       		}
        },
        error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}

function saveAttachment(){
	$.ajax({
		url : serverPath + 'contractUpload/saveAttachment',
        type : "post",
        data:{"strArray":JSON.stringify(array)},
        success : function(data) {
			if(data.status=='1'){
				layer.msg("保存成功！");
			}else if(data.status=='0'){
				layer.msg(data.message);
			}
		},
		error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}

function delAttachment(){
	$.ajax({
		url : serverPath + 'contractUpload/delAttachment',
        type : "post",
        data:{"deleteArray":JSON.stringify(deleteArray)},
        async:false,
        success : function(data) {
			if(data.status=='1'){
				console.log("删除附件扫描件成功！");
			}else if(data.status=='0'){
				layer.msg(data.message);
			}
		},
		error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}

function saveContract(){
	//console.log("result====="+result);
	//console.log("array====="+array);
	if(deleteArray.length!=0){
		delAttachment();
	}
	if(JSON.stringify(result) == "{}"){
		if($("#uploadFileNameshow").val()==''){
			delContractText();
		}
		if(array.length==0){
			layer.msg("保存成功！");
		}else{
       		saveAttachment();
		}
	}else{
		if(array.length==0){
			saveContractText();
		}else{
			var jsonStr = JSON.stringify(result);
			$.ajax({
				url : serverPath + 'contractUpload/saveContract',
        		type : "post",
        		data:{"jsonStr":jsonStr,"id":id},
        		success : function(data) {
       				if(data.status=='1'){
       					$.ajax({
							url : serverPath + 'contractUpload/saveAttachment',
        					type : "post",
        					data:{"strArray":JSON.stringify(array)},
        					success : function(data) {
       							if(data.status=='1'){
       								layer.msg("保存成功！");
       							}else if(data.status=='0'){
       								layer.msg(data.message);
       							}
        					},
        					error: function(result) {
								App.ajaxErrorCallback(result);
							}
						});
       				}else if(data.status=='0'){
       					layer.msg(data.message);
       				}
        		}
			});
		}
	}
}


/**
 * 工作流相关
 * */
function beforePushProcess(pass){
	var result=true;
	//1，业务侧的校验，校验不通过则返回false
	if($("#uploadFileNameshow").val()==''){
		layer.alert("请上传合同正文扫描件！", {
            icon: 0,
            skin: 'layer-ext-moon'
        });
		return;
	}
	var url = serverPath + 'contractUpload/validateContractStatus?id='+id;
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
			if(data.count!=0){
				result=false;
				layer.msg(data.message);
			}else{
				result=true;
			}
       	},
       	error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
	
	//2,设置下一步选人的参数，用于匹配通用规则选人。
	var assigneeParam = { 
		"prov": "sd",  //省分，来自需求工单，必传
	}
	parent.setAssigneeParam(assigneeParam);
	
	//3,设置路由值，默认为0，对于有分支的场景需要单独设置路由值
	// parent.setPathSelect(1);
	
	return result;
}

//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_pass(root, taskDefinitionKey, assignee, processInstanceId, taskId, comment, handleType, withdraw){
	//alert( "目标任务定义：" + taskDefinitionKey + "_目标受理人：" + assignee + "_流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_审批意见：" + comment + "_处理方式：" + handleType + "_是否可回撤" + withdraw);
		$.post(root + "contractUpload/pushProcess", {
			"processInstanceId" : processInstanceId,//当前流程实例
			"taskId" : taskId,//当前任务id
			"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
			"assignee" : assignee,//下一步参与者
			"comment" : comment,//下一步办理意见
			"handleType" : handleType,//处理类型，1为通过，2为回退
			"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
			"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
			"title":""//可不传，如果需要修改待办标题则传此参数。
		}, function(data) {
			layer.msg(data.sign);
			
			// 成功后回调模态窗口关闭方法
			parent.modal_close();   
		});
}

//转派前回调业务侧实现的方法，业务进行必要的校验等操作。
function beforeTransfer(){
	var result=true;
	//1,业务侧的校验
	
	//2，设置转派选人的参数
	var assigneeParam = { 
		"prov": "sd",  //省分，来自需求工单，必传
	}
	parent.setAssigneeParam(assigneeParam);
	return result;
}


function businessPush(){
	if($("#uploadFileNameshow").val()==''){
		layer.msg("请上传合同正文扫描件！");
		return;
	}
	var taskBusinessKey=id;
	//alert(taskBusinessKey);
	if(taskBusinessKey.length==0){
		layer.msg("请填写业务主键！");
		return;
	}
	//App.getFlowParam 参数，serverPath，业务主键，handletype，pathSelect
	var flowParam=App.getFlowParam(serverPath,taskBusinessKey,1,0);
	if(App.applyCandidateTask(serverPath,flowParam)){
		modal_passBybuss(flowParam);
	}else{
		layer.alert("任务申领失败", {
            icon: 0,
            skin: 'layer-ext-moon'
        });
		//alert("任务申领失败！");
		return;
	}
}

//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_passBybuss(flowParam){
	var root=serverPath;//flowParam.root
	var taskDefinitionKey=flowParam.taskDefinitionKey
	var assignee=flowParam.assignee
	var processInstanceId=flowParam.processInstanceId
	var taskId=flowParam.taskId
	var comment=flowParam.comment
	var handleType=flowParam.handleType
	var withdraw=flowParam.withdraw
	
	var postData = {
		"processInstanceId" : processInstanceId,//当前流程实例
		"taskId" : taskId,//当前任务id
		"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
		"assignee" : assignee,//下一步参与者
		"comment" : comment,//下一步办理意见
		"handleType" : handleType,//处理类型，1为通过，2为回退
		"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
		"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
		"title":""//可不传，如果需要修改待办标题则传此参数。
	};
	var url = "contractUpload/pushProcess";
	postData.id = id;
	App.formAjaxJson(serverPath + url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		parent.layer.alert("提交成功!",{icon:1});
		document.getElementById("saveButton").style.display = "none";
		document.getElementById("businessPushButton").style.display = "none";
		/*parent.layer.alert("处理成功",{icon:1},function(){
			parent.modal_close();
		});*/
	};
	function improperCallback(result){
		parent.layer.alert(result.message,{icon:1});
	}
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
}