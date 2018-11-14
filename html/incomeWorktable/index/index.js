//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
/*
 * roleType
 * 收入类租线业务页面角色说明
 * 取globalConfig.curRole,其中包含以下角色可以进入此页面（已在进入之前判断,只包含以下一个可以进入）
 * 91216：客户经理
 * 91217：业务管理
 * 91218：稽核管理
 * 91219：商务经理
 */
var roleType = "";
$(function() {
	//取得角色list中的当前页面所使用的角色
	checkRoleType();
	//重点关注DOM区域生成
	getFocusEmphasis();
	//获取收入总览图表数据
	getIncomeOverviewData();
	//获取收入预测图表数据
	getIncomeAnalysisData();
})
/*
 * 取得角色list中的当前页面所使用的角色
 */
function checkRoleType() {
	var roleArr = config.curRole;
	var permArr = [91216, 91217, 91218, 91219];
	$.each(roleArr, function(k, v) {
		if(isInArray(permArr, v)) {
			roleType = v;
			return false;
		}
	});
}
/*
 * 重点关注合同和客户切换
 */
$("#emphasisRadio input[name='emphasisRadio']").on("change", function() {
	if($(this).val() == 1) {
		$("#emphasisContractDom").hide(0, function() {
			$("#emphasisCustomerDom").show();
			//			initEmphasisClientDom();
		});
	} else if($(this).val() == 2) {
		$("#emphasisCustomerDom").hide(0, function() {
			$("#emphasisContractDom").show();
			//			initEmphasisClientDom();
		});
	}
})
/*
 * 获取重点关注履行中合同跟踪
 */
function getFocusEmphasis(){
	if(roleType == 91217){
		$("#emphasisColForAccount").show();
		$("#emphasisColForOhter").remove();
		getFocusAccountTable();
	}else{
		$("#emphasisColForOhter").show();
		$("#emphasisColForAccount").remove();
		getFocusCustomerTable();
		if(roleType == 91218) {
			$("#emphasisRadio").remove();
		}else{
			getFocusContractTable();
		};
	}
}
/*
 * 获取重点关注客户经理
 */
function getFocusAccountTable(){
	var url = serverPath + 'customerManager/listFocusCustomerManager';
	var postData = {
		draw: 1,
		start: 0,
		length: 5,
		order: [],
		managerStaffName: $("#focusAccountInput").val().trim()
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		if(result.recordsTotal > postData.length){
			$("#showAccountMore").show();
		}else{
			$("#showAccountMore").hide();
		};
		if(data.length > 0){
			var html = "";
			$.each(data, function(k,v) {
				var itemPhone = v.phone ? v.phone : '';
				var itemEmail = v.email ? v.email : '';
				html += '<tr>'+
					'<td>'+ (k+1) + '</td>'+
					'<td>'+ v.managerStaffName + '</td>'+
					'<td>'+ v.orgName + '</td>'+
					'<td>'+ itemPhone + '</td>'+
					'<td>'+ itemEmail +'</td>'+
					'<td><a onclick="jumpContractManageByStaffid(\''+v.managerStaffOrgId+'\')">查看</a></td>';
			});
			$("#focusAccountTbody").html(html);		
		}else{
			var emptyTr = '<tr><td colspan="6">暂无重点关注的客户经理信息</td></tr>'
			$("#focusAccountTbody").html(emptyTr);						
		}
	}
}
/*
 * 跳转我的客户经理管理
 */
$("#showAccountMore").on("click",function(){
	var url = "/html/incomeWorktable/accountManage/accountManage.html?expandFocusCustomer=true";
	top.showSubpageTab(url,"履行中合同");
})
/*
 * 跳转合同信息（根据客户经理ID）
 */
function jumpContractManageByStaffid(managerStaffOrgId){
	var url = "/html/incomeWorktable/contractManage/performContractForAccount.html?managerStaffOrgId="+managerStaffOrgId;
	top.showSubpageTab(url,"查看履行中合同");
}
/*
 * 获取重点关注客户
 */
function getFocusCustomerTable(){
	var url = serverPath + "customerInfo/listFocusCustomerInfoRelate";
	var postData = {
		draw: 1,
		start: 0,
		length: 5,
		order: []
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		if(result.recordsTotal > postData.length){
			$("#showCustomerMore").show();
		}else{
			$("#showCustomerMore").hide();
		};
		if(data.length > 0){
			var html = "";
			$.each(data, function(k,v) {
				html += '<tr>'+
					'<td>'+ (k+1) + '</td>'+
					'<td>'+ v.customerName + '</td>'+
					'<td>'+ v.customerCode + '</td>'+
					'<td>'+ v.partnerCode + '</td>'+
					'<td>'+ v.customerManagerName +'</td>'+
					'<td><a onclick="jumpContractManageByCustomerCode(\''+v.customerCode+'\')">查看</a></td>';
			});
			$("#emphasisCustomerTbody").html(html);		
		}else{
			var emptyTr = '<tr><td colspan="6">暂无重点关注的客户信息</td></tr>'
			$("#emphasisCustomerTbody").html(emptyTr);						
		}
	}
}
/*
 * 跳转我的客户管理
 */
$("#showCustomerMore").on("click",function(){
	var url = "/html/incomeWorktable/customerManage/customerManage.html?expandFocusCustomer=true";
	top.showSubpageTab(url,"客户管理");
})
/*
 * 跳转合同信息（根据客户ID）
 */
function jumpContractManageByCustomerCode(customerCode){
	var url = "/html/incomeWorktable/contractManage/performContract.html?customerCode="+customerCode;
	top.showSubpageTab(url,"查看履行中合同");
}
/*
 * 获取重点关注合同
 */
function getFocusContractTable(){
	var url = serverPath + "performanceContract/listFocusContract";
	var postData = {
		draw: 1,
		start: 0,
		length: 5,
		order: []
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		if(result.recordsTotal > postData.length){
			$("#showContractMore").show();
		}else{
			$("#showContractMore").hide();
		};
		if(data.length > 0){
			var html = "";
			$.each(data, function(k,v) {
				html += '<tr>'+
					'<td>'+ (k+1) + '</td>'+
					'<td>'+ v.contractName + '</td>'+
					'<td>'+ v.contractNumber + '</td>'+
					'<td>'+ v.customerName + '</td>'+
					'<td>'+ v.customerCode + '</td>'+
					'<td>'+ v.partnerCode + '</td>'+
					'<td>'+ App.unctionToThousands(v.contractValue) + '</td>'+
					'<td>'+ v.customerManagerName + '</td>'+
					'<td><a onclick="jumpLineManageByContract(\''+v.contractId+'\')">查看</a></td>';
			});
			$("#emphasisContractTbody").html(html);		
		}else{
			var emptyTr = '<tr><td colspan="9">暂无重点关注的合同信息</td></tr>'
			$("#emphasisContractTbody").html(emptyTr);						
		}
	}
}
/*
 * 跳转履行中合同
 */
$("#showContractMore").on("click",function(){
	var url = "/html/incomeWorktable/contractManage/contractManage.html?expandFocusContractList=true";
	top.showSubpageTab(url,"履行中合同");
})
/*
 * 跳转线路信息（已关联合同）
 */
function jumpLineManageByContract(contractId){
	var url = "/html/incomeWorktable/lineManage/lineView.html?relationType=1&contractId="+contractId;
	top.showSubpageTab(url,"线路信息");
}

/*
 * 获取收入总览图表数据
 */
function getIncomeOverviewData(){
	var url = serverPath + "incomeManage/listIncomePosition";
	var incomeOverviewReceivable = echarts.init(document.getElementById('incomeOverviewReceivable'));
	var incomeOverviewReceived = echarts.init(document.getElementById('incomeOverviewReceived'));
	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			var incomeCollectedTotal = data.incomeCollectedTotal;			//合同收入-实收总金额
			var incomeReceivableTotal = data.incomeReceivableTotal;			//合同收入-应收总金额
			var riskIncomeCollectedTotal = data.riskIncomeCollectedTotal;	//风险收入-实收总金额
			var riskIncomeReceivableTotal = data.riskIncomeReceivableTotal;	//风险收入-应收总金额
			var lastAccountPeriod = data.lastAccountPeriod;					//统计数据截止日期
			$("#incomeOverviewNote").html(lastAccountPeriod.substring(0,4)+"年"+parseInt(lastAccountPeriod.substring(4,6))+"月");
			if(incomeReceivableTotal || riskIncomeReceivableTotal){			//应收总金额图表生成
				var overviewReceivableOption = returnChartsOption('应收金额', '合同收入/风险收入\n累计应收金额占比情况', [{
					value: riskIncomeReceivableTotal,
					name: '风险收入：'+App.unctionToThousands(riskIncomeReceivableTotal)+'元'
				}, {
					value: incomeReceivableTotal,
					name: '合同收入：'+App.unctionToThousands(incomeReceivableTotal)+'元'
				}], '应收金额');
			}else{
				var overviewReceivableOption = returnEmptyChartsOption('应收金额', '合同收入/风险收入\n累计应收金额占比情况', ['风险收入：0元', '合同收入：0元'], '应收金额：0元');
			};
			if(incomeCollectedTotal || riskIncomeCollectedTotal){			//实收总金额图表生成
				var overviewReceivedOption = returnChartsOption('实收金额', '合同收入/风险收入\n累计应收金额占比情况', [{
					value: riskIncomeCollectedTotal,
					name: '风险收入：'+App.unctionToThousands(riskIncomeCollectedTotal)+'元'
				}, {
					value: incomeCollectedTotal,
					name: '合同收入：'+App.unctionToThousands(incomeCollectedTotal)+'元'
				}], '应收金额');
			}else{
				var overviewReceivedOption = returnEmptyChartsOption('实收金额', '合同收入/风险收入\n累计应收金额占比情况', ['风险收入：0元', '合同收入：0元'], '实收金额：0元');
			};
			incomeOverviewReceivable.setOption(overviewReceivableOption);
			incomeOverviewReceived.setOption(overviewReceivedOption);
		};
	}
	function improperCallback(result){
		layer.msg(result.message);
		var overviewReceivableOption = returnEmptyChartsOption('应收金额', '合同收入/风险收入\n累计应收金额占比情况', ['风险收入：0元', '合同收入：0元'], '应收金额：0元');
		var overviewReceivedOption = returnEmptyChartsOption('实收金额', '合同收入/风险收入\n累计应收金额占比情况', ['风险收入：0元', '合同收入：0元'], '实收金额：0元');
		incomeOverviewReceivable.setOption(overviewReceivableOption);
		incomeOverviewReceived.setOption(overviewReceivedOption);
		$("#chartsNote").html("*该图表暂未汇总到数据");
	}
}
/*
 * 获取收入预测图表数据
 */
function getIncomeAnalysisData(){
	var url = serverPath + "incomeForecast/getIncomeForecastChartData";
	App.formAjaxJson(url, "post", null, successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			initIncomeAnalysis(data);
		};
	}
	function improperCallback(result){
		layer.msg(result.message);
		$("#incomeAnalysis").html("<span style='margin:30px 0 0 20px'>*该图表暂未汇总到数据</span>")
	}
}

function returnChartsOption(title, subTitle, data, seriesName) {
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
	        textStyle: {
	        	fontSize: 12
	        },
	        confine:"true"
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

function returnEmptyChartsOption(title, subTitle, data, toolTip) {
	var seriesData = [];
	for(var i = 0; i < data.length; i++) {
		var value = i == 0 ? 1 : 0;
		var item = {
			value: value,
			name: data[i]
		};
		seriesData.push(item);
	};
	var option = {
		title: {
			text: title,
			subtext: subTitle,
			x: 'center',
			itemGap: 6,
			textStyle: {
				fontSize: 14
			},
			subtextStyle: {
				lineHeight: 16,
				color: "#333",
				rich: {}
			},
		},
		tooltip: {
			formatter: toolTip,
			textStyle: {
	        	fontSize: 12
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
		series: [{
			name: '',
			type: 'pie',
			clockwise: false,
			startAngle: 0,
			radius: '55%',
			center: ['50%', '53%'],
			label: {
				show: false
			},
			labelLine: {
				show: false
			},
			data: seriesData
		}],
		color: ['#bfbfbf', '#bfbfbf']
	};
	return option;
};
/*
 * 收入预测图表生成
 */
function initIncomeAnalysis(incomedata) {
	var accountPeriodX = [];
	$.each(incomedata.accountPeriodX,function(k,v){
		var acountPeriodXItem = parseInt(v.substring(4,6)) + '月';
		accountPeriodX.push(acountPeriodXItem);
	});
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
	        confine:"true",
	        axisPointer : {
	            type : 'shadow'
	        },
	        textStyle:{
               	align:'left'
           	},
           	formatter:function (params, ticket, callback) {
            	var tooltipCon = params[0].name + "</br>"
            	$.each(params, function(k,v) {
            		tooltipCon += v.marker + v.seriesName + "：" + App.unctionToThousands(v.value) + "元</br>";
            	});
			    return tooltipCon;
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
	        data: accountPeriodX
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
		        data: incomedata.contractIncomeForecastZxArray
		    },
		    {
		    	name: '风险收入',
		        type: 'bar',
		        stack:'收入预测',
		        barMaxWidth: 45,
		        data: incomedata.lineIncomeForecastArray
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
		        data: incomedata.totalArray
		    }
	    ],
	    color:['#0070c0', '#ed8b00','#a0a0a0']
	};
	incomeAnalysis.setOption(incomeAnalysisOption);
}