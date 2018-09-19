//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

//区域收缩时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	if(id == "emphasisCustomer"){
		var isInitEmphasisCustomerTable = $.fn.dataTable.isDataTable("#emphasisCustomerTable");
		if(!isInitEmphasisCustomerTable){
			initEmphasisCustomerTable();
		}
	}
}

/*
 * 已关联合同客户点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchCustomer(){
	var isInitCustomerListTable = $.fn.dataTable.isDataTable("#customerListTable");
	if(isInitCustomerListTable){
		reloadPageDataTable("#customerListTable");
	}else{
		initCustomerListTable();
	}
}
/*
 * 已关联合同客户表格初始化
 */
function initCustomerListTable(){
	App.initDataTables('#customerListTable', "#customerLoading", {
		ajax: {
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
				d.managerStaffName = $("#customerInput").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return relationCustomerData;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#customerListTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "name","className": "whiteSpaceNormal"},
			{"data": "number","className": "whiteSpaceNormal"},
			{"data": "number1","className": "whiteSpaceNormal"},
			{"data": "user","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.user+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					return "<img onclick='jumpContractManage(\""+data.user+"\")' src='/static/img/add.png' />";
				}
			}
		]
	});
}
/*
 * 我重点关注的客户经理点击查询事件
 * 已加载表格直接可以刷新操作
 */
function searchEmphasisCustomer(){
	reloadPageDataTable("#emphasisCustomerTable");
}
/*
 * 我重点关注的客户经理表格初始化
 */
function initEmphasisCustomerTable(){
	App.initDataTables('#emphasisCustomerTable', "#emphasisCustomerLoading", {
		ajax: {
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
				d.managerStaffName = $("#emphasisCustomerInput").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return relationCustomerData;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#emphasisCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "name","className": "whiteSpaceNormal"},
			{"data": "number","className": "whiteSpaceNormal"},
			{"data": "number1","className": "whiteSpaceNormal"},
			{"data": "user","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.user+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					return "<img onclick='jumpContractManage(\""+data.user+"\")' src='/static/img/delete.png' />";
				}
			}
		]
	});
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

/*
 * 跳转合同信息
 */
function jumpContractManage(data){
	var url = "/html/incomeWorktable/contractManage/performContract.html?id=123";
	top.showSubpageTab(url,"履行中合同");
}
