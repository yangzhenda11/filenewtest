//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var isSubmit = false;
var wcardId = 12312332132;		//主键ID         测试
var contractId = null;			//合同ID
var wcardTypeCode = null;		//工单类型
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
	getWorkOrderInfo();
})
/*
 * 请求工单模块，获取基本信息及各模块的url
 */
function getWorkOrderInfo(){
	App.formAjaxJson(serverPath + "contractOrderEditorController/listDomainInfo", "post", JSON.stringify({wcardId:wcardId}), successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data.length > 0){
			var domObj = [];
			contractId = data[0].contractId;
			wcardTypeCode = data[0].wcardTypeCode;
			for(var i = 0; i < data.length; i++){
				var item = {
					key:data[i].domainEntityName,
					value:data[i].domainUrl
				}
				domObj.push(item);
			};
			setDomContent(domObj);
		}else{
			layer.alert("当前工单暂无信息",{icon:2,title:"错误"})
		}
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
		var domHtml = '<div id="' + k + '" class="form-wrapper" data-target="' + k + '">';
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
	isSubmit = true;
	App.init();
	validate();
}
/*
 * 获取表单信息
 * 先验证表单
 * 再验证各页面返回值，页面内的方法判断都错误时返回false，会阻止提交操作
 * 若都无错误进行下一步操作
 */
function getContentValue() {
	var submitData = {};
	var isPass = true;
	var bootstrapValidator = $('#workOrderContent').data('bootstrapValidator');
    //手动触发表单验证
    bootstrapValidator.validate();
    if(!bootstrapValidator.isValid()){
        layer.alert("当前工单表单校验未通过，请检查",{icon:2,title:"错误"});
    	return false;
    };
    //各页面返回信息验证
	$('.form-wrapper').each(function(index, wrapperItem) {
		var targetObj = $(wrapperItem).data('target');
		if(!App.isExitsFunction("getValue_" + targetObj)){
			return true;
		};
		var itemFun = eval('getValue_' + targetObj);
		if(itemFun()){
			submitData[targetObj] = itemFun();
		}else{
			isPass = false;
			return;
		}
	});
	if(isPass){
		return submitData;
	}else{
		return false;
	};
}
function saveContent(){
	if(isSubmit){
		var submitData = getContentValue();
		if(submitData){
			alert("提交");
			console.log(submitData);
		}
	}
}
/*
 * 表单验证
 * 每个页面中单独往里增加内容，提交时先验证表单
 */
function validate() {
	$('#workOrderContent').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup change',
		message: '校验未通过',
		container: 'popover',
		fields: {}
	})
}