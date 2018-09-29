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
$(function(){
	//取得角色list中的当前页面所使用的角色
	checkRoleType();
	$("#loginUserName").text(config.curStaffName);
	if(roleType == 91216 || roleType == 91217 || roleType == 91219){
		if(roleType == 91216){
			$("#roleName").text("客户经理");
			$("#captionTitle").text("我的商务助理");
		}else if(roleType == 91217){
			$("#roleName").text("业务管理");
		}else{
			$("#roleName").text("商务经理");
		};
		$("#auditCol").remove();
	}else if(roleType == 91218){
		$("#roleName").text("稽核管理");
		$("#workItemCol").removeClass("col-sm-10").addClass("col-sm-7");
		$("#auditCol").removeClass("hidden");
		setAuditScope();
	};
	$(".page-content-worktable").show();
	//获取商务助理配置内容
	getAssistantList();
	
	initIncomeOverview();
	initIncomeAnalysis();
})
$("#workItemDom").on("click",".workItem",function(){
	var moduleUrl = $(this).find("img").data("url");
	if(moduleUrl){
		alert(moduleUrl);
		top.showSubpageTab(moduleUrl,$(this).find("p").text());
	}else{
		layer.alert("该模块暂未使用。",{icon:2})	
	}
})
/*
 * 取得角色list中的当前页面所使用的角色
 */
function checkRoleType(){
	var roleArr = config.curRole;
	var permArr = [91216,91217,91218,91219];
	$.each(roleArr, function(k,v) {
		if(isInArray(permArr,v)){
			roleType = v;
			return false;
		}
	});
}

/*
 * 获取商务助理配置内容
 */
function getAssistantList(){
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
		$.each(data, function(k,v) {
			html += '<div class="workItem">'+
					'<img src="/static/img/worktable/'+v.funIconUrl+'" data-url="'+v.funUrl+'"/>'+
					'<p>'+v.funName+'</p>'+
					'</div>';
		});
		$("#workItemDom").html(html);
	}
}
/***************选择稽核范围开始***********************/
/*
 * 设置初始稽核范围
 */
function setAuditScope(){
	var url = serverPath + "auditManager/getAuditRangeById";
	var postData = {
		provCode: config.provCode,
		companyCode: config.companyCode
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	var dataPermission = config.dataPermission;
	function successCallback(result){
		var data = result.data;
		/*if(data.length > 0){*/
			var dataPermission = config.dataPermission;
			var companyName = data.companyName;
			var provName = data.provName;	
			if(dataPermission == 3){
				$("#scope").text(provName);
				$("#scope").attr("title",provName);
				$("#changeScope").show();
			}else{
				$("#scope").text(companyName);
				$("#scope").attr("title",companyName);
				$("#changeScope").remove();
			}
			top.globalConfig.auditScope = data.companyCode;
		/*}*/
	}
}
/*
 * 选择稽核范围
 */
function changeScope(){
	$("#scopeModal").modal("show");
	if(!scopeTree){
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
			autoParam: ["orgId=orgId"]
		},
		data: {
			simpleData: {
				enable: true,
				idKey: "orgId",
				pIdKey: "parentId"
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
		if(responseData.status == 1){
			var data = responseData.data;
			if(data){
	        	return data;
			}else{
				return null;
			}
		}else{
			layer.msg(responseData.message);
			return null;
		}
	};
	App.formAjaxJson(serverPath + 'contractType/listCompany',"post",{'orgId':''},successCallback,null,null,null,null,"formData")
	function successCallback(result){
		var data = result.data;
    	if (data != "") {
        	if(scopeTree){
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
function chooseScopeTree(){
	var treeNode = scopeTree.getSelectedNodes()[0];
		setScopeChecked(treeNode);
}
//按钮删除
function deleteCheckedScope(){
	if($("#scopeChecked .scopeItem.selected").length == 0){
		layer.msg("请选择已选内容进行移除");
	}else{
		$("#scopeChecked").html("");
	}
}
//右侧赋值
function setScopeChecked(treeNode){
	var name = treeNode.orgName;
	var orgId = treeNode.orgId;
	var html = '<div class="scopeItem" data-id='+orgId+'>'+name+'</div>';
	$("#scopeChecked").html(html);
}
$("#scopeChecked").on("click",".scopeItem",function(){
	if($(this).hasClass("selected")){
		$(this).removeClass("selected");
	}else{
		$(this).addClass("selected");
	}
})
/*
 * 选择稽核范围确定按钮点击
 */
function setScope(){
	$("#scopeModal").modal("hide");
	if($("#scopeChecked .scopeItem").length > 0){
		var checkedText = $("#scopeChecked .scopeItem").text();
		var checkedId = $("#scopeChecked .scopeItem").data("id");
		$("#scope").text(checkedText);
		$("#scope").attr("title",checkedText);
		top.globalConfig.auditScope = checkedId;
	}
}
/***************选择稽核范围结束***********************/
















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
