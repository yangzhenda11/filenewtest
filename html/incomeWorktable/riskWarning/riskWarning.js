//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
$(function(){
	//生成预警总览图表
	getCount(); 
})

function getCount() {
	var postData = { 
	};
	var url = serverPath + "riskWarningDetailMangerController/getRiskWarningCount";
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		$("#lineIsArrearage").text(result.data.lineIsArrearage);
		$("#lineRentNotBill").text(result.data.lineRentNotBill);
		$("#lineRentedHaveBill").text(result.data.lineRentedHaveBill);
		$("#contractEndHaveLine").text(result.data.contractEndHaveLine);
		$("#contractEndHaveNewLine").text(result.data.contractEndHaveNewLine);
		 
		$("#customDiffTobss").text(result.data.customDiffTobss);
		$("#customDiffToyzs").text(result.data.customDiffToyzs);
		$("#customDiffInbss").text(result.data.customDiffInbss);
		$("#customDiffInyzsdr").text(result.data.customDiffInyzsdr);
		
 		$("#relatedNotzxBase").text(result.data.relatedNotzxBase);
		$("#relatedNotzxPeriod").text(result.data.relatedNotzxPeriod);
		initWarningOverviewCharts(); 
	}
}
 











/*
 * 标题切换
 */
$("#buttonNavTabs").on("click","button",function(){
	$(this).addClass("check").siblings("button").removeClass("check");
})
$('button[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//	$(e.target).data("id")
})
//风险预警点击跳转
$("#warningOverviewTr").on("click","a",function(){
	var paneId = $(this).data("pane");
	var domId = $(this).attr("id") + "Dom";
	var scrollTopValue = $("#"+domId).offset().top - 20;
	$("#buttonNavTabs button[data-id="+paneId+"]").addClass("check").siblings("button").removeClass("check");
	$("#"+paneId).addClass("active in").siblings("div").removeClass("active in");
	$("#page-content").animate({
		scrollTop:scrollTopValue
	},300)
})
//查询按钮点击统一处理
function searchTable(tableId){ 
	var isInitTable = $.fn.dataTable.isDataTable("#"+tableId);
 	if(isInitTable){
		reloadPageDataTable("#"+tableId);
	}else{ 
		if(tableId == "lineIsArrearageTable"){//线路租用中欠费
			initLineIsArrearageTable();
		}else if(tableId == "lineRentNotBillTable"){//线路账单异常-线路租用中，无账单
			initLineRentNotBillTable();		
		}else if(tableId == "lineRentedHaveBillTable"){//线路账单异常-线路已止租，有新账单
			initLineRentedHaveBillTable();
		}else if(tableId == "contractEndHaveLineTable"){//合同到期业务未停止-合同已到期，存在未止租线路
			initContractEndHaveLineTable();
		}else if(tableId == "contractEndHaveNewLineTable"){//合同到期业务未停止-合同已到期，存在新起租线路
			initContractEndHaveNewLineTable();
		}else if(tableId == "customDiffTobssTable"){//客户信息不一致（沃商务与BSS）
			initCustomDiffTobssTable();  
		}else if(tableId == "customDiffToyzsTable"){//客户信息不一致（沃商务与一站式）
			initCustomDiffToyzsTable();
		}else if(tableId == "customDiffInbssTable"){// BSS系统内线路客户信息不一致
			initCustomDiffInbssTable();
		}else if(tableId == "customDiffInyzsdrTable"){//一站式系统/手工导入线路客户信息不一致 
			initCustomDiffInyzsdrTable();
		}else if(tableId == "relatedNotzxBaseTable"){//线路关联非租线合同异常（基本信息）
			initRelatedNotzxBaseTable();
		}else if(tableId == "relatedNotzxPeriodTable"){//线路关联非租线合同异常（出账信息）
			initRelatedNotzxPeriodTable();
		}
	}
}
/*
 * 风险类型为0:线路租用中欠费
 * 账单明细中点击查看未写
 */
function initLineIsArrearageTable() {
	App.initDataTables('#lineIsArrearageTable', "#lineIsArrearageLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#lineIsArrearageInput").val().trim();
				d.riskType ='0';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",			
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#lineIsArrearageTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",	
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",				
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",			
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",			
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data": null,
					"className": "whiteSpaceNormal",
					"width":"5%",
					"render" : function(data, type, full, meta){
					return "<a onclick='jumpRiskList(\""+data.riskType+"\",\""+data.contractId+"\")'>查看</a>";
					}
				}

			]
	});
}


/*
 * 风险类型为1:线路账单异常-线路租用中，无账单
 * 账单明细中点击查看未写
 */
function initLineRentNotBillTable() {
	App.initDataTables('#lineRentNotBillTable', "#lineRentNotBillLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#lineRentNotBillInput").val().trim();
				d.riskType ='1';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#lineRentNotBillTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data": null,
					"className": "whiteSpaceNormal",
					"width":"5%",
					"render" : function(data, type, full, meta){
					return "<a onclick='jumpRiskList(\""+data.riskType+"\",\""+data.contractId+"\")'>查看</a>";
					}
				}

			]
	});
}

 
 
/*
 * 风险类型为2:线路账单异常-线路已止租，有新账单
 * 账单明细中点击查看未写
 */

function initLineRentedHaveBillTable() {
	App.initDataTables('#lineRentedHaveBillTable', "#lineRentedHaveBillLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#lineRentedHaveBillInput").val().trim();
				
				d.riskType ='2';
 
				return JSON.stringify(d);
			}
 
		},
  
		"columns" :  
 
 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#lineRentedHaveBillTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data": null,
					"className": "whiteSpaceNormal",
					"width":"5%",
					"render" : function(data, type, full, meta){
					return "<a onclick='jumpRiskList(\""+data.riskType+"\",\""+data.contractId+"\")'>查看</a>";
					}
				}

			]
	});
}


/*
 * 风险类型为3:合同到期业务未停止-合同已到期，存在未止租线路
 * 账单明细中点击查看未写
 */
function initContractEndHaveLineTable() {
	App.initDataTables('#contractEndHaveLineTable', "#contractEndHaveLineLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#contractEndHaveLineInput").val().trim();
				d.riskType ='3';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#contractEndHaveLineTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data": null,
					"className": "whiteSpaceNormal",
					"width":"5%",
					"render" : function(data, type, full, meta){
					return "<a onclick='jumpRiskList(\""+data.riskType+"\",\""+data.contractId+"\")'>查看</a>";
					}
				}

			]
	});
}


/*
 * 风险类型为4:合同到期业务未停止-合同已到期，存在新起租线路
 * 账单明细中点击查看未写
 */
function initContractEndHaveNewLineTable() {
	App.initDataTables('#contractEndHaveNewLineTable', "#contractEndHaveNewLineLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#contractEndHaveNewLineInput").val().trim();
				d.riskType ='4';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#contractEndHaveNewLineTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data": null,
					"className": "whiteSpaceNormal",
					"width":"5%",
					"render" : function(data, type, full, meta){
					return "<a onclick='jumpRiskList(\""+data.riskType+"\",\""+data.contractId+"\")'>查看</a>";
					}
				}
 
			]
	});
}
 
















 /*
  * 业务信息报错-客户信息不一致（沃商务与BSS）
  * 线路明细中点击查看未写
  */
function initCustomDiffTobssTable() {
	App.initDataTables('#customDiffTobssTable', "#customDiffTobssLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listCustomDiffTobss',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
			    d.contractName = $("#customDiffTobssInput").val().trim();
				return JSON.stringify(d);
			}
 
		},
  
		"columns" :  
 
			 [
		 			{
						"data" : null,
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#customDiffTobssTable").pageStart;
							return start + meta.row + 1;
						}
					}, {
						"data" : "contractName",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "contractNumber",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "diffContent",
						"className" : "whiteSpaceNormal",
						} ,
						{
							"data": null,
							"className": "whiteSpaceNormal",
							"width":"5%",
							"render" : function(data, type, full, meta){
							return "<a onclick='jumpCustomDiffToDetail(\""+data.contractId+"\",\"Tobss\")'>查看</a>";
							}
						}
						
						]
	});
}


/*
 * 业务信息报错-客户信息不一致（沃商务与一站式）
 * 线路明细中点击查看未写
 */
function initCustomDiffToyzsTable() {

	App.initDataTables('#customDiffToyzsTable', "#customDiffToyzsLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listCustomDiffToyzs',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#customDiffToyzsInput").val().trim();

				return JSON.stringify(d);
			}
 
		},
  
		"columns" :  
			 [
		 			{
						"data" : null,
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#customDiffTobssTable").pageStart;
							return start + meta.row + 1;
						}
					}, {
						"data" : "contractName",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "contractNumber",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "diffContent",
						"className" : "whiteSpaceNormal",
						} ,
						{
							"data": null,
							"className": "whiteSpaceNormal",
							"width":"5%",
							"render" : function(data, type, full, meta){
							return "<a onclick='jumpCustomDiffToDetail(\""+data.contractId+"\",\"Toyzs\")'>查看</a>";
							}
						}
						]
	});
}


/*
 * 业务信息报错- BSS系统内线路客户信息不一致
 * 线路明细中点击查看未写
 */
function initCustomDiffInbssTable() {
	
	App.initDataTables('#customDiffInbssTable', "#customDiffInbssLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listCustomDiffInbss',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#customDiffInbssInput").val().trim();

				return JSON.stringify(d);
			}
 
		},
  
		"columns" :  
			 [
		 			{
						"data" : null,
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#customDiffTobssTable").pageStart;
							return start + meta.row + 1;
						}
					}, {
						"data" : "contractName",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "contractNumber",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "diffContent",
						"className" : "whiteSpaceNormal",
						} ,
						{
							"data": null,
							"className": "whiteSpaceNormal",
							"width":"5%",
							"render" : function(data, type, full, meta){
							return "<a onclick='jumpCustomDiffInDetail(\""+data.contractNumber+"\",\"Inbss\")'>查看</a>";
							}
						}
						]
	});
}


/*
 * 业务信息报错-一站式系统/手工导入线路客户信息不一致 
 * 线路明细中点击查看未写
 */
function initCustomDiffInyzsdrTable() {

	App.initDataTables('#customDiffInyzsdrTable', "#customDiffInyzsdrLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listCustomDiffInyzsdr',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 			
				d.contractName = $("#customDiffInyzsdrInput").val().trim();
				return JSON.stringify(d);
			}
 
		},
  
		"columns" :  
			 [
		 			{
						"data" : null,
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#customDiffInyzsdrTable").pageStart;
							return start + meta.row + 1;
						}
					}, {
						"data" : "contractName",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "contractNumber",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss1",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss2",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "diffContent",
						"className" : "whiteSpaceNormal",
						},
						{
							"data": null,
							"className": "whiteSpaceNormal",
							"width":"5%",
							"render" : function(data, type, full, meta){
							return "<a onclick='jumpCustomDiffInDetail(\""+data.contractNumber+"\",\"Inyzsdr\")'>查看</a>";
							}
						}
						]
	});
}


/*
 * 业务信息报错-线路关联非租线合同异常（基本信息）
 */
function initRelatedNotzxBaseTable() {

	App.initDataTables('#relatedNotzxBaseTable', "#relatedNotzxBaseLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'lineMangerController/listLineInfoForRiskWaring',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				//d.riskType = $("#searchInput").val().trim();
			
				d.contractName = $("#relatedNotzxBaseInput").val().trim();
				return JSON.stringify(d);
			}
 
		},
  
		"columns" :  
			 [
		 			{
						"data" : null,
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#relatedNotzxBaseTable").pageStart;
							return start + meta.row + 1;
						}
					}
		 			,{
						"data":"businessId",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"circuitCode",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"productName",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"contractNumber",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"customerCode",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"customerName",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"startCityName",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"rentingScope",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"monthRentCost",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"rentState",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"customerManagerName",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"sourceName",
					    "className" : "whiteSpaceNormal",
					}
					
					
					
			]
	});
}

/*
 * 业务信息报错-线路关联非租线合同异常（出账信息）
 */
function initRelatedNotzxPeriodTable() {

	App.initDataTables('#relatedNotzxPeriodTable', "#relatedNotzxPeriodLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'lineIncomeMangerController/listLineIncomeForRiskWaring',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				d.contractName = $("#relatedNotzxPeriodInput").val().trim();
				return JSON.stringify(d);
			}
 
		},
  
		"columns" :  
			 [
		 			{
						"data" : null,
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#relatedNotzxPeriodTable").pageStart;
							return start + meta.row + 1;
						}
					}
		 			,{
						"data":"businessId",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"circuitCode",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"productName",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"contractNumber",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"customerCode",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"customerName",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"startCityName",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"rentingScope",
					    "className" : "whiteSpaceNormal",
					},{
						"data":"monthRentCost",
					    "className" : "whiteSpaceNormal",
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
 * 生成预警总览图表
 */
function initWarningOverviewCharts(){
	var chartsDom = echarts.init(document.getElementById('warningOverviewCharts'));
 
	var   lineArrearage =parseInt($("#lineIsArrearage").text());
	var   lineException =parseInt($("#lineRentNotBill").text())+parseInt($("#lineRentedHaveBill").text()) ;
	
	var   contractException =parseInt($("#contractEndHaveLine").text())
	      +parseInt($("#contractEndHaveNewLine").text()) ;
	var   businessException=
		parseInt($("#customDiffTobss").text())+
		parseInt($("#customDiffToyzs").text())+
		parseInt($("#customDiffInbss").text())+
		parseInt($("#customDiffInyzsdr").text())+
		parseInt($("#relatedNotzxBase").text())+
		parseInt($("#relatedNotzxPeriod").text());
	var option = {
		title : {
	        text: '风险预警总览',
	        x:'center',
	        textStyle: {
	        	fontSize:13
	        }
	   	},
	    xAxis: {
	        type: 'category',
	        data: ['线路租用中欠费', '线路账单异常', '合同到期业务未停止', '业务信息报错']
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [{
	        data: [lineArrearage, lineException, contractException, businessException ],
	        type: 'bar',
	        barWidth:'45%',
	        itemStyle: {   
                normal:{  
                    color: function (params){
                        var colorList = ['#00a3e2', '#ffc100','#bfbfbf','#85be23'];
                        return colorList[params.dataIndex];
                    }
                },
           	}
	    }]
	};
	chartsDom.setOption(option);
}


/*
 * 跳转明细查看
 */
function jumpRiskList(riskType,contractId){
	var url = "/html/incomeWorktable/riskWarning/riskWarningList.html?returnBtn=true&contractId="+contractId+"&riskType="+riskType;
	top.showSubpageTab(url,"查看线路明细");
}
 



//to 跳转地址
function jumpCustomDiffToDetail(contractParm,riskType){
	var url = "/html/incomeWorktable/riskWarning/customDiffDetail.html?returnBtn=true&contractId="+contractParm+"&riskType="+riskType;
	top.showSubpageTab(url,"查看线路明细");
}



//in 跳转地址
function jumpCustomDiffInDetail(contractParm,riskType){
	var url = "/html/incomeWorktable/riskWarning/customDiffDetail.html?returnBtn=true&contractNumber="+contractParm+"&riskType="+riskType;
	top.showSubpageTab(url,"查看线路明细");
}
 