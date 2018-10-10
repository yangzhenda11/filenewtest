//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 标题切换
 */
$("#buttonNavTabs").on("click","button",function(){
	$(this).addClass("check").siblings("button").removeClass("check");
})
$(function(){
	getInvoiceChartsFixedData();
	getInvoiceChartsNotFixedData();
})
/*
 * 获取发票管理固定金额合同图表数据
 */
function getInvoiceChartsFixedData(){
	var url = serverPath + "paymentManage/getPaymentManageIsFixedSum";
	App.formAjaxJson(url, "post", null, successCallback);
	function successCallback(result) {
		var data = result.data;
		console.log(result);
	}
}
/*
 * 获取发票管理框架协议合同图表数据
 */
function getInvoiceChartsNotFixedData(){
	var url = serverPath + "paymentManage/getPaymentManageNoFixedSum";
	App.formAjaxJson(url, "post", null, successCallback);
	function successCallback(result) {
		var data = result.data;
		console.log(result);
	}
}

//我的付款总览图表生成
var expentType1Data = [
	{	
		value: 100000,
		name: '累计含税付款金额：100,000元'
	},
	{
		value: 30000,
		name: '剩余含税未付款金额：30,000元'
	}
];
var expentType2Data = [
	{	
		value: 0,
		name: '累计含税付款金额：0元'
	},
	{
		value: 1,
		name: '剩余含税未付款金额：0元'
	}
];
var expentType1 = echarts.init(document.getElementById('invoiceChartsFixed'));
var expentType1Option = initCharts("合同付款（固定金额合同）","固定金额合同累计付款金额情况",expentType1Data);
expentType1.setOption(expentType1Option);



var expentType2 = echarts.init(document.getElementById('invoiceChartsNotFixed'));
var expentType2Option = initCharts("合同付款（框架协议）","框架协议对应的订单累计付款金额情况",expentType2Data,true);
expentType2.setOption(expentType2Option);



function initCharts(title,subtext,data,isEmpty){
	var borderWidth = 2;
	var formatter = "{a} <br/>{b} ({d}%)";
	if(isEmpty){
		borderWidth = 0;
		formatter = title;
		for(var i = 0; i < data.length; i++){
			formatter += "<br />" + data[i].name;
		}
	}
	var option = {
		title: {
			text: title,
			subtext: subtext,
			x:'center',
	        itemGap: 6,
	        top: 10,
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
		color: ['#d11718', '#bfbfbf'],
		series: [{
			clockwise: false,
//			hoverAnimation: false,
			name: title,
			type: 'pie',
			radius: ['35%', '60%'],
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
