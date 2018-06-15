//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
var id = parm.id;
App.fixToolBars("toolbarBtnContent", 70);	//固定操作按钮在70px的高度
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

$(function() {
	//获取合同信息
	getContractInfo();
	//获取合同正文和附件列表
	getReplenishContractInfo();
})
/*
 * 获取合同正文和附件列表
 */
function getReplenishContractInfo(){
	var url = serverPath + "contractUpload/getReplenishContractInfo";
	var postData = {id:id};
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
		}
	}
}
/*
 * 设置正文扫描件html
 */
function setBodyDocData(bodyDocData){
	if(bodyDocData){
		var html = "<tr><td>1</td>";
		if(bodyDocData.bodyDocStoreId){
			html += "<td><a href='"+serverPath+"fileload/downloadS3?key="+bodyDocData.bodyDocStoreId+"'>"+ bodyDocData.displayName+"</td>";
		}else{
			html += "<td>"+ bodyDocData.displayName+"</td>";
		};
		html += "<td>"+ App.formatDateTime(bodyDocData.updatedDate,"yyyy-MM-dd") +"</td>"+
				"<td>"+ (bodyDocData.updatedByName == null ? "":bodyDocData.updatedByName) +"</td></tr>";
		
		$("#contractTextTbody").html(html);
	}else{
		layer.msg("获取不到合同正文扫描件信息");
		$("#contractTextUploadBtn").attr("disabled","disabled");
	}
}
/*
 * 设置附件扫描件html
 */
function setAttachDocData(data){
	if(data.length > 0){
		var html = "";
		for(var i = 0; i < data.length; i++){
			html += "<tr>"+"<td>"+ (i+1) +"</td>";
			if(data[i].bodyDocStoreId){
				html += "<td><a href='"+serverPath+"fileload/downloadS3?key="+data[i].bodyDocStoreId+"'>"+ data[i].displayName+"</td>";
			}else{
				html += "<td>"+ data[i].displayName+"</td>";
			};
			html += "<td>"+ App.formatDateTime(data[i].updatedDate,"yyyy-MM-dd") +"</td>"+
					"<td>"+ (data[i].updatedByName == null ? "":data[i].updatedByName) +"</td></tr>";
		}
		$("#contractAttachmentTbody").html(html);
	}
}
/*
 * 获取合同信息
 */
function getContractInfo(){
	App.formAjaxJson(serverPath + "contractUpload/getContractById?id="+id, "post", null, successCallback);
	function successCallback(result){
		var data = result.data;
		if(data){
			$("#contractNumber").val(data.contractNumber);
        	$("#undertakeName").val(data.undertakeName);
        	$("#undertakePhone").val(data.undertakePhone);
        	$("#undertakeMobile").val(data.undertakeMobile);
        	$("#contractName").val(data.contractName);
        	$("#executeDeptName").val(data.executeDeptName);
        	$("#unicomPartyName").text(data.unicomPartyName);
        	$("#oppoPartyName").text(data.oppoPartyName);
			$("#contractType").text(data.contractType);
		}else{
			layer.msg("合同基本信息为空，请联系管理员");
		}
	}
}
//返回上一页
function backPage(){
	window.history.go(-1);
}
