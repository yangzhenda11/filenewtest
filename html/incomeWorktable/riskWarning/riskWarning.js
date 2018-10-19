//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
$(function(){
	//生成预警总览图表
	debugger;
	getCount(); 
})

function getCount() {
	debugger;
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
		if(tableId == "lineIsArrearageTable"){
			initLineIsArrearageTable();
		}else if(tableId == "lineRentNotBillTable"){
			initLineRentNotBillTable();		
		}else if(tableId == "lineRentedHaveBillTable"){
<<<<<<< HEAD
			initLineRentedHaveBillTable();
		}else if(tableId == "contractEndHaveLineTable"){
			initContractEndHaveLineTable();
		}else if(tableId == "contractEndHaveNewLineTable"){
			initContractEndHaveNewLineTable();

=======
			initLineRentedHaveBillTable(); 
		}else if(tableId == "contractEndHaveLineTable"){
			initContractEndHaveLineTable();
		}else if(tableId == "contractEndHaveNewLineTable"){
			initContractEndHaveNewLineTable(); 
		}else if(tableId == "customDiffTobssTable"){
			initCustomDiffTobssTable(); 
			
>>>>>>> c3bd94fdeb591ab3f1d55dc8b7aaf508756f556f
		}
		
	}
}
/*
 * 风险类型为0:线路租用中欠费
 * 账单明细中点击查看未写
 */
function initLineIsArrearageTable() {
	var isInit = $.fn.dataTable.isDataTable("#lineIsArrearageTable");
	if (!isInit) {
		$("#lineIsArrearageTable").html("");
	} ;
	App.initDataTables('#lineIsArrearageTable', "#lineIsArrearageLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				//d.riskType = $("#searchInput").val().trim();
				d.riskType ='0';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"title":"序号",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#lineIsArrearageTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"title":"合同名称",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"title":"合同编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"title":"客户名称",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"title":"集客客户编号",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"title":"合作方编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"title":"含增值税合同金额",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"title":"客户经理",
					"className" : "whiteSpaceNormal"
				} 

			]
	});
}


/*
 * 风险类型为1:线路账单异常-线路租用中，无账单
 * 账单明细中点击查看未写
 */
function initLineRentNotBillTable() {
	var isInit = $.fn.dataTable.isDataTable("#lineRentNotBillTable");
	if (!isInit) {
		$("#lineRentNotBillTable").html("");
	}
	;
	App.initDataTables('#lineRentNotBillTable', "#lineRentNotBillLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				//d.riskType = $("#searchInput").val().trim();
				d.riskType ='1';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"title":"序号",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#lineRentNotBillTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"title":"合同名称",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"title":"合同编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"title":"客户名称",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"title":"集客客户编号",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"title":"合作方编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"title":"含增值税合同金额",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"title":"客户经理",
					"className" : "whiteSpaceNormal"
				} 

			]
	});
}

 
<<<<<<< HEAD



=======
function initCustomDiffTobssTable() {
	var isInit = $.fn.dataTable.isDataTable("#customDiffTobssTable");
	if (!isInit) {
		$("#customDiffTobssTable").html("");
	};
	App.initDataTables('#customDiffTobssTable', "#customDiffTobssLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listCustomDiffInbss',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) {
				d.contractName = $("#customDiffTobssInput").val().trim(); 
				
				return JSON.stringify(d);
			}
		},
		"columns" : [
		 			{
						"data" : null,
						"title" : "序号",
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#customDiffTobssTable").pageStart;
							return start + meta.row + 1;
						}
					}, {
						"data" : "contractName",
						"title" : "合同名称",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "contractNumber",
						"title" : "合同编号",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss1",
						"title" : "客户名称",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss1",
						"title" : "集客客户编号",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss2",
						"title" : "客户名称",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss2",
						"title" : "集客客户编号",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "diffContent",
						"title" : "差异描述",
						"className" : "whiteSpaceNormal",
						} ,
						{
						"data" : "diffContent",
						"title" : "线路明细",
						"className" : "whiteSpaceNormal",
						}
						]
				});
			}
		 
>>>>>>> c3bd94fdeb591ab3f1d55dc8b7aaf508756f556f
/*
 * 风险类型为2:线路账单异常-线路已止租，有新账单
 * 账单明细中点击查看未写
 */

function initLineRentedHaveBillTable() {
	var isInit = $.fn.dataTable.isDataTable("#lineRentedHaveBillTable");
	if (!isInit) {
		$("#lineRentedHaveBillTable").html("");
	}
	;
	App.initDataTables('#lineRentedHaveBillTable', "#lineRentedHaveBillLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				//d.riskType = $("#searchInput").val().trim();
				d.riskType ='2';
 
				return JSON.stringify(d);
			}
		},
<<<<<<< HEAD
		"columns" : 
  
=======
		"columns" :  
>>>>>>> c3bd94fdeb591ab3f1d55dc8b7aaf508756f556f
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"title":"序号",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#lineRentedHaveBillTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"title":"合同名称",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"title":"合同编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"title":"客户名称",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"title":"集客客户编号",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"title":"合作方编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"title":"含增值税合同金额",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"title":"客户经理",
					"className" : "whiteSpaceNormal"
				} 

			]
	});
}



/*
 * 风险类型为3:合同到期业务未停止-合同已到期，存在未止租线路
 * 账单明细中点击查看未写
 */
function initContractEndHaveLineTable() {
	var isInit = $.fn.dataTable.isDataTable("#contractEndHaveLineTable");
	if (!isInit) {
		$("#contractEndHaveLineTable").html("");
	}
	;
	App.initDataTables('#contractEndHaveLineTable', "#contractEndHaveLineLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				//d.riskType = $("#searchInput").val().trim();
				d.riskType ='3';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"title":"序号",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#contractEndHaveLineTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"title":"合同名称",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"title":"合同编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"title":"客户名称",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"title":"集客客户编号",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"title":"合作方编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"title":"含增值税合同金额",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"title":"客户经理",
					"className" : "whiteSpaceNormal"
				} 

			]
	});
}


/*
 * 风险类型为4:合同到期业务未停止-合同已到期，存在新起租线路
 * 账单明细中点击查看未写
 */
function initContractEndHaveNewLineTable() {
	var isInit = $.fn.dataTable.isDataTable("#contractEndHaveNewLineTable");
	if (!isInit) {
		$("#contractEndHaveNewLineTable").html("");
	}
	;
	App.initDataTables('#contractEndHaveNewLineTable', "#contractEndHaveNewLineLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listRiskWarningDetail',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) { 
				//d.riskType = $("#searchInput").val().trim();
				d.riskType ='4';
				return JSON.stringify(d);
			}
		},
		"columns" : 
			[ 
				{
					"data" : null,
					"className" : "whiteSpaceNormal",
					"title":"序号",
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#contractEndHaveNewLineTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "contractName",
					"title":"合同名称",
					"className" : "whiteSpaceNormal"
				},
				{
					"data" : "contractNumber",
					"title":"合同编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerName",
					"title":"客户名称",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerCode",
					"title":"集客客户编号",
					"className" : "whiteSpaceNormal"
				}  ,
				{
					"data" : "partnerCode",
					"title":"合作方编号",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "contractValue",
					"title":"含增值税合同金额",
					"className" : "whiteSpaceNormal"
				} ,
				{
					"data" : "customerManagerName",
					"title":"客户经理",
					"className" : "whiteSpaceNormal"
				} 
<<<<<<< HEAD


=======
 
>>>>>>> c3bd94fdeb591ab3f1d55dc8b7aaf508756f556f
			]
	});
}
 

<<<<<<< HEAD
function initCustomDiffTobssTable() {
	var isInit = $.fn.dataTable.isDataTable("#customDiffTobssTable");
	if (!isInit) {
		$("#customDiffTobssTable").html("");
	};
	App.initDataTables('#customDiffTobssTable', "#customDiffTobssLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listCustomDiffInbss',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) {
				d.contractName = $("#customDiffTobssInput").val().trim(); 
				"columns" : 
					 
					[
					{
						"data" : null,
						"title" : "序号",
						"className" : "whiteSpaceNormal",
						"render" : function(data, type, full, meta) {
							var start = App.getDatatablePaging("#customDiffTobssTable").pageStart;
							return start + meta.row + 1;
						}
					}, {
						"data" : "contractName",
						"title" : "合同名称",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "contractNumber",
						"title" : "合同编号",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss1",
						"title" : "客户名称",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss1",
						"title" : "集客客户编号",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerNameBss2",
						"title" : "客户名称",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "customerCodeBss2",
						"title" : "集客客户编号",
						"className" : "whiteSpaceNormal",
						},
						{
						"data" : "diffContent",
						"title" : "差异描述",
						"className" : "whiteSpaceNormal",
						} ,
						{
						"data" : "diffContent",
						"title" : "线路明细",
						"className" : "whiteSpaceNormal",
						}
						]
			});
		}
	}
}

/*
=======
 /*
>>>>>>> c3bd94fdeb591ab3f1d55dc8b7aaf508756f556f
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
