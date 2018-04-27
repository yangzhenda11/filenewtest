//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
console.log(parm);
var verifyId = parm.verifyId;

//系统的全局变量获取
var config = top.globalConfig;
//console.log(config);
var serverPath = config.serverPath;

//全局变量
var pdfLoadFlag = 0;
var timer = null;

//页面初始化事件
$(function() {
	if(parm.pageType == 1){
		$(".toolbarBtn,.portlet-title").remove();
		$(".page-content,.portlet-body").css("padding",'0px');
		$(".portlet").css("cssText","border:none !important;padding:0px");
		$(".page-content,#setExplain").removeClass("hidden");
	}else{
		$(".page-content").removeClass("hidden");
		$("#setExplain").removeClass("hidden");				//展示,*******删除
		//固定操作按钮在70px的高度
		//App.fixToolBars("toolbarBtnContent", 70);
	}
	//获取合同基本信息
	getScanValidationInfo(verifyId);	
})
/*
 * 获取合同基本信息
 */
function getScanValidationInfo(verifyId){
	var postData = {
		verifyId : verifyId
	}
	App.formAjaxJson(serverPath + "sysScanValidation/getSysScanValidationId", "post", JSON.stringify(postData), successCallback);
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
		$("#contratVersion").text(data.verifyVersion);
		//判断是否有差异
		if(data.verifyDiffCount == null || data.verifyDiffCount == "" || data.verifyDiffCount == undefined){
			var isDifferences = false;
		}else{
			var isDifferences = true;
		};
		//设值展现形式
		validationResultView(isDifferences);
//		var executeDeptName = data.executeDeptName == null || data.executeDeptName == undefined ? "" :  data.executeDeptName;
		$("#contractNumber").val(data.contractNumber);
		$("#executeDeptName").val(data.executeDeptName);
		$("#contractName").val(data.contractName);
		$("#undertakeName").val(data.undertakeName);
		$("#undertakePhone").val(data.undertakePhone);
    	$("#undertakeMobile").val(data.undertakeMobile);
		$("#otherPartyName").val(data.otherPartyName);
    	$("#ourPartyName").val(data.ourPartyName);
		//pdf URL设值
		//	var url = encodeURIComponent("/pdf.js/web/compressed.tracemonkey-pldi-09.pdf");
		var textPdf = "contract1.pdf";
		var scandocPdf = "contract2.pdf";
		//$("#textPdfContent").attr("src", "/static/plugins/pdf/web/viewer.html?file="+textPdf);
		//$("#scandocPdfContent").attr("src", "/static/plugins/pdf/web/viewer.html?file="+scandocPdf);
		//若有差异查询差异记录
		if(isDifferences){
			getDifferenceRecord(data.contractId)
		}
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
		console.log(data);
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
})
/*
 * 加载差异记录的列表及差异说明
 */
function setDifferenceRecord(data){
	for(var i = 1; i < data.length; i++){
		var diffInfoItem = data[i];
		if(diffInfoItem.tSBusiProcessInfoVo.length > 0){
			var thatItemHtml = "";
			for(var i = tSBusiProcessInfoVo.length - 1; i >= 0; i--){
				thatItemHtml += creatThatItemHtml(tSBusiProcessInfoVo[i]);
			}
			$("#thatItemContent").html(thatItemHtml);
		};
		'<div class="form-fieldset">'+
			'<div class="form-fieldset-title">'+
				'<span class="diffVersion">版本号：1</span>'+
				'<span class="diffValiDate">验证日期：2017年3月21日</span>'+
				'<span class="diffNum">共有<span class="mLR5">0</span>项不符</span>'+
				'<div class="form-fieldset-tools"><a href="#" class="form-collapse"><i class="fa fa-angle-up"></i></a></div>'+
			'</div>'+
			'<div class="form-fieldset-body"><div class="row"><div class="col-sm-12 differencesThatItem">'+
				'<div class="thatItemTitle">承办人</div>'+
				'<div class="thatItemContent">因XXX原因，存在差异项，请领导批准。</div>'+
				'<div class="thatItemFooter">采购部: 王芳  2018-01-16   09:23:42</div></div>'+
					'<table class="table table-hover table-bordered table-striped">'+
						'<thead><tr><th>序号</th><th>合同定稿正文</th><th>正文扫描件</th></tr></thead>'+
						'<tbody></tbody>'+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>';
	}
}
//返回上一页
function backPage(){
	window.history.go(-1);
}
/*
 * 设置验证结果页面展示形式
 */
function validationResultView(isDifferences){
	if(isDifferences){
		$("#differencesThat").removeClass("hidden");
		$("#textPdfDiv,#scandocPdfDiv,#differenceDiv").addClass("col-sm-4");
		$("#scaleContent").css("padding-left","20%");
	}else{
		$("#textPdfDiv,#scandocPdfDiv").addClass("col-sm-6");
		$("#differencesThat,#differencesRecord,#differenceDiv").remove();
		$("#scaleContent").css("padding-left","44%");
	};
	var pdfViewHeight = $(".page-content").height() - 10;
	$("#scandocPdfContent,#textPdfContent,#differenceTable").css({"height":pdfViewHeight,"overflow":"auto"});
	$("#validationResult").removeClass("hidden");
	
}
/*
 * 检测两个文档是否加载完成
 */
//var interval1 = setInterval('loadTextPdf()', 300);
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
//var interval2 = setInterval('loadScandocPdf()', 300);
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




