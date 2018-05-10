//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var formSubmit = false;
var wcardId = "123123123123";		//主键ID 工单ID         测试
var contractId = null;				//合同ID
var wcardTypeCode = null;			//合同类型		0:其他类型;1:收入-租线类;2:支出-采购类',
var contractNumber = null;			//合同编号
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
		var wcardType = "未知类型";
		if(data.length > 0){
			var domObj = [];
			contractId = data[0].contractId;
			contractNumber = data[0].contractNumber;
			wcardTypeCode = data[0].wcardTypeCode;
			if(wcardTypeCode == 1){
				wcardType = "收入-租线类";
			}else if(wcardTypeCode == 2){
				wcardType = "支出-采购类";
			}else if(wcardTypeCode == 0){
				wcardType = "其他类型";
			};
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
		};
		$("#wcardType").text(wcardType);
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
	formSubmit = true;
	App.init();
	validate();
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
	if(formSubmit){
		var submitData = getContentValue();
		if(submitData){
			console.log(submitData);
			var postData = JSON.stringify(submitData);
			App.formAjaxJson(serverPath + "contractOrderEditorController/saveOrderEditorInfo", "post", postData, successCallback);
			function successCallback(result) {
				var data = result.data;
				setPageIdCallback(data);
			}
			
		}
	}
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
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		if(formSubmit){
			var submitData = getContentValue(true);
			if(submitData){
				//alert("提交");
				console.log(submitData);
			}
		}
	});
}
/*
 * 保存或提交后更改各模块内对于ID值得callback函数
 * 页面内需声明"setPageId_"+约定各页面返回的ID值，  （约定为domain的name值即保存时的各模块key+ID）
 */
function setPageIdCallback(data){
	if(data.length > 0){
		$.each(data, function(k,v) {
			if(!App.isExitsFunction("setPageId_" + k)){
				return true;
			};
			var itemCallbackFn = eval('setPageId_' + k);
			itemCallbackFn(v);
		});
	}
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
//工作流相关
//var bootstrapValidator = $('#workOrderContentForm').data('bootstrapValidator');
//  //手动触发表单验证
//  bootstrapValidator.validate();
//  if(!bootstrapValidator.isValid()){
//      layer.alert("当前工单表单校验未通过，请检查",{icon:2,title:"错误"});
//      $($("#workOrderContentForm").find(".has-error")[0]).find("input,select").focus();
//  	return false;
//  };