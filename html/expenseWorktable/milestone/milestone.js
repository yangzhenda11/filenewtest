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
			{"data": "contractName","className": "whiteSpaceNormal","width":"15%"},
			{"data": "contractNumber","className": "whiteSpaceNormal","width":"10%"},
			{"data": "partyName","className": "whiteSpaceNormal","width":"10%"},
			{"data": "partyCode","className": "whiteSpaceNormal","width":"8%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width":"8%"},
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
			{"data": "contractId","className": "whiteSpaceNormal","width":"5%",
				"render" : function(data, type, full, meta) {
					return "<a onclick='jumpOrderManageByContract(\""+data+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend","width":"5%",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='mLegend "+getLengendColor(data.contractSigning)+"'></span>"+
						"<span class='rightWired "+getLengendColor(data.orderPlacement)+"'></span>"+
					"</div>";
					return html;
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend","width":"5%",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='leftWired "+getLengendColor(data.orderPlacement)+"'></span>"+
						"<span class='mLegend "+getLengendColor(data.orderPlacement)+"'></span>"+
						"<span class='rightWired "+getLengendColor(data.reciveIncoming)+"'></span>"+
					"</div>";
					return html;
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend","width":"5%",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='leftWired "+getLengendColor(data.reciveIncoming)+"'></span>"+
						"<span class='mLegend "+getLengendColor(data.reciveIncoming)+"'></span>"+
						"<span class='rightWired "+getLengendColor(data.invoiceFlag)+"'></span>"+
					"</div>";
					return html;
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend","width":"5%",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='leftWired "+getLengendColor(data.invoiceFlag)+"'></span>"+
						"<span class='mLegend "+getLengendColor(data.invoiceFlag)+"'></span>"+
						"<span class='rightWired "+getLengendColor(data.payFlag)+"'></span>"+
					"</div>";
					return html;
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend","width":"5%",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='leftWired "+getLengendColor(data.payFlag)+"'></span>"+
						"<span class='mLegend "+getLengendColor(data.payFlag)+"'></span>"+
					"</div>";
					return html;
				}
			}
		]
	});
}
function getLengendColor(data){
	var returnColor = "gray";
	if(data == 1){
		returnColor = "gray";
	}else if(data == 2){
		returnColor = "yellow";
	}else if(data == 3){
		returnColor = "green";
	}
	return returnColor;
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
 * 跳转订单信息
 */
function jumpOrderManageByContract(contractId){
	var url = "/html/expenseWorktable/orderManage/orderManageForContract.html?contractId="+contractId;
	top.showSubpageTab(url,"订单信息");
}