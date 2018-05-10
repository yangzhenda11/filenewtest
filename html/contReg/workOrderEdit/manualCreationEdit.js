//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#contractCheckListTable', "#submitBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'workOrderHandle/contractCheckList',
        "data": function(d) {//自定义传入参数
        	d.contractNumber = $("#contractNumber").val();
        	d.contractName = $("#contractName").val();
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	{
    		"data" : "contractId",
         	"title":"选择",
			"render":function(data, type, full, meta){
						var result = '<input type="radio" name="radio" onclick="selectcontract(\'' +data.contractId+ '\');">';
				   		return result;
					}
		},
		{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"25%"},
        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"25%"},
        {"data": "oppoPartyName","title": "对方主体名称","className":"whiteSpaceNormal","width":"50%"}
    ]
});


/*
 * 搜索点击事件
 */
function searchContractCheckList(retainPaging) {
	var table = $('#contractCheckListTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

//点击iconfont弹出模态框事件
$(function(){
	$("#searchContractData").click(function() {
		App.getCommonModal("contractDataSearch","#contractDataSearch","contractNumber",["contractId","contractName","unicomPartyName","partyName","undertakeName","executeDeptName","approveDate"]);
	})
})

$('#commomModal').on('hide.bs.modal',function(){
	//console.log($("#contractDataSearch").data("unicomPartyName"));
	if($("#contractDataSearch").data("exactSearch")){
        $("#contractName").val($("#contractDataSearch").data("contractName"));
        $("#unicomPartyName").text($("#contractDataSearch").data("unicomPartyName"));
		$("#oppoPartyName").text($("#contractDataSearch").data("partyName"));
		$("#undertakeName").val($("#contractDataSearch").data("undertakeName"));
		$("#executeDeptName").val($("#contractDataSearch").data("executeDeptName"));
		$("#approveDate").val(formatDateTime($("#contractDataSearch").data("approveDate")));
   }
});

//调整时间显示，不显示时分秒
function formatDateTime(inputTime,type) {
	if(inputTime){
		var date = new Date(inputTime);
	}else{
		return "";
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
}

/**
 * 创建工单
 * */
function createWorkOrder(){
	var contractNumber = $("#contractDataSearch").val();
	if(contractNumber==''){
		alert("合同编号不能为空！");
		return;
	}else{
		$.ajax({
		url:serverPath + 'workOrderHandle/createWorkOrder',
        type:"post",
        data:{"contractNumber":contractNumber},
        success:function(data) {
       				if(data.status=='1'){
       					alert("工单"+data.message+"创建成功！");
       				}else if(data.status=='0'){
       					alert(data.message);
       				}
        		}
		});
	}
	
}
