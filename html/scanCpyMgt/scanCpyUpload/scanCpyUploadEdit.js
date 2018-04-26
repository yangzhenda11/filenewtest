//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
console.log(parm);
var contractId = parm.id;

//系统的全局变量获取
var config = top.globalConfig;
//console.log(config);
var serverPath = config.serverPath;


//页面初始化事件
$(function() {
	if(parm.pageType == 1){
		$(".toolbarBtn,.portlet-title").remove();
		$(".page-content,.portlet-body").css("padding",'0px');
		$(".portlet").css("cssText","border:none !important;padding:0px");
		$(".page-content").removeClass("hidden");
	}else{
		$(".page-content").removeClass("hidden");
		//固定操作按钮在70px的高度
		App.fixToolBars("toolbarBtnContent", 70);
	}
	checkFileIsUpload();
	getContractInfo();
})

//查询该合同下是否上传了扫描件
function checkFileIsUpload(){
	var url = serverPath + 'contractUpload/checkFileIsUpload?id=113';
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
        	console.log(data);
			if(data.count==1){
				var label=document.getElementById("fileName"); 
				label.innerText=data.displayName; 
				$("#fileName").html(data.displayName); 
				$("#uploadFile_div2").show();
    			$("#uploadFile_div1").hide();
    			$("#delButton1").show();
    			$("#delButton2").hide();
			}
        }
	});
}

function getContractInfo(){
	var url = serverPath + 'contractUpload/getContractById?id=113';
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
        	//console.log(data.data);
        	$("#contractNumber").val(data.data.contractNumber);
        	$("#undertakeName").val(data.data.undertakeName);
        	$("#undertakePhone").val(data.data.undertakePhone);
        	$("#undertakeMobile").val(data.data.undertakeMobile);
        	$("#contractName").val(data.data.contractName);
        	$("#executeDeptName").val(data.data.executeDeptName);
        	$("#unicomPartyName").val(data.data.unicomPartyName);
        	$("#oppoPartyName").val(data.data.oppoPartyName);
        }
	});
}

//返回上一页
function backPage(){
	window.history.go(-1);
}

/**
 * 初始化表格
 * */
App.initDataTables('#scanCpyloadTable', {
	ajax: {
        "type": "POST",
        "url": serverPath+'contractUpload/listFile',
        "data": function(d) {
            d.id = 113;
            return d;
        }
    },
    "columns": [
    	{"data": "","title": "序号"},
    	{"data": "displayName","title": "文件列表"},
    	{
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "添加", "fn": "addAttachment('" + data.attachId + "')","icon":"iconfont icon-add"});
                    btnArray.push({ "name": "查看", "fn": "addAttachment('" + data.attachId + "')","icon":"iconfont icon-add"});
                    btnArray.push({ "name": "删除", "fn": "addAttachment('" + data.attachId + "')","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		}
    ],
    "fnRowCallback" : function(nRow, aData, iDisplayIndex){
          $("td:first", nRow).html(iDisplayIndex +1);//设置序号位于第一列，并顺次加一
         return nRow;
    },
});

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
			console.log(array);
		}
	}
	App.getFileUploadModal(setting,queryCallback);
}

/**
 * 上传文件
 * */
(function (_, $) {
    $("#myfile").fileinput({
        language: 'zh', 
        uploadUrl: serverPath+'contractUpload/uploadFile', // 用于文件上传的服务器端请求地址
        uploadAsync: false,
        //allowedFileExtensions: ['pdf'],
        maxFileSize: 51200,
        // maxFileCount: 10,
        showPreview:false,
        slugCallback: function (filename) {
            return filename;
        },
        uploadExtraData: function(previewId, index) {	
			// 添加额外参数
			var obj = {
				displayName:'',
				busiId:110
			};
			return obj;
		}
    });
    // 异步上传成功结果处理
    $("#myfile").on("fileuploaded", function (event, data) {
    	alert(data.response.message);
    	var table = $('#scanCpyloadTable').DataTable();
    	table.ajax.reload();
    });
    // 同步上传成功结果处理
    $("#myfile").on("filebatchuploadsuccess", function (event, data) {
    	alert(data.response.message);
    	$("#myfile").fileinput('reset')
    	var table = $('#scanCpyloadTable').DataTable();
    	table.ajax.reload();
    });
})(window, jQuery);


/**
 * 点击选择按钮触发事件
 * */
var result={};//保存上传成功后返回的对象
function fileUpload(){
	var setting = {
		title : "文件上传",
		url:'contractUpload/uploadFile',	//上传地址，非空
		maxNumber:1,//最大上传数量
		//uploadAsync : false, //ajax提交是否异步提交，参数:false|true，默认为true,可为空
		//fileExtensions:["pdf"],//上传文件类型，参数:["pdf"]多个["pdf","doc"]，默认不控制，可为空
		extraData:{attachId:''}//上传时额外附加的参数,业务为正文扫描件上传时要求加displayname字段，可为空
	};
	function queryCallback(){//点击确定执行的函数，必传。
		var fileInfo = getFileItemInfo();//可以在此获取上传列表的内容，通过内置getFileItem获取；
		$("#commomModal").modal("hide");//模态框关闭
		if(fileInfo.length!=0){
			result = fileInfo[0].data;
			console.log(result);
			var label=document.getElementById("fileName"); 
			label.innerText=result.displayName; 
			$("#fileName").html(result.displayName); 
			$("#uploadFile_div1").hide();
    		$("#uploadFile_div2").show();
    		$("#delButton1").hide();
    		$("#delButton2").show();
		}
	}
	App.getFileUploadModal(setting,queryCallback);
}

/**
 * 删除合同正文扫描件
 * */
function delContractText(){
	var url = serverPath + 'contractUpload/delContractText?id=113';
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
       		if(data.status=='1'){
       			$("#uploadFile_div1").show();
    			$("#uploadFile_div2").hide();		
       		}else if(data.status=='0'){
       			alert(data.message);
       		}
        }
	});
}

function delContractText2(){
	$("#uploadFile_div1").show();
    $("#uploadFile_div2").hide();
    result={};
    console.log(result);
}



/**
 * 工作流相关
 * */
function beforePushProcess(pass){
	var result=true;
	//1，业务侧的校验，校验不通过则返回false
	
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
	var taskBusinessKey=1100006;
	if(taskBusinessKey.length==0){
		layer.msg("请填写业务主键！");
		return;
	}
	var flowParam=App.getFlowParam(serverPath,taskBusinessKey);
	modal_passBybuss(flowParam);
}

//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_passBybuss(flowParam){
	//typeof(tmp) == "undefined"
	var root=serverPath;//flowParam.root
	var taskDefinitionKey=flowParam.taskDefinitionKey
	var assignee=flowParam.assignee
	var processInstanceId=flowParam.processInstanceId
	var taskId=flowParam.taskId
	var comment=flowParam.comment
	var handleType=flowParam.handleType
	var withdraw=flowParam.withdraw
    
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
}