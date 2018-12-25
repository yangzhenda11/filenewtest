//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
$(function(){
	var defaultData =  {
        "resourceProject": "3",
        "resourceAign": "3",
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
   	initExpenseFlowCharts(defaultData);
})

/**************************************获取合同基本信息********************************************/
function getContractBaseData(){
	var defaultData =  {
        "resourceProject": "1",
        "resourceAign": "1",
        "resourcePurchase": "1",
        "registerActivate": "1",
        "businessOrderRelease": "2",
        "businessOrderArrival": "1",
        "businessOrderReceive": "2",
        "supplierOrderConfirm": "1",
        "supplierOrderDeliver": "1",
        "supplierTicket": "1",
        "invicePaymentVerification": "2",
        "invicePaymentPayment": "2",
        "riskWarning": "2",
        "contractCloseConclude": "3"
   	};
	initExpenseFlowCharts(defaultData);
	
	
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
		function improperCallback(result){
			var ms = result.message;
			layer.alert(ms,{icon:2});
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
//	var url = serverPath + "";
	var orderChart = echarts.init(document.getElementById('orderChart'));
//	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
//	function successCallback(result) {
//		var data = result.data;
		var getPaymentNum = 121;			//累计接收金额
		var remainsPaymentNum  = 223;		//剩余未接收金额
		var getPaymentPercent = 0.3517;		//累计接收金额百分比
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
//	var url = serverPath + "";
	var invoiceChart = echarts.init(document.getElementById('invoiceChart'));
//	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
//	function successCallback(result) {
//		var data = result.data;
		var getPaymentNum = 0;			//累计开票金额
		var remainsPaymentNum  = 0;		//剩余未开票金额
		var getPaymentPercent = 0;		//累计开票金额百分比
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
//	var url = serverPath + "";
	var paymentChart = echarts.init(document.getElementById('paymentChart'));
//	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
//	function successCallback(result) {
//		var data = result.data;
		var getPaymentNum = 3220;			//累计含税付款金额
		var remainsPaymentNum  = 1220;		//剩余含税未付款金额
		var getPaymentPercent = 0.7252;		//累计含税付款金额百分比
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



/**************************************地铁图配置********************************************/
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
}
$("#expenseFlowChart").on('mouseenter',"circle",function(e){
	console.log(e)
    if($(this).data("status") == 2){
    	var addHtml = "<input type='checkbox' disabled='disabled' ><span style='color:#000'>测试</span>"
    	var html = '<div id="vtip"><img id="vtipArrow" src="/static/img/vtip_arrow.png" />' + addHtml + '</div>';
    	this.top = (e.pageY + 20); this.left = (e.pageX - 0);
        $('body').append(html);
        $('div#vtip').css("top", this.top+"px").css("left", this.left+"px").fadeIn("slow");
    }
 });
$("#expenseFlowChart").on('mouseout',"circle",function(e){
   $("div#vtip").fadeOut("slow").remove();
});
//
//this.vtip = function() {    
//  this.xOffset = -10; // x distance from mouse
//  this.yOffset = 10; // y distance from mouse       
//  
//  $(".vtip").unbind().hover(    
//      function(e) {
//          this.t = this.title;
//          this.title = ''; 
//          
//          
//      },
//      function() {
//          this.title = this.t;
//          //$("div#vtip").fadeOut("slow").remove();
//      }
//  ).mousemove(
//      function(e) {
//          this.top = (e.pageY + yOffset);
//          this.left = (e.pageX + xOffset);
//                       
//          $("div#vtip").css("top", this.top+"px").css("left", this.left+"px");
//      }
//  );            
//  
//};


/**************************************地铁图配置********************************************/