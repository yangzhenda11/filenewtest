//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//区域展开时判断是否重新加载的标志位
var reloadCustomerListTable = false;
var reloadEmphasisCustomerTable = false;
//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	if(id == "customerList"){
		var isInitCustomerListTable = $.fn.dataTable.isDataTable("#customerListTable");
		if(isInitCustomerListTable && reloadCustomerListTable){
			reloadPageDataTable("#customerListTable",true);
		}
	}else if(id == "emphasisCustomer"){
		var isInitEmphasisCustomerTable = $.fn.dataTable.isDataTable("#emphasisCustomerTable");
		if(isInitEmphasisCustomerTable && reloadEmphasisCustomerTable){
			reloadPageDataTable("#emphasisCustomerTable",true);
		}else if(isInitEmphasisCustomerTable == false){
			initEmphasisCustomerTable();
		}
	}
}

/*
 * 我管理的客户经理点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchRiskWarning(){
	var isInitRiskWarningListTable = $.fn.dataTable.isDataTable("#riskWarningListTable");
	if(isInitRiskWarningListTable){
		reloadPageDataTable("#riskWarningListTable");
	}else{
		initRiskWarningListTable();
	}
}
/*
 * 我管理的客户经理表格初始化
 */
function initRiskWarningListTable(){
	App.initDataTables('#riskWarningListTable', "#riskWarningLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'riskWarning/listRiskWarning',
	        "data": function(d) {
	        	d.contractName = $("#riskWarningfoSearch").val().trim();
	        	d.contractNumber = $("#riskWarningfoSearch").val().trim();
	        	d.partnerName = $("#riskWarningfoSearch").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#riskWarningListTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal"},
			{"data": "contractNumber","className": "whiteSpaceNormal"},
			{"data": "partnerName","className": "whiteSpaceNormal"},
			{"data": "partnerCode","className": "whiteSpaceNormal"},
			{"data": "signDate","className": "whiteSpaceNormal"},
			{"data": "expiryDate","className": "whiteSpaceNormal"},
			{"data": "performerOrgName","className": "whiteSpaceNormal"},
			{"data": "performerStaffName","className": "whiteSpaceNormal"},
			{"data": "contractValue","className": "whiteSpaceNormal"},
			{"data": "AccumulativeAmount","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					var editFlag = "add";
					if(full.isValid == 1){
						editFlag = "delete";
					};
					return "<img onclick='emphasisOfCustomer(\""+data.managerStaffOrgId+"\",\""+editFlag+"\")' src='/static/img/"+editFlag+".png' />";
				}
			}
		]
	});
}

/*
 * 我重点关注的客户经理表格初始化
 */
/*function initEmphasisCustomerTable(){
	App.initDataTables('#emphasisCustomerTable', "#emphasisCustomerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'customerManager/listFocusCustomerManager',
	        "data": function(d) {
	        	d.managerStaffName = $("#emphasisCustomerInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#emphasisCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "managerStaffName","className": "whiteSpaceNormal"},
			{"data": "orgName","className": "whiteSpaceNormal"},
			{"data": "phone","className": "whiteSpaceNormal"},
			{"data": "email","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.managerStaffOrgId+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					return "<img onclick='deleteEmphasisOfEmp(\""+data.managerStaffOrgId+"\")' src='/static/img/delete.png' />";
				}
			}
		]
	});
}*/
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
