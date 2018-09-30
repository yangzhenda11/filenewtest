//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 里程碑点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchMilestone(){
	var isInitmilestoneTable = $.fn.dataTable.isDataTable("#milestoneTable");
	if(isInitmilestoneTable){
		reloadPageDataTable("#milestoneTable");
	}else{
		initmilestoneTable();
	}
}
/*
 * 里程碑表格初始化
 */
function initmilestoneTable(){
	App.initDataTables('#milestoneTable', "#riskWarningLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'milestone/searchMilestoneInfo',
	        "data": function(d) {
	        	d.contractIdOrName = $("#riskWarningfoSearch").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width":"5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#milestoneTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal","width":"20%"},
			{"data": "contractNumber","className": "whiteSpaceNormal","width":"10%"},
			{"data": "partyName","className": "whiteSpaceNormal","width":"10%"},
			{"data": "partyCode","className": "whiteSpaceNormal","width":"7%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width":"10%"},
			{"data": "signStampDate","className": "whiteSpaceNormal","width":"7%",
				"render" : function(data, type, full, meta) {
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": "expiryDate","className": "whiteSpaceNormal","width":"7%",
				"render" : function(data, type, full, meta) {
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": "contractSigning","className": "whiteSpaceNormal","width":"10%",
				"render" : function(data, type, full, meta) {
					var html = "<div class='cycLegend'></div>";
					if(data == 2){
						html = "<div class='cycLegend yellow'></div>";
					}else if(data == 3){
						html = "<div class='cycLegend green'></div>";
					}else if(data == 1){
						html = "<div class='cycLegend gray'></div>";
					};
					return html;
				}},
			{"data": "orderPlacement","className": "whiteSpaceNormal","width":"5%",
				"render" : function(data, type, full, meta) {
					var html = "<div class='cycLegend'></div>";
					if(data == 2){
						html = "<div class='cycLegend yellow'></div>";
					}else if(data == 3){
						html = "<div class='cycLegend green'></div>";
					}else if(data == 1){
						html = "<div class='cycLegend gray'></div>";
					};
					return html;
				}},
			{"data": "reciveIncoming","className": "whiteSpaceNormal","width":"7%",
				"render" : function(data, type, full, meta) {
					var html = "<div class='cycLegend'></div>";
					if(data == 2){
						html = "<div class='cycLegend yellow'></div>";
					}else if(data == 3){
						html = "<div class='cycLegend green'></div>";
					}else if(data == 1){
						html = "<div class='cycLegend gray'></div>";
					};
					return html;
				}
			},
			{"data": "invoiceFlag","className": "whiteSpaceNormal","width":"7%",
				"render" : function(data, type, full, meta) {
					var html = "<div class='cycLegend'></div>";
					if(data == 2){
						html = "<div class='cycLegend yellow'></div>";
					}else if(data == 3){
						html = "<div class='cycLegend green'></div>";
					}else if(data == 1){
						html = "<div class='cycLegend gray'></div>";
					};
					return html;
				}
			},
			{"data": "payFlag","className": "whiteSpaceNormal","width":"5%",
				"render" : function(data, type, full, meta){
					var html = "<div class='cycLegend'></div>";
					if(data == 2){
						html = "<div class='cycLegend yellow'></div>";
					}else if(data == 3){
						html = "<div class='cycLegend green'></div>";
					}else if(data == 1){
						html = "<div class='cycLegend gray'></div>";
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
