//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
$(function(){
	//生成预警总览图表
	initWarningOverviewCharts();
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
		
	/*	$("#relatedNotzxBase").text(result.data.relatedNotzxBase);
		$("#relatedNotzxPeriod").text(result.data.relatedNotzxPeriod);
		*/
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
			
		}else if(tableId == "lineRentedHaveBillTable"){
			
		}
		
	}
}

function initLineIsArrearageTable() {
	var isInit = $.fn.dataTable.isDataTable("#lineIsArrearageTable");
	if (!isInit) {
		$("#lineIsArrearageTable").html("");
	}
	;
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
					"render" : function(data, type, full, meta) {
						var start = App.getDatatablePaging("#lineIsArrearageTable").pageStart;
						return start + meta.row + 1;
					}
				},
				{
					"data" : "riskId",
					"className" : "whiteSpaceNormal"
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
	var option = {
		title : {
	        text: '风险预警总览',
	        x:'center',
	        textStyle: {
	        	fontSize:14
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
	        data: [12, 20, 15, 30,],
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
