var roleType = 2;
$("#loginUserName").text("汪雨");
if(roleType == 1){
	$("#roleName").text("稽核管理");
	$("#workItemCol").removeClass("col-sm-10").addClass("col-sm-7");
	$("#auditCol").removeClass("hidden");
}else{
	$("#roleName").text("客户经理");
	$("#auditCol").remove();
};
$(".page-content-worktable").show();
initIncomeOverview();
initIncomeAnalysis();
$("#emphasisRadio input[name='emphasisRadio']").on("change",function(){
	if($(this).val() == 1){
		$("#emphasisContractDom").hide(0,function(){
			$("#emphasisCustomerDom").show();
//			initEmphasisClientDom();
		});
	}else if($(this).val() == 2){
		$("#emphasisCustomerDom").hide(0,function(){
			$("#emphasisContractDom").show();
//			initEmphasisClientDom();
		});
	}
})
$("#workItemDom").on("click","img",function(){
	if($(this).data("url")){
		top.showSubpageTab($(this).data("url"),"客户管理")
	}
})
//我的收入总览图表生成
function initIncomeOverview(){
	var incomeOverviewReceivable = echarts.init(document.getElementById('incomeOverviewReceivable'));
	var overviewReceivableOption = returnChartsOption('应收金额','合同收入/风险收入\n累计应收金额占比情况',[{value:406957, name:'风险收入：406,957元'},{value:20348, name:'合同收入：20,348元'}],'应收金额');
	incomeOverviewReceivable.setOption(overviewReceivableOption);
	var incomeOverviewReceived = echarts.init(document.getElementById('incomeOverviewReceived'));
	var overviewReceivedOption = returnEmptyChartsOption('实收金额','合同收入/风险收入\n累计应收金额占比情况',['风险收入：0元','合同收入：0元'],'应收金额：0元');
	incomeOverviewReceived.setOption(overviewReceivedOption);
}
function returnChartsOption(title,subTitle,data,seriesName){
	var overviewReceivableOption = {
		title : {
	        text: title,
	        subtext: subTitle,
	        x:'center',
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
	    tooltip : {
	        formatter: "{a} <br/>{b} ({d}%)",
	        position: function (pos, params, dom, rect, size) {
		      var obj = {top: 60};
		      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
		      return obj;
		  }
	    },
	    legend: {
	    	orient: "vertical",
	        bottom: '0',
	        itemWidth: 8,
	        itemHeight: 8,
	        selectedMode: false,
	        itemGap: 5
	    },
	    series : [
	        {
	            name: seriesName,
	            type: 'pie',
	            radius : '55%',
	            center: ['50%', '53%'],
	            clockwise: false,
	            startAngle: 0,
//	            hoverAnimation: false,
				label: {
 					color: "#333",
 					formatter:"{d}%"
 				},
   				labelLine: {
   					length: 5,
   					length2: 5,
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
	    color:['#ed8b00', '#0070c0']
	};
	return overviewReceivableOption;
};
function returnEmptyChartsOption(title,subTitle,data,toolTip){
	var seriesData = [];
	for(var i = 0; i < data.length; i++){
		var value = i==0 ? 1 : 0;
		var item = {value:value, name:data[i]};
		seriesData.push(item);
	};
	var option = {
		title : {
	        text: title,
	        subtext: subTitle,
	        x:'center',
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
	    tooltip : {
	        formatter: toolTip
	    },
	    legend: {
	    	orient: "vertical",
	        bottom: '0',
	        itemWidth: 8,
	        itemHeight: 8,
	        selectedMode: false,
	        itemGap: 5
	    },
	    series : [
	        {
	            name: '',
	            type: 'pie',
	            clockwise: false,
        		startAngle: 0,
	            radius : '55%',
	            center: ['50%', '53%'],
				label: {
 					show: false
 				},
   				labelLine: {
   					show: false
   				},
	            data: seriesData
	        }
	    ],
	    color:['#bfbfbf', '#bfbfbf']
	};
	return option;
};
function initIncomeAnalysis(){
	var incomeAnalysis = echarts.init(document.getElementById('incomeAnalysis'));
	var incomeAnalysisOption = {
		title : {
	        text: '2018年收入预测分析',
	        x:'center',
	        textStyle: {
	        	fontSize:14
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
	        axisPointer : {
	            type : 'shadow'
	        }
	    },
	    grid: {
	    	left: '10',
            right: '100',
            bottom: '5',
            top: '50',
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
		        barWidth:'45%',
		        data: [22000, 18200, 19100, 23400, 29000, 13000, 31000]
		    },
		    {
		    	name: '风险收入',
		        type: 'bar',
		        stack:'收入预测',
		        barWidth:'45%',
		        lable:{
		        	show:true
		        },
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
	incomeAnalysis.setOption(incomeAnalysisOption);
}
