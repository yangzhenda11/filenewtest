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
	        "url": serverPath+'milestoneMangerController/listMilestoneZx',
	        "data": function(d) {
 	        	d.contractId = parm.contractId;
	        	d.circuitCode = $("#lineInfoInput").val().trim();
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
			{"data": "businessId","className": "whiteSpaceNormal",
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
						"<span class='mLegend "+getLengendColor(data.lineRenting)+"'></span>"+
						"<span class='rightWired "+getLengendColor(data.invoiceReturn)+"'></span>"+
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
						html += "<span title='点击查看开票回款信息' data-placement='top' data-container='body' " +
								"data-trigger='hover' data-toggle='tooltip' " +
								"class='mLegend "+getLengendColor(data.invoiceReturn)+"'" +
										" onclick='getInvoiceReturnInfo(\""+data.businessId+"\" )'></span>";
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
function lineSleeptime(businessId){
	var postData = {
		businessId: businessId
	};
 	App.formAjaxJson(serverPath + "milestoneMangerController/getLineSleeptimeById", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) { 
		$("#businessId").val(businessId);
		$("#sleepId").val(result.data.sleepId);
		$("#lineSleeptimeContent").val(result.data.sleepTime);
		$("#lineSleeptimeModal").modal("show");
	}
}
/*
 * 保存休眠时间
 */
function saveLineSleeptime(){
	var postData = {
		businessId: $("#businessId").val(),
		sleepId: $("#sleepId").val(),
		sleepTime: $("#lineSleeptimeContent").val()
	}
	App.formAjaxJson(serverPath + "milestoneMangerController/updateLineSleeptime", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		layer.msg("保存成功");
		$("#lineSleeptimeModal").modal("hide");
	}
}
/*
 * 获取近6个月开票回款信息
 */
function getInvoiceReturnInfo(businessId){
	var postData = {
			 businessId: businessId
		}
 	App.formAjaxJson(serverPath + "milestoneMangerController/listLineIncome", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		var content = "";
		var contentObj = {
			"title":"<tr class='tableSelect'><td id='invoiceReturnInfoTitle'>近6个月开票回款信息</td>",
			"accountPeriodName":"<tr><td class='tableSelect'>账期</td>",
			"isInvoice":"<tr><td class='tableSelect'>是否开票</td>",
			"receivableAmount":"<tr><td class='tableSelect'>收款金额</td>",
			"collectedAmount":"<tr><td class='tableSelect'>实收金额</td>",
			"arrearsAmount":"<tr><td class='tableSelect'>欠费金额</td>",
		};
		for(var i = 0; i < data.length; i++){
			var item = data[i];
			contentObj.accountPeriodName = contentObj.accountPeriodName + "<td>"+ item.accountPeriodName+"</td>";
			contentObj.isInvoice = contentObj.isInvoice + "<td>"+ item.accountPeriodName+"</td>";
			contentObj.receivableAmount = contentObj.receivableAmount + "<td>"+ App.unctionToThousands(item.receivableAmount)+"</td>";
			contentObj.collectedAmount = contentObj.collectedAmount + "<td>"+ App.unctionToThousands(item.collectedAmount)+"</td>";
			contentObj.arrearsAmount = contentObj.arrearsAmount + "<td>"+ App.unctionToThousands(item.arrearsAmount)+"</td>";
		};
 		$.each(contentObj, function(k,v) {
 			content += v + "</tr>";
 		});
 		$("#invoiceReturnInfoTable").html(content);
 		$("#invoiceReturnInfoTitle").attr("colspan",data.length+1);
		$("#invoiceReturnInfoModal").modal("show");
	}	
}
//返回点击
function returnMilestone(){
	window.history.go(-1);
}