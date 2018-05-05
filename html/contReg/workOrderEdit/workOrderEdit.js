//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();

//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

$(function() {
	if(parm.pageType == 1) {
		$(".portlet-title").remove();
		$(".page-content,.portlet-body").css("padding", '0px');
		$(".portlet").css("cssText", "border:none !important;padding:0px");
		$(".page-content").removeClass("hidden");
	} else {
		$(".page-content").removeClass("hidden");
	};
	//固定操作按钮在70px的高度
	App.fixToolBars("toolbarBtnContent", 70);
	setDomContent();
})
/*
 * 设置dom元素，并load进入
 */
function setDomContent(type) {
	//type区别类型
	var domObj = {
		contractOverview: "module/_contractOverview.html",
		contractFeasor: "module/_contractFeasor.html",
		contractEffectiveInfo: "module/_contractEffectiveInfo.html",
		contractScanCopyList: "module/_contractScanCopyList.html",
		procurementInfo: "module/_procurementInfo.html",
		accountInfo: "module/_accountInfo.html",
		invoiceInfo: "module/_invoiceInfo.html",
		otherFinanceInfo: "module/_otherFinanceInfo.html",
		procurementInfo: "module/_procurementInfo.html",
		alterationInfo: "module/_alterationInfo.html"
	}
	var loadFlag = 0;
	var loadEndLen = Object.keys(domObj).length;
	$.each(domObj, function(k, v) {
		var domHtml = '<div id="' + k + '" class="form-wrapper" data-target="' + k + '">';
		$("#workOrderContent").append(domHtml);
		$("#" + k + "").load(v + "?" + App.timestamp(), function() {
			loadFlag++;
			if(loadFlag == loadEndLen) {
				//dom区域全部加载完成
				loadComplete();
			}
		});
	});
}
/*
 * dom区域全部加载完成后的函数
 */
function loadComplete() {
	App.init();
}
/*
 * 保存操作
 */
function saveContent() {
	var submitData = {};
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("getValue_" + targetObj)){
			return false;
		};
		var itemFun = eval('getValue_' + targetObj);
		submitData[targetObj] = itemFun();
	})
	console.log(submitData)
}
 