//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
console.log(parm);

//系统的全局变量获取
var config = top.globalConfig;
//console.log(config);
var serverPath = config.serverPath;

//全局变量
var pdfLoadFlag = 0;
var timer = null;
var verifyId = null;
var isDifferences = null;
var isLeader = null;

//页面初始化事件
$(function() {
	if(parm.pageType == 1){
		$(".toolbarBtn,.portlet-title,.closeBtn").remove();
		$(".page-content,.portlet-body").css("padding",'0px');
		$(".portlet").css("cssText","border:none !important;padding:0px");
		$(".page-content").removeClass("hidden");
		verifyId = parm.businessKey;
		if(parm.taskFlag = "db"){
			$("#setExplain").removeClass("hidden");
		}else{
			$("#setExplain").remove();
			$("#toolbarBtnContent").remove();
		};
		if(parm.taskDefinitionKey == "YZSP"){
			isLeader = true;
		}else{
			isLeader = false;
		}
	}else{
		$(".page-content").removeClass("hidden");
		$("#setExplain,.reuploadBtn").remove();
		verifyId = parm.verifyId;
	};
	//固定操作按钮在70px的高度
	App.fixToolBars("toolbarBtnContent", 70);
	//获取合同基本信息
	getScanValidationInfo(verifyId);	
})


/*
 * 工作流回调页面方法
 * isDifferences是否有差异，无差异直接提交不选人-false，有差异选人-true
 * isLeader 是否为领导， true领导>选人|退回承办人   ，false 非领导 > 重新上传|下一步选人
 */
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
	
	//3,设置路由值，默认为0，对于有分支的场景需要单独设置路由值
	parent.setPathSelect(pathSelect);
	
	//4,设置选人单选还是多选。
	var staffSelectType=$("#staffSelectType").val();
	parent.setStaffSelectType(staffSelectType);
	
	//5,设置办理意见
	if(pass){
		var businessInfo = $("#differencesExplain").val();
		parent.setComment(businessInfo);
	}
	return result;
}
//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_pass(root, taskDefinitionKey, assignee, processInstanceId, taskId, comment, handleType, withdraw){
	//alert( "目标任务定义：" + taskDefinitionKey + "_目标受理人：" + assignee + "_流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_审批意见：" + comment + "_处理方式：" + handleType + "_是否可回撤" + withdraw);
	//自定义业务上传接口
//	$("#differencesExplain").val()	意见的获取
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
	}
	App.formAjaxJson(serverPath + "sysScanValidation/getSysScanValidationId", "post", JSON.stringify(postData), successCallback,improperCallback);
	function successCallback(result) {
		var data = result.data;
		console.log(data);
		
	}
	function improperCallback(result){
		console.log(result);
	}
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
		var data = result.data;
		console.log(data);
		var verifyState = "";
		if(data.verifyStatus == 1){
			verifyState = "草稿";
		}else if(data.verifyStatus == 2){
			verifyState = "审批中";
		}else if(data.verifyStatus == 3){
			verifyState = "生效";
		}else if(data.verifyStatus == 4){
			verifyState = "失效";
		}
		$("#verifyState").text(verifyState);
		var verifyVersion = data.verifyVersion == null ? "暂无版本" : data.verifyVersion;
		$("#contratVersion").text(verifyVersion);
		//判断是否有差异
		if(data.verifyDiffCount == null || data.verifyDiffCount == "" || data.verifyDiffCount == undefined){
			isDifferences = false;
		}else{
			isDifferences = true;
		};
		//设值展现形式
		validationResultView(isDifferences);
//		var executeDeptName = data.executeDeptName == null || data.executeDeptName == undefined ? "" :  data.executeDeptName;
		$("#contractNumber").val(data.contractNumber);
		$("#executeDeptName").val(data.executeDeptName);
		$("#contractName").val(data.contractName);
		$("#undertakeName").val(data.undertakeName);
		$("#mobilPhone").val(data.mobilPhone);
    	$("#phone").val(data.phone);
		$("#otherPartyName").text(data.otherPartyName);
    	$("#ourPartyName").text(data.ourPartyName);
		//pdf URL设值
		//	var url = encodeURIComponent("/pdf.js/web/compressed.tracemonkey-pldi-09.pdf");
		var textPdf = "contract1.pdf";
		var scandocPdf = "contract2.pdf";
		$("#textPdfContent").attr("src", "/static/plugins/pdf/web/viewer.html?file="+textPdf);
		$("#scandocPdfContent").attr("src", "/static/plugins/pdf/web/viewer.html?file="+scandocPdf);
		//若有差异查询差异记录
		if(isDifferences){
			getDifferenceRecord(data.contractId)
		}
	}
	function improperCallback(){
		clearInterval(interval1);
		clearInterval(interval2);
	}
}
/*
 * 若有版本差异记录获取版本差异
 */
function getDifferenceRecord(contractId){
	var postData = {
		contractId : contractId
	}
	App.formAjaxJson(serverPath + "sysScanValidation/getVerifyDiffId", "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
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
	if(tSBusiProcessInfoVo.length == 0 && parm.pageType == 2){
		$("#differencesThat").remove();
	}else{
		if(tSBusiProcessInfoVo.length > 0){
			var thatItemHtml = "";
			for(var i = tSBusiProcessInfoVo.length - 1; i >= 0; i--){
				thatItemHtml += creatThatItemHtml(tSBusiProcessInfoVo[i]);
			}
			$("#thatItemContent").html(thatItemHtml);
		};
		var differenceTbodyHtml = "";
		for(var k = 0; k < verifyDiffVo.length; k++){
			differenceTbodyHtml += creatDiffTbodyHtml(verifyDiffVo[k],k)
		}
		$("#differenceTbody").html(differenceTbodyHtml);
	}
}
/*
 * 生成消息项
 */
function creatThatItemHtml(data){
	var thatItemTitle = data.createdType == 2 ? "承办领导" : "承办人";
	var thatItemContent = data.pinfoContent;
	var thatItemFooter = data.orgName + "：" + data.createdName + "<span class='marL30'>" + data.ctreatedDate;
	var html = '<div class="col-sm-12 differencesThatItem">'+
		'<div class="thatItemTitle">'+ thatItemTitle +'</div>'+
		'<div class="thatItemContent">'+ thatItemContent +'</div>'+
		'<div class="thatItemFooter">'+ thatItemFooter +'</div>'+
		'</div>';
	return html;
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
	alert($(this).data("textpageno"));
//	var textpageno = $(this).data("textpageno");
//	document.getElementById("textPdfContent").contentWindow.PDFViewerApplication.page = textpageno;	
//	pdfApiSearch("textPdfContent",$(this).children().eq(1));
//	document.getElementById("scandocPdfContent").contentWindow.PDFViewerApplication.page = textpageno;
//	pdfApiSearch("scandocPdfContent",$(this).children().eq(2));
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
			for(var o = diffInfoItem.tSBusiProcessInfoVo.length - 1; o >= 0; o--){
				thatItemHtml += creatThatItemHtml(diffInfoItem.tSBusiProcessInfoVo[o]);
			}
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
var interval1 = setInterval('loadTextPdf()', 300);
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
var interval2 = setInterval('loadScandocPdf()', 300);
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
