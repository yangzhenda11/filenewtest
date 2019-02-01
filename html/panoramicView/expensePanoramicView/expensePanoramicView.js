//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//初始化图表数据
var defaultData =  {
    "resourceProject": "3",
    "resourceSign": "3",
    "resourcePurchase": "3",
    "registerActivate": "3",
    "businessOrderRelease": "3",
    "businessOrderArrival": "3",
    "businessOrderReceive": "3",
    "supplierOrderConfirm": "3",
    "supplierOrderDeliver": "3",
    "supplierTicket": "3",
    "invicePaymentVerification": "3",
    "invicePaymentPayment": "3",
    "riskWarning": "3",
    "contractCloseConclude": "3"
};
$(function(){
   	initExpenseFlowCharts(defaultData);
})

/**************************************获取合同基本信息********************************************/
function getContractBaseData(){
	var contractNumber = $("#searchContractNumber").val().trim();
	if(contractNumber){
		var url = serverPath + "tPContractSubwayPay/listByContractNumber";
		var postData = {
			contractNumber: contractNumber
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback, improperCallback);
		function successCallback(result) {
			var data = result.data;
 			if(data.contractNumber){ 
 				$("#contractNameSel").val(data.contractName);
				$("#contractNumberSel").val(data.contractNumber); 
				$("#partnerName").val(data.partnerName); 
				$("#partnerCode").val(data.partnerCode); 
				if(data.isFixed == '1'){
					$("#contractValueDom").show();
					$("#contractValue").val(App.unctionToThousands(data.contractValue));
					$("input[name='isFixed'][value='1']").attr("checked","checked");
				}else if("2"==data.isFixed){
					$("#contractValueDom").hide();
					$("input[name='isFixed'][value='2']").attr("checked","checked");
				};
				$("#contractBaseData,#expenseCharts").show();
				createOrderChart(contractNumber);
				createInvoiceChart(contractNumber);
				createPaymentChart(contractNumber);
				getIncomeFlowChartsData(contractNumber);
			}else{
				$("#contractBaseData,#expenseCharts").hide();
				initExpenseFlowCharts(defaultData);
				layer.alert("您输入的合同编号有误，请重新输入。",{icon:2});
			}
		}
		function improperCallback(result){
			var ms = result.message;
			$("#contractBaseData,#expenseCharts").hide();
			initExpenseFlowCharts(defaultData);
			layer.alert(ms,{icon:2});
		}
	}else{
		$("#contractBaseData,#expenseCharts").hide();
		initExpenseFlowCharts(defaultData);
		layer.alert("请输入合同编号。",{icon:2});
	}
}

/**************************************获取合同基本信息********************************************/

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
	return resultData;
}

/**************************************获取图表数据生成图表********************************************/
//生成订单接收图表
function createOrderChart(contractNumber){
	var url = serverPath + "analysisPayController/orderChartOption";
	var postData = {
			contractNumber:contractNumber
		}
	var orderChart = echarts.init(document.getElementById('orderChart'));
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		console.log(result);
		var data = result.data;
	
		var getPaymentNum = data.getPaymentNum;			//累计接收金额
		var remainsPaymentNum  = data.remainsPaymentNum;		//剩余未接收金额
		var getPaymentPercent = data.getPaymentPercent;		//累计接收金额百分比
		if(getPaymentNum || remainsPaymentNum){
			var orderChartOption = circleChartsOption('订单接收',"订单累计接收金额情况", [{
				value: getPaymentNum,
				name: '累计接收金额：'+getPaymentNum+'元'
			}, {
				value: remainsPaymentNum,
				name: '剩余未接收金额：'+remainsPaymentNum+'元'
			}]);
			$("#orderChartValue").text(parseFloat(getPaymentPercent*100) + "%");
			$("#expenseOverviewNote").text(data.resultData)
		}else{
			$("#orderChartValue").text("0%");
			var orderChartOption = circleChartsOption("订单接收","订单累计接收金额情况",[{value: 0,name: '累计接收金额：0元'},{value: 1,name: '剩余未接收金额：0元'}],true);
		};
		orderChart.setOption(orderChartOption);
	}
	function improperCallback(result){
		layer.msg(result.message);
		$("#orderChartValue").text("0%");
		var orderChartOption = circleChartsOption("订单接收","订单累计接收金额情况",[{value: 0,name: '累计接收金额：0元'},{value: 1,name: '剩余未接收金额：0元'}],true);
		orderChart.setOption(orderChartOption);
	}
}
//生成合同发票图表
function createInvoiceChart(contractNumber){
	var isFixed = $('input[name="isFixed"]:checked').val(); 
	if(isFixed==1){
		var url = serverPath + "analysisPayController/FixedAmountOption";
	}else if(isFixed==2){
		var url = serverPath +"analysisPayController/FrameworkOption";
	}
	var postData = {
			contractNumber:contractNumber
		}

	var invoiceChart = echarts.init(document.getElementById('invoiceChart'));
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		var getPaymentNum = data.notTaxPaymentNum;			//累计开票金额
		var remainsPaymentNum  = data.notRemainsPaymentNum;		//剩余未开票金额
		var getPaymentPercent = data.noInvoiceNnovatePercent;		//累计开票金额百分比
		if(getPaymentNum || remainsPaymentNum){
			var invoiceChartOption = circleChartsOption('合同发票',"累计开票金额情况", [{
				value: getPaymentNum,
				name: '累计开票金额：'+getPaymentNum+'元'
			}, {
				value: remainsPaymentNum,
				name: '剩余未开票金额：'+remainsPaymentNum+'元'
			}]);
			$("#invoiceChartValue").text(parseFloat(getPaymentPercent*100) + "%");
			$("#expenseOverviewNote").text(data.resultData)
		}else{
			$("#invoiceChartValue").text("0%");
			var invoiceChartOption = circleChartsOption("合同发票","累计开票金额情况",[{value: 0,name: '累计开票金额：0元'},{value: 1,name: '剩余未开票金额：0元'}],true);
		};
		invoiceChart.setOption(invoiceChartOption);
	}
	function improperCallback(result){
		layer.msg(result.message);
		$("#invoiceChartValue").text("0%");
		var invoiceChartOption = circleChartsOption("合同发票","累计开票金额情况",[{value: 0,name: '累计开票金额：0元'},{value: 1,name: '剩余未开票金额：0元'}],true);
		invoiceChart.setOption(invoiceChartOption);
	}
}
//生成合同付款图表
function createPaymentChart(contractNumber){
	var isFixed = $('input[name="isFixed"]:checked').val(); 
	if(isFixed==1){
		var url = serverPath + "analysisPayController/FixedAmountOption";
	}else if(isFixed==2){
		var url = serverPath + "analysisPayController/FrameworkOption";
	}
	var postData = {
			contractNumber:contractNumber
		}
	var paymentChart = echarts.init(document.getElementById('paymentChart'));
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		var getPaymentNum = data.taxPaymentNum;			//累计含税付款金额
		var remainsPaymentNum  = data.noPayVateAmountSum;		//剩余含税未付款金额
		var getPaymentPercent = data.noPayVateAmountPercent;		//累计含税付款金额百分比
		alert(data.resultData);
		if(getPaymentNum || remainsPaymentNum){
			var paymentChartOption = circleChartsOption('合同付款',"累计含税付款金额情况", [{
				value: getPaymentNum,
				name: '累计含税付款金额：'+getPaymentNum+'元'
			}, {
				value: remainsPaymentNum,
				name: '剩余含税未付款金额：'+remainsPaymentNum+'元'
			}]);
			$("#paymentChartValue").text(parseFloat(getPaymentPercent*100) + "%");
			$("#expenseOverviewNote").text(data.resultData)
		}else{
			$("#paymentChartValue").text("0%");
			var paymentChartOption = circleChartsOption("合同付款","累计含税付款金额情况",[{value: 0,name: '累计含税付款金额：0元'},{value: 1,name: '剩余含税未付款金额：0元'}],true);
		};
		paymentChart.setOption(paymentChartOption);
	}
	function improperCallback(result){
		layer.msg(result.message);
		$("#paymentChartValue").text("0%");
		var paymentChartOption = circleChartsOption("合同付款","累计含税付款金额情况",[{value: 0,name: '累计含税付款金额：0元'},{value: 1,name: '剩余含税未付款金额：0元'}],true);
		paymentChart.setOption(paymentChartOption);
	}
}
/**************************************获取图表数据生成图表********************************************/



/************************************************图表生成配置项*******************************************************/
/*
 * 生成圆环配置项
 */
function circleChartsOption(title,subtext,data,isEmpty){
	var minAngleValue = 6;
	var borderWidth = 2;
	$.each(data, function(k,v) {
		if(v.value == 0){
			minAngleValue = 0;
			borderWidth = 0;
		}
	});
	var formatter = "{a}<br/>{b} ({d}%)";
	if(isEmpty){
		formatter = title;
		for(var i = 0; i < data.length; i++){
			formatter += "<br />" + data[i].name;
		}
	};
	var option = {
		title: {
			text: title,
			subtext: subtext,
			x:'center',
			top:'10',
	        itemGap: 6,
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
	var url = serverPath + "tPContractSubwayPay/listSubwayInfo";
	var postData = {
		contractNumber: contractNumber
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		initExpenseFlowCharts(data.contractSubwayPay);
		initExpenseFlowChartsTips(data);
	}
}
function initExpenseFlowCharts(data){
	$('#expenseFlowChart').html('');
	var tw = $('#expenseFlowChart').width();
	var th = $('#expenseFlowChart').height();
	var baseData = initD3Charts(data);
	$('#expenseFlowChart').D3Charts({
		width:tw,
		height:th,
		baseData: baseData
	})
	
	$(window).resize(function(){
		$('#expenseFlowChart').html('');
		var tw = $('#expenseFlowChart').width();
		var th = $('#expenseFlowChart').height();
		$('#expenseFlowChart').D3Charts({
			width:tw,
			height:th,
			baseData: baseData
		})
	})
};
var orderIssuedDataTips = '',orderReceivingWarehousingDataTips = '',InvoiceVerificationDataTips = '',paymentDataTips = '',riskWarningDataTips = '';
function initExpenseFlowChartsTips(data){
	var orderIssuedData = data.orderIssuedData;
	var orderReceivingWarehousingData = data.orderReceivingWarehousingData;
	var InvoiceVerificationData = data.InvoiceVerificationData;
	var paymentData = data.paymentData;
	var riskWarningData = data.riskWarningData;
	if(orderIssuedData){
		orderIssuedDataTips = "<table><tr><td>累计下单数量</td>"+
							"<td>"+orderIssuedData.totalOrderNum+" 条</td></tr>"+
							"<tr><td>累计下单金额</td>"+
							"<td>"+App.unctionToThousands(orderIssuedData.totalOrderAmount)+" 元</td></tr></table>";
	}else{
		orderIssuedDataTips = "暂无数据";
	};
	if(orderReceivingWarehousingData){
		orderReceivingWarehousingDataTips = "<table><tr><td>累计接收金额</td>"+
							"<td>"+App.unctionToThousands(orderReceivingWarehousingData.totalReceiveAmount)+" 元</td></tr>"+
							"<tr><td>累计接收百分比</td>"+
							"<td>"+orderReceivingWarehousingData.totalReceiveProportion+"%</td></tr></table>";
	}else{
		orderReceivingWarehousingDataTips = "暂无数据";
	};
	if(InvoiceVerificationData){
		InvoiceVerificationDataTips = "<table><tr><td>累计发票数量</td>"+
							"<td>"+InvoiceVerificationData.totalInvoiceNum+" 张</td></tr>"+
							"<tr><td>累计开票金额</td>"+
							"<td>"+App.unctionToThousands(InvoiceVerificationData.totalTicketAmount)+" 元</td></tr>"+
							"<tr><td>累计开票百分比</td>"+
							"<td>"+InvoiceVerificationData.totalTicketProportion+"%</td></tr></table>";
	}else{
		InvoiceVerificationDataTips = "暂无数据";
	};
	if(paymentData){
		paymentDataTips = "<table><tr><td>累计含税付款金额</td>"+
							"<td>"+App.unctionToThousands(paymentData.totalIntaxPayment)+" 元</td></tr>"+
							"<tr><td>累计付款百分比</td>"+
							"<td>"+paymentData.totalPaymentProportion+"%</td></tr></table>";
	}else{
		paymentDataTips = "暂无数据";
	};
	if(riskWarningData){
		riskWarningDataTips = "<div class='tipsTopCon'>本合同存在以下类型风险：</div>"+
							"<div class='tipsContent'><input type='checkbox' "+returnChecked(riskWarningData.expireUnconclude)+" />该合同已到期未办结</div>"+
							"<div class='tipsContent'><input type='checkbox' "+returnChecked(riskWarningData.aboutExpireZeroThirty)+" />该合同即将到期0-30天</div>";
//							"<div class='tipsContent'><input type='checkBox' "+returnChecked(riskWarningData.aboutExpireThirtySixty)+" />该合同即将到期30-60</div>";
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
var hoverIdList = ["businessOrderRelease","businessOrderReceive","invicePaymentVerification","invicePaymentPayment","riskWarning"];
$("#expenseFlowChart").on('mouseenter',"circle",function(e){
    if($(this).data("status") == 2){
    	var id = $(this).attr("id");
    	if(hoverIdList.indexOf(id) != -1){
    		var topValue = $(this).offset().top + 24;
			var leftValue = $(this).offset().left - 36;
			var tipsHtml = "暂无数据";
    		if(id == "businessOrderRelease"){
    			tipsHtml = orderIssuedDataTips;
    		}else if(id == "businessOrderReceive"){
    			tipsHtml = orderReceivingWarehousingDataTips;
    		}else if(id == "invicePaymentVerification"){
    			tipsHtml = InvoiceVerificationDataTips;
    		}else if(id == "invicePaymentPayment"){
    			tipsHtml = paymentDataTips;
    		}else if(id == "riskWarning"){
    			tipsHtml = riskWarningDataTips;
    		};
	    	var html = '<div id="vtip"><img id="vtipArrow" src="/static/img/vtip_arrow.png" />' + tipsHtml + '</div>';
	        $('body').append(html);
	        $('div#vtip').css("top", topValue+"px").css("left", leftValue+"px").fadeIn("slow");
		}
    }
});
$("#expenseFlowChart").on('mouseout',"circle",function(e){
	if($("div#vtip")[0]){
		$("div#vtip").fadeOut("slow").remove();
	};
});
/**************************************地铁图配置********************************************/