//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//页面变量
var pageConfig = {
	isInitForecastCharts: false,		//页面是否已经生产收入预测表格
	accountPeriod: null,					//收入预测点击选择的账期
	incomePeriod: null					// 收入分析点击选择的账期
}
$(function(){
	initIncomeCharts();
	
	/*
	 * 跨省分摊收入按钮: 只有省分权限的稽核能够导入
	 * 跨省分摊收入: 只有具有省分权限的稽核和商务能够查看，其他权限都看不到
	 * roleType
	 * 91216：客户经理
	 * 91217：业务管理
	 * 91218：稽核管理
	 * 91219：商务经理
	 * dataPermission
	 * 0个人，1部门，2公司，3省分
	 */
	var roleArr = config.curRole;
	var dataPermission = config.dataPermission;
	if(isInArray(roleArr,91218) || isInArray(roleArr,91219)){
		if(dataPermission == 3) {
			$("#incomeShareDiv").show();

			// 加载跨省分摊收入数据
			initIncomeShareTableTable();
			// 只有省分权限的稽核能够导入
			if(isInArray(roleArr,91218)){
				$("#incomeShareButton").show();
			}
			else {
				$("#incomeShareButton").hide();				
			}
		} else {
			$("#incomeShareDiv").hide();	
			$("#incomeShareButton").hide();				
		}
	}else{
		$("#incomeShareDiv").remove();
	};
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
//=======================================收入分析 start=============================================//
/*
 * 获取收入分析图表数据
 */
function initIncomeCharts(){
	var url = serverPath + "incomeManage/listIncomePosition";
	App.formAjaxJson(url, "post", null, successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			initIncomeAnalysisCharts(data);
		};
	}
}
/*
 * 生成收入分析图表
 */
function initIncomeAnalysisCharts(incomeChartData){
//	var incomeChartData = {
//		currentYear: 2018,
//		accountPeriodX: ["201801","201802","201803","201804","201805","201806","201807","201808","201809","201810","201811","201812"],
//		riskIncomeCollectedAmountList: [10000,12000,11000,13000,11000,12300,10000,12000,11000,13000,11000,12300],
//		riskIncomeArrearsAmountList: [7000,8000,8000,8400,7600,8500,8000,7600,8200,7900,8200,8700],
//		incomeCollectedAmountList: [13000,11000,13200,12000,11400,12000,11000,11200,11800,13400,12000,12900],
//		incomeArrearsAmountList: [7000,8000,8000,8400,7600,8500,8000,7600,8200,7900,8200,8700],
//	}
	// 定义账期集合
	var acountPeriod = [];
	// 定义风险收入-实收金额集合
	var riskIncomeCollectedAmountList = [];
	// 定义风险收入-欠费金额集合
	var riskIncomeArrearsAmountList = [];
	// 定义合同收入-实收金额集合
	var incomeCollectedAmountList = [];
	// 定义合同收入-欠费金额集合
	var incomeArrearsAmountList = [];
	// 遍历账期集合，处理账期数据
	$.each(incomeChartData.accountPeriodX,function(k,v){
		var acountPeriodItem = '风险收入 合同收入\n\n'+v.substring(5,6)+'月份';
//		var a = '风险 合同\n收入 收入\n'+v;
		acountPeriod.push(acountPeriodItem);
		// 定义风险收入-实收Item
		var riskIncomeCollectedAmountItem = {
				value:incomeChartData.riskIncomeCollectedAmountList[k],
				other:incomeChartData.riskIncomeArrearsAmountList[k],
				account:v
		};
		riskIncomeCollectedAmountList.push(riskIncomeCollectedAmountItem);
		// 定义风险收入-欠费Item
		var riskIncomeArrearsAmountItem = {
				value:incomeChartData.riskIncomeArrearsAmountList[k],
				other:incomeChartData.riskIncomeCollectedAmountList[k],
				account:v
		};
		riskIncomeArrearsAmountList.push(riskIncomeArrearsAmountItem);
		// 定义合同收入-实收Item
		var incomeCollectedAmountItem = {
				value:incomeChartData.incomeCollectedAmountList[k],
				other:incomeChartData.incomeArrearsAmountList[k],
				account:v
		};
		incomeCollectedAmountList.push(incomeCollectedAmountItem);
		// 定义合同收入-欠费Item
		var incomeArrearsAmountItem = {
				value:incomeChartData.incomeArrearsAmountList[k],
				other:incomeChartData.incomeCollectedAmountList[k],
				account:v
		};
		incomeArrearsAmountList.push(incomeArrearsAmountItem);
	})
	var incomeAnalysis = echarts.init(document.getElementById('incomeAnalysisCharts'));
	var incomeAnalysisOption = {
		title : {
	        text: incomeChartData.currentYear+'年收入情况分析',
	        x:'center',
	        itemGap: 12,
	        textStyle: {
	        	fontSize:20
	        },
	        subtext: '合同收入：'+App.unctionToThousands(incomeChartData.incomeReceivableTotal)+'元，'
	                 +'风险收入：'+App.unctionToThousands(incomeChartData.riskIncomeReceivableTotal)+'元，'
	                 +'收入总计：'+App.unctionToThousands(incomeChartData.incomeSum)+'元',
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
	    	top: '10',
	        right: '30',
	        itemWidth: 10,
	        itemHeight: 10,
	        selectedMode: false,
	        itemGap: 10
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
            		tooltipCon += v.stack + v.seriesName + "：" + App.unctionToThousands(v.value) + "元</br>";
            	});
			    return tooltipCon;
			}
	    },
	    grid: {
	    	left: '10',
            right: '10',
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
            axisLabel: {
//          	lineHeight:18
//          	textStyle:{
//          		fontSize: 10
//          	},
//             interval:0,
//             rotate:40
            },
	    	data: acountPeriod
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
			    stack: '风险收入',
			    data: riskIncomeCollectedAmountList
			},
			{
			    name:'欠费金额',
			    type:'bar',
			    stack: '风险收入',
			    barGap: 0,
			    barMaxWidth: 50,
			    data: riskIncomeArrearsAmountList
			},
	        {
	            name:'实收金额',
	            type:'bar',
	            stack: '合同收入',
	            data: incomeCollectedAmountList
	        },
	        {
	            name:'欠费金额',
	            type:'bar',
	            stack: '合同收入',
	            barGap: 0,
	            barMaxWidth: 50,
	            data: incomeArrearsAmountList
	        }
	        
	    ],
	    color:['#4472c4', '#ff0000','#4472c4','#ff0000']
	};
	incomeAnalysis.setOption(incomeAnalysisOption);
	incomeAnalysis.on('click', function (params) {
		// 将账期放入到全局变量中
		console.log("params",params)
		pageConfig.incomePeriod = params.data.account;
    	if(params.stack == "合同收入"){
    		// 风险收入明细div隐藏
    		$("#riskIncomeAnalysisValue").hide();
    		// 合同收入明细div显示
    		$("#contractIncomeAnalysisValue").show();
    		// 给账期赋值
    		$(".accuontPeriod").text(params.data.account);
    		// 给合同收入-应收赋值
    		var incomeReceivable = (params.data.value)+(params.data.other);
    		$("#incomeReceivable").text(App.unctionToThousands(incomeReceivable));
    		// 给合同收入-欠费赋值
    		$("#incomeArrears").text(App.unctionToThousands(params.data.other));
    		// 给合同收入-实收赋值
    		$("#incomeCollected").text(App.unctionToThousands(params.data.value));
    		// 获取radio选中val，然后根据选中值查询
    		var radioVal = $("input[name='incomeType']:checked").val();
    		checkIncomeRadio(radioVal);
    	}
    	else if(params.stack == "风险收入"){
    		// 合同收入明细div隐藏
    		$("#contractIncomeAnalysisValue").hide();
    		// 风险收入明细div显示
    		$("#riskIncomeAnalysisValue").show();
    		// 给账期赋值
    		$(".accuontPeriod").text(params.data.account);
    		// 给风险收入-应收赋值
    		var riskIncomeReceivable = (params.data.value)+(params.data.other);
    		$("#riskIncomeReceivable").text(App.unctionToThousands(riskIncomeReceivable));
    		// 给风险收入-欠费赋值
    		$("#riskIncomeArrears").text(App.unctionToThousands(params.data.value));
    		// 给风险收入-实收赋值
    		$("#riskIncomeCollected").text(App.unctionToThousands(params.data.other));
    		// 获取radio选中val，然后根据选中值查询
    		var radioVal = $("input[name='riskIncomeType']:checked").val();
    		checkRiskIncomeRadio(radioVal);
    	}
	});
}
 /*
  * 收入分析-合同收入明细查看类型切换
  */
 $("#incomeAnalysisRadio input[name='incomeType']").on("change",function(){
	 checkIncomeRadio($(this).val());
 })
 //收入分析-合同收入明细-点击单选按钮，获取radio选中项，根据选中类型查询
 function checkIncomeRadio(radioVal){
	 if(pageConfig.incomePeriod == null){
			if(radioVal == 1){ 		// 按客户查看
				var theadHtml = "<th>序号</th><th>客户名称</th><th>集客客户编号</th><th>累计应收(元)</th><th>累计欠费(元)</th><th>累计实收(元)</th><th>履行中合同</th>";
			}else{	
									// 按线路查看
				var theadHtml = "<th>序号</th><th>合同名称</th><th>合同编号</th><th>客户名称</th><th>集客客户编号</th><th>含增值税合同金额</th><th>累计应收(元)</th><th>累计欠费(元)</th><th>累计实收(元)</th><th>线路明细</th>";
			}
			$("#incomeThead").html(theadHtml);
		}else{
			if(radioVal == 1){ 		
				// 按客户查看
				initIncomeTableByCustomer();
			}else{					
				// 按合同查看
				initIncomeTableByContract();
			}
		}
 }
 // 收入分析-合同收入明细-按客户查看
 function initIncomeTableByCustomer(){
	var isInitTable = $.fn.dataTable.isDataTable("#incomeTable");
	if(!isInitTable){
		$("#incomeTable").html("");
	};
	App.initDataTables('#incomeTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeManage/listIncomeByCustomer',
			"data": function(d) {
	        	d.accountPeriodName = pageConfig.incomePeriod;
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
			{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal","width": "15%",},
			{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal","width": "15%",},
			{"data": "receivableAmount","title":"累计应收(元)","className": "whiteSpaceNormal","width": "13%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "arrearsAmount","title":"累计欠费(元)","className": "whiteSpaceNormal","width": "13%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "collectedAmount","title":"累计实收(元)","className": "whiteSpaceNormal","width": "13%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "customerCode","title":"履行中合同","className": "whiteSpaceNormal","width": "11%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpIncomeContractManage(\""+data+"\")'>查看</a>";
				}
			
			}
		]
	});
 }
 // 收入分析-合同收入明细-按合同查看
 function initIncomeTableByContract(){
	 var isInitTable = $.fn.dataTable.isDataTable("#incomeTable");
     if(!isInitTable){
		$("#incomeTable").html("");
	 };
	 App.initDataTables('#incomeTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeManage/listIncomeByContract',
			"data": function(d) {
	        	d.accountPeriodName = pageConfig.incomePeriod;
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
			{"data": "contractName","title":"合同名称","className": "whiteSpaceNormal","width": "11%"},
			{"data": "contractNumber","title":"合同编号","className": "whiteSpaceNormal","width": "11%"},
			{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal","width": "11%"},
			{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal","width": "11%"},
			{"data": "contractValue","title":"含增值税合同金额","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "receivableAmount","title":"累计应收(元)","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "arrearsAmount","title":"累计欠费(元)","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "collectedAmount","title":"累计实收(元)","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "","title":"线路明细","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpIncomeLineManage(\""+data+"\")'>查看</a>";
				}
			}
		]
	});
 }
 
 /*
  * 收入分析-风险收入明细查看类型切换
  */
 $("#riskIncomeAnalysisRadio input[name='riskIncomeType']").on("change",function(){
	 checkRiskIncomeRadio($(this).val());
 })
 // 收入分析-风险收入明细-点击单选按钮，获取radio选中项，根据选中类型查询
 function checkRiskIncomeRadio(radioVal){
	 if(pageConfig.incomePeriod == null){
			if(radioVal == 1){ 		// 按客户查看
				var theadHtml = "<th>序号</th><th>客户名称</th><th>集客客户编号</th><th>累计应收(元)</th><th>累计欠费(元)</th><th>累计实收(元)</th><th>线路明细</th>";
			}else{			
									// 按线路查看
				var theadHtml = "<th>序号</th><th>业务信息ID</th><th>电路代号</th><th>产品名称</th><th>发起分公司</th><th>租用范围</th><th>月租费</th><th>应收(元)</th><th>欠费(元)</th><th>实收(元)</th>";
			}
			$("#riskIncomeThead").html(theadHtml);
		}else{
			if(radioVal == 1){ 		// 按客户查看
				initRiskIncomeTableByCustomer();
			}else{		
									// 按合同查看
				initRiskIncomeTableByContract();
			}
		}
 }
 // 收入分析-风险收入明细-按客户查看
 function initRiskIncomeTableByCustomer(){
	var isInitTable = $.fn.dataTable.isDataTable("#riskIncomeTable");
	if(!isInitTable){
		$("#riskIncomeTable").html("");
	};
	App.initDataTables('#riskIncomeTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeManage/listRiskIncomeByCustomer',
			"data": function(d) {
	        	d.accountPeriodName = pageConfig.incomePeriod;
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#riskIncomeTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal","width": "15%",},
			{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal","width": "15%",},
			{"data": "receivableAmount","title":"累计应收(元)","className": "whiteSpaceNormal","width": "13%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "arrearsAmount","title":"累计欠费(元)","className": "whiteSpaceNormal","width": "13%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "collectedAmount","title":"累计实收(元)","className": "whiteSpaceNormal","width": "13%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "customerCode","title":"线路明细","className": "whiteSpaceNormal","width": "11%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpIncomeLineManage(\""+data+"\")'>查看</a>";
				}
			
			}
		]
	});
 }
// 收入分析-风险收入明细-按线路查看
 function initRiskIncomeTableByContract(){
	var isInitTable = $.fn.dataTable.isDataTable("#riskIncomeTable");
	if(!isInitTable){
		$("#riskIncomeTable").html("");
	};
	App.initDataTables('#riskIncomeTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeManage/listRiskIncomeByLine',
			"data": function(d) {
	        	d.accountPeriodName = pageConfig.incomePeriod;
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#riskIncomeTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "businessId","title":"业务信息ID","className": "whiteSpaceNormal","width": "11%",},
			{"data": "circuitCode","title":"电路代号","className": "whiteSpaceNormal","width": "11%",},
			{"data": "productName","title":"产品名称","className": "whiteSpaceNormal","width": "11%",},
			{"data": "startCityName","title":"发起分公司","className": "whiteSpaceNormal","width": "11%",},
			{"data": "rentingScope","title":"租用范围","className": "whiteSpaceNormal","width": "11%",},
			{"data": "monthRentCost","title":"月租费","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "receivableAmount","title":"应收(元)","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "arrearsAmount","title":"欠费(元)","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "collectedAmount","title":"实收(元)","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			}
		]
	});
 }
 /*
  * 跳转合同信息
  */
 function jumpIncomeContractManage(customerCode, forecastAccountPeriod){
 	var url = "/html/incomeWorktable/incomeManage/contractIncomeManage.html?customerCode="+customerCode
 				+"&forecastAccountPeriod="+forecastAccountPeriod;
 	top.showSubpageTab(url,"合同收入预测");
 }
 /*
  *  跳转线路信息 jumpRiskIncomeContractManage
  */
 function jumpIncomeLineManage(){
	 //跳转线路信息链接
 }
 
//=======================================收入分析 end=============================================//
/*
 * 生成收入预测图表数据
 */
function initIncomeForecastCharts(){
	var url = serverPath + "incomeForecast/getIncomeForecastChartData";
	App.formAjaxJson(url, "post", null, successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			initForecastCharts(data);
		};
	}
}
/*
 * 生成收入预测图表
 */
function initForecastCharts(forecastChartsData){
	var incomeForecast = echarts.init(document.getElementById('incomeForecastCharts'));
	var incomeForecastOption = {
		title : {
	        text: forecastChartsData.currentYear+'年收入预测情况',
	        x:'center',
	        itemGap: 12,
	        textStyle: {
	        	fontSize:20
	        },
	        subtext: '收入预测周期：'+forecastChartsData.firstAccountPeriod+' 至 '+forecastChartsData.lastAccountPeriod
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
	                    position: 'top',
	                    formatter:function(params){
		                	return App.unctionToThousands(params.data);
		                }
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
    	// 将账期放入到全局变量中
    	pageConfig.accountPeriod = params.name;
    	if(params.seriesName == "合同收入"){
    		// 风险收入明细div隐藏
    		$("#lineIncomeForecastValue").hide();
    		// 合同收入明细div显示
    		$("#contractIncomeForecastValue").show();
    		// 给预测账期赋值
    		$("#contractIncomeForecastAccountPeriod").text(params.name);
    		// 给收入预测赋值
    		$("#contractIncomeForecastReceivable").text(App.unctionToThousands(params.data));
    		// 获取radio选中val，然后根据选中值查询
    		var radioVal = $("input[name='contractIncomeForecastType']:checked").val();
    		checkContractIncomeForecastRadio(radioVal);
    	}
    	else if(params.seriesName == "风险收入"){
    		// 合同收入明细div隐藏
    		$("#contractIncomeForecastValue").hide();
    		// 风险收入明细div显示
    		$("#lineIncomeForecastValue").show();
    		// 给预测账期赋值
    		$("#lineIncomeForecastAccountPeriod").text(params.name);
    		// 给收入预测赋值
    		$("#lineIncomeForecastReceivable").text(App.unctionToThousands(params.data));
    		// 获取radio选中val，然后根据选中值查询
    		var radioVal = $("input[name='lineIncomeForecastType']:checked").val();
    		checkLineIncomeForecastRadio(radioVal);
    	}
	});
}
/*
 * 收入预测-合同收入明细查看类型切换
 */
$("#contractIncomeForecastRadio input[name='contractIncomeForecastType']").on("change",function(){
	checkContractIncomeForecastRadio($(this).val());
})

/*
 * 收入预测-合同收入明细判断radio选中数据，根据选中类型查询
 */
function checkContractIncomeForecastRadio(valRadio){
	if(pageConfig.accountPeriod == null){
		if(valRadio == 1){ 		// 按客户查看
			var theadHtml = "<th>序号</th><th>客户名称</th><th>集客客户编号</th><th>合同收入预测</th><th>履行中合同</th>";
		}else{					// 按合同查看
			var theadHtml = "<th>序号</th><th>合同名称</th><th>合同编号</th><th>客户名称</th><th>集客客户编号</th><th>签订盖章日期</th><th>合同终止日期</th><th>含增值税合同金额</th><th>合同收入预测</th><th>线路明细</th>";
		}
		$("#contractIncomeForecastThead").html(theadHtml);
	}else{
		if(valRadio == 1){ 		// 按客户查看
			initContractIncomeForecastTableByCustom();
		}else{					// 按线路查看
			initContractIncomeForecastTableByContract();
		}
	}
}

/*
 * 合同收入预测明细 - 按客户跟踪查询
 */
function initContractIncomeForecastTableByCustom(){
	var isInitTable = $.fn.dataTable.isDataTable("#contractIncomeForecastTable");
	if(!isInitTable){
		$("#contractIncomeForecastTable").html("");
	};
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
			{"data": "forecastReceivable","title":"合同收入预测","className": "whiteSpaceNormal","width": "27%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": null,"title":"履行中合同","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.customerCode+"\",\""+data.forecastAccountPeriod+"\")'>查看</a>";
				}
			}
		]
	});
}
/*
 * 合同收入预测明细 - 按合同跟踪查询
 */
function initContractIncomeForecastTableByContract(){
	var isInitTable = $.fn.dataTable.isDataTable("#contractIncomeForecastTable");
	if(!isInitTable){
		$("#contractIncomeForecastTable").html("");
	};
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
					return App.formatDateTime(data,'yyyy-MM-dd');
				}
			},
			{"data": "expiryDate","title":"合同终止日期","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data,'yyyy-MM-dd');
				}
			},
			{"data": "contractValue","title":"含增值税合同金额","className": "whiteSpaceNormal","width": "11%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "forecastReceivable","title":"合同收入预测","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "contractId","title":"线路明细","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data+"\")'>查看</a>";
				}
			}
		]
	});
}
/*
 * 收入预测-风险收入明细查看类型切换
 */
$("#lineIncomeForecastRadio input[name='lineIncomeForecastType']").on("change",function(){
	checkLineIncomeForecastRadio($(this).val());
})
/*
 * 收入预测-风险收入明细判断radio选中数据，根据选中类型查询
 */
function checkLineIncomeForecastRadio(valRadio){
	if(pageConfig.accountPeriod == null){
		if(valRadio == 1){ 		// 按客户查看
			var theadHtml = "<th>序号</th><th>客户名称</th><th>集客客户编号</th><th>风险收入预测</th><th>线路明细</th>";
		}else{					// 按合同查看
			var theadHtml = "<th>序号</th><th>业务信息ID</th><th>电路代号</th><th>产品名称</th><th>发起分公司</th><th>租用范围</th><th>月租费</th><th>风险收入预测</th>";
		}
		$("#lineIncomeForecastThead").html(theadHtml);
	}else{
		if(valRadio == 1){ 		// 按客户查看
			initLineIncomeForecastTableByCustom();
		}else{					// 按线路查看
			initLineIncomeForecastTableByLine();
		}
	}
}
/*
 * 风险收入预测明细 - 按客户跟踪查询
 */
function initLineIncomeForecastTableByCustom(){
	var isInitTable = $.fn.dataTable.isDataTable("#lineIncomeForecastTable");
	if(!isInitTable){
		$("#lineIncomeForecastTable").html("");
	};
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
			{"data": "forecastReceivable","title":"风险收入预测","className": "whiteSpaceNormal","width": "27%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
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
	var isInitTable = $.fn.dataTable.isDataTable("#lineIncomeForecastTable");
	if(!isInitTable){
		$("#lineIncomeForecastTable").html("");
	};
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
/*
 * 跳转线路信息
 */
function jumpLineManage(data){
	var url = "/html/incomeWorktable/lineManage/lineView.html?relationType=0&id="+data;
	top.showSubpageTab(url,"线路基本信息");
}
/*
 * 跳转合同信息
 */
function jumpContractManage(customerCode, forecastAccountPeriod){
	var url = "/html/incomeWorktable/incomeManage/contractIncomeForecastManage.html?customerCode="+customerCode
				+"&forecastAccountPeriod="+forecastAccountPeriod;
	top.showSubpageTab(url,"合同收入预测");
}

/*
 * 收入管理 - 收入分析 - 跨省分摊收入
 */
function initIncomeShareTableTable(){
	App.initDataTables('#incomeShareTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'incomeShare/listIncomeShare',
			"data": function(d) {
	        	//d.forecastAccountPeriod = pageConfig.accountPeriod;
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#incomeShareTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "companyName","title":"组织机构名称","className": "whiteSpaceNormal","width": "30%"},
			{"data": "accountPeriodName","title":"账期","className": "whiteSpaceNormal","width": "30%"},
			{"data": "shareValue","title":"分摊收入","className": "whiteSpaceNormal","width": "35%",
				"render": function(data, type, full, meta){
				return App.unctionToThousands(data);
				}
			},
		]
	});
}

/*
 * 跳转到跨省分摊收入编辑页面
 */
function toIncomeSharePage(){
	var url = "/html/incomeWorktable/incomeManage/importIncomeAssessed.html";
	top.showSubpageTab(url,"导入跨省分摊收入");
}
