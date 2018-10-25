//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 风险预警点击查询事件
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
 * 风险预警表格初始化
 */
function initRiskWarningListTable(){
	App.initDataTables('#riskWarningListTable', "#riskWarningLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'riskWarning/listRiskWarning',
	        "data": function(d) {
	        	d.riskWarningfoSearch = $("#riskWarningfoSearch").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width":"5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#riskWarningListTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal","width":"20%"},
			{"data": "contractNumber","className": "whiteSpaceNormal","width":"10%"},
			{"data": "partnerName","className": "whiteSpaceNormal","width":"10%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width":"7%"},
			{"data": "signDate","className": "whiteSpaceNormal","width":"7%",
				"render" : function(data, type, full, meta) {
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": "expiryDate","className": "whiteSpaceNormal","width":"8%",
				"render" : function(data, type, full, meta) {
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": "performerOrgName","className": "whiteSpaceNormal","width":"10%"},
			{"data": "performerStaffName","className": "whiteSpaceNormal","width":"5%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width":"7%",
				"render" : function(data, type, full, meta) {
					return App.unctionToThousands(data);
				}
			},
			{"data": "payVateAmountSum","className": "whiteSpaceNormal","width":"7%",
				"render" : function(data, type, full, meta) {
					return App.unctionToThousands(data);
				}
			},
			{"data": "isExpire","className": "whiteSpaceNormal milestoneLegend","width":"5%",
				"render" : function(data, type, full, meta){
					var html = "<div class='cycLegend'></div>";
					if(data == 1){
						html = "<div class='cycLegend red'></div>";
					}else if(data == 0){
						html = "<div class='cycLegend yellow'></div>";
					};
					return html;
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
