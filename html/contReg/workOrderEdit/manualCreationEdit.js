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
		App.getCommonModal("contractDataSearch","#contractDataSearch","contractNumber",["contractId","contractName","partyName"]);
	})
})

$('#commomModal').on('hide.bs.modal',function(){
	//console.log($("#contractDataSearch").data("partyName"));
	if($("#contractDataSearch").data("exactSearch")){
        $("#contractName").val($("#contractDataSearch").data("contractName"));
		$("#oppoPartyName").text($("#contractDataSearch").data("partyName"));
   }
});
