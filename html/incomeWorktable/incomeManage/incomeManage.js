//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//页面变量
var pageConfig = {
	isInitForecastCharts: false,
	incomeForecastData: null,
	accountPeriod: null
}
$(function(){
	initIncomeAnalysisCharts();
})
/*
 * 标题切换
 */
$("#buttonNavTabs").on("click","button",function(){
	$(this).addClass("check").siblings("button").removeClass("check");
})
$('button[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	if($(e.target).data("id") == "incomeForecast"){
		if(!pageConfig.isInitForecastCharts){
			initIncomeForecastCharts();
		}
	};
})
/*
 * 合同收入明细查看类型切换
 */
$("#incomeAnalysisRadio input[name='incomeType']").on("change",function(){
//	$(this).val()
})
/*
 * 生成收入分析图表
 */
function initIncomeAnalysisCharts(){
	var incomeAnalysis = echarts.init(document.getElementById('incomeAnalysisCharts'));
	var incomeAnalysisOption = {
		title : {
	        text: '2018年收入情况分析',
	        x:'center',
	        itemGap: 12,
	        textStyle: {
	        	fontSize:20
	        },
	        subtext: '合同收入：750,000元，风险收入：550,000元，收入总计：1,300,000元',
	        subtextStyle: {
	        	color: "#333",
	        	fontSize: 14,
	        	fontWeight: "bolder",
	        	lineHeight: 20,
	        	rich: {}
	        }
	   	},
	    legend: {
	    	orient: 'vertical',
	    	top: '40%',
	        right: '5',
	        itemWidth: 10,
	        itemHeight: 10,
	        selectedMode: false,
	        itemGap: 15
	    },
	    tooltip : {
	        trigger: 'axis',
	        confine:"true",
	        axisPointer : {
	            type : 'shadow'
	        },
	        textStyle:{
               	align:'left'
            },
            formatter:function (params, ticket, callback) {
            	var tooltipCon = params[0].name.split("\n\n")[1] + "</br>"
            	$.each(params, function(k,v) {
            		tooltipCon += v.stack + v.seriesName + "：" + v.value + "元</br>";
            	});
			    return tooltipCon;
			}
	    },
	    grid: {
	    	left: '10',
            right: '100',
            bottom: '5',
            top: '80',
            containLabel: true
        },
	    xAxis: {
	    	axisLine:{
	    		show:false
	    	},
	    	axisTick:{
	    		show:false
	    	},
	        data: ['风险收入 合同收入\n\n6月', '风险收入 合同收入\n\n7月', '风险收入 合同收入\n\n8月', '风险收入 合同收入\n\n9月', '风险收入 合同收入\n\n10月', '风险收入 合同收入\n\n11月', '风险收入 合同收入\n\n12月']
	    },
	    yAxis: {
	    	axisLine:{
	    		show:false
	    	},
	    	axisTick:{
	    		show:false
	    	}
	    },
	    series : [
	        {
	            name:'实收金额',
	            type:'bar',
	            stack: '合同收入',
	            data:[120, 132, 101, 134, 90, 230, 210]
	        },
	        {
	            name:'欠费金额',
	            type:'bar',
	            stack: '合同收入',
	            barGap: 0,
	            barMaxWidth: 50,
	            data:[220, 182, 191, 234, 290, 330, 310]
	        },
	        {
	            name:'实收金额',
	            type:'bar',
	            stack: '风险收入',
	            data:[620, 732, 701, 734, 1090, 1130, 1120]
	        },
	        {
	            name:'欠费金额',
	            type:'bar',
	            stack: '风险收入',
	            barGap: 0,
	            barMaxWidth: 50,
	            data:[62, 82, 91, 84, 109, 110, 120]
	        }
	    ],
	    color:['#4472c4', '#ff0000','#4472c4','#ff0000']
	};
	incomeAnalysis.setOption(incomeAnalysisOption);
	incomeAnalysis.on('click', function (params) {
    	console.log(params);
    	if($("#incomeAnalysisValue").css("display") == "none"){
    		$("#incomeAnalysisValue").show();
    	};
	});
}


/*
 * 生成收入预测图表
 */
function initIncomeForecastCharts(){
	
	var url = serverPath + "incomeForecast/getIncomeForecastChartData";
	App.formAjaxJson(url, "post", null, successCallback, improperCallbacks);
	function successCallback(result) {
		if(result.data){
			pageConfig.incomeForecastData = result.data;
		};
		initForecastCharts();
	}
	function improperCallbacks(result){
		layer.msg(result.message);
		initForecastCharts();
	}
}

/*
 * 生成收入预测图表
 */
function initForecastCharts(){
	
	var forecastChartsData = pageConfig.incomeForecastData;
	var incomeForecast = echarts.init(document.getElementById('incomeForecastCharts'));
	var incomeForecastOption = {
		title : {
	        text: forecastChartsData.currentYear+'年收入预测分析',
	        x:'center',
	        itemGap: 12,
	        textStyle: {
	        	fontSize:20
	        },
	        subtext: '收入预测周期：'+forecastChartsData.firstAccountPeriod+'至'+forecastChartsData.lastAccountPeriod
	        		+'，合同收入：'+App.unctionToThousands(forecastChartsData.contractIncomeTotal)+'元，'
	        		+'风险收入：'+App.unctionToThousands(forecastChartsData.lineIncomeTotal)+'元，'
	        		+'收入总计：'+App.unctionToThousands(forecastChartsData.incomeTotal)+'元',
	        subtextStyle: {
	        	color: "#333",
	        	fontSize: 14,
	        	fontWeight: "bolder",
	        	lineHeight: 20,
	        	rich: {}
	        }
	   	},
	    legend: {
	    	orient: 'vertical',
	    	top: '40%',
	        right: '5',
	        itemWidth: 20,
	        itemHeight: 8,
	        selectedMode: false,
	        itemGap: 15
	    },
	    tooltip : {
	        trigger: 'axis',
	        confine:"true",
	        axisPointer : {
	            type : 'shadow'
	        },
	        textStyle:{
               	align:'left'
            }
	    },
	    grid: {
	    	left: '10',
            right: '100',
            bottom: '5',
            top: '80',
            containLabel: true
           },
	    xAxis: {
	    	axisLine:{
	    		show:false
	    	},
	    	axisTick:{
	    		show:false
	    	},
	        data: forecastChartsData.accountPeriodX
	    },
	    yAxis: {
	    	axisLine:{
	    		show:false
	    	},
	    	axisTick:{
	    		show:false
	    	}
	    },
	    series: [
	        {
	        	name: '合同收入',
		        type: 'bar',
		        stack:'收入预测',
		        data: forecastChartsData.contractIncomeForecastZxArray
		    },
		    {
		    	name: '风险收入',
		        type: 'bar',
		        stack:'收入预测',
		        barMaxWidth: 55,
		        data: forecastChartsData.lineIncomeForecastArray
		    },
		    {
		    	name: '收入总计',
		        type: 'line',
		        label: {
	                normal: {
	                    show: true,
	                    position: 'top'
	                }
	            },
		        data: forecastChartsData.totalArray
		    }
	    ],
	    color:['#0070c0', '#ed8b00','#a0a0a0']
	};
	incomeForecast.setOption(incomeForecastOption);
	pageConfig.isInitForecastCharts = true;
	incomeForecast.on('click', function (params) {
    	console.log(params);

    	// 将账期放入到全局变量中
    	pageConfig.accountPeriod = params.name;
    	if(params.seriesName == "合同收入"){
    		// 合同收入明细div显示
    		$("#contractIncomeForecastValue").show();
    		// 给预测账期赋值
    		$("#contractIncomeForecastAccountPeriod").text(params.name);
    		// 给收入预测赋值
    		$("#contractIncomeForecastReceivable").text(App.unctionToThousands(params.data));
    		
    		// 风险收入明细div隐藏
    		$("#lineIncomeForecastValue").hide();
    	}
    	else if(params.seriesName == "风险收入"){
    		// 风险收入明细div显示
    		$("#lineIncomeForecastValue").show();
    		// 给预测账期赋值
    		$("#lineIncomeForecastAccountPeriod").text(params.name);
    		// 给收入预测赋值
    		$("#lineIncomeForecastReceivable").text(App.unctionToThousands(params.data));
    		
    		// 合同收入明细div隐藏
    		$("#contractIncomeForecastValue").hide();
    	}
	});
}

/*
 * 收入预测-合同收入明细查看类型切换
 */
$("#contractIncomeForecastRadio input[name='contractIncomeForecastType']").on("change",function(){

	if($(this).val() == 1){ // 按客户查看
		initContractIncomeForecastTableByCustom();
	}else{// 按合同查看
		initContractIncomeForecastTableByContract();
	}
})

/*
 * 合同收入预测明细 - 按客户跟踪查询
 */
function initContractIncomeForecastTableByCustom(){

	App.initDataTables('#contractIncomeForecastTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeForecast/listCustomIncomeForecastByContractIncome',
			"data": function(d) {
	        	d.forecastAccountPeriod = pageConfig.accountPeriod;
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#contractIncomeForecastTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal","width": "30%",},
			{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal","width": "30%",},
			{"data": "forecastReceivable","title":"合同收入预测","className": "whiteSpaceNormal","width": "27%",},
			{"data": "customerCode","title":"履行中合同","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data+"\")'>查看</a>";
				}
			}
		]
	});
}

/*
 * 合同收入预测明细 - 按合同跟踪查询
 */
function initContractIncomeForecastTableByContract(){

	App.initDataTables('#contractIncomeForecastTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeForecast/listContractIncomeForecastZx',
			"data": function(d) {
	        	d.forecastAccountPeriod = pageConfig.accountPeriod;
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#contractIncomeForecastTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","title":"合同名称","className": "whiteSpaceNormal","width": "11%"},
			{"data": "contractNumber","title":"合同编号","className": "whiteSpaceNormal","width": "11%"},
			{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal","width": "11%"},
			{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal","width": "11%"},
			{"data": "signDate","title":"签订盖章日期","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data);
				}
			},
			{"data": "expiryDate","title":"合同终止日期","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data);
				}
			},
			{"data": "contractValue","title":"含增值税合同金额","className": "whiteSpaceNormal","width": "11%"},
			{"data": "forecastReceivable","title":"合同收入预测","className": "whiteSpaceNormal","width": "10%"},
			{"data": "contractNumber","title":"线路明细","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data+"\")'>查看</a>";
				}
			}
		]
	});
}

/*
 * 跳转线路信息
 */
function jumpLineManage(data){
	var url = "/html/incomeWorktable/lineManage/lineView.html?relationType=0&id="+data;
	top.showSubpageTab(url,"线路信息");
}
/*
 * 跳转合同信息
 */
function jumpContractManage(customerCode){
	var url = "/html/incomeWorktable/contractManage/performContract.html?customerCode="+customerCode;
	top.showSubpageTab(url,"查看履行中合同");
}

/*
 * 收入预测-风险收入明细查看类型切换
 */
$("#lineIncomeForecastRadio input[name='lineIncomeForecastType']").on("change",function(){

	if($(this).val() == 1){ // 按客户查看
		initLineIncomeForecastTableByCustom();
	}else{// 按线路查看
		initLineIncomeForecastTableByLine();
	}
})

/*
 * 风险收入预测明细 - 按客户跟踪查询
 */
function initLineIncomeForecastTableByCustom(){

	App.initDataTables('#lineIncomeForecastTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeForecast/listCustomIncomeForecastByLineIncome',
			"data": function(d) {
	        	d.forecastAccountPeriod = pageConfig.accountPeriod;
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#lineIncomeForecastTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal","width": "30%",},
			{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal","width": "30%",},
			{"data": "forecastReceivable","title":"风险收入预测","className": "whiteSpaceNormal","width": "27%",},
			{"data": "customerCode","title":"线路明细","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data+"\")'>查看</a>";
				}
			}
		]
	});
}

/*
 * 风险收入预测明细 - 按线路跟踪查询
 */
function initLineIncomeForecastTableByLine(){

	App.initDataTables('#lineIncomeForecastTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeForecast/listLineIncomeForecast',
			"data": function(d) {
	        	d.forecastAccountPeriod = pageConfig.accountPeriod;
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#lineIncomeForecastTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "businessId","title":"业务信息ID","className": "whiteSpaceNormal","width": "15%"},
			{"data": "circuitCode","title":"电路代号","className": "whiteSpaceNormal","width": "15%"},
			{"data": "productName","title":"产品名称","className": "whiteSpaceNormal","width": "15%"},
			{"data": "startCityName","title":"发起分公司","className": "whiteSpaceNormal","width": "15%"},
			{"data": "rentingScope","title":"租用范围","className": "whiteSpaceNormal","width": "15%"},
			{"data": "monthRentCost","title":"月租费","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "forecastReceivable","title":"风险收入预测","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			}
		]
	});
}