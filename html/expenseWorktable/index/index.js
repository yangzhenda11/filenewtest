//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
App.fixScrollTopTool("#scrollTopTool");
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
	//待办待阅数量查询
	setMessageNumber();
	//获取合同付款（固定金额合同）图表数据
	getChartsFixedData();
	//获取合同付款（框架协议）图表数据
	getChartsNotFixedData();
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
		$.each(data, function(k, v) {
			var funCode = v.funCode;
			html += '<div class="workItem"><div class="workItemImg">';
			if(funCode == "HZFGL" || funCode == "LXZHT_ZC" || funCode == "FXYJ_ZC"){
				html += '<span class="badge badge-Worktable">'+v.superscript+'</span>';
			};
			html += '<img src="/static/img/worktable/' + v.funIconUrl + '" data-url="' + v.funUrl + '"/></div><p>' + v.funName + '</p></div>';
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
					'<td><a onclick="jumpOrderManageByContract(\''+v.contractNumber+'\')">查看</a></td>'+
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
function jumpOrderManageByContract(contractNumber){
	var url = "/html/expenseWorktable/orderManage/orderManageForContract.html?contractNumber="+contractNumber;
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
				var item = data[i];
//				var performerType = item.performerType == 1 ? "是" : "否";
				html += "<tr>"+
							"<td class='align-center'>"+(i+1)+"</td>"+
							"<td>"+item.performerStaffName+"</td>"+
							"<td>"+item.performerOrgName+"</td>"+
//							"<td>"+performerType+"</td>"+
//							"<td></td>"+"<td></td>"+
//							"<td>"+item.addStaff+"</td>"+
//							"<td>"+item.addStaffOrg+"</td>"+
						"</tr>";
			}
		}else{
			html = '<tr><td colspan="8">暂无合同履行人信息</td></tr>'
		};
		$("#contractPerformerTbody").html(html);
		$("#contractPerformerModal").modal("show");
	}
}
/*
 * 获取固定金额合同图表数据
 */
function getChartsFixedData(){
	var url = serverPath + "paymentManage/getPaymentManageIsFixedSum";
	App.formAjaxJson(url, "post", null, successCallback, improperCallbacks);
	function successCallback(result) {
		initPaymentFiexdCharts(result.data);
		setInvoiceChartsNote(result.data.resultData);
	}
	function improperCallbacks(result){
		layer.msg(result.message);
		initPaymentFiexdCharts();
		setInvoiceChartsNote();
	}
}
/*
 * 获取框架协议合同图表数据
 */
function getChartsNotFixedData(){
	var url = serverPath + "paymentManage/getPaymentManageNoFixedSum";
	App.formAjaxJson(url, "post", null, successCallback, improperCallbacks);
	function successCallback(result) {
		initPaymentNotFiexdCharts(result.data);
		setInvoiceChartsNote(result.data.resultData);
	}
	function improperCallbacks(result){
		layer.msg(result.message);
		initPaymentNotFiexdCharts();
		setInvoiceChartsNote();
	}
}
//合同付款（固定金额合同）（图表）
function initPaymentFiexdCharts(data){
	var paymentChartsFixedOption;
	var paymentChartsFixedDom = echarts.init(document.getElementById('paymentChartsFixed'));
	var paymentChartsFixedData = [
		{value: 0,name: '累计含税付款金额：0元'},
		{value: 1,name: '剩余含税未付款金额：0元'}
	];
	if(data){
		var payVateAmountSumSum = data.payVateAmountSumSum ? data.payVateAmountSumSum : 0;
		var noPayVateAmountSum = data.noPayVateAmountSum ? data.noPayVateAmountSum : 0;
		var noPayVateAmountPercent = data.noPayVateAmountPercent ? data.noPayVateAmountPercent : 0;
		if(payVateAmountSumSum || noPayVateAmountSum){
			paymentChartsFixedData = [
				{
					value: payVateAmountSumSum,
					name: "累计含税付款金额："+App.unctionToThousands(payVateAmountSumSum)+"元"
				},
				{
					value: noPayVateAmountSum,
					name: "剩余含税未付款金额："+App.unctionToThousands(noPayVateAmountSum)+"元"
				}
			];
			paymentChartsFixedOption = initCharts("合同付款（固定金额合同）","固定金额合同累计付款金额情况",paymentChartsFixedData);
			$("#paymentChartsFixedValue").text(parseFloat((noPayVateAmountPercent*100).toPrecision(12)) + "%")
		}else{
			paymentChartsFixedOption = initCharts("合同付款（固定金额合同）","固定金额合同累计付款金额情况",paymentChartsFixedData,true);
			$("#paymentChartsFixedValue").text("0%")
		}
	}else{
		paymentChartsFixedOption = initCharts("合同付款（固定金额合同）","固定金额合同累计付款金额情况",paymentChartsFixedData,true);
		$("#paymentChartsFixedValue").text("0%")
	};
	paymentChartsFixedDom.setOption(paymentChartsFixedOption);
}
//合同付款（框架协议）（图表）
function initPaymentNotFiexdCharts(data){
	var paymentChartsNotFixedOption;
	var paymentChartsNotFixedDom = echarts.init(document.getElementById('paymentChartsNotFixed'));
	var paymentChartsNotFixedData = [
		{value: 0,name: '累计含税付款金额：0元'},
		{value: 1,name: '剩余含税未付款金额：0元'}
	];
	if(data){
		var payVateAmountSumSum = data.payVateAmountSumSum ? data.payVateAmountSumSum : 0;
		var noPayVateAmountSum = data.noPayVateAmountSum ? data.noPayVateAmountSum : 0;
		var noPayVateAmountPercent = data.noPayVateAmountPercent ? data.noPayVateAmountPercent : 0;
		if(payVateAmountSumSum || noPayVateAmountSum){
			paymentChartsNotFixedData = [
				{
					value: payVateAmountSumSum,
					name: "累计含税付款金额："+App.unctionToThousands(payVateAmountSumSum)+"元"
				},
				{
					value: noPayVateAmountSum,
					name: "剩余含税未付款金额："+App.unctionToThousands(noPayVateAmountSum)+"元"
				}
			];
			paymentChartsNotFixedOption = initCharts("合同付款（框架协议）","框架协议对应的订单累计付款金额情况",paymentChartsNotFixedData);
			$("#paymentChartsNotFixedValue").text(parseFloat((noPayVateAmountPercent*100).toPrecision(12)) + "%")
		}else{
			paymentChartsNotFixedOption = initCharts("合同付款（框架协议）","框架协议对应的订单累计付款金额情况",paymentChartsNotFixedData,true);
			$("#paymentChartsNotFixedValue").text("0%")
		}
	}else{
		paymentChartsNotFixedOption = initCharts("合同付款（框架协议）","框架协议对应的订单累计付款金额情况",paymentChartsNotFixedData,true);
		$("#paymentChartsNotFixedValue").text("0%")
	};
	paymentChartsNotFixedDom.setOption(paymentChartsNotFixedOption);
}
/*
 * 设置截止日期
 */
var invoiceChartsNoteSum = 0;
var invoiceChartsNoteText = "";
function setInvoiceChartsNote(data){
	invoiceChartsNoteSum++;
	if(data){
		var data = data.split("-");
		var resultData = "";
		$.each(data, function(k,v) {
			if(k == 0){
				resultData += v + "年";
			}else if(k == 1){
				resultData += v + "月";
			}else if(k == 2){
				resultData += v + "日";
			}
		});
		invoiceChartsNoteText = "*以上统计数据截至" + resultData;
	}
	if(invoiceChartsNoteSum == 2){
		if(invoiceChartsNoteText){
			$("#invoiceChartsNote").text(invoiceChartsNoteText);
		}else{
			$("#invoiceChartsNote").text("*该图表暂未汇总到数据");
		}
		
	}
}
/*
 * 生成环形图配置项
 */
function initCharts(title,subtext,data,isEmpty){
	var borderWidth = 2;
	var formatter = "{a} <br/>{b} ({d}%)";
	if(isEmpty){
		borderWidth = 0;
		formatter = title;
		for(var i = 0; i < data.length; i++){
			formatter += "<br />" + data[i].name;
		}
	}
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
		tooltip: {
			confine:"true",
	        trigger: 'item',
	        textStyle: {
	        	fontSize: 12
	        },
	        formatter: formatter
	    },
		legend: {
			orient: 'vertical',
			top: 'bottom',
			itemWidth: 8,
	        itemHeight: 8,
	        itemGap: 5,
			selectedMode: false
		},
		color: ['#d11718', '#bfbfbf'],
		series: [{
			clockwise: false,
//			hoverAnimation: false,
			name: title,
			type: 'pie',
			radius: ['35%', '60%'],
			label: {
				normal: {
					show: false,
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			itemStyle: {
                borderWidth: borderWidth,
                borderColor: '#ffffff'
	        },
			data: data
		}]
	};
	return option;
};
