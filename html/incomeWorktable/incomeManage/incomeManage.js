//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//页面变量
var pageConfig = {
	isInitForecastCharts: false
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
	var incomeForecast = echarts.init(document.getElementById('incomeForecastCharts'));
	var incomeForecastOption = {
		title : {
	        text: '2018年收入预测分析',
	        x:'center',
	        itemGap: 12,
	        textStyle: {
	        	fontSize:20
	        },
	        subtext: '收入预测周期：201806至201812，合同收入：750,000元，风险收入：550,000元，收入总计：1,300,000元',
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
	        data: ['6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
		        data: [22000, 18200, 19100, 23400, 29000, 13000, 31000]
		    },
		    {
		    	name: '风险收入',
		        type: 'bar',
		        stack:'收入预测',
		        barMaxWidth: 55,
		        data: [220000, 182000, 191000, 234000, 290000, 130000, 310000]
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
		        data: [242000, 200200, 210100, 257400, 319000, 143000, 341000]
		    }
	    ],
	    color:['#0070c0', '#ed8b00','#a0a0a0']
	};
	incomeForecast.setOption(incomeForecastOption);
	pageConfig.isInitForecastCharts = true;
}