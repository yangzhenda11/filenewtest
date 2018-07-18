//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();

//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

//全局变量
var pdfLoadFlag = 0;
var timer = null;
var verifyId = null;		//页面主键ID
var isDifferences = null;	//是否有差异
var isLeader = null;		//是否是领导审批页面
var relationId = null;		//保存意见是的ID
var contractId = null;		//合同ID
//取关联字典编码
var associateCodeInfo = new Array();
App.formAjaxJson(serverPath + "dicts/listChildrenByDicttId","post",JSON.stringify({"dictId": 9030}),succssCallback,null,null,null,false);
function succssCallback(result) {
    var data = result.data;
    $.each(data, function (i, item) {
        associateCodeInfo[item.dictValue] = item.dictLabel;
    });
}

//页面初始化事件
$(function() {
	if(parm.pageType == 1){
		$(".portlet-title,.toolbarBtn").remove();
		$(".page-content,.portlet-body").css("padding",'0px');
		$(".portlet").css("cssText","border:none !important;padding:0px");
		$(".page-content").removeClass("hidden");
		verifyId = parm.businessKey;
		if(parm.taskFlag == "db"){
			$("#setExplain").removeClass("hidden");
		}else{
			$("#setExplain").remove();
		};
		if(parm.taskDefinitionKey == "YZSP"){
			isLeader = true;
		}else{
			isLeader = false;
		}
	}else if(parm.pageType == 2){
		$(".page-content").removeClass("hidden");
		$("#setExplain").remove();
		verifyId = parm.verifyId;
		//固定操作按钮在70px的高度
		App.fixToolBars("toolbarBtnContent", 70);
	};
	//获取合同基本信息
	getScanValidationInfo(verifyId);	
})


/*
 * 工作流回调页面方法			涉及提交下一步操作的验证
 * isDifferences是否有差异，无差异直接提交不选人-false，有差异选人-true
 * isLeader 是否为领导， true领导>选人|退回承办人   ，false 非领导 > 重新上传|下一步选人
 */
//通过或退回回调的方法
function beforePushProcess(pass){
	var result = true;
	var pathSelect = null;
	//1，业务侧的校验，校验不通过则返回false
	if(isDifferences == null){
		layer.alert("获取页面状态失败",{icon:2});
		return false;
	}else if(isDifferences == false){
		pathSelect = 0;
	}else{
		if($("#differencesExplain").val() == ""){
			layer.alert("请输入意见",{icon:2});
			return false;
		}else if(isLeader == true){
			pathSelect = 0;
		}else{
			pathSelect = 2;
		}
	};
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
		"taskDefinitionKeyNow":parm.taskDefinitionKey,
		"title":""//可不传，如果需要修改待办标题则传此参数。
	};
	//是否有差异
	if(isDifferences == false){
		var url = "sysScanValidation/saveOpinionPushProcessTrue";
		postData.verifyId = verifyId;
	}else{
		//是否承办人
		var createdType = isLeader == true ? 2 : 1;
		var url = "sysScanValidation/saveOpinionPushProcess";
		postData.relationId = relationId;
		postData.busiId = verifyId;
		postData.verifyId = verifyId;
		postData.createdType = createdType;
		postData.pinfoContent = $("#differencesExplain").val();
	};
	App.formAjaxJson(serverPath + url, "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		parent.layer.alert("处理成功",{icon:1},function(){
			parent.modal_close();
		});
	};
	function improperCallback(result){
		parent.layer.alert(result.message,{icon:1});
	}
}
//设置办理意见
function setComment(pass){
	var userComment=$("#differencesExplain").val();
	return userComment;
}
//保存回调业务侧实现的方法。
function modal_save(){
	if(isDifferences == true){
		var createdType = isLeader == true ? 2 : 1;
		var postData = {
			relationId : relationId,
			busiId : verifyId,
			createdType : createdType,
			pinfoContent : $("#differencesExplain").val()
		};
		App.formAjaxJson(serverPath + "sysScanValidation/saveOpinion", "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.msg("保存成功");
			relationId = result.data.saveRelationId;
		}
	}else{
		layer.msg("当前环节不需要保存数据");
	}
	
}
/*
 * 重新上传扫描件,推动工作流
 */
function modal_passBybuss(flowParam){
	var setting = {
		title : "合同正文扫描件上传",
		url:'fileload/uploadFileS3',
		maxNumber:1,
		fileExtensions:["pdf"]
		//extraData:{test:123,test2:456}	//上传时额外附加的参数,业务为正文扫描件上传时要求加displayname字段，可为空
	};
	function queryCallback(){
		var fileInfo = getFileItemInfo();
		$("#commomModal").modal("hide");
		if(flowParam){
			var postData = flowParam;
		}else{
			var postData = {};
		}
		postData.verifyId = verifyId;
		postData.storeId = fileInfo[0].data;
		postData.contractId = contractId;
		App.formAjaxJson(serverPath + "sysScanValidation/uploadScannedDoc", "post", JSON.stringify(postData), successCallback,improperCallback);
		function successCallback(result) {
			parent.layer.alert("提交成功！系统将对扫描件进行验证，验证结果请在待办中查询。",{icon:1},function(){
				parent.modal_close();
			});
		}
		function improperCallback(result){
			parent.layer.alert(result.message,{icon:2});
		}
	}
	App.getFileUploadModal(setting,queryCallback);
}

//转派前回调业务侧实现的方法，业务进行必要的校验等操作。
function beforeTransfer(){
	var result=true;
	//1,业务侧的校验
	
	//2，设置转派选人的参数
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
	}
	parent.setAssigneeParam(assigneeParam);
	return result;
}
//撤回代码示例，业务界面需要实现，可以拼接业务参数到后台，数据的更新和流程的撤回放在业务侧方法里，保持事务同步。
function modal_return(root, processInstanceId, taskId){
	//alert( "流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId);
	
	$.post(root + "business/withdrawProcess", {
		"processInstanceId" : processInstanceId,//流程实例
		"taskId" : taskId //任务id
	}, function(data) {
		alert(data.sign + "（业务开发人员自定义提示消息有无及内容）");
		// 成功后回调模态窗口关闭方法
		parent.modal_close();
	});
}



/*
 * 获取合同基本信息
 */
function getScanValidationInfo(verifyId){
	var postData = {
		verifyId : verifyId
	}
	App.formAjaxJson(serverPath + "sysScanValidation/getSysScanValidationId", "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		console.log(result);
		var data = result.data;
		$("#verifyState").text(associateCodeInfo[data.verifyStatus]);
		$("#contratVersion").text(data.verifyVersion);
		//判断是否有差异
		if(data.verifyDiffCount == null || data.verifyDiffCount == "" || data.verifyDiffCount == undefined){
			isDifferences = false;
		}else{
			isDifferences = true;
		};
		//设值展现形式
		validationResultView(isDifferences);
		contractId = data.contractId;
		var otherPartyName = data.otherPartyName == null || data.otherPartyName == undefined ? "" :  data.otherPartyName;
		var ourPartyName = data.ourPartyName == null || data.ourPartyName == undefined ? "" :  data.ourPartyName;
		$("#contractNumber").val(data.contractNumber);
		$("#executeDeptName").val(data.executeDeptName);
		$("#contractName").val(data.contractName);
		$("#undertakeName").val(data.undertakeName);
		$("#mobilPhone").val(data.mobilPhone);
    	$("#phone").val(data.phone);
		$("#otherPartyName").html(otherPartyName);
    	$("#ourPartyName").html(ourPartyName);
		//pdf URL设值
		if(data.textPdf){
			var textPdf = encodeURIComponent(serverPath + "fileload/downloadS3?key=" + data.textPdf);
			$("#textPdfContent").attr("src", "../../../static/plugins/pdf/web/viewer.html?file="+textPdf);
			interval1 = setInterval('loadTextPdf()', 500);
		}else{
			var doc = document.getElementById("textPdfContent").contentDocument || document.frames["textPdfContent"].document;
        	doc.body.innerHTML = "<div style='color:red;text-align:center'>不存在可加载pdf的url</div>";
		};
		if(data.scandocPdf){
			var scandocPdf = encodeURIComponent(serverPath + "fileload/downloadS3?key=" + data.scandocPdf);
			console.log(scandocPdf);
			$("#scandocPdfContent").attr("src", "../../../static/plugins/pdf/web/viewer.html?file="+scandocPdf);
			interval2 = setInterval('loadScandocPdf()', 500);
		}else{
			var doc = document.getElementById("scandocPdfContent").contentDocument || document.frames["scandocPdfContent"].document;
        	doc.body.innerHTML = "<div style='color:red;text-align:center'>不存在可加载pdf的url</div>";
		};
		//若有差异查询差异记录
		if(isDifferences){
			if(parm.pageType == 1 && parm.taskFlag == "db" && isLeader == false){
				parent.setUserButton(true,parm.businessKey);
			};
			getDifferenceRecord(contractId,data.verifyVersion)
		}
	}
	function improperCallback(result){
		layer.msg(result.message);
		clearInterval(interval1);
		clearInterval(interval2);
	}
}
/*
 * 若有版本差异记录获取版本差异
 */
function getDifferenceRecord(contractId,verifyVersion){
	var postData = {
		contractId : contractId
	}
	App.formAjaxJson(serverPath + "sysScanValidation/getVerifyDiffId", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var result = result.data;
		var data = [];
		for(var i = 0; i < result.length; i++){
			if(result[i].verifyVersion <= verifyVersion){
				data.push(result[i]);
			}
		};
		if(data.length == 0){
			layer.alert("当前验证有差异，暂未获取到差异记录",{icon:2});
			return false;
		};
		//加载右侧差异项的列表的tbody及差异说明
		setDifferenceInfo(data[0]);
		if(data.length > 1){
			$("#differencesRecord").removeClass("hidden");
			//加载差异记录的列表及差异说明
			setDifferenceRecord(data);
		}else{
			$("#differencesRecord").remove();
		}
	}
}
/*
 * 加载右侧差异项的列表的tbody及差异说明
 */
function setDifferenceInfo(data){
	$("#verifyData").text(data.verifyDate);
	var verifyDiffCount = data.verifyDiffCount == null || data.verifyDiffCount == undefined ? 0 : data.verifyDiffCount;
	$("#differenceNumber").text(verifyDiffCount);
	var tSBusiProcessInfoVo = data.tSBusiProcessInfoVo;
	var verifyDiffVo = data.verifyDiffVo;
	if(tSBusiProcessInfoVo.length > 0){
		if(parm.taskFlag == "db"){
			if(isLeader == true){
				if(tSBusiProcessInfoVo[0].createdType == 2){
					$("#differencesExplain").val(tSBusiProcessInfoVo[0].pinfoContent);
					relationId = tSBusiProcessInfoVo[0].relationId;
					tSBusiProcessInfoVo.splice(0,1);
				}
			}else{
				if(tSBusiProcessInfoVo[0].createdType == 1){
					$("#differencesExplain").val(tSBusiProcessInfoVo[0].pinfoContent);
					relationId = tSBusiProcessInfoVo[0].relationId;
					tSBusiProcessInfoVo.splice(0,1);
				}
			}
		}
	};
	if(tSBusiProcessInfoVo.length == 0 && parm.pageType == 2){
		$("#differencesThat").remove();
	}else{
		if(tSBusiProcessInfoVo.length > 0){
			var thatItemHtml = creatThatItemHtml(tSBusiProcessInfoVo);
			$("#thatItemContent").html(thatItemHtml);
		};
	};
	var differenceTbodyHtml = "";
	for(var k = 0; k < verifyDiffVo.length; k++){
		differenceTbodyHtml += creatDiffTbodyHtml(verifyDiffVo[k],k)
	};
	$("#differenceTbody").html(differenceTbodyHtml);
}
/*
 * 生成消息项
 */
function creatThatItemHtml(data){
	var undertakerHtml = "";
	var learderHtml = "";
	var returnHtml = "";
	for(var i = 0; i < data.length; i++){
		var thatItemContent = data[i].pinfoContent;
		var itemDate = data[i].updatedDate == null ? data[i].ctreatedDate : data[i].updatedDate;
		var thatItemFooter = data[i].orgName + "：" + data[i].createdName + "<span class='marL30'>" + itemDate;
		var html = '<div class="thatItemContent">'+ thatItemContent +'</div>'+
			'<div class="thatItemFooter">'+ thatItemFooter +'</div>';
		if(data[i].createdType == 2){
			learderHtml += html;
		}else{
			undertakerHtml += html;
		}
	};
	if(undertakerHtml != ""){
		returnHtml += '<div class="col-sm-12 differencesThatItem">'+
			'<div class="thatItemTitle">承办人</div>'+ undertakerHtml +'</div>';
	};
	if(learderHtml != ""){
		returnHtml += '<div class="col-sm-12 differencesThatItem">'+
			'<div class="thatItemTitle">承办部门领导</div>'+ learderHtml +'</div>';
	};
	
	return returnHtml;
}
/*
 * 生成列表项
 */
function creatDiffTbodyHtml(data,k){
	var html = '<tr data-textpageno='+ data.textPageno +' data-textlineno='+ data.textLineno +'>'+
		'<td>' + (k+1) + '</td>'+
		'<td>'+ data.textDiff +'</td>'+
		'<td>'+ data.scandocDiff +'</td>'+
		'</tr>';
	return html;
}
/*
 * 验证有差异时右侧table的点击事件
 */
$("#differenceTbody").on("click","tr",function(el){
	console.log(this)
	var textpageno = $(this).data("textpageno");
	document.getElementById("textPdfContent").contentWindow.PDFViewerApplication.page = textpageno;	
	pdfApiSearch("textPdfContent",$(this).children().eq(1));
	document.getElementById("scandocPdfContent").contentWindow.PDFViewerApplication.page = textpageno;
	pdfApiSearch("scandocPdfContent",$(this).children().eq(2));
})
/*
 * pdf搜索
 */
function pdfApiSearch(dom,data){
	document.getElementById(dom).contentWindow.PDFViewerApplication.findController.executeCommand('find', {
	    query: data,
	    phraseSearch: true,
	    caseSensitive: true,
	    highlightAll: true,
	    findPrevious: undefined
	});
}

/*
 * 加载差异记录的列表及差异说明
 */
function setDifferenceRecord(data){
	var differenceRecordHtml = "";
	for(var i = 1; i < data.length; i++){
		var diffInfoItem = data[i];
		var verifyDiffCount = diffInfoItem.verifyDiffCount == null || diffInfoItem.verifyDiffCount == undefined ? 0 : diffInfoItem.verifyDiffCount;
		var thatItemHtml = "";
		var differenceTbodyHtml = "";
		//生成意见项
		if(diffInfoItem.tSBusiProcessInfoVo.length > 0){
			if(parm.taskFlag == "db"){
				if(isLeader == true){
					if(diffInfoItem.tSBusiProcessInfoVo[0].createdType == 2){
						diffInfoItem.tSBusiProcessInfoVo.splice(0,1);
					}
				}else{
					if(diffInfoItem.tSBusiProcessInfoVo[0].createdType == 1){
						diffInfoItem.tSBusiProcessInfoVo.splice(0,1);
					}
				};
			};
		}
		if(diffInfoItem.tSBusiProcessInfoVo.length > 0){
			thatItemHtml = creatThatItemHtml(diffInfoItem.tSBusiProcessInfoVo);
		};
		//生成列表项
		if(diffInfoItem.verifyDiffVo.length > 0){
			for(var k = 0; k < diffInfoItem.verifyDiffVo.length; k++){
				differenceTbodyHtml += creatDiffTbodyHtml(diffInfoItem.verifyDiffVo[k],k)
			}
		};
		//拼接dom
		differenceRecordHtml += '<div class="form-fieldset">'+
			'<div class="form-fieldset-title">'+
				'<span class="diffVersion">版本号：'+ diffInfoItem.verifyVersion +'</span>'+
				'<span class="diffValiDate">验证日期：'+ diffInfoItem.verifyDate +'</span>'+
				'<span class="diffNum">共有<span class="mLR5">'+ verifyDiffCount +'</span>项不符</span>'+
				'<div class="form-fieldset-tools"><a href="#" class="form-collapse"><i class="fa fa-angle-down"></i></a></div>'+
			'</div>'+
			'<div class="form-fieldset-body" style="display:none;"><div class="row">'+ thatItemHtml +
					'<table class="table table-hover table-bordered table-striped">'+
						'<thead><tr><th>序号</th><th>合同定稿正文</th><th>正文扫描件</th></tr></thead>'+
						'<tbody>'+ differenceTbodyHtml +'</tbody>'+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>';
	}
	$("#differenceRecordContent").html(differenceRecordHtml);
	panelAction('#differenceRecordContent .form-collapse', '.form-fieldset-title', '.form-fieldset-body', 'fa-angle-up', 'fa-angle-down');
}
//返回上一页
function backPage(){
	window.history.go(-1);
}
/*
 * 设置验证结果页面展示形式
 */
function validationResultView(isDifferences){
	var pdfViewHeight = $(".page-content").height() - 10;
	if(isDifferences){
		$("#differencesThat").removeClass("hidden");
		$("#textPdfDiv,#scandocPdfDiv,#differenceDiv").addClass("col-sm-4");
		$("#scaleContent").css("padding-left","20%");
		$("#pdfToggle").css("height",pdfViewHeight + 25);
		$(".squery").on("click",function(){
			if($(this).data("isFewer")){
				$("#pdfContent,#scaleContent").removeClass("hidden");
				$("#differenceDiv").removeClass("col-sm-12").addClass("col-sm-4");
				$(this).children().removeClass("icon-sanjiaoright").addClass("icon-sanjiaoleft");
				$(this).data("isFewer",false);
			}else{
				$("#pdfContent,#scaleContent").addClass("hidden");
				$("#differenceDiv").removeClass("col-sm-4").addClass("col-sm-12");
				$(this).children().removeClass("icon-sanjiaoleft").addClass("icon-sanjiaoright");
				$(this).data("isFewer",true);
			}
		})
	}else{
		$("#textPdfDiv,#scandocPdfDiv").addClass("col-sm-6");
		$("#differencesThat,#differencesRecord,#differenceDiv").remove();
		$("#scaleContent").css("padding-left","44%");
	};
	$("#scandocPdfContent,#textPdfContent,#differenceTable").css({"height":pdfViewHeight,"overflow":"auto"});
	$("#validationResult").removeClass("hidden");	
}
/*
 * 检测两个文档是否加载完成
 */

function loadTextPdf() {
	if(document.getElementById("textPdfContent").contentWindow.PDFViewerApplication.pdfDocument != null) {
		clearInterval(interval1);
		console.log('Load textPdf Success...');
		pdfLoadFlag++;
		$('#textPdfContent').contents().find('#viewerContainer').on("scroll",function(){
			textPdfScroll();
		});
	}
}

function loadScandocPdf() {
	if(document.getElementById("scandocPdfContent").contentWindow.PDFViewerApplication.pdfDocument != null) {
		clearInterval(interval2);
		console.log('Load scandocPdf Success...');
		pdfLoadFlag++;
		$('#scandocPdfContent').contents().find('#viewerContainer').on("scroll", function(){
			scandocPdfScroll();
		});
	}
}
/*
 * 同步滚动设置
 */
function textPdfScroll(){
	if(pdfLoadFlag == 2){
    	$('#scandocPdfContent').contents().find('#viewerContainer').unbind("scroll");
    	var viewer2scrollTop = $('#textPdfContent').contents().find('#viewerContainer').scrollTop()/$('#textPdfContent').contents().find('#viewer').height()*$('#scandocPdfContent').contents().find('#viewer').height();
    	$('#scandocPdfContent').contents().find('#viewerContainer').scrollTop(viewer2scrollTop);
    	clearTimeout(timer);
    	timer = setTimeout(function() {
        	$('#scandocPdfContent').contents().find('#viewerContainer').on("scroll",function(){
        		scandocPdfScroll();
        	});
    	}, 300 );
    }
}
function scandocPdfScroll(){
	if(pdfLoadFlag == 2){
		$('#textPdfContent').contents().find('#viewerContainer').unbind("scroll");
    	var viewer1scrollTop = $('#scandocPdfContent').contents().find('#viewerContainer').scrollTop()/$('#scandocPdfContent').contents().find('#viewer').height()*$('#textPdfContent').contents().find('#viewer').height();
    	$('#textPdfContent').contents().find('#viewerContainer').scrollTop(viewer1scrollTop);
    	clearTimeout(timer);
    	timer = setTimeout(function() {
        	$('#textPdfContent').contents().find('#viewerContainer').on("scroll",function(){
        		textPdfScroll();
        	});
    	}, 300 );
    }
}
/*
 * 缩放配置
 */
$("#pdfScaleSelect").change(function(){
	if($(this).val() == "custom"){
		$("#customScale").removeClass("hidden");
	}else{
		$("#customScale").addClass("hidden");
		document.getElementById("textPdfContent").contentWindow.PDFViewerApplication.pdfViewer.currentScaleValue = $(this).val();
		document.getElementById("scandocPdfContent").contentWindow.PDFViewerApplication.pdfViewer.currentScaleValue = $(this).val();
	}
})
/*
 * 自定义缩放配置
 */
function customScale(){
	var value = $("#scalevalue").val();
	var reg=/(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{2}$)/
    if(!reg.test(value)){
        layer.msg("请输入大于0的整数或者保留两位小数",{icon:2})
    }else{
        document.getElementById("textPdfContent").contentWindow.PDFViewerApplication.pdfViewer.currentScaleValue = value;
		document.getElementById("scandocPdfContent").contentWindow.PDFViewerApplication.pdfViewer.currentScaleValue = value;
    };
	
}
/*
 * 差异记录收缩
 */
function panelAction(el, parentEl, bodyEl, icon1, icon2) {
	$(el).off("click").on("click",function(){
		var dom = $(this);
		var pnode = dom.closest(parentEl);
		var pbody = pnode.nextAll(bodyEl).first();
		var iconToggle = dom.find('.fa');
		pbody.slideToggle(200);
		iconToggle.toggleClass(icon1).toggleClass(icon2);
	})	
}
