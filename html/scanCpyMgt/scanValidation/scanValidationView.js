//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
console.log(parm);
var contractId = parm.contractId;

//系统的全局变量获取
var config = top.globalConfig;
console.log(config);
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
	var verifyId = 1;
	getScanValidationInfo(verifyId);	
})
/*
 * 获取合同基本信息
 */
function getScanValidationInfo(verifyId){
	var postData = {
		verifyId : verifyId
	}
	App.formAjaxJson(serverPath + "sysScanValidation/getSysScanValidationId?verifyId="+verifyId, "post", "", successCallback);
	function successCallback(result) {
		var data = result.data;
		console.log(result);
	}
	//	var url = encodeURIComponent("/pdf.js/web/compressed.tracemonkey-pldi-09.pdf");
	
	var isDifferences = true;
	var verifyNumber = 2;
	
	validationResultView(isDifferences,verifyNumber);
	if(isDifferences){
		setTbodyValue();
		if(verifyNumber > 1){
			
		}
	}
	var textPdf = "contract1.pdf";
	var scandocPdf = "contract2.pdf";
	//$("#textPdfContent").attr("src", "/static/plugins/pdf/web/viewer.html?file="+textPdf);
	//$("#scandocPdfContent").attr("src", "/static/plugins/pdf/web/viewer.html?file="+scandocPdf);
}
/*
 * 加载右侧差异项的列表的tbody
 */
function setTbodyValue(data){
	var html = "";
	for(var i = 0; i < 20; i++){
		html += '<tr>'+
				'<td>' + i + '</td>'+
				'<td>合同定稿正文测试</td>'+
				'<td>正文扫描件测试</td>'+
				'</tr>'
	}
	$("#differenceTbody").html(html);
}
/*
 * 验证有差异时右侧table的点击事件
 */
$("#differenceTbody").on("click","tr",function(el){
	console.log(el)
	alert("事件委托点击")
})
//返回上一页
function backPage(){
	window.history.go(-1);
}
/*
 * 设置验证结果页面展示形式
 */
function validationResultView(isDifferences,verifyNumber){
	if(isDifferences){
		$("#differencesThat").removeClass("hidden");
		$("#textPdfDiv,#scandocPdfDiv,#differenceDiv").addClass("col-sm-4");
		$("#scaleContent").css("padding-left","20%");
		if(verifyNumber > 1){
			$("#differencesRecord").removeClass("hidden");
		}
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




