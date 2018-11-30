//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//全局数据
var pageData = {
	isPaymentCharts: false,
	fixedData: null,
	notFixedData: null
}
/*
 * 标题切换
 */
$("#buttonNavTabs").on("click","button",function(){
	$(this).addClass("check").siblings("button").removeClass("check");
})
$('button[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	if($(e.target).data("id") == "payment"){
		if(!pageData.isPaymentCharts){
			initPaymentFiexdCharts();
			initPaymentNotFiexdCharts();
			pageData.isPaymentCharts = true;
		}
	};
})
$(function(){
	//获取固定金额合同图表数据
	getChartsFixedData();
	//获取框架协议合同图表数据
	getChartsNotFixedData();
})
/*
 * 获取固定金额合同图表数据
 */
function getChartsFixedData(){
	var url = serverPath + "paymentManage/getPaymentManageIsFixedSum";
	App.formAjaxJson(url, "post", null, successCallback, improperCallbacks);
	function successCallback(result) {
		if(result.data){
			pageData.fixedData = result.data;
		};
		initInvoiceFiexdCharts();
	}
	function improperCallbacks(result){
		layer.msg(result.message);
		initInvoiceFiexdCharts();
	}
}
/*
 * 获取框架协议合同图表数据
 */
function getChartsNotFixedData(){
	var url = serverPath + "paymentManage/getPaymentManageNoFixedSum";
	App.formAjaxJson(url, "post", null, successCallback, improperCallbacks);
	function successCallback(result) {
		if(result.data){
			pageData.notFixedData = result.data;
		};
		initInvoiceNotFiexdCharts();
	}
	function improperCallbacks(result){
		layer.msg(result.message);
		initInvoiceNotFiexdCharts();
	}
}
/*
 * 发票管理表格初始化
 */
function initInvoiceTable(type){
	var isInitIncomeTable = $.fn.dataTable.isDataTable("#incomeTable");
	if(!isInitIncomeTable){
		$("#incomeTable").html("");
	};
	if(type == "fixed"){
		var totalData = pageData.fixedData;
		var url = serverPath + "paymentManage/listPaymentManageIsFixed";
	}else{
		var totalData = pageData.notFixedData;
		var url = serverPath + "paymentManage/listPaymentManageNoFixed";
	};
	var contractValueNovatSum = totalData.contractValueNovatSum ? App.unctionToThousands(totalData.contractValueNovatSum) : 0;
	var poAmountSumSum = totalData.poAmountSumSum ? App.unctionToThousands(totalData.poAmountSumSum) : 0;
	var invoiceNnovateSumSum = totalData.invoiceNnovateSumSum ? App.unctionToThousands(totalData.invoiceNnovateSumSum) : 0;
	$("#contractValueNovatSum").text(contractValueNovatSum+"元");
	$("#poAmountSumSum").text(poAmountSumSum+"元");
	$("#invoiceNnovateSumSum").text(invoiceNnovateSumSum+"元");
	App.initDataTables('#incomeTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": url,
	        "data": function(d) {
	        	d.performerStaffId = config.curStaffId;
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#incomeTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractNumber","title":"合同编号","className": "whiteSpaceNormal","width": "10%"},
			{"data": "contractName","title":"合同名称","className": "whiteSpaceNormal","width": "20%"},
			{"data": "partyName","title":"合作方名称","className": "whiteSpaceNormal","width": "10%"},
			{"data": "partyCode","title":"合作方编号","className": "whiteSpaceNormal","width": "10%"},
			{"data": "isFixed","title":"是否固定金额合同","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return data == 1 ? "是" : "否";
				}
			},
			{"data": "contractValueNovat","title":"不含增值税合同金额","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "poAmountSum","title":"累计订单不含税金额","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "invoiceNnovateSum","title":"累计不含税开票金额","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": null,"title":"发票明细","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpInviceDetail(\""+data.contractNumber+"\",\""+data.invoiceNnovateSum+"\")'>查看</a>";
				}
			}
		]
	});
}
/*
 * 付款管理表格初始化
 */
function initPaymentTable(type){
	var isInitPaymentTable = $.fn.dataTable.isDataTable("#paymentTable");
	if(!isInitPaymentTable){
		$("#paymentTable").html("");
	};
	if(type == "fixed"){
		var totalData = pageData.fixedData;
		var url = serverPath + "paymentManage/listPaymentManageIsFixed";
	}else{
		var totalData = pageData.notFixedData;
		var url = serverPath + "paymentManage/listPaymentManageNoFixed";
	};
	var payVateAmountSumSum = totalData.payVateAmountSumSum ? App.unctionToThousands(totalData.payVateAmountSumSum) : 0;
	var contractValueSum = totalData.contractValueSum ? App.unctionToThousands(totalData.contractValueSum) : 0;
	var invoiceSumSum = totalData.invoiceSumSum ? App.unctionToThousands(totalData.invoiceSumSum) : 0;
	$("#payVateAmountSumSum").text(payVateAmountSumSum+"元");
	$("#contractValueSum").text(contractValueSum+"元");
	$("#invoiceSumSum").text(invoiceSumSum+"元");
	App.initDataTables('#paymentTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": url,
	        "data": function(d) {
	        	d.performerStaffId = config.curStaffId;
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#paymentTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractNumber","title":"合同编号","className": "whiteSpaceNormal","width": "10%"},
			{"data": "contractName","title":"合同名称","className": "whiteSpaceNormal","width": "20%"},
			{"data": "partyName","title":"合作方名称","className": "whiteSpaceNormal","width": "10%"},
			{"data": "partyCode","title":"合作方编号","className": "whiteSpaceNormal","width": "10%"},
			{"data": "isFixed","title":"是否固定金额合同","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return data == 1 ? "是" : "否";
				}
			},
			{"data": "contractValue","title":"含增值税合同金额","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "invoiceSum","title":"累计含税开票金额","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "payVateAmountSum","title":"累计含税付款金额","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": null,"title":"付款明细","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpPaymentDetail(\""+data.contractNumber+"\",\""+data.payVateAmountSum+"\")'>查看</a>";
				}
			}
		]
	});
}
/*
 * 跳转发票明细
 */
function jumpInviceDetail(contractNumber,invoiceNnovateSum){
	var url = "/html/expenseWorktable/paymentManage/invoiceDetail.html?contractNumber="+contractNumber+"&invoiceNnovateSum="+invoiceNnovateSum;
	top.showSubpageTab(url,"发票明细");
}
/*
 * 跳转付款明细
 */
function jumpPaymentDetail(contractNumber,payVateAmountSum){
	var url = "/html/expenseWorktable/paymentManage/paymentDetail.html?contractNumber="+contractNumber+"&payVateAmountSum="+payVateAmountSum;
	top.showSubpageTab(url,"付款明细");
}
//发票管理-固定金额合同累计开票金额情况（图表）
function initInvoiceFiexdCharts(){
	var data = pageData.fixedData;
	var invoiceChartsFixedOption;
	var invoiceChartsFixedDom = echarts.init(document.getElementById('invoiceChartsFixed'));
	var invoiceChartsFixedData = [
		{value: 0,name: '累计开票金额：0元',canSelect: false},
		{value: 1,name: '剩余未开票金额：0元',canSelect: false}
	];
	if(data){
		var invoiceNnovateSumSum = data.invoiceNnovateSumSum ? data.invoiceNnovateSumSum : 0;
		var noInvoiceNnovateSum = data.noInvoiceNnovateSum ? data.noInvoiceNnovateSum : 0;
		var noInvoiceNnovatePercent = data.noInvoiceNnovatePercent ? data.noInvoiceNnovatePercent : 0;
		if(invoiceNnovateSumSum || noInvoiceNnovateSum){
			invoiceChartsFixedData = [
				{
					value: invoiceNnovateSumSum,
					name: "累计开票金额："+App.unctionToThousands(invoiceNnovateSumSum)+"元",
					canSelect: true
				},
				{
					value: noInvoiceNnovateSum,
					name: "剩余未开票金额："+App.unctionToThousands(noInvoiceNnovateSum)+"元",
					canSelect: true
				}
			];
			invoiceChartsFixedOption = initCharts("固定金额合同累计开票金额情况",invoiceChartsFixedData);
			$("#invoiceChartsFixedValue").text(parseFloat((noInvoiceNnovatePercent*100).toPrecision(12)) + "%")
			$("#invoiceChartsFixedRemark").text("*以上统计数据截至"+returnForamtData(data.resultData));
		}else{
			invoiceChartsFixedOption = initCharts("固定金额合同累计开票金额情况",invoiceChartsFixedData,true);
			$("#invoiceChartsFixedValue").text("0%")
			$("#invoiceChartsFixedRemark").text("*该图表暂未汇总到数据");
		}
	}else{
		invoiceChartsFixedOption = initCharts("固定金额合同累计开票金额情况",invoiceChartsFixedData,true);
		$("#invoiceChartsFixedValue").text("0%")
		$("#invoiceChartsFixedRemark").text("*该图表暂未汇总到数据");
	};
	invoiceChartsFixedDom.setOption(invoiceChartsFixedOption);
	invoiceChartsFixedDom.on('click', function (params) {
		if(params.data.canSelect){
			initInvoiceTable("fixed");
		}
	})
}
//发票管理-框架协议累计开票金额情况（图表）
function initInvoiceNotFiexdCharts(){
	var data = pageData.notFixedData;
	var invoiceChartsNotFixedOption;
	var invoiceChartsNotFixedDom = echarts.init(document.getElementById('invoiceChartsNotFixed'));
	var invoiceChartsNotFixedData = [
		{value: 0,name: '累计开票金额：0元',canSelect: false},
		{value: 1,name: '剩余未开票金额：0元',canSelect: false}
	];
	if(data){
		var invoiceNnovateSumSum = data.invoiceNnovateSumSum ? data.invoiceNnovateSumSum : 0;
		var noInvoiceNnovateSum = data.noInvoiceNnovateSum ? data.noInvoiceNnovateSum : 0;
		var noInvoiceNnovatePercent = data.noInvoiceNnovatePercent ? data.noInvoiceNnovatePercent : 0;
		if(invoiceNnovateSumSum || noInvoiceNnovateSum){
			invoiceChartsNotFixedData = [
				{
					value: invoiceNnovateSumSum,
					name: "累计开票金额："+App.unctionToThousands(invoiceNnovateSumSum)+"元",
					canSelect: true
				},
				{
					value: noInvoiceNnovateSum,
					name: "剩余未开票金额："+App.unctionToThousands(noInvoiceNnovateSum)+"元",
					canSelect: true
				}
			];
			invoiceChartsNotFixedOption = initCharts("框架协议累计开票金额情况",invoiceChartsNotFixedData);
			$("#invoiceChartsNotFixedValue").text(parseFloat((noInvoiceNnovatePercent*100).toPrecision(12)) + "%")
			$("#invoiceChartsNotFixedRemark").text("*以上统计数据截至"+returnForamtData(data.resultData));
		}else{
			invoiceChartsNotFixedOption = initCharts("框架协议累计开票金额情况",invoiceChartsNotFixedData,true);
			$("#invoiceChartsNotFixedValue").text("0%")
			$("#invoiceChartsNotFixedRemark").text("*该图表暂未汇总到数据");
		}
	}else{
		invoiceChartsNotFixedOption = initCharts("框架协议累计开票金额情况",invoiceChartsNotFixedData,true);
		$("#invoiceChartsNotFixedValue").text("0%")
		$("#invoiceChartsNotFixedRemark").text("*该图表暂未汇总到数据");
	};
	invoiceChartsNotFixedDom.setOption(invoiceChartsNotFixedOption);
	invoiceChartsNotFixedDom.on('click', function (params) {
	    if(params.data.canSelect){
			initInvoiceTable("notFixed");
		}
	})
}
//付款管理-固定金额合同累计含税付款金额情况（图表）
function initPaymentFiexdCharts(){
	var data = pageData.fixedData;
	var paymentChartsFixedOption;
	var paymentChartsFixedDom = echarts.init(document.getElementById('paymentChartsFixed'));
	var paymentChartsFixedData = [
		{value: 0,name: '累计含税付款金额：0元',canSelect: false},
		{value: 1,name: '剩余含税未付款金额：0元',canSelect: false}
	];
	if(data){
		var payVateAmountSumSum = data.payVateAmountSumSum ? data.payVateAmountSumSum : 0;
		var noPayVateAmountSum = data.noPayVateAmountSum ? data.noPayVateAmountSum : 0;
		var noPayVateAmountPercent = data.noPayVateAmountPercent ? data.noPayVateAmountPercent : 0;
		if(payVateAmountSumSum || noPayVateAmountSum){
			paymentChartsFixedData = [
				{
					value: payVateAmountSumSum,
					name: "累计含税付款金额："+App.unctionToThousands(payVateAmountSumSum)+"元",
					canSelect: true
				},
				{
					value: noPayVateAmountSum,
					name: "剩余含税未付款金额："+App.unctionToThousands(noPayVateAmountSum)+"元",
					canSelect: true
				}
			];
			paymentChartsFixedOption = initCharts("固定金额合同累计含税付款金额情况",paymentChartsFixedData);
			$("#paymentChartsFixedValue").text(parseFloat((noPayVateAmountPercent*100).toPrecision(12)) + "%")
			$("#paymentChartsFixedRemark").text("*以上统计数据截至"+returnForamtData(data.resultData));
		}else{
			paymentChartsFixedOption = initCharts("固定金额合同累计含税付款金额情况",paymentChartsFixedData,true);
			$("#paymentChartsFixedValue").text("0%")
			$("#paymentChartsFixedRemark").text("*该图表暂未汇总到数据");
		}
	}else{
		paymentChartsFixedOption = initCharts("固定金额合同累计含税付款金额情况",paymentChartsFixedData,true);
		$("#paymentChartsFixedValue").text("0%")
		$("#paymentChartsFixedRemark").text("*该图表暂未汇总到数据");
	};
	paymentChartsFixedDom.setOption(paymentChartsFixedOption);
	paymentChartsFixedDom.on('click', function (params) {
		if(params.data.canSelect){
			initPaymentTable("fixed");
		}
	})
}
//付款管理-框架协议累计含税付款金额情况（图表）
function initPaymentNotFiexdCharts(){
	var data = pageData.notFixedData;
	var paymentChartsNotFixedOption;
	var paymentChartsNotFixedDom = echarts.init(document.getElementById('paymentChartsNotFixed'));
	var paymentChartsNotFixedData = [
		{value: 0,name: '累计含税付款金额：0元',canSelect: false},
		{value: 1,name: '剩余含税未付款金额：0元',canSelect: false}
	];
	if(data){
		var payVateAmountSumSum = data.payVateAmountSumSum ? data.payVateAmountSumSum : 0;
		var noPayVateAmountSum = data.noPayVateAmountSum ? data.noPayVateAmountSum : 0;
		var noPayVateAmountPercent = data.noPayVateAmountPercent ? data.noPayVateAmountPercent : 0;
		if(payVateAmountSumSum || noPayVateAmountSum){
			paymentChartsNotFixedData = [
				{
					value: payVateAmountSumSum,
					name: "累计含税付款金额："+App.unctionToThousands(payVateAmountSumSum)+"元",
					canSelect: true
				},
				{
					value: noPayVateAmountSum,
					name: "剩余含税未付款金额："+App.unctionToThousands(noPayVateAmountSum)+"元",
					canSelect: true
				}
			];
			paymentChartsNotFixedOption = initCharts("框架协议累计含税付款金额情况",paymentChartsNotFixedData);
			$("#paymentChartsNotFixedValue").text(parseFloat((noPayVateAmountPercent*100).toPrecision(12)) + "%")
			$("#paymentChartsNotFixedRemark").text("*以上统计数据截至"+returnForamtData(data.resultData));
		}else{
			paymentChartsNotFixedOption = initCharts("框架协议累计含税付款金额情况",paymentChartsNotFixedData,true);
			$("#paymentChartsNotFixedValue").text("0%")
			$("#paymentChartsNotFixedRemark").text("*该图表暂未汇总到数据");
		}
	}else{
		paymentChartsNotFixedOption = initCharts("框架协议累计含税付款金额情况",paymentChartsNotFixedData,true);
		$("#paymentChartsNotFixedValue").text("0%")
		$("#paymentChartsNotFixedRemark").text("*该图表暂未汇总到数据");
	};
	paymentChartsNotFixedDom.setOption(paymentChartsNotFixedOption);
	paymentChartsNotFixedDom.on('click', function (params) {
		if(params.data.canSelect){
			initPaymentTable("notFixed");
		}
	})
}
/*
 * 生成圆环配置项
 */
function initCharts(title,data,isEmpty){
	var minAngleValue = 6;
	$.each(data, function(k,v) {
		if(v.value == 0){
			minAngleValue = 0;
		}
	});
	var formatter = "{a} <br/>{b} ({d}%)";
	if(isEmpty){
		formatter = title;
		for(var i = 0; i < data.length; i++){
			formatter += "<br />" + data[i].name;
		}
	};
	var option = {
		title: {
			text: title,
			x:'center',
	        itemGap: 6,
	        top: 20,
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
                borderWidth: 2,
                borderColor: '#ffffff'
	        },
			data: data
		}]
	};
	return option;
};
/*
 * 返回年月日
 */
function returnForamtData(data){
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
