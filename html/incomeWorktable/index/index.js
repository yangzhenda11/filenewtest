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
	$("#loginUserName").text(config.curStaffName);
	if(roleType == 91216 || roleType == 91217 || roleType == 91219) {
		if(roleType == 91216) {
			$("#roleName").text("客户经理");
			$("#captionTitle").text("我的商务助理");
		} else if(roleType == 91217) {
			$("#roleName").text("业务管理");
		} else {
			$("#roleName").text("商务经理");
		};
		$("#auditCol").remove();
	} else if(roleType == 91218) {
		$("#roleName").text("稽核管理");
		$("#workItemCol").removeClass("col-sm-10").addClass("col-sm-7");
		$("#auditCol").removeClass("hidden");
		setAuditScope();
	};
	$(".page-content-worktable").show();
	//获取商务助理配置内容
	getAssistantList();
	//设置待办待阅数量
	setMessageNumber();
	//重点关注DOM区域生成
	getFocusEmphasis();
	//获取收入总览图表数据
	getIncomeOverviewData();
	//获取收入预测图表数据
	getIncomeAnalysisData();
})
$("#workItemDom").on("click", ".workItem", function() {
	var moduleUrl = $(this).find("img").data("url");
	if(moduleUrl) {
		top.showSubpageTab(moduleUrl, $(this).find("p").text());
	} else {
		layer.alert("该模块暂未使用。", {icon: 2})
	}
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
 * 获取商务助理配置内容
 */
function getAssistantList() {
	var url = serverPath + "assistant/assistantList";
	var postData = {
		roleId: roleType,
		provinceCode: config.provCode,
		funType: "sr"
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);

	function successCallback(result) {
		var data = result.data;
		var html = "";
		$.each(data, function(k, v) {
			html += '<div class="workItem">' +
				'<img src="/static/img/worktable/' + v.funIconUrl + '" data-url="' + v.funUrl + '"/>' +
				'<p>' + v.funName + '</p>' +
				'</div>';
		});
		$("#workItemDom").html(html);
	}
}
/*
 * 待办待阅数量查询
 */
function setMessageNumber(){
	var todoData = {
		staffId : config.curStaffId,
		draw : 999,
		start : 0,
		length : 0
	};
	var toreadData = {
		draw : 999,
		start : 0,
		length : 0
	};
	App.formAjaxJson(serverPath + "workflowrest/taskToDo", "get", todoData, todoSuccessCallback,null,todoErrorCallback);
	App.formAjaxJson(serverPath + "recordToread/getRecordToreadList", "POST", JSON.stringify(toreadData), toreadSuccessCallback,null,toreadErrorCallback,false);
    function todoSuccessCallback(result) {
    	$("#todoNum").text(result.recordsTotal);
    };
    function todoErrorCallback(result){
    	$("#todoNum").text("?");
    };
    function toreadSuccessCallback(result) {
    	$("#toreadNum").text(result.recordsTotal);
    };
    function toreadErrorCallback(result){
    	$("#toreadNum").text("?");
    };
}
/*
 * 待办待阅跳转
 */
function jumpWorkflow(type){
	if(type == "todo"){
		var url = "html/workflow/tasklist/task-todo.html";
		top.showSubpageTab(url,"待办事项",null,true);
	}else if(type == "toread"){
		var url = "html/workflow/readrecordlist/record-toread.html";
		top.showSubpageTab(url,"待阅事项",null,true);
	};
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
	var url = "/html/incomeWorktable/lineManage/lineView.html?relationType=1&id="+contractId;
	top.showSubpageTab(url,"线路信息");
}
/***************选择稽核范围开始***********************/
/*
 * 设置初始稽核范围
 */
function setAuditScope() {
	var obj = {
		companyCode: config.companyCode
	};
	var url = serverPath + "auditManager/getAuditRangeByStaffOrgId";
	App.formAjaxJson(url, "POST", JSON.stringify(obj), successCallback);
	var dataPermission = config.dataPermission;
	function successCallback(result) {
		var data = result.data;
		var dataPermission = config.dataPermission;
		var orgName = data.orgName;
		$("#scope").text(orgName);
		$("#scope").attr("title", orgName);
		if(dataPermission == 3) {
			$("#changeScope").show();
		} else {
			$("#changeScope").remove();
		};
		var html = '<div class="scopeItem" data-id=' + data.auditRange + '>' + orgName + '</div>';
		$("#scopeChecked").html(html);
		top.globalConfig.auditScope = data.auditRange;
	}
}
/*
 * 选择稽核范围
 */
function changeScope() {
	$("#scopeModal").modal("show");
	if(!scopeTree) {
		initSopeChooseTree();
	}
}
var scopeTree;
/*
 * 生成稽核部门树————ztree
 */
function initSopeChooseTree() {
	var treeSetting = {
		async: {
			enable: true,
			url: serverPath + "contractType/listCompany",
			type: "post",
			dataType: 'json',
			dataFilter: orgsfilter,
			autoParam: ["orgCode=orgCode"]
		},
		data: {
			simpleData: {
				enable: true,
				idKey: "orgCode",
				pIdKey: "parentCode"
			},
			key: {
				name: "orgName"
			}
		},
		view: {
			selectedMulti: false,
			//			dblClickExpand: false
		},
		callback: {
			onAsyncError: onAsyncError,
			onDblClick: setInputInfo
		}
	};

	function orgsfilter(treeId, parentNode, responseData) {
		if(responseData.status == 1) {
			var data = responseData.data;
			if(data) {
				return data;
			} else {
				return null;
			}
		} else {
			layer.msg(responseData.message);
			return null;
		}
	};
	App.formAjaxJson(serverPath + 'contractType/listCompany', "post", {
		'orgId': ''
	}, successCallback, null, null, null, null, "formData")

	function successCallback(result) {
		var data = result.data;
		if(data != "") {
			if(scopeTree) {
				scopeTree.destroy();
			};
			scopeTree = $.fn.zTree.init($("#scopeTree"), treeSetting, data);
			var nodes = scopeTree.getNodes();
			scopeTree.expandNode(nodes[0]);
		} else {
			layer.msg("暂无数据，请稍后重试");
		}
	}
	//双击事件 
	function setInputInfo(event, treeId, treeNode) {
		setScopeChecked(treeNode);
	}
}
//按钮选择
function chooseScopeTree() {
	var treeNode = scopeTree.getSelectedNodes()[0];
	setScopeChecked(treeNode);
}
//按钮删除
function deleteCheckedScope() {
	if($("#scopeChecked .scopeItem.selected").length == 0) {
		layer.msg("请选择已选内容进行移除");
	} else {
		$("#scopeChecked").html("");
	}
}
//右侧赋值
function setScopeChecked(treeNode) {
	var name = treeNode.orgName;
	var orgCode = treeNode.orgCode;
	var html = '<div class="scopeItem" data-id=' + orgCode + '>' + name + '</div>';
	$("#scopeChecked").html(html);
}
$("#scopeChecked").on("click", ".scopeItem", function() {
	if($(this).hasClass("selected")) {
		$(this).removeClass("selected");
	} else {
		$(this).addClass("selected");
	}
})
/*
 * 选择稽核范围确定按钮点击
 */
function setScope() {
	$("#scopeModal").modal("hide");
	if($("#scopeChecked .scopeItem").length > 0) {
		var checkedText = $("#scopeChecked .scopeItem").text();
		var companyCode = $("#scopeChecked .scopeItem").data("id");
		var obj = {
			"companyCode": companyCode,
		};
		var url = serverPath + "auditManager/updateAuditRange";
		App.formAjaxJson(url, "POST", JSON.stringify(obj), successCallback);
		function successCallback(result) {
			layer.msg("更改成功!");
		}
		$("#scope").text(checkedText);
		$("#scope").attr("title", checkedText);
		top.globalConfig.auditScope = companyCode;
	}
}

/***************选择稽核范围结束***********************/
/*
 * 获取收入总览图表数据
 */
function getIncomeOverviewData(){
	var url = serverPath + "incomeManage/listIncomePosition";
	App.formAjaxJson(url, "post", null, successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			var incomeCollectedTotal = data.incomeCollectedTotal;			//合同收入-实收总金额
			var incomeReceivableTotal = data.incomeReceivableTotal;			//合同收入-应收总金额
			var riskIncomeCollectedTotal = data.riskIncomeCollectedTotal;	//风险收入-实收总金额
			var riskIncomeReceivableTotal = data.riskIncomeReceivableTotal;	//风险收入-应收总金额
			var lastAccountPeriod = data.lastAccountPeriod;					//统计数据截止日期
			$("#incomeOverviewNote").html(lastAccountPeriod.substring(0,4)+"年"+lastAccountPeriod.substring(4,6)+"月");
			var incomeOverviewReceivable = echarts.init(document.getElementById('incomeOverviewReceivable'));
			var incomeOverviewReceived = echarts.init(document.getElementById('incomeOverviewReceived'));
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
}
/*
 * 获取收入预测图表数据
 */
function getIncomeAnalysisData(){
	var url = serverPath + "incomeForecast/getIncomeForecastChartData";
	App.formAjaxJson(url, "post", null, successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			initIncomeAnalysis(data);
		};
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
	        data: incomedata.accountPeriodX
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
		        barMaxWidth: 55,
		        data: incomedata.lineIncomeForecastArray
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
		        data: incomedata.totalArray
		    }
	    ],
	    color:['#0070c0', '#ed8b00','#a0a0a0']
	};
	incomeAnalysis.setOption(incomeAnalysisOption);
}