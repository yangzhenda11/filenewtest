//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
console.log(parm);
var id = parm.id;

//系统的全局变量获取
var config = top.globalConfig;
console.log(config);
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
	//getContractInfo();
})

//查询该合同下是否上传了扫描件
function checkFileIsUpload(){
	var url = serverPath + 'contractUpload/checkFileIsUpload?contractId=111';
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
			if(data.displayName!=null&&data.displayName!=""){
				$("#uploadFileName").val(data.displayName);
				$("#uploadFile_div2").show();
    			$("#uploadFile_div1").hide();
			}
        }
	});
}

function getContractInfo(){
	var url = serverPath + 'contractUpload/getContractById?contractId=1';
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
        	//console.log(data.data.contractNumber);
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

App.initDataTables('#scanCpyloadTable', {
	ajax: {
        "type": "POST",
        "url": serverPath+'contractUpload/listFile',
        "data": function(d) {
            d.contractId = 110;
            return d;
        }
    },
    "columns": [
    	{"data": "","title": "序号"},
    	{"data": "displayName","title": "文件列表"},
    	{"data": "storeId","title": "文件存储id"},
    	{
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "添加", "fn": "addAttachment('" + JSON.stringify(full) + "')","icon":"iconfont icon-add"});
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
    "columnDefs": [
     	{
            'render': function (data, type, full, meta) {
            	//只是显示附件名称10个字
            	var html = "<a href='/contractUpload/downloadFile?displayName="+full.displayName+"'><span title='"+full.displayName+"'>"+full.displayName.substr(0, 10);
            	if(full.displayName.length>10){
               		html+="&#8230;</span></a>";
               	}else{
               		html+="</span></a>";
               	}
            	return html;
            }
     	}
     ]
});


function addAttachment(row){
	 $('#uploadModal').modal('show');
}

//上传文件
function uploadFile(){
	var myfile = $("#myfile").val();
	if (myfile == "") {
		alert("请选择要上传的文件");
		return;
	}
	//获取该上传文件的dom对象
	var dom = $('#myfile');
	
	//获取上传文件的文件名
	var fullFileName = dom.val();
	var tempFileName = fullFileName.substr(fullFileName.lastIndexOf("\\")+1,fullFileName.length);
	var names = tempFileName.split(".");
	var reg = names[names.length-1];
	var b = false;
	if("jpg".toLowerCase() == reg.toLowerCase()){
		b = true;
	}
	if(!b){
		alert("该文档类型只能上传jpg类型的文件");
		return false;
	}
	var sizeIsOk = true;
	try{
    	//判断文件大小是否超出限制
		var fSize = $('#myfile')[0].files[0].size;

		var MB = (50 * 1024 * 1024).toString();
		sizeIsOk = fSize < MB;
	}catch(e){}
	
	if (!sizeIsOk) {
		alert("上传文件大小超出限制,请上传小于50M的文件");
		return false;
	}else if(fSize==0){
		alert("不能上传空文件");
		return false;
	}
	
	$.ajaxFileUpload({
		'url' : serverPath+'contractUpload/uploadFile?busiId=110',
		'fileElementId' : "myfile",
		'contentType' : "text/html",
        'processData' : true,
		'beforeSend': function(){},
	    'complete': function(){},
		'data' : function(data) {
			console.log(data);
			var table = $('#scanCpyloadTable').DataTable();
    		table.ajax.reload();
			$("#myfile").val("");
		}
	});
}


function uploadAttachment(){
	var myAttachment = $("#myAttachment").val();
	if (myAttachment == "") {
		alert("请选择要上传的文件");
		return;
	}
	//获取该上传文件的dom对象
	var dom = $('#myAttachment');
	
	//获取上传文件的文件名
	var fullFileName = dom.val();
	var tempFileName = fullFileName.substr(fullFileName.lastIndexOf("\\")+1,fullFileName.length);
	var names = tempFileName.split(".");
	var reg = names[names.length-1];
	var b = false;
	if("jpg".toLowerCase() == reg.toLowerCase()){
		b = true;
	}
	if(!b){
		alert("该文档类型只能上传jpg类型的文件");
		return false;
	}
	var sizeIsOk = true;
	try{
    	//判断文件大小是否超出限制
		var fSize = $('#myfile')[0].files[0].size;

		var MB = (50 * 1024 * 1024).toString();
		sizeIsOk = fSize < MB;
	}catch(e){}
	
	if (!sizeIsOk) {
		alert("上传文件大小超出限制,请上传小于50M的文件");
		return false;
	}else if(fSize==0){
		alert("不能上传空文件");
		return false;
	}
	
	$.ajaxFileUpload({
		'url' : serverPath+'contractUpload/uploadAttachment?storeId=110',
		'fileElementId' : "myAttachment",
		'contentType' : "text/html",
        'processData' : true,
		'beforeSend': function(){},
	    'complete': function(){},
		'success' : function(data) {
			console.log(data);
			$("#myfile").val("");
		}
	});
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
}
