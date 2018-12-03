var config = top.globalConfig;
var serverPath = config.serverPath;
//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();
var staffOrgId=parm.staffOrgId;//岗位ID接收人
var bussId=parm.bussId;//业务id
var readTypeCode=parm.readTypeCode;//流程类型
var urls="";
$(function(){
	getInitInfo();
});

function getInitInfo(){
	var ajaxObj = {
		    "url" :  serverPath+"recordToread/selectByReadTypeCode",
		    "type" : "post",
		    "data": {"readTypeCode":readTypeCode}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
			urls=result.data[0].label;
			findDetail (urls,bussId);
		}
}
function  findDetail  (url,bussId) {
	var src = url+"&bussid="+bussId;
	$('#businessiframe').attr("src",src);
	$('#businessiframe').show();
	$('#textValue').hide();
//	App.changePresentUrl(url+"&bussid="+bussId);
}
