//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//获取传参
var parm = App.getPresentParm();
if(!parm.contractId){
	layer.alert("暂无合同主键ID，请联系系统管理员",{icon:2})
}
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
	if(!parm.contractId){
		layer.alert("暂无合同主键ID，请联系系统管理员",{icon:2});
		return;
	}
	App.initDataTables('#lineTable', "#lineLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContract/listPerformanceContract',
	        "data": function(d) {
//	        	d.contractId = parm.contractId;
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
					var html = "<div class='wired'><span class='leftWired "+getLengendColor(data.invoiceReturn)+"'></span>";
					if(data.invoiceReturn == 3 || data.invoiceReturn == null){
						html += "<span class='mLegend "+getLengendColor(data.invoiceReturn)+"'></span>";
					}else{
						html += "<span title='点击查看开票回款信息' data-placement='top' data-container='body' data-trigger='hover' data-toggle='tooltip' class='mLegend "+getLengendColor(data.invoiceReturn)+"' onclick='getInvoiceReturnInfo(data.milestoneId)'></span>";
					};
					html += "<span class='rightWired "+getLengendColor(data.lineStopRenting)+"'></span></div>";
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
	var returnColor = "gray";
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
/*
 * 获取休眠时间
 */
function lineSleeptime(milestoneId){
	var postData = {
		milestoneId: milestoneId
	}
	App.formAjaxJson(serverPath + "", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		$("#milestoneId").val(milestoneId);
		$("#lineSleeptimeContent").val(result.data);
		$("#lineSleeptimeModal").modal("show");
	}
}
/*
 * 保存休眠时间
 */
function saveLineSleeptime(){
	var postData = {
		milestoneId: $("#milestoneId").val(),
		lineSleeptimeContent: $("#lineSleeptimeContent").val()
	}
	App.formAjaxJson(serverPath + "", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		layer.msg("保存成功");
		$("#lineSleeptimeModal").modal("show");
	}
}
/*
 * 获取近6个月开票回款信息
 */
function getInvoiceReturnInfo(milestoneId){
	var postData = {
		milestoneId: milestoneId
	}
	App.formAjaxJson(serverPath + "", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		$("#invoiceReturnInfoModal").modal("show");
	}
}
//返回点击
function returnMilestone(){
	window.history.go(-1);
}