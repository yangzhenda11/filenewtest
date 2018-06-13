//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
if(parm.pageType==1){
	var scandocId = parm.businessKey;
}else if(parm.pageType==2){
	var scandocId = parm.id;
};
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
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
	//获取合同基本信息
	getContractInfo();
	//获取合同正文和附件列表
	getReplenishContractInfo();
})
/*
 * 获取合同基本信息
 */
function getContractInfo(){
	var url = serverPath + "contractUpload/getContractById?id=" + scandocId;
	App.formAjaxJson(url, "post", null, successCallback);
	function successCallback(result) {
		var data = result.data;
		$("#contractNumber").val(data.contractNumber);
    	$("#undertakeName").val(data.undertakeName);
    	$("#undertakePhone").val(data.undertakePhone);
    	$("#undertakeMobile").val(data.undertakeMobile);
    	$("#contractName").val(data.contractName);
    	$("#executeDeptName").val(data.executeDeptName);
    	$("#unicomPartyName").text(data.unicomPartyName);
    	$("#oppoPartyName").text(data.oppoPartyName);
    	$("#contractType").text(data.contractType);
	}
} 
/*
 * 获取合同正文和附件列表
 */
function getReplenishContractInfo(){
	var url = serverPath + "contractUpload/getReplenishContractInfo";
	var postData = {id:scandocId};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			//设置正文扫描件html
			setBodyDocData(data.bodyDoc);
			//设置附件扫描件html
			setAttachDocData(data.attachDoc);
		}else{
			layer.msg("暂无数据");
			$("#contractTextUploadBtn").attr("disabled","disabled");
		}
	}
}
/*
 * 设置正文扫描件html
 */
function setBodyDocData(bodyDocData){
	if(bodyDocData){
		var bodyDocHtml = "";
		if(bodyDocData.storeId){
			$("#contractText").removeClass("col-sm-4").addClass("contractDocSty");
			$("#contractTextUploadBtn").text("删除");
			$("#contractText").data("storeid",bodyDocData.storeId);
			bodyDocHtml =  '<a href="'+serverPath+'fileload/downloadS3?key='+bodyDocData.storeId+'">'+bodyDocData.displayName+'</a>';
		}else{
			$("#contractTextUploadBtn").text("添加");
			bodyDocHtml = '<input type="text" disabled="disabled" class="form-control" />';
			$("#contractText").data("storeid","");
		};
		$("#contractText").html(bodyDocHtml);
		$("#contractText").data("attachid",bodyDocData.attachId);
		$("#contractText").data("displayname",bodyDocData.displayName);
	}else{
		layer.msg("获取不到合同正文扫描件信息");
		$("#contractTextUploadBtn").attr("disabled","disabled");
	}
}
/*
 * 正文扫描件的上传和回调及已经上传后的删除
 */
$("#contractTextUploadBtn").on("click",function(){
	var bodyDocStoreId = $("#contractText").data("storeid");
	if(bodyDocStoreId){
		layer.confirm("是否要删除已上传的正文扫描件",{icon:7,title:"提示"},function(index){
			layer.close(index);
			var bodyDocHtml = '<input type="text" disabled="disabled" class="form-control" />';
			$("#contractText").data("storeid","");
			$("#contractText").removeClass("contractDocSty").addClass("col-sm-4");
			$("#contractText").html(bodyDocHtml);
			$("#contractTextUploadBtn").text("添加");
		});
	}else{
		var attachId = $("#contractText").data("attachid");
		var displayName = $("#contractText").data("displayname");
		var setting = {
			title : "正文上传",
			url: 'fileload/uploadFileS3',
			maxNumber:1,
			fileExtensions:["pdf"],
			explain:'<i class="iconfont icon-mi required"></i>正文大小不能超过？M。（具体大小待确定）。</br>',
			extraData:{displayName:displayName}
		};
		function queryCallback(){
			var fileInfo = getFileItemInfo()[0].data;
			$("#commomModal").modal("hide");
			var bodyDocHtml =  '<a href="'+serverPath+'fileload/downloadS3?key='+fileInfo.storeId+'">'+displayName+'</a>';
			$("#contractText").removeClass("col-sm-4").addClass("contractDocSty");
			$("#contractText").html(bodyDocHtml);
			$("#contractTextUploadBtn").text("删除");
			$("#contractText").data("storeid",fileInfo);
		}
		App.getFileUploadModal(setting,queryCallback);
	}
})
/*
 * 设置附件扫描件html
 */
function setAttachDocData(bodyDocData){
	if(bodyDocData.length > 0){
		var bodyDocHtml = "";
		for(var i = 0; i < bodyDocData.length; i++){
			var bodyDocItem = bodyDocData[i];
			var btnHtml = "";
			if(bodyDocItem.storeId){
				btnHtml = '<a href="'+serverPath+'fileload/downloadS3?key='+bodyDocItem.storeId+'">查看</a><a class="attachDelectBtn marginLeft25">删除</a>';
				bodyDocHtml += '<tr data-attachid="'+bodyDocItem.attachId+'" data-storeid="'+bodyDocItem.storeId+'">';
			}else{
				btnHtml = '<button type="button" class="btn primary btn-outline btn-xs attachUploadBtn">添加</button>';
				bodyDocHtml += '<tr data-attachid="'+bodyDocItem.attachId+'" data-storeid="">';
			};
			bodyDocHtml += '<td>'+(i+1)+'</td>'+
						'<td>'+bodyDocItem.displayName+'</td>'+
						'<td>'+btnHtml+'</td>'+
						'</tr>';
		}
	};
	$("#contractAttachmentTbody").html(bodyDocHtml);
}
/*
 * 附件扫描件事件委托
 */
//删除
$("#contractAttachmentTbody").on("click",".attachDelectBtn",function(){
	var dom = $(this);
	layer.confirm("是否要删除已上传的附件扫描件",{icon:7,title:"提示"},function(index){
		layer.close(index);
		var btnHtml = '<button type="button" class="btn primary btn-outline btn-xs attachUploadBtn">添加</button>';
		dom.parents("tr").data("storeid","");
		dom.parent("td").html(btnHtml);
	});
})
//添加
$("#contractAttachmentTbody").on("click",".attachUploadBtn",function(){
	var dom = $(this);
	var attachId = $(this).parents("tr").data("attachid");
	var setting = {
		title : "附件上传",
		url: 'fileload/uploadFileS3',
		maxNumber:1
		//extraData:{attachId:attachId}
	};
	function queryCallback(){
		var fileInfo = getFileItemInfo()[0].data;
		$("#commomModal").modal("hide");
<<<<<<< HEAD
		var btnHtml = '<a href="'+serverPath+'contractUpload/downloadS3?key1='+fileInfo+'">查看</a><a class="attachDelectBtn marginLeft25">删除</a>';
		dom.parents("tr").data("storeid",fileInfo);
=======
		var btnHtml = '<a href="'+serverPath+'fileload/downloadS3?key='+fileInfo.storeId+'">查看</a><a class="attachDelectBtn marginLeft25">删除</a>';
		dom.parents("tr").data("storeid",fileInfo.storeId);
>>>>>>> fec4a384b630665f0873ba785f6beb6023442b4a
		dom.parent("td").html(btnHtml);
	}
	App.getFileUploadModal(setting,queryCallback);
})

/*
 * 获取正文扫描件及附件信息
 * uploadStatus:1保存
 * uploadStatus:3提交
 */
function getContractUploadInfo(uploadStatus){
	var contractAttachmentList = [];
	var obj = {};
	$.each($("#contractAttachmentTbody tr"), function(k,v) {
		if(!$(v).hasClass("emptyTr")){
			var contractAttachmentItem = {
				attachId : $(v).data("attachid"),
				storeId : $(v).data("storeid"),
			};
			contractAttachmentList.push(contractAttachmentItem);
		};
	});
	var bodyDocStoreId = $("#contractText").data("storeid");
	if(bodyDocStoreId){
		obj.bodyDoc = {
			attachId : $("#contractText").data("attachid"),
			storeId : bodyDocStoreId
		};
	}else if(bodyDocStoreId == undefined){
		layer.msg("合同正文扫描件信息为空");
		return false;
	}else{
		obj.bodyDoc = {
			attachId : "",
			storeId : ""
		};
	}
	obj.attachDoc = contractAttachmentList;
	obj.uploadStatus = uploadStatus;
	obj.scandocId = scandocId;
	return obj;
}
/*
 * 保存方法
 */
function saveContractUpload(){
	var data = getContractUploadInfo(1);
	if(data){
		var url = serverPath + "contractUpload/saveReplenishContractInfo";
		App.formAjaxJson(url, "post", JSON.stringify(data), successCallback);
		function successCallback(result) {
			layer.msg("保存成功");
		}
	}
}
/*
 * 提交方法
 */
function pushContractUpload(){
	var data = getContractUploadInfo(3);
	if(data){
		if(data.bodyDoc.storeId){
			var url = serverPath + "contractUpload/saveReplenishContractInfo";
			App.formAjaxJson(url, "post", JSON.stringify(data), successCallback);
			function successCallback(result) {
				layer.msg("提交成功");
				var backPageTimer = setTimeout('backPage()',1000);
			}
		}else{
			layer.msg("请上传合同正文扫描件后进行提交");
		}
	}
}
//返回上一页
function backPage(){
	window.history.go(-1);
}