//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//初始化数据
var defaultData =  {
    "resourceCustomer": "3",
    "resourceSign": "3",
    "registerActivate": "3",
    "businessLineRenting": "3",
    "businessStopRenting": "3",
    "ticketReceivables": "3",
    "riskWarning": "3",
    "contractCloseConclude": "3"
};

$(function(){
   	initIncomeFlowCharts(defaultData);
})


/**************************************获取合同基本信息********************************************/
function getContractBaseData(){ 
	var contractNumber = $("#searchContractNumber").val().trim();
	if(contractNumber){
		var url = serverPath + "contractSubwayZxManger/getContractSubwayZxByContractNumber";
		var postData = {
				contractNumber: contractNumber
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback, improperCallback);
		function successCallback(result) {
			var data = result.data;
 			if(data.contractNumber){
 				$("#contractBaseData,#incomeCharts").show();
 				$("#contractName").val(data.contractName);
				$("#contractNumber").val(data.contractNumber); 
				$("#customerName").val(data.customerName); 
				if(data.customerCode){
					$("#customerCode").val(data.customerCode); 
				}else if(data.partnerCode){
					$("#customerCode").val(data.partnerCode); 
				};
				createLineNumberChart(contractNumber);
				createLineHireChart(contractNumber);
				createIncomeChartCharts(contractNumber);
				getIncomeFlowChartsData(contractNumber);
			}else{
				$("#contractBaseData,#incomeCharts").hide();
				initIncomeFlowCharts(defaultData);
				layer.alert("您输入的合同编号有误，请重新输入。",{icon:2});
			}
		}
		function improperCallback(result){
			var ms = result.message;
			$("#contractBaseData,#incomeCharts").hide();
			initIncomeFlowCharts(defaultData);
			layer.alert(ms,{icon:2});
		}
	}else{
		$("#contractBaseData,#incomeCharts").hide();
		initIncomeFlowCharts(defaultData);
		layer.alert("请输入合同编号。",{icon:2});
	}
}
/**************************************获取合同基本信息********************************************/
/*
 * 返回年月日
 */
function returnForamtDate(data){
	var data = data.split("-");
	var resultData = "";
	$.each(data, function(k,v) {
		if(k == 0){
			resultData += v + "年";
		}else if(k == 1){
			resultData += v + "月";
		}else if(k == 2){
			resultData += v + "日";
		}
	});
	return resultDate;
}
/**************************************获取图表数据生成图表********************************************/
//生成本地线路与跨域线路数量占比情况图表
function createLineNumberChart(contractNumber){
	var url = serverPath + "analysisZx/localAndOffSite";
	var lineNumberChart = echarts.init(document.getElementById('lineNumberChart'));
	var postData = {
		contractNumber:contractNumber
	}
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		var localLineNum = data.localLineNum; //本地线路数量
		var offsiteLineNum = data.offsiteLineNum; //跨域线路数量
		if(localLineNum || offsiteLineNum){
			var lineNumberChartOption = returnChartsOption('本地线路与跨域线路数量占比情况', [{
				value: localLineNum,
				name: '本地线路：'+localLineNum+'条'
			}, {
				value: offsiteLineNum,
				name: '跨域线路：'+offsiteLineNum+'条'
			}]);
		}else{
			var lineNumberChartOption = returnEmptyChartsOption('本地线路与跨域线路数量占比情况', ['本地线路：0条', '跨域线路：0条']);
		};
		lineNumberChart.setOption(lineNumberChartOption);
	}
	function improperCallback(result){
		layer.msg(result.message);
		var lineNumberChartOption = returnEmptyChartsOption('本地线路与跨域线路数量占比情况', ['本地线路：0条', '跨域线路：0条']);
		lineNumberChart.setOption(lineNumberChartOption);
	}
}
//生成租用中线路与已止租线路数量占比情况图表
function createLineHireChart(contractNumber){
	var url = serverPath + "analysisZx/isLineAndNotLine?contractNumber="+contractNumber;
	var lineHireChart = echarts.init(document.getElementById('lineHireChart'));
	var postData = {
		contractNumber:contractNumber
	}
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		var isLineHireNum = data.isLineHireNum; //租用中线路数量
		var notLineHireNum = data.notLineHireNum; //已止租线路数量
		if(isLineHireNum || notLineHireNum){
			var lineHireChartOption = returnChartsOption('租用中线路与已止租线路数量占比情况', [{
				value: isLineHireNum,
				name: '租用中线路：'+isLineHireNum+'条'
			}, {
				value: notLineHireNum,
				name: '已止租线路：'+notLineHireNum+'条'
			}]);
		}else{
			var lineHireChartOption = returnEmptyChartsOption('租用中线路与已止租线路数量占比情况', ['租用中线路：0条', '已止租线路：0条']);
		};
		lineHireChart.setOption(lineHireChartOption);
	}
	function improperCallback(result){
		layer.msg(result.message);
		var lineHireChartOption = returnEmptyChartsOption('租用中线路与已止租线路数量占比情况', ['租用中线路：0条', '已止租线路：0条']);
		lineHireChart.setOption(lineHireChartOption);
	}
}
//生成本年度已出账收入情况图表
function createIncomeChartCharts(contractNumber){
	var url = serverPath + "analysisZx/collectedAndArrears?contractNumber="+contractNumber;
	var incomeChart = echarts.init(document.getElementById('incomeChart'));
	var postData = {
		contractNumber:contractNumber
	}
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		var invoiceNnovateSum = data.invoiceNnovateSum;
		var noInvoiceNnovateSum = data.noInvoiceNnovateSum;
		var noInvoiceNnovatePercent = data.noInvoiceNnovatePercent;
		if(invoiceNnovateSum || invoiceNnovateSum){
			var invoiceChartsFixedData = [
				{
					value: invoiceNnovateSum,
					name: "实收金额："+App.unctionToThousands(invoiceNnovateSum)+"元",
					canSelect: true
				},
				{
					value: noInvoiceNnovateSum,
					name: "欠费金额："+App.unctionToThousands(noInvoiceNnovateSum)+"元",
					canSelect: true
				}
			];
			incomeChartOption = circleChartsOption("本年度已出账收入情况",invoiceChartsFixedData);
			$("#incomeChartValue").text(parseFloat(noInvoiceNnovatePercent*100) + "%");
			$("#incomeOverviewNote").text(data.currentDate);
		}else{
			incomeChartOption = circleChartsOption("本年度已出账收入情况",[{value: 0,name: '实收金额：0元'},{value: 1,name: '欠费金额：0元'}],true);
			$("#incomeChartValue").text("0%")
		}
		incomeChart.setOption(incomeChartOption);
	}
	function improperCallback(result){
		layer.msg(result.message);
		incomeChartOption = circleChartsOption("本年度已出账收入情况",[{value: 0,name: '实收金额：0元'},{value: 1,name: '欠费金额：0元'}],true);
		$("#incomeChartValue").text("0%")
		incomeChart.setOption(incomeChartOption);
	}
}
/**************************************获取图表数据生成图表********************************************/



/************************************************图表生成配置项*******************************************************/
//生成本地线路与跨域线路数量占比情况,租用中线路与已止租线路数量占比情况***有数据配置
function returnChartsOption(title, data) {
	var minAngleValue = 6;
	$.each(data, function(k,v) {
		if(v.value == 0){
			minAngleValue = 0;
		}
	});
	var overviewReceivableOption = {
		title : {
	        text: title,
	        x:'center',
	        top: '15',
	        itemGap: 6,
	        textStyle: {
	        	fontSize:14
	        }
	    },
	    tooltip : {
	        formatter: "{b} ({d}%)",
	        textStyle: {
	        	fontSize: 12
	        },
	        confine:"true"
	    },
	    legend: {
	    	orient: "vertical",
	        bottom: '10',
	        itemWidth: 8,
	        itemHeight: 8,
	        selectedMode: false,
	        itemGap: 5
	    },
	    series : [
	        {
	            name: "",
	            type: 'pie',
	            radius: '60%',
//				radius: ['35%', '60%'],
				minAngle: minAngleValue,
	            clockwise: false,
				label: {
 					color: "#333",
 					formatter:"{d}%"
 				},
   				labelLine: {
   					length: 10,
   					length2: 10,
   					lineStyle: {
   						color: "#333"
   					}
   				},
   				itemStyle: {
	                borderWidth: 1,
	                borderColor: '#ffffff'
		        },
		        emphasis: {
	                borderWidth: 0,
	                shadowBlur: 10,
	                shadowOffsetX: 0,
	                shadowColor: 'rgba(0, 0, 0, 0.5)'
	           	},
	            data:data
	        }
	    ],
	    color:['#FD6D64', '#73D2FD']
	};
	return overviewReceivableOption;
};
//生成本地线路与跨域线路数量占比情况,租用中线路与已止租线路数量占比情况***无数据配置
function returnEmptyChartsOption(title, data) {
	var seriesData = [];
	var toolTip = '';
	for(var i = 0; i < data.length; i++) {
		var value = i == 0 ? 1 : 0;
		var item = {
			value: value,
			name: data[i]
		};
		toolTip += data[i] + "</br>";
		seriesData.push(item);
	};
	var option = {
		title: {
			text: title,
			x: 'center',
			top: '15',
			itemGap: 6,
			textStyle: {
				fontSize: 14
			}
		},
		tooltip: {
			formatter: toolTip,
			textStyle: {
	        	fontSize: 12
	        }
		},
		legend: {
			orient: "vertical",
			bottom: '10',
			itemWidth: 8,
			itemHeight: 8,
			selectedMode: false,
			itemGap: 5
		},
		series: [{
			name: '',
			type: 'pie',
			clockwise: false,
			radius: '60%',
//			radius: ['35%', '60%'],
			label: {
				show: false
			},
			labelLine: {
				show: false
			},
			data: seriesData
		}],
		color: ['#DBDBDB', '#DBDBDB']
	};
	return option;
};

/*
 * 生成圆环配置项
 */
function circleChartsOption(title,data,isEmpty){
	var minAngleValue = 6;
	var borderWidth = 2;
	$.each(data, function(k,v) {
		if(v.value == 0){
			minAngleValue = 0;
			borderWidth = 0;
		}
	});
	var formatter = "{b} ({d}%)";
	if(isEmpty){
		formatter = "";
		for(var i = 0; i < data.length; i++){
			formatter += data[i].name+"<br />";
		}
	};
	var option = {
		title: {
			text: title,
			x:'center',
	        itemGap: 6,
	        top: 15,
	        textStyle: {
	        	fontSize:14
	        },
	        subtextStyle: {
	        	lineHeight: 16,
	        	color: "#333",
	        	rich: {}
	        },
		},
		tooltip: {
			confine:"true",
	        trigger: 'item',
	        textStyle: {
	        	fontSize: 12
	        },
	        formatter: formatter
	    },
		legend: {
			orient: 'vertical',
			itemWidth: 8,
	        itemHeight: 8,
	        itemGap: 5,
	        bottom: 10,
			selectedMode: false
		},
		color: ['#FD6D64', '#DBDBDB'],
		series: [{
			clockwise: false,
//			hoverAnimation: false,
			name: title,
			type: 'pie',
			radius: ['35%', '60%'],
			minAngle: minAngleValue,
			label: {
				normal: {
					show: false,
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			itemStyle: {
                borderWidth: borderWidth,
                borderColor: '#ffffff'
	        },
			data: data
		}]
	};
	return option;
};
/************************************************图表生成配置项*******************************************************/

/**************************************地铁图配置********************************************/
function getIncomeFlowChartsData(contractNumber){
	var url = serverPath + "contractSubwayZxManger/getContractSubwayZxDetailByContractNumber";
	var postData = {
		contractNumber: contractNumber
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		initIncomeFlowCharts(data.contractSubwayZx);
		initIncomeFlowChartsTips(data);
	}
}
function initIncomeFlowCharts(data){
	$('#incomeFlowChart').html('');
	var tw = $('#incomeFlowChart').width();
	var th = $('#incomeFlowChart').height();
	var baseData = initD3Charts(data);
	$('#incomeFlowChart').D3Charts({
		width:tw,
		height:th,
		baseData: baseData
	})
	
	$(window).resize(function(){
		$('#incomeFlowChart').html('');
		var tw = $('#incomeFlowChart').width();
		var th = $('#incomeFlowChart').height();
		$('#incomeFlowChart').D3Charts({
			width:tw,
			height:th,
			baseData: baseData
		})
	})
}
var rentingDataTips = '',stopRentingDataTips = '',invoiceRefundDataTips = '',riskWarningDataTips = '';
function initIncomeFlowChartsTips(data){
	var rentingData = data.rentingData;
	var stopRentingData = data.stopRentingData;
	var invoiceRefundData = data.invoiceRefundData;
	var riskWarningData = data.riskWarningData;
	if(rentingData){
		rentingDataTips = "<table><tr><td>租用中线路数量</td>"+
							"<td>"+rentingData.rentingNum+" 条</td></tr>"+
							"<tr><td>跨域电路数量</td>"+
							"<td>"+rentingData.rentingCrossNum+" 条</td></tr>"+
							"<tr><td>本地电路数量</td>"+
							"<td>"+rentingData.rentingLocalNum+" 条</td></tr></table>";
	}else{
		rentingDataTips = "暂无数据";
	};
	if(stopRentingData){
		stopRentingDataTips = "<table><tr><td>已止租线路数量</td>"+
							"<td>"+stopRentingData.stopRentingNum+" 条</td></tr>"+
							"<tr><td>跨域电路数量</td>"+
							"<td>"+stopRentingData.stopRentingLocaNnum+" 条</td></tr>"+
							"<tr><td>本地电路数量</td>"+
							"<td>"+stopRentingData.stopRentingCrossNum+" 条</td></tr></table>";
	}else{
		stopRentingDataTips = "暂无数据";
	};
	if(invoiceRefundData){
		invoiceRefundDataTips = "<table><tr><td>上月应收金额</td>"+
							"<td>"+App.unctionToThousands(invoiceRefundData.lastmonthReceivableAmount)+" 元</td></tr>"+
							"<tr><td>上月实收金额</td>"+
							"<td>"+App.unctionToThousands(invoiceRefundData.lastmonthCollectedAmount)+" 元</td></tr>"+
							"<tr><td>上月欠费金额</td>"+
							"<td>"+App.unctionToThousands(invoiceRefundData.lastmonthArrearsAmount)+" 元</td></tr></table>"+
							"<div class = 'tipsBottomCon'>* 月初时数据可能出现延迟</div>";
	}else{
		invoiceRefundDataTips = "暂无数据";
	};
	if(riskWarningData){
		riskWarningDataTips = "<div class='tipsTopCon'>本合同存在以下类型风险：</div>"+
							"<div class='tipsContent'><input type='checkbox' "+returnChecked(riskWarningData.rentingArrears)+" />线路租用中欠费</div>"+
							"<div class='tipsContent'><input type='checkbox' "+returnChecked(riskWarningData.rentingNobill)+" />线路租用中，无账单</div>"+
							"<div class='tipsContent'><input type='checkBox' "+returnChecked(riskWarningData.rentingNewbill)+" />线路已止租，有新账单</div>"+
							"<div class='tipsContent'><input type='checkBox' "+returnChecked(riskWarningData.expireUnstopRenting)+" />合同已到期，存在未止租线路</div>"+
							"<div class='tipsContent'><input type='checkBox' "+returnChecked(riskWarningData.expireNewRenting)+" />合同已到期，存在新起租线路</div>"+
							"<div class='tipsContent'><input type='checkBox' "+returnChecked(riskWarningData.customerInfoDiff)+" />客户信息不一致</div>";
	}else{
		riskWarningDataTips = "暂无数据";
	};
	function returnChecked(data){
		if(data == 1){
			return "checked='checked'";
		}else{
			return '';
		}
	}
};
var hoverIdList = ["businessLineRenting","businessStopRenting","ticketReceivables","riskWarning"];
$("#incomeFlowChart").on('mouseenter',"circle",function(e){
    if($(this).data("status") == 2){
    	var id = $(this).attr("id");
    	if(hoverIdList.indexOf(id) != -1){
    		var topValue = $(this).offset().top + 24;
			var leftValue = $(this).offset().left - 36;
			var tipsHtml = "暂无数据";
    		if(id == "businessLineRenting"){
    			tipsHtml = rentingDataTips;
    		}else if(id == "businessStopRenting"){
    			tipsHtml = stopRentingDataTips;
    		}else if(id == "ticketReceivables"){
    			tipsHtml = invoiceRefundDataTips;
    		}else if(id == "riskWarning"){
    			tipsHtml = riskWarningDataTips;
    		};
	    	var html = '<div id="vtip"><img id="vtipArrow" src="/static/img/vtip_arrow.png" />' + tipsHtml + '</div>';
	        $('body').append(html);
	        $('div#vtip').css("top", topValue+"px").css("left", leftValue+"px").fadeIn("slow");
		}
    }
});
$("#incomeFlowChart").on('mouseout',"circle",function(e){
	if($("div#vtip")[0]){
		$("div#vtip").fadeOut("slow").remove();
	};
});
/**************************************地铁图配置********************************************/
