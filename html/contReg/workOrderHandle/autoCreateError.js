//系统的全局变量获取
var parm = App.getPresentParm();
var config = top.globalConfig;
var serverPath = config.serverPath;
var isLoad = false;					//全局加载成功标识位
var contractId = parm.businessKey;			//主键ID
if(parm.taskFlag == "db"){
	//隐藏保存和通过按钮
	parent.showOrhideButton("saveButton",false);
	parent.showOrhideButton("passButton",false);
	//增加创建按钮
	parent.addCustomBt("cjgdButton","创建","createWorkOrder");
	$("#lableInfoText").text('工单自动创建失败，请手动点击尝试创建。');
	$("#fieldsetTitle").text('创建生效合同结构化数据工单');
}else{
	$("#lableInfoText").text('工单手动创建成功。');
	$("#fieldsetTitle").text('已创建成功的生效合同结构化数据工单');
}
$(function() {
	$(".page-content,.portlet-body").css("padding", '0px');
	$(".portlet").css("cssText", "border:none !important;padding:0px");
	$(".page-content").removeClass("hidden");
	//获取合同信息
	getContractBaseInfo();
})

/*
 * 获取合同信息
 */
function getContractBaseInfo(){
	App.formAjaxJson(serverPath + "contractBaseInfo/getContractById?id="+contractId, "post", null, successCallback);
	function successCallback(result){
		var data = result.data;
		if(data){
			isLoad = true;
			var valueCallback = {'approveDate':function(value){return App.formatDateTime(value,"yyyy-mm-dd")}}
			App.setFormValues("#contractBaseInfo",data,valueCallback);
			var unicomPartyName = "";
			var partyName = "";
			if(data.unicomPartyName){
				unicomPartyName = data.unicomPartyName.replace(",","\n");
			};
			if(data.partyName){
				partyName = data.partyName.replace(",","\n");
			};
			$("#unicomPartyName").html(unicomPartyName);
			$("#partyName").html(partyName);
		}else{
			parent.layer.msg("合同基本信息为空，请联系管理员");
		}
	}
}
/*
 * 创建工单
 */
function createWorkOrder(){
	if(isLoad){
		var postData = {
			contractNumber: $("#contractNumber").val(),
			contractId: $("#contractId").val()
		}
		App.formAjaxJson(serverPath + 'workOrderHandle/createWorkOrder',"post",postData,successCallback,null,null,null,null,"formData");
		function successCallback(result){
			var msg = result.message;
			var msgStr = msg.split(",");
			var htmlStr = "工单"+msgStr[0]+"创建成功！";
			parent.layer.alert(htmlStr,{icon:1},function(){
				parent.modal_close();
			});
		}
	}else{
		parent.layer.alert("页面信息有误",{icon:2,title:"错误"});
	}
}
