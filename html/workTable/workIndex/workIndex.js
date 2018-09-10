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
creatIncomChart()
//我的收入总览图表生成
function creatIncomChart(){
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
	        formatter: "{a} <br/>{b} ({d}%)"
	    },
	    legend: {
	    	orient: "vertical",
	        bottom: '0',
	        itemWidth: 8,
	        itemHeight: 8,
	        selectedMode: false,
	        itemGap: 5,
	        data: ['风险收入：406,957元','合同收入：20,348元']
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
   					length: 10,
   					length2: 10,
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
	        itemGap: 5,
	        data: data
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