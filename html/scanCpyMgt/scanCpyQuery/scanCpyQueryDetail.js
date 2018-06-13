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
	
	//获取合同正文扫描件
    App.formAjaxJson(serverPath+'contractScanQuery/listContractText?id='+id, "POST", null, listContractTextSuccess);

    function listContractTextSuccess(result) {
		var data = result.data;
		if(data.length > 0){
			var html = "";
			for(var i = 0; i < data.length; i++){
				html += "<tr>"+"<td>"+ (i+1) +"</td>";
				if(data[i].storeIdDisplay && data[i].storeIdDisplay != "0"){
					html += "<td><a href='"+serverPath+"fileload/downloadS3?key="+data[i].storeIdDisplay+"'>"+ data[i].displayName+"</td>";
				}else{
					html += "<td>"+ data[i].displayName+"</td>";
				};
				html += "<td>"+ App.formatDateTime(data[i].ctreatedDate,"yyyy-MM-dd") +"</td>"+
						"<td>"+ data[i].createdByName +"</td></tr>";
			}
			$("#contractTextTbody").html(html);
		}
	}
	
	//获取合同附件扫描件
    App.formAjaxJson(serverPath+'contractScanQuery/listContractAttachment?id='+id, "POST", null, listContractAttachmentSuccess);

    function listContractAttachmentSuccess(result) {
		var data = result.data;
		if(data.length > 0){
			var html = "";
			for(var i = 0; i < data.length; i++){
				html += "<tr>"+"<td>"+ (i+1) +"</td>";
				if(data[i].storeIdDisplay && data[i].storeIdDisplay != "0"){
					html += "<td><a href='"+serverPath+"fileload/downloadS3?key="+data[i].storeIdDisplay+"'>"+ data[i].displayName+"</td>";
				}else{
					html += "<td>"+ data[i].displayName+"</td>";
				};
				html += "<td>"+ App.formatDateTime(data[i].ctreatedDate,"yyyy-MM-dd") +"</td>"+
						"<td>"+ data[i].createdByName +"</td></tr>";
			}
			$("#contractAttachmentTbody").html(html);
		}
	};
})
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
