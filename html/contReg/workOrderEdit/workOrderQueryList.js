//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;




/*
 * 搜索点击事件
 */
function searchWorkOrder(retainPaging) {
	var table = $('#workOrderQueryTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

//点击iconfont弹出模态框事件
$(function(){
	//合同类型
	$("#searchContractType").click(function(){
		alert("***")
		App.getCommonModal("contractType","#contractType","typeFullname","typeId");
	})
	//承办人
	$("#searchAgentStaff").click(function(){
		App.getCommonModal("agentStaff","#agentStaff","name","id");
	})
	//承办部门
	$("#searchAgentDepartment").click(function(){
		App.getCommonModal("agentDepartment","#agentDepartment","orgName","orgId");
	})
	//我方主体
	$("#searchOurSubject").click(function(){
		App.getCommonModal("ourSubject","#ourSubject","partnerName","partnerId");
	})
	//对方主体
	$("#searchOtherSubject").click(function(){
		App.getCommonModal("otherSubject","#otherSubject","partnerName","partnerId");
	})
	
	$("#contractType").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#agentStaff").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#agentDepartment").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#ourSubject").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#otherSubject").on("input",function(){
		$(this).data("exactSearch",false);
	})
})