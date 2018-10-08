//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var parm = App.getPresentParm();

//我的客户查询表格初始化
initPerformContractTable();
/*
 * 履行中合同信息查询点击查询事件
 */
function searchPerformContract(){
	reloadPageDataTable("#performContractTable");
}
/*
 * 我的客户查询表格初始化
 */
function initPerformContractTable(){
//	alert(JSON.stringify(parm));
//	alert(parm.customerCode);
//	alert(parm.managerStaffOrgId);
	var url = serverPath + 'performanceContract/listContractByManagerStaffOrgId';
	if(parm.customerCode != null && parm.customerCode != ""){
		url = serverPath + 'performanceContract/listContractByCustomerCode';
	}

	App.initDataTables('#performContractTable', "#performContractLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": url,
			"data": function(d) {
				if(parm.customerCode != null && parm.customerCode != ""){
					d.customerCode = parm.customerCode;
				}else{
					d.managerStaffOrgId = parm.managerStaffOrgId;
				};
	        	d.contractInfoSearch = $("#contractInfoInput").val().trim();
				return JSON.stringify(d);;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#performContractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal"},
			{"data": "contractNumber","className": "whiteSpaceNormal"},
			{"data": "customerName","className": "whiteSpaceNormal"},
			{"data": "customerCode","className": "whiteSpaceNormal"},
			{"data": "partnerCode","className": "whiteSpaceNormal"},
			{"data": "contractValue","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": null,"className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.contractId+"\")'>查看</a>";
				}
			}
		]
	});
}
/*
 * 跳转线路信息
 */
function jumpLineManage(data){
	var url = "/html/incomeWorktable/lineManage/lineView.html?id=123&relationType=1&returnbtn=true";
	window.location.href = url;
}
/*
 * 页面内表格初始化完成之后查询事件
 */
function reloadPageDataTable(tableId,retainPaging) {
	var table = $(tableId).DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

