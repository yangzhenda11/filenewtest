//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId = config.curStaffOrgId;
$(function(){
	getTableToreadHisList();
})
var parm = App.getPresentParm();
console.log(parm);
if(parm.returnbtn == "true"){//下钻页面
	$("#returnBtn").show();
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
	        "url": serverPath+'orderManage/searchOrderManage',
	        "data": function(d) {//自定义传入参数
	        	d.contractIdOrPoNumber = $("#contractIdOrPoNumber").val().trim();
	        	d.returnbtn=parm.returnbtn;
	        	d.contractId=parm.contractId;
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
	        {"data": "contractId","title": "合同编号","className":"whiteSpaceNormal"},
	        {"data": "poNumber","title": "订单编号","className":"whiteSpaceNormal"},
	        {"data": "orgName","title": "订单所属组织","className":"whiteSpaceNormal"},
	        {"data": "poAmount","title": "订单不含税金额","className":"whiteSpaceNormal"},
	        {"data": "receiveAmountHead","title": "累计接收金额","className":"whiteSpaceNormal"},
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


