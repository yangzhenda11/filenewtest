//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//获取传参
var parm = App.getPresentParm();
/*
 * 线路信息里程碑点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchLineMilestone(){
	var isInitLineMilestoneTable = $.fn.dataTable.isDataTable("#lineTable");
	if(isInitLineMilestoneTable){
		reloadPageDataTable("#lineTable");
	}else{
		initLineMilestoneTable();
	}
}
/*
 * 我履行中的合同跟踪表格初始化
 */
function initLineMilestoneTable(){
	App.initDataTables('#lineTable', "#lineLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContract/listPerformanceContract',
	        "data": function(d) {
	        	d.contractInfoSearch = $("#lineInfoInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#lineTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "businessId","className": "whiteSpaceNormal"},
			{"data": "circuitCode","className": "whiteSpaceNormal"},
			{"data": "productName","className": "whiteSpaceNormal"},
			{"data": "monthRentCost","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "rentState","className": "whiteSpaceNormal"},
			{"data": "rentingTime","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": "milestoneId","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return "<a onclick='lineSleeptime(\""+data+"\")'>查看</a>";
				}
			},
			{"data": "stopRentingTime","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data,"yyyy-MM-dd");
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<div class='mLegend "+getLengendColor(data.contractSign)+"'></div>"+
						"<span class='rightWired "+getLengendColor(data.lineRenting)+"'></span>"+
					"</div>";
					return html;
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='leftWired "+getLengendColor(data.lineRenting)+"'></span>"+
						"<span class='mLegend "+getLengendColor(data.invoiceReturn)+"'></span>"+
						"<span class='rightWired "+getLengendColor(data.lineRenting)+"'></span>"+
					"</div>";
					return html;
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='leftWired "+getLengendColor(data.invoiceReturn)+"'></span>"+
						"<span title='点击查看开票回款信息' data-placement='top' data-container='body' data-trigger='hover' data-toggle='tooltip' class='mLegend "+getLengendColor(data.invoiceReturn)+"'></span>"+
						"<span class='rightWired "+getLengendColor(data.lineStopRenting)+"'></span>"+
					"</div>";
					return html;
				}
			},
			{"data": null,"className": "whiteSpaceNormal milestoneLegend",
				"render": function(data, type, full, meta){
					var html = "<div class='wired'>"+
						"<span class='leftWired "+getLengendColor(data.lineStopRenting)+"'></span>"+
						"<span class='mLegend "+getLengendColor(data.lineStopRenting)+"'></span>"+
					"</div>";
					return html;
				}
			}
		]
	});
}
/*
 * 获取节点颜色
 * 1:绿色（已完成）2：黄色（进行中）3：灰色（未开始）4红色（存在风险）
 */
function getLengendColor(data){
	var returnColor = "red";
	if(data == 1){
		returnColor = "green";
	}else if(data == 2){
		returnColor = "yellow";
	}else if(data == 3){
		returnColor = "gray";
	}else if(data == 4){
		returnColor = "red";
	};
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
//返回点击
function returnMilestone(){
	window.history.go(-1);
}