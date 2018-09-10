var roleType = 2;
$("#roleName").text("客户经理");
$("#loginUserName").text("汪雨");
if(roleType == 1){
	$("#workItemCol").removeClass("col-sm-10").addClass("col-sm-7");
	$("#auditCol").removeClass("hidden");
}else{
	$("#auditCol").remove();
}
$(".page-content-worktable").show();
initIncomeOverview();
initIncomeAnalysis();
//我的收入总览图表生成
function initIncomeOverview(){
	var incomeOverviewReceivable = echarts.init(document.getElementById('incomeOverviewReceivable'));
	var overviewReceivableOption = {
		title : {
	        text: '应收金额',
	        subtext: '合同收入/风险收入\n累计应收金额占比情况',
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
	            name: '应收金额',
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
	            data:[
	                {value:406957, name:'风险收入：406,957元'},
	                {value:20348, name:'合同收入：20,348元'},
	            ]
	        }
	    ],
	    color:['#ed8b00', '#0070c0']
	};
	incomeOverviewReceivable.setOption(overviewReceivableOption);
	var incomeOverviewReceived = echarts.init(document.getElementById('incomeOverviewReceived'));
	var overviewReceivedOption = returnEmptyChartsOption('应收金额','合同收入/风险收入\n累计应收金额占比情况',['风险收入：0元','合同收入：0元'],'应收金额：0元');
	incomeOverviewReceived.setOption(overviewReceivedOption);
}
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
	        bottom: '0',
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
	    xAxis: {
	        data: ['6月', '7月', '8月', '9月', '10月', '11月', '12月']
	    },
	    yAxis: {},
	    series: [
	    	
//	        {
//	        type: 'line',
////	        lable:{
////	    		show:true
////	    	},
//	        data: [220, 182, 191, 234, 290, 330, 310].map(function(val) {
//	            return val*2
//	        })
//	    },
	        {
	        	name: '合同收入',
		        type: 'bar',
		        stack:'收入预测',
		        
		        data: [22000, 18200, 19100, 23400, 29000, 33000, 31000]
		    },
		    {
		    	name: '风险收入',
		        type: 'bar',
		        stack:'收入预测',
		        // barWidth:'30%',
		        lable:{
		        	show:true
		        },
		        data: [220000, 182000, 191000, 23400, 290000, 330000, 310000]
		    }
	    ],
	    color:['#0070c0', '#ed8b00']
	};
	incomeAnalysis.setOption(incomeAnalysisOption);
}
