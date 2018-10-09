//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId = config.curStaffOrgId;
$(function(){
	getTableToreadHisList();
})
/*
 * 初始化订单信息表格
 */
function getTableToreadHisList(){
	App.initDataTables('#orderManagerListTable', "#searchBtn", {
		ajax: {
	        "type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'orderManage/getOrderManageInfo',
	        "data": function(d) {
	        	d.contractIdOrPoNumber = $("#contractIdOrPoNumber").val().trim();
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