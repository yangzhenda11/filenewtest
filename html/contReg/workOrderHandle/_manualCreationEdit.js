//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;


//点击iconfont弹出模态框事件
$(function(){
	$("#searchContractData").off("click").on("click",function() {
		App.getCommonModal("contractDataSearch","#contractDataSearch","contractNumber",["contractId","contractName","unicomPartyName","partyName","undertakeName","executeDeptName","approveDate"]);
	})
})

$('#commomModal').on('hide.bs.modal',function(){
	if($("#contractDataSearch").data("exactSearch")){
		$("#contractId").val($("#contractDataSearch").data("contractId"));
        $("#contractName").val($("#contractDataSearch").data("contractName"));
        if($("#contractDataSearch").data("unicomPartyName")!=null){
        	var unicomStr = $("#contractDataSearch").data("unicomPartyName").toString();
        	$("#unicomPartyName").text(unicomStr.replace(",","\n"));
        }
        if($("#contractDataSearch").data("partyName")!=null){
        	var oppoStr = $("#contractDataSearch").data("partyName").toString();
			$("#oppoPartyName").text(oppoStr.replace(",","\n"));
        }
		$("#undertakeName").val($("#contractDataSearch").data("undertakeName"));
		$("#executeDeptName").val($("#contractDataSearch").data("executeDeptName"));
		$("#approveDate").val(App.formatDateTime($("#contractDataSearch").data("approveDate"),"yyyy-MM-dd"));
   }
});

/**
 * 创建工单
 * */
function createWorkOrder(){
	var contractNumber = $("#contractDataSearch").val();
	var contractId = $("#contractId").val();
	if(contractNumber==''){
		layer.alert("合同编号不能为空！",{icon:2,title:"错误"});
		return;
	}else{
		$.ajax({
		url:serverPath + 'workOrderHandle/createWorkOrder',
        type:"post",
        data:{"contractNumber":contractNumber,"contractId":contractId},
        success:function(data) {
       				if(data.status=='1'){
       					var htmlStr = "工单"+data.message+"创建成功！<a href=''>点击查看</a>";
       					document.getElementById('createResult').innerHTML=htmlStr;
       					//alert("工单"+data.message+"创建成功！");
       				}else if(data.status=='0'){
       					layer.msg(data.message);
       				}
        		}
		});
	}
	
}
