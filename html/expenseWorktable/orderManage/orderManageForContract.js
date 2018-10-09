//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
var parm = App.getPresentParm();
$(function(){
	if(!parm.contractNumber){
		layer.alert("页面参数错误，请联系系统管理员。",{icon:2});
		return;
	};
	getTableToreadHisList();
})
if(parm.returnbtn == "true"){
	$("#returnBtn").show();
}else{
	$("#returnBtn").remove();
};
$("#returnBtn").on("click",function(){
	window.history.go(-1);
})
/*
 * 初始化表格
 */
function getTableToreadHisList(){
	App.initDataTables('#orderManagerListTable', "#searchBtn", {
		ajax: {
	        "type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'orderManageForContract/getOrderManageForContractInfo',
	        "data": function(d) {
	        	d.contractIdOrPoNumber = $("#contractIdOrPoNumber").val().trim();
	        	d.returnbtn = parm.returnbtn;
	        	d.contractNumber = parm.contractNumber;
	           	return JSON.stringify(d);
	        }
	    },
	    "columns": [
	    	{"data" : null,"title":"序号","className": "text-center",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#orderManagerListTable").pageStart;
					return start + meta.row + 1;
			   	}
			},
	        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal"},
	        {"data": "poNumber","title": "订单编号","className":"whiteSpaceNormal"},
	        {"data": "orgName","title": "订单所属组织","className":"whiteSpaceNormal"},
	        {"data": "poAmount","title": "订单不含税金额","className":"whiteSpaceNormal",
	        	"render" : function(data, type, full, meta){
					return App.unctionToThousands(data);
			   	}
	        },
	        {"data": "receiveAmountHead","title": "累计接收金额","className":"whiteSpaceNormal",
	        	"render" : function(data, type, full, meta){
					return App.unctionToThousands(data);
			   	}
	        },
	        {"data": "orderPercentage","title": "接收百分比","className":"whiteSpaceNormal"}
	    ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 && col < 6) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
	});
}
/*
 * 搜索点击事件
 */
function searchCustomer(retainPaging) {
	var table = $('#orderManagerListTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
