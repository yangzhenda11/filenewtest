//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var formSubmit = false;				//全局加载成功标识位
var wcardId = null;					//工单主键ID
var wcardTypeCode = null;			//工单类型，0：其他，1：收入类-租线合同，2：支出类-采购合同
var contractId = null;				//合同ID
var contractNumber = null;			//合同编号
var contractStatus = null;			//合同状态，1、 已审批，2、 作废，3、 作废申请中
var isEdit = false;					//是否可以编辑标识位
var isCancelApproved = false;		//是否为退回状态标识位

var curStaffOrgId = config.curStaffId;	//工作流需要用户ID

/*
 * 页面是待办且为工单处理时才可以编辑
 */
if(parm.taskDefinitionKey == "GDCL" && parm.taskFlag == "db"){
	isEdit = true;
};

$(function() {
	if(parm.pageType == 1) {		//工作流页面进入
		wcardId = parm.businessKey;
		$(".portlet-title").remove();
		$(".page-content,.portlet-body").css("padding", '0px');
		$(".portlet").css("cssText", "border:none !important;padding:0px");
		$(".toolbarBtn").remove();
		$(".page-content").removeClass("hidden");
		if(parm.taskFlag == "db"){
			if(parm.taskDefinitionKey == "GDCL"){
				$("#flowLable").text("工单处理");
				//工单处理环节将提交按钮改为“注册完成” btId：passButton   
				parent.setUserBtName("passButton","注册完成");
				//工单处理环节将返回待办列表改为“关闭” btId：backTolist
				parent.setUserBtName("backTolist","关闭");
			}else if(parm.taskDefinitionKey == "GDQR"){
				$("#flowLable").text("工单确认");
				//工单确认环节将提交按钮改为“工单激活” btId：passButton   
				parent.setUserBtName("passButton","激活合同");
				//工单处理环节将回退按钮改为“退回承办人” btId：backButton
				parent.setUserBtName("backButton","退回承办人");
				//工单处理环节将返回待办列表改为“关闭” btId：backTolist
				parent.setUserBtName("backTolist","关闭");
			};
		}else{
			if(parm.taskDefinitionKey == "GDCL"){
				$("#flowLable").text("工单处理");
			}else if(parm.taskDefinitionKey == "GDQR"){
				$("#flowLable").text("工单确认");
			};
		}
	} else if(parm.pageType == 2) {		//工单处理和工单激活页面进入
		wcardId = parm.wcardId;
		$("#flowNote").remove();
		if(parm.taskDefinitionKey == "GDCL" && parm.taskFlag == "db"){
			$(".sendBackBtn,.activateBtn").remove();
		}else if(parm.taskDefinitionKey == "GDQR" && parm.taskFlag == "db"){
			$(".saveBtn,.register,.cancelApprovedBtn").remove();
		};
		$(".page-content").removeClass("hidden");
		App.fixToolBars("toolbarBtnContent", 70);	//固定操作按钮在70px的高度
	} else if(parm.pageType == 0) {		//关联合同页面点击进入
		wcardId = parm.wcardId;
		$(".toolbarBtn,#flowNote").remove();
		$(".page-content").removeClass("hidden");
	} else if(parm.pageType == 4) {		//工单查询页面进入
		wcardId = parm.wcardId;
		$("#flowNote").remove();
		$("#toolbarBtnContent button").not(".closeBtn").remove();
		$(".page-content").removeClass("hidden");
		App.fixToolBars("toolbarBtnContent", 70);	//固定操作按钮在70px的高度
	};
	//请求工单模块，获取基本信息及各模块的url
	getWorkOrderInfo();
})
/*
 * 工作流相关
 */
//通过或退回回调的方法@工作流
function beforePushProcess(pass){
	var result = true;
	var pathSelect = 0;
	//1，业务侧的校验，校验不通过则返回false
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(1);
		if(!wcardCanSubmit){
			return false;
		};
		//删除表格内多余的数据
		removeMoreThanTablecontent();
		//手动触发表单验证
		var bootstrapValidator = $('#workOrderContentForm').data('bootstrapValidator');
	    bootstrapValidator.validate();
	    if(!bootstrapValidator.isValid()){
	        parent.layer.alert("当前工单表单校验未通过，请检查",{icon:2,title:"错误"});
	        srolloOffect($("#workOrderContentForm").find(".has-error")[0],1);
	    	return false;
	    }else{
	    	var submitData = getContentValue(true);
	    	if(!submitData){
				return false
			};
    	};
    	if(parm.taskDefinitionKey == "GDQR" && pass == true){
    		var adminCommitmentValue = $("input[name='adminCommitment']:checked").val();
			if(adminCommitmentValue == null){
				parent.layer.alert("请勾选合同管理员确认信息!",{icon:2,title:"错误"});
				srolloOffect("#adminCommitmentContent");
				return false;
			};
    	}
	}else{
		parent.layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
	//2,设置下一步选人的参数，用于匹配通用规则选人。
	var assigneeParam = { 
		"prov": "sd",  //省分，来自需求工单，必传
	}
	parent.setAssigneeParam(assigneeParam);
	
	//3,设置路由值
	parent.setPathSelect(pathSelect);
	
	//4,设置选人单选还是多选。
	//var staffSelectType=$("#staffSelectType").val();
	//parent.setStaffSelectType(staffSelectType);
	
	return result;
}
//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_pass(root, taskDefinitionKey, assignee, processInstanceId, taskId, comment, handleType, withdraw){
	var postData = {
		"processInstanceId" : processInstanceId,//当前流程实例
		"taskId" : taskId,//当前任务id
		"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
		"assignee" : assignee,//下一步参与者
		"comment" : comment,//下一步办理意见
		"handleType" : handleType,//处理类型，1为通过，2为回退
		"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
		"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
		"title":""//可不传，如果需要修改待办标题则传此参数。
	};
	if(handleType == 1 && parm.taskDefinitionKey == "GDCL"){		//工单注册点击@工作流
		var datas = getContentValue(true);
		postData = $.extend(postData, datas);
		postData.wcardId = wcardId;
		postData.wcardType = wcardTypeCode;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
		function successCallback(result) {
			var data = result.data;
			if(data.success == "000"){
				parent.layer.alert(data.message,{icon:2});
			}else{
				parent.layer.alert("注册成功！",{icon:1},function(){
					parent.modal_close();
				});
			}
		}
		function improperCallback(result){
			parent.layer.alert(result.message,{icon:2});
		}
	}else if(handleType == 2 && parm.taskDefinitionKey == "GDQR"){		//工单退回点击@工作流
		var pinfoContent = $('#comment', parent.document).val();
		postData.pinfoContent = pinfoContent;
		postData.busiId = wcardId;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderFallbackProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
		function successCallback(result) {
			var data = result.data;
			parent.layer.alert("退回成功！",{icon:1},function(){
				parent.modal_close();
			});
		}
		function improperCallback(result){
			parent.layer.alert(result.message,{icon:2});
		}
	}else if(handleType == 1 && parm.taskDefinitionKey == "GDQR"){		//工单激活点击@工作流
		parent.layer.confirm("注意：合同激活后将进入履行阶段。",{icon:7,title:"提示"},function(index){
			parent.layer.close(index);
			postData.validity = {};
			postData.validity.adminCommitment = 1;
			postData.validity.validityId = $("#validityId").val();
			postData.wcardId = wcardId;
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
			function successCallback(result) {
				var data = result.data;
				parent.layer.alert("激活成功！",{icon:1},function(){
					parent.modal_close();
				});
			}
			function improperCallback(result){
				parent.layer.alert(result.message,{icon:2});
			}
		});
	}
}
//工单处理取消审批按钮点击@工作流
function modal_passQxsp(flowParam){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(1);
		if(!wcardCanSubmit){
			return false;
		};
		if(flowParam){
			var postData = flowParam;
		}else{
			var postData = {};
		};
		parent.layer.confirm("请确认是否取消该工单的审批。",{icon:7,title:"提示"},function(index){
			parent.layer.close(index);
			postData.wcardId = wcardId;
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderCancelApprovalProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
			function successCallback(result) {
				parent.layer.alert("取消成功。",{icon:1},function(index){
					//parent.layer.close(index);
					//window.location.reload();
					parent.modal_close();
				});
			}
			function improperCallback(result){
				parent.layer.alert(result.message,{icon:2});
			}
		});
	}else{
		parent.layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
//保存回调业务侧实现的方法@工作流
function modal_save(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(1);
		if(!wcardCanSubmit){
			return false;
		};
		if(parm.taskDefinitionKey == "GDCL"){
			saveContent();
		}else{
			parent.layer.msg("当前环节不需要保存");
		}
	}else{
		parent.layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
//转派前回调业务侧实现的方法，业务进行必要的校验等操作@工作流
function beforeTransfer(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(1);
		if(!wcardCanSubmit){
			return false;
		};
		var result=true;
		//1,业务侧的校验
		
		//2，设置转派选人的参数
		var assigneeParam = { 
				"prov": "sd",  //省分，来自需求工单，必传
		}
		parent.setAssigneeParam(assigneeParam);
		return result;
	}else{
		parent.layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
//撤回代码示例，业务界面需要实现，可以拼接业务参数到后台，数据的更新和流程的撤回放在业务侧方法里，保持事务同步@工作流
function modal_return(root, processInstanceId, taskId){
	if(formSubmit){
		//alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId);
		var wcardCanSubmit = checkContractStatus(1);
		if(!wcardCanSubmit){
			return false;
		};
		$.post(root + "business/withdrawProcess", {
			"processInstanceId" : processInstanceId,//流程实例
			"taskId" : taskId //任务id
		}, function(data) {
			alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
			// 成功后回调模态窗口关闭方法
			parent.modal_close();
		});
	}else{
		parent.layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
/*
 * 保存按钮点击@功能页面
 */
function saveBtnClick(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(2);
		if(!wcardCanSubmit){
			return false;
		};
		saveContent();
	}else{
		layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
/*
 * 注册按钮点击@功能页面
 */
function submitContent(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(2);
		if(!wcardCanSubmit){
			return false;
		};
		//删除表格内多余的数据
		removeMoreThanTablecontent();
		//手动触发表单验证
		var bootstrapValidator = $('#workOrderContentForm').data('bootstrapValidator');
	    bootstrapValidator.validate();
	    if(!bootstrapValidator.isValid()){
	        layer.alert("当前工单表单校验未通过，请检查",{icon:2,title:"错误"});
	        srolloOffect($("#workOrderContentForm").find(".has-error")[0],1);
	    	return false;
	    }else{
	    	var submitData = getContentValue(true);
	    	if(submitData){
	    		var flowKey = "Contractproject2Process";
	    		var linkcode = "GDCL";
	    		var prov = "sd";
	    		var callbackFun = "submitContentPost";
	    		var staffSelectType = 1;
	    		jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType);
			}
    	}	
	}else{
		layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
/*
 * 工单注册后台提交@功能页面
 */
function submitContentPost(ORG_ID,org_code,full_name,STAFF_NAME,STAFF_ORG_ID,callbackFun){
	var postData = App.getFlowParam(serverPath,parm.wcardId,1,0);
	postData.assignee = STAFF_ORG_ID;
	postData.wcardId = wcardId;
	postData.wcardType = wcardTypeCode;
	var datas = getContentValue(true);
	postData = $.extend(postData, datas);
	$("#PandJstaffiframetask").modal("hide");
	App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		if(data.success == "000"){
			layer.alert(data.message,{icon:2});
		}else{
			layer.alert("注册成功！",{icon:1},function(){
				backPage();
			});
		}
	}
	function improperCallback(result){
		layer.alert(result.message,{icon:2});
	}
}
/*
 * 调出选人页面（参考工作流）
 */
function jandyStaffSearch(flowKey,linkcode,prov,callbackFun,staffSelectType){
	var frameSrc ="/html/workflow/assignee/assgigneeList.html?" + App.timestamp(); 
    $("#PandJstaffiframetask").load(frameSrc,function() {
    	$("#PandJstaffiframetask").modal('show');
    	setParam(flowKey,linkcode,prov,callbackFun,staffSelectType);
    	$("#PandJstaffiframetask").off('shown.bs.modal').on('shown.bs.modal', function (e) {
			App.initDataTables('#searchStaffTable', "#searchEforgHome", dataTableConfig);
			$(".checkall").click(function () {
			      var check = $(this).prop("checked");
			      $(".checkchild").prop("checked", check);
			});
		})
    });
}
/*
 * 激活按钮点击@功能页面
 */
function activateContract(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(2);
		if(!wcardCanSubmit){
			return false;
		};
		var adminCommitmentValue = $("input[name='adminCommitment']:checked").val();
		if(adminCommitmentValue == 1){
			var adminCommitment = 1;
		}else{
			var adminCommitment = 0;
		};
		if(adminCommitment == 0){
			layer.alert("请勾选合同管理员确认信息!",{icon:2,title:"错误"});
			srolloOffect("#adminCommitmentContent");
			return false;
		}else{
			layer.confirm("注意：合同激活后将进入履行阶段。",{icon:7,title:"提示"},function(index){
				layer.close(index);
				var postData = App.getFlowParam(serverPath,parm.wcardId,1,0);
				postData.validity = {};
				postData.validity.adminCommitment = adminCommitment;
				postData.validity.validityId = $("#validityId").val();
				postData.wcardId = wcardId;
				App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderApprovalProcess", "post", JSON.stringify(postData), successCallback,improperCallback);
				function successCallback(result) {
					var data = result.data;
					layer.alert("激活成功！",{icon:1},function(){
						backPage();
					});
				}
				function improperCallback(result){
					layer.alert(result.message,{icon:2});
				}
			});
		}
	}else{
		layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
/*
 * 取消审批点击@功能页面
 */
function cancelApproved(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(2);
		if(!wcardCanSubmit){
			return false;
		};
		layer.confirm("请确认是否取消该工单的审批。",{icon:7,title:"提示"},function(index){
			layer.close(index);
			var flowParam = App.getFlowParam(serverPath,parm.wcardId,8,1);
			flowParam.wcardId = wcardId;
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderCancelApprovalProcess", "post", JSON.stringify(flowParam), successCallback,improperCallback);
			function successCallback(result) {
				layer.alert("取消成功。",{icon:1},function(index){
					layer.close(index);
					window.location.reload();
				});
			}
			function improperCallback(result){
				layer.alert(result.message,{icon:2});
			}
		});
	}else{
		layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
/*
 * 退回点击@功能页面
 */
function sendBack(){
	if(formSubmit){
		var wcardCanSubmit = checkContractStatus(2);
		if(!wcardCanSubmit){
			return false;
		};
		$("#pinfoContentModal").modal("show");
	}else{
		layer.alert("页面加载失败",{icon:2,title:"错误"});
		return false;
	}
}
/*
 * 退回确定按钮点击@功能页面
 */
function setPinfoContent(){
	var pinfoContent = $("#pinfoContent").val();
	if(pinfoContent == ""){
		layer.msg("请输入退回原因");
	}else{
		var flowParam = App.getFlowParam(serverPath,parm.wcardId,2,0);
		flowParam.pinfoContent = pinfoContent;
		flowParam.busiId = wcardId;
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderFallbackProcess", "post", JSON.stringify(flowParam), successCallback,improperCallback);
		function successCallback(result) {
			var data = result.data;
			layer.alert("退回成功！",{icon:1},function(){
				backPage();
			});
		}
		function improperCallback(result){
			layer.alert(result.message,{icon:2});
		}
	};
}
/*
 * 检查当前工单是否处于作废(contractStatus=2)或作废申请中(contractStatus=3)
 * 处于这两种状态下不能进行下一步操作，返回false
 * parm 1:工作流  2：功能页面
 */
function checkContractStatus(parm){
	if(contractStatus == null){
		showLayerErrorMsg(parm,'当前合同状态未知，请稍后操作！');
		return false;
	}else if(contractStatus == 2){
		showLayerErrorMsg(parm,'当前合同处于"作废"状态，不能进行下一步操作！');
		return false;
	}else if(contractStatus == 3){
		showLayerErrorMsg(parm,'当前合同处于"作废申请中"状态，不能进行下一步操作！');
		return false;
	}else{
		return true;
	};
}
function showLayerErrorMsg(parm,ms){
	if(parm == 1){
		parent.layer.alert(ms,{icon:2});
	}else if(parm == 2){
		layer.alert(ms,{icon:2});
	};
}

/*
 * 请求工单模块，获取基本信息及各模块的url
 */
function getWorkOrderInfo(){
	App.formAjaxJson(serverPath + "contractOrderEditorController/listDomainInfo", "post", JSON.stringify({wcardId:wcardId}), successCallback);
	function successCallback(result) {
		var data = result.data;
		var wcardType = "未知类型";
		if(data.length > 0){
			var domObj = [];
			contractId = data[0].contractId;
			contractNumber = data[0].contractNumber;
			wcardTypeCode = data[0].wcardTypeCode;
			if(isEdit== true && data[0].wcardProcess == 2 && wcardStatus == 904020){
				isCancelApproved = true;
				if(parm.pageType == 1){
					//显示取消审批按钮
					parent.setQxspButton(true,parm.businessKey);
				}
				if(parm.pageType == 2){
					$("#cancelApprovedBtn").removeClass("hidden");
				}
			}else{
				$("#cancelApprovedBtn").remove();
			};
			if(wcardTypeCode == 1){
				wcardType = "收入类-租线合同";
			}else if(wcardTypeCode == 2){
				wcardType = "支出类-采购合同";
			}else if(wcardTypeCode == 0){
				wcardType = "其他";
			};
			for(var i = 0; i < data.length; i++){
				var item = {
					key:data[i].domainEntityName,
					value:data[i].domainUrl
				}
				domObj.push(item);
			};
			var addDemo = {
				key:"scanCpyUpload",
				value:"module/_scanCpyUpload.html"
			};
			//domObj.unshift(addDemo);
			setDomContent(domObj);
		}else{
			layer.alert("当前工单暂无信息",{icon:2,title:"错误"})
		};
		$(".wcardType").text(wcardType);
	}
}
/*
 * 设置dom元素，并load进入
 */
function setDomContent(domObj) {
	var loadFlag = 0;
	var loadEndLen = domObj.length;
	for(var i = 0; i < domObj.length; i++){
		var k = domObj[i].key;
		var v = domObj[i].value;
		var domHtml = '<div id="' + k + '" class="form-wrapper" data-target="' + k + '"></div>';
		$("#workOrderContent").append(domHtml);
		$("#" + k + "").load(v + "?" + App.timestamp(), function() {
			loadFlag++;
			if(loadFlag == loadEndLen) {
				loadComplete();
			}
		});
	};
}
/*
 * dom区域全部加载完成后的函数
 */
function loadComplete() {
	formSubmit = true;
	//页面元素初始化
	App.init();
	//加载验证壳
	validate();
	//加载意见
	getBusiProcessInfoID();
	//加载快捷跳转
	setSpeedyJump();
};
/*
 * 加载意见
 */
function getBusiProcessInfoID(){
	var url = serverPath + "contractOrderEditorController/getBusiProcessInfoID";
	App.formAjaxJson(url, "get", {wcardId:wcardId}, successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data.length > 0){
			var busiProcess = "";
			var o = 0;
			for(var i = data.length-1; i >= 0; i--){
				o++;
				var createdName = data[i].createdName == null ? "" : data[i].createdName;
				if(data[i].createdType == 1){
					if(data[i].pinfoContent == "取消审批"){
						busiProcess += "<p>【"+ o +"】  合同承办人-"+createdName+"  取消审批  ("+data[i].ctreatedDate+")</p>";
					}else{
						busiProcess += "<p>【"+ o +"】  合同承办人-"+createdName+"  申报意见："+data[i].pinfoContent+"  ("+data[i].ctreatedDate+")</p>";
					};
				}else{
					busiProcess += "<p>【"+ o +"】  合同管理员-"+createdName+"  审核意见："+data[i].pinfoContent+"  ("+data[i].ctreatedDate+")</p>";
				}
			};
			var html = '<div class="form-fieldset"><div class="form-fieldset-title"><span><i class="iconfont icon-layers"></i> 工单处理意见</span><div class="form-fieldset-tools"></div></div><div class="form-fieldset-body">'+
				'<div class="row">'+busiProcess+'</div></div></div>';
			if(isCancelApproved && parm.taskFlag == "db"){
				$("#workOrderContent").prepend(html);
			}else{
				$("#workOrderContent").append(html);
			}
		}
	}
}
/*
 * 滚动到相应位置高度
 */
function srolloOffect(el,srolloParm){
	var scrollTopParm = 200;
	if(srolloParm == 1){
		if($(el).parents("#incomeLinerentTbody")[0]){
			var scrollLeftValue = $(el).offset().left - $(".page-content").width() + 500;
			if(scrollLeftValue > 0){
				$("#incomeLinerentTableContent").scrollLeft(scrollLeftValue);
			}
		}
	}else if(srolloParm == 2){
		if(parm.pageType == 1) {
			scrollTopParm = 0;
		}else{
			scrollTopParm = 50;
		}
	}
	var v = $(".page-content").scrollTop();
	var scrollTopValue = v + $(el).offset().top - scrollTopParm;
	$('.page-content').animate({
		scrollTop:scrollTopValue
	},300)
}
/*
 * 设置快捷跳转
 */
function setSpeedyJump(){
	var data = titleIconList[wcardTypeCode];
	var html = "";
	$.each(data, function(k,v) {
		if($(v.jumpId)[0]){
			html += '<li onclick="srolloOffect(\''+v.jumpId+'\',2)" data-placement="left" data-trigger="hover" data-toggle="tooltip" title="'+ v.title +'"><i class="iconfont '+ v.icon +'"></i></li>';
		}
	});
	$("#workOrderMenu").html(html);
	$("#workOrderMenu [data-toggle='tooltip']").tooltip();
}
/*
 * 当不为其他类型工单时基本信息“固定金额”为是时，开票信息和账号信息(收款方)加*号@共同函数
 */
function setRequiredIcon(){
	if(wcardTypeCode != 0){
		var isFixedValue = $("input[name='isFixed']:checked").val();
		if(isFixedValue == 1){
			$(".isRequiredIcon").each(function(){
				var addRequiredIconHtml = '<i class="iconfont icon-mi required"></i>' + $(this).text();
				$(this).html(addRequiredIconHtml);
			})
		}
	}
}
/*
 * 获取表单信息
 * 验证各页面返回值，页面内的方法判断都错误时返回false，会阻止提交操作
 * 若都无错误进行下一步操作
 * isSubmit == true 子页面会收到此参数进行逻辑上的判断
 */
function getContentValue(isSubmit) {
	var submitData = {};
	var isPass = true;
    //各页面返回信息验证
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("getValue_" + targetObj)){
			return true;
		};
		var itemFn = eval('getValue_' + targetObj);
		var itemValue = itemFn(isSubmit);
		if(itemValue){
			submitData[targetObj] = itemValue;
		}else{
			isPass = false;
			return false;
		}
	});
	if(isPass){
		submitData.wcardId = wcardId;
		return submitData;
	}else{
		return false;
	};
}
/*
 * 去除表格内多于的行
 */
function removeMoreThanTablecontent(){
    //各页面执行相应的方法，若页面无方法跳过
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("removeMorethan_" + targetObj)){
			return true;
		};
		var itemFn = eval('removeMorethan_' + targetObj);
		itemFn();
	});
}
/*
 * 保存按钮点击
 */
function saveContent(){
	//删除多于表格内的数据
	removeMoreThanTablecontent();
	//手动触发表单特定的验证项
	//var bootstrapValidator = $("#workOrderContentForm").data('bootstrapValidator').validateField('notEmpty');
    //console.log(bootstrapValidator.isValid());
//	    if(!bootstrapValidator.isValid()){
//	        layer.alert("当前工单表单校验未通过，请检查",{icon:2,title:"错误"});
//	        srolloOffect($("#workOrderContentForm").find(".has-error")[0],true);
//	        //$($("#workOrderContentForm").find(".has-error")[0]).find("input,select").focus();
//	    	return false;
//	    };
	var submitData = getContentValue();
	if(submitData){
		var postData = JSON.stringify(submitData);
		App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorInfo", "post", postData, successCallback);
		function successCallback(result) {
			var data = result.data;
			setPageIdCallback(data);
			layer.msg("保存成功");
		}
	}
}

/*
 * 保存或提交后更改各模块内对于ID值得callback函数
 * 页面内需声明"setPageId_"+约定各页面返回的ID值，  （约定为domain的name值即保存时的各模块key+ID）
 */
function setPageIdCallback(data){
	$.each(data, function(k,v) {
		if(!App.isExitsFunction("setPageId_" + k)){
			return true;
		};
		var itemCallbackFn = eval('setPageId_' + k);
		itemCallbackFn(v);
	});
}

/*
 * 表单验证
 * 每个页面中单独往里增加内容，提交时先验证表单
 */
function validate() {
	$('#workOrderContentForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup change',
		message: '校验未通过',
		container: 'popover',
		fields: {}
	});
}

/*
 * 不能为空的验证信息
 */
function addNotEmptyValidatorField(name,msg){
	var notEmptyValidatorField = {
		notEmpty : {
			message : msg
		}
	}
   	App.addValidatorField("#workOrderContentForm",name,notEmptyValidatorField);
}

//返回上一页
function backPage(){
	window.history.go(-1);
}
