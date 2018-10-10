//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
$(function(){
	//判断有无查询条件
	if(App.hasCache("contractPageSearch")){
		App.readCache("contractPageSearch");
		searchContract();
	}
})
/*
 * 合同信息点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchContract(){
	var isInitContractTable = $.fn.dataTable.isDataTable("#contractTable");
	if(isInitContractTable){
		reloadPageDataTable("#contractTable");
	}else{
		initContractTable();
	}
}
/*
 * 合同信息表格初始化
 */
function initContractTable(){
	App.initDataTables('#contractTable', "#contractLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContract/listContractBasicInfo',
	        "data": function(d) {
	        	d.contractName = $("#contractInfoInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width":"5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#contractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal","width":"20%"},
			{"data": "contractNumber","className": "whiteSpaceNormal","width":"12%"},
			{"data": "customerName","className": "whiteSpaceNormal","width":"12%"},
			{"data": "customerCode","className": "whiteSpaceNormal","width":"12%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width":"10%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width":"8%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "signDate","className": "whiteSpaceNormal","width":"8%",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": "expiryDate","className": "whiteSpaceNormal","width":"8%",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": "contractId","className": "whiteSpaceNormal","width":"5%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpRiskList(\""+data+"\")'>管理</a>";
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
 * 跳转里程碑查看
 */
function jumpRiskList(id){
	var url = "/html/incomeWorktable/milestone/milestoneList.html?contractId="+id;
	App.setCache("contractPageSearch");
	App.changePresentUrl(url);
}
