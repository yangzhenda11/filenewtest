//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
/*
 * roleType
 * 收入类租线业务页面角色说明
 * 取globalConfig.curRole,其中包含以下角色可以进入此页面（已在进入之前判断,只包含以下一个可以进入）
 * 91220：采购经理/项目经理
 * 91221：业务管理
 * 91222：商务经理
 */
var roleType = "";
$(function(){
	//取得角色list中的当前页面所使用的角色
	checkRoleType();
	$("#loginUserName").text(config.curStaffName);
	if(roleType == 91220){
		$("#roleName").text("采购经理/项目经理");
		$("#captionTitle").text("我的商务助理");
	}else if(roleType == 91221){
		$("#roleName").text("业务管理");
	}else if(roleType == 91222){
		$("#roleName").text("商务经理");
	};
	//获取商务助理配置内容
	getAssistantList();
	//获取重点关注履行中合同跟踪
	getFocusContractTable()
})
$("#workItemDom").on("click",".workItem",function(){
	var moduleUrl = $(this).find("img").data("url");
	if(moduleUrl){
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
	var permArr = [91220,91221,91222];
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
		funType: "zc"
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
/*
 * 获取重点关注履行中合同跟踪
 */
function getFocusContractTable(){
	var url = serverPath+'performanceContractPay/listFocusContractPay';
	var postData = {
		draw: 1,
		start: 0,
		length: 5,
		order: [],
		contractInfoSearch: $("#focusContractInput").val().trim()
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
					'<td>'+ v.partnerName + '</td>'+
					'<td>'+ v.partnerCode + '</td>'+
					'<td>'+ App.unctionToThousands(v.contractValue) + '</td>'+
					'<td><a onclick="jumpOrderManageByContract(\''+v.contractId+'\')">查看</a></td>'+
					'<td><a onclick="showContractPerformerModal(\''+v.contractId+'\')">查看</a></td>';
			});
			$("#emphasisClient").html(html);		
		}else{
			var emptyTr = '<tr><td colspan="8">暂无重点关注的合同信息</td></tr>'
			$("#emphasisClient").html(emptyTr);						
		}
	}
}
/*
 * 跳转我履行中的合同信息
 */
$("#showContractMore").on("click",function(){
	var url = "/html/expenseWorktable/contractManage/contractManage.html?expandFocusContract=true";
	top.showSubpageTab(url,"履行中合同");
})
/*
 * 跳转订单信息
 */
function jumpOrderManageByContract(contractId){
	var url = "/html/expenseWorktable/orderManage/orderManageForContract.html?contractId="+contractId;
	top.showSubpageTab(url,"订单信息");
}
/*
 * 我履行中的合同跟踪合同履行人查看
 */
function showContractPerformerModal(contractId) {
	var url = serverPath + "contractPerformer/contractPerformerList";
	App.formAjaxJson(url, "post", JSON.stringify({contractId: contractId}), successCallback);
	function successCallback(result) {
		var data = result.data;
		var html = '';
		if(data.length > 0){
			for (var i = 0; i < data.length; i++){
				var item = result[i];
				var performerType = item.performerType == 1 ? "是" : "否";
				html += "<tr>"+
							"<td class='align-center'>"+(i+1)+"</td>"+
							"<td>"+item.performerStaffName+"</td>"+
							"<td>"+item.performerOrgName+"</td>"+
							"<td>"+performerType+"</td>"+
							"<td></td>"+"<td></td>"+
							"<td>"+item.addStaff+"</td>"+
							"<td>"+item.addStaffOrg+"</td>"+
						"</tr>";
			}
		}else{
			html = '<tr><td colspan="8">暂无合同履行人信息</td></tr>'
		};
		$("#contractPerformerTbody").html(html);
		$("#contractPerformerModal").modal("show");
	}
}










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