//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
/**************************************获取合同基本信息********************************************/
function getContractBaseData(){
	debugger;
	var contractNumber = $("#searchContractNumber").val().trim();
	if(contractNumber){
		var url = serverPath + "tPContractSubwayPay/listByContractNumber";
		var postData = {
				contractNumber: contractNumber
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			var data = result.data;
 			if(data.contractNumber){ 
 				$("#contractNameSel").val(data.contractName);
				$("#contractNumberSel").val(data.contractNumber); 
				$("#partnerName").val(data.partnerName); 
				$("#partnerCode").val(data.partnerCode); 
				$("#isFixed").val(data.isFixed); 
				//下面在这个radio按钮不会赋值，振达兄改的时候，帮忙看一下，thank you~~~
				if("1"==data.isFixed){
					$("#contractValue").val(data.contractValue); 
				}
				if("2"==data.isFixed){
					$("#contractValue").hide();
				}
			}else{
				layer.alert("暂无数据",{icon:2});
			}
		}
	
		
	}else{
		layer.alert("请输入合同编号。",{icon:2});
	}
}

/**************************************获取合同基本信息********************************************/



/**************************************获取图表数据生成图表********************************************/
createOrderChart();
//生成订单接收图表
function createOrderChart(){
	var contractNumber = $("#searchContractNumber").val();
	var url = serverPath + "analysisPayController/orderChartOption?contractNumber="+contractNumber;
	var orderChart = echarts.init(document.getElementById('orderChart'));
	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
	function successCallback(result) {
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
			$("#orderChartValue").text(parseFloat(getPaymentPercent*100) + "%")
		}else{
			$("#orderChartValue").text("0%");
			var orderChartOption = circleChartsOption("订单接收","订单累计接收金额情况",[{value: 0,name: '累计接收金额：0元'},{value: 1,name: '剩余未接收金额：0元'}],true);
		};
		orderChart.setOption(orderChartOption);
//	}
	function improperCallback(result){
		layer.msg(result.message);
		$("#orderChartValue").text("0%");
		var orderChartOption = circleChartsOption("订单接收","订单累计接收金额情况",[{value: 0,name: '累计接收金额：0元'},{value: 1,name: '剩余未接收金额：0元'}],true);
		orderChart.setOption(orderChartOption);
	}
}
createInvoiceChart();
//生成合同发票图表
function createInvoiceChart(){
	var contractNumber = $("#searchContractNumber").val();
	var isFixed = $('input[isFixed="sex"]:checked').val(); 
	if(isFixed==1){
		var url = serverPath + "analysisPayController/invoiceChartFixedAmountOption?contractNumber="+contractNumber;
	}else if(isFixed==2){
		var url = serverPath +"analysisPayController/orderChartFrameworkOption?contractNumber="+contractNumber;
	}
	

	var invoiceChart = echarts.init(document.getElementById('invoiceChart'));
	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		var getPaymentNum = data.getPaymentNum;			//累计开票金额
		var remainsPaymentNum  = data.remainsPaymentNum;		//剩余未开票金额
		var getPaymentPercent = data.getPaymentPercent;		//累计开票金额百分比
		if(getPaymentNum || remainsPaymentNum){
			var invoiceChartOption = circleChartsOption('合同发票',"累计开票金额情况", [{
				value: getPaymentNum,
				name: '累计开票金额：'+getPaymentNum+'元'
			}, {
				value: remainsPaymentNum,
				name: '剩余未开票金额：'+remainsPaymentNum+'元'
			}]);
			$("#invoiceChartValue").text(parseFloat(getPaymentPercent*100) + "%")
		}else{
			$("#invoiceChartValue").text("0%");
			var invoiceChartOption = circleChartsOption("合同发票","累计开票金额情况",[{value: 0,name: '累计开票金额：0元'},{value: 1,name: '剩余未开票金额：0元'}],true);
		};
		invoiceChart.setOption(invoiceChartOption);
//	}
	function improperCallback(result){
		layer.msg(result.message);
		$("#invoiceChartValue").text("0%");
		var invoiceChartOption = circleChartsOption("合同发票","累计开票金额情况",[{value: 0,name: '累计开票金额：0元'},{value: 1,name: '剩余未开票金额：0元'}],true);
		invoiceChart.setOption(invoiceChartOption);
	}
}
createPaymentChart();
//生成合同付款图表
function createPaymentChart(){
	var contractNumber = $("#searchContractNumber").val();
	var isFixed = $('input[isFixed="sex"]:checked').val(); 
	if(isFixed==1){
		var url = serverPath + "analysisPayController/paymentChartFixedAmountOption?contractNumber="+contractNumber;
	}else if(isFixed==2){
		var url = serverPath +"analysisPayController/paymentChartFrameworkOption?contractNumber="+contractNumber;
	}
	var paymentChart = echarts.init(document.getElementById('paymentChart'));
	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		var getPaymentNum = data.getPaymentNum;			//累计含税付款金额
		var remainsPaymentNum  = data.remainsPaymentNum;		//剩余含税未付款金额
		var getPaymentPercent = data.getPaymentPercent;		//累计含税付款金额百分比
		if(getPaymentNum || remainsPaymentNum){
			var paymentChartOption = circleChartsOption('合同付款',"累计含税付款金额情况", [{
				value: getPaymentNum,
				name: '累计含税付款金额：'+getPaymentNum+'元'
			}, {
				value: remainsPaymentNum,
				name: '剩余含税未付款金额：'+remainsPaymentNum+'元'
			}]);
			$("#paymentChartValue").text(parseFloat(getPaymentPercent*100) + "%")
		}else{
			$("#paymentChartValue").text("0%");
			var paymentChartOption = circleChartsOption("合同付款","累计含税付款金额情况",[{value: 0,name: '累计含税付款金额：0元'},{value: 1,name: '剩余含税未付款金额：0元'}],true);
		};
		paymentChart.setOption(paymentChartOption);
//	}
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


$(function(){
	/**************************************地铁图配置********************************************/
	var tw = $('#expenseFlowChart').width();
	var th = $('#expenseFlowChart').height();
	var flowData = initExpenseFlowCharts();
	$('#expenseFlowChart').D3Charts({
		width:tw,
		height:th,
		areaData: flowData.areaData,
		lineData: flowData.lineData,
		polyline: flowData.polyline,
		triangle: flowData.triangle
	})
	$("circle").hover(function(){
		if($(this).data("id") == "kehu"){
			var html = "<input type='checkbox' disabled='disabled' ><span style='color:#000'>测试</span>"
			layer.tips(html, $(this), {
			  tips: [3, '#fff'],
			  time: 0
			});
		}
	},function(){
		layer.closeAll('tips');
	})
	$(window).resize(function(){
		$('#expenseFlowChart').html('');
		var tw = $('#expenseFlowChart').width();
		var th = $('#expenseFlowChart').height();
		$('#expenseFlowChart').D3Charts({
			width:tw,
			height:th,
			areaData: flowData.areaData,
			lineData: flowData.lineData,
			polyline: flowData.polyline,
			triangle: flowData.triangle
		})
	})
	/**************************************地铁图配置********************************************/
})
