//系统的全局变量获取
var parm = App.getPresentParm();
var config = top.globalConfig;
var serverPath = config.serverPath;
var isLoad = false;					//全局加载成功标识位
var contractId = parm.businessKey;			//主键ID
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
			var unicomPartyName = data.unicomPartyName == null ? "" : data.unicomPartyName;
			var partyName = data.partyName == null ? "" : data.partyName;
			$("#unicomPartyName").text(unicomPartyName);
			$("#partyName").text(partyName);
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
		$.ajax({
			url:serverPath + 'workOrderHandle/createWorkOrder',
	        type:"post",
	        data:{"contractNumber":$("#contractNumber").val(),"contractId":$("#contractId").val()},
	        success:function(data) {
   				if(data.status=='1'){
   					var msg = data.message;
   					var msgStr = msg.split(",");
   					var htmlStr = "工单"+msgStr[0]+"创建成功！";
   					parent.layer.alert(htmlStr,{icon:1},function(){
   						parent.modal_close();
   					});
   				}else if(data.status=='0'){
   					parent.layer.alert(data.message,{icon:2,title:"错误"});
   				}
    		},
    		error: function(result) {
				App.ajaxErrorCallback(result);
			}
		});
	}else{
		parent.layer.alert("页面信息有误",{icon:2,title:"错误"});
	}
}
