
$("#loginUserName").text("汪雨");
$("#roleName").text("采购经理/项目经理");

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
var expentType1 = echarts.init(document.getElementById('expentType1'));
var expentType1Option = initCharts("合同付款（固定金额合同）","固定金额合同累计付款金额情况",expentType1Data);
expentType1.setOption(expentType1Option);
expentType1.dispatchAction({
	type: 'highlight',
	dataIndex: 0,
});


var expentType2 = echarts.init(document.getElementById('expentType2'));
var expentType2Option = initEmptyCharts("合同付款（框架协议）","框架协议对应的订单累计付款金额情况",expentType2Data);
expentType2.setOption(expentType2Option);
expentType2.dispatchAction({
	type: 'highlight',
	dataIndex: 0,
})


function initCharts(title,subtext,data){
	var option = {
		title: {
			text: title,
			subtext: subtext,
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
		legend: {
			orient: 'vertical',
			top: 'bottom',
			itemWidth: 8,
	        itemHeight: 8,
	        itemGap: 5,
			selectedMode: false
		},
		color: ['#c00000', '#bfbfbf'],
		series: [{
			clockwise: false,
			hoverAnimation: false,
			name: '订单付款',
			silent: true,
			type: 'pie',
			radius: ['35%', '60%'],
			avoidLabelOverlap: false,
			label: {
				normal: {
					show: false,
					position: 'center',
					textStyle: {
						color: '#333'
					},
					formatter: '{d}%'
				},
				emphasis: {
					show: true,
					textStyle: {
						fontSize: '20',
//						fontWeight: 'bold'
					}
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
function initEmptyCharts(title,subtext,data){
	var option = {
		title: {
			text: title,
			subtext: subtext,
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
		legend: {
			orient: 'vertical',
			top: 'bottom',
			itemWidth: 8,
	        itemHeight: 8,
	        itemGap: 5,
			selectedMode: false
		},
		color: ['#c00000', '#bfbfbf'],
		series: [{
			clockwise: false,
			hoverAnimation: false,
			name: '订单付款',
			silent: true,
			type: 'pie',
			radius: ['35%', '60%'],
			avoidLabelOverlap: false,
			label: {
				normal: {
					show: false,
					position: 'center',
					textStyle: {
						color: '#333'
					},
					formatter: '{d}%'
				},
				emphasis: {
					show: true,
					textStyle: {
						fontSize: '20',
//						fontWeight: 'bold'
					}
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			data: data
		}]
	};
	return option;
};