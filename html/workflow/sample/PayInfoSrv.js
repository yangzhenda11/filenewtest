//该方法为发起查询采购订单头信息服务。
function flowStart(){
	//业务表单校验等。
	var provincecode=$("#provincecodeHeadInfo").val();
	var contractnumber=$("#contractnumberHeadInfo").val();
	if(provincecode.length==0){
		layer.msg("请填写省份代码！");
		return;
	}
	var createDateBegin =  $("#startlastupdatedateHeadInfo").val();
	var createDateEnd = $("#endlastupdatedateHeadInfo").val();
	if(!App.checkDate(createDateBegin,createDateEnd)){
		layer.msg("结束日期不能早于起始日期");
		return;
	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveAllInfo",
		    "type": "post",
		    "data":{"provinceCode":provincecode,
					    	"contractnumber":contractnumber,
					    	"orgname":$("#orgnameHeadInfo").val(),
					    	"ponumber":$("#ponumberHeadInfo").val(),
					    	"startlastupdatedate":$("#startlastupdatedateHeadInfo").val(),
					    	"endlastupdatedate":$("#endlastupdatedateHeadInfo").val()
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
				layer.alert(result.data.label+";"+result.data.value);
		}
}
//该方法为发起查询采购订单行信息服务。
function flowStart2(){
	//业务表单校验等。
	var provincecode=$("#provincecodeHeadLine").val();
	var orgname=$("#orgnameHeadLine").val();
	var ponumber=$("#ponumberHeadLine").val();
	var poheaderid=$("#poheaderidHeadLine").val();
	if(provincecode.length==0){
		layer.msg("请填写省份代码！");
		return;
	}
	if(orgnameHeadLine.length==0){
		layer.msg("请填写OU名称！");
		return;
	}
	var createDateBegin =  $("#startlastupdatedateHeadLine").val();
	var createDateEnd = $("#endlastupdatedateHeadLine").val();
	if(!App.checkDate(createDateBegin,createDateEnd)){
		layer.msg("结束日期不能早于起始日期");
		return;
	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveTIOrderRowInfo",
		    "type": "post",
		    "data":{"provinceCode":provincecode,
					    	"orgname":orgname,
					    	"poheaderid":$("#poheaderidHeadLine").val(),
					    	"ponumber":$("#ponumberHeadLine").val(),
					    	"startlastupdatedate":$("#startlastupdatedateHeadLine").val(),
					    	"endlastupdatedate":$("#endlastupdatedateHeadLine").val(),
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
				layer.alert(result.data.label+";"+result.data.value);
		}
}
//该方法为发起查询采购订单接收信息服务
function flowStart3(){
	//业务表单校验等。
	var provincecode=$("#provincecodeHeadReceived").val();
	var orgname=$("#orgnameHeadReceived").val();
	if(provincecode.length==0){
		layer.msg("请填写省份代码！");
		return;
	}
	var createDateBegin =  $("#startlastupdatedateHeadReceived").val();
	var createDateEnd = $("#endlastupdatedateHeadReceived").val();
	if(!App.checkDate(createDateBegin,createDateEnd)){
		layer.msg("结束日期不能早于起始日期");
		return;
	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveTIOrderReceiveInfo",
		    "type": "post",
		    "data":{"provinceCode":provincecode,
					    	"orgname":orgname,
					    	"vendornum":$("#vendornumHeadReceived").val(),
					    	"vendorname":$("#vendornameHeadReceived").val(),
					    	"ponumber":$("#ponumberHeadReceived").val(),
					    	"itemnumber":$("#itemnumberHeadReceived").val(),
					    	"startlastupdatedate":$("#startlastupdatedateHeadReceived").val(),
					    	"endlastupdatedate":$("#endlastupdatedateHeadReceived").val()
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
				layer.alert(result.data.label+";"+result.data.value);
		}
}
//该方法为发起查询应付实付信息服务
function flowStart4(){
	//业务表单校验等。
	var provincecode=$("#provincecodePayment").val();
	var contractnumber=$("#contractnumberPayment").val();
	var contractid=$("#contractidPayment").val();
	if(provincecode.length==0){
		layer.msg("请填写省份代码！");
		return;
	}
	var createDateBegin =  $("#startlastupdatedatePayment").val();
	var createDateEnd = $("#endlastupdatedatePayment").val();
	if(!App.checkDate(createDateBegin,createDateEnd)){
		layer.msg("结束日期不能早于起始日期");
		return;
	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveTIInvoicePaymentRow",
		    "type": "post",
		    "data":{"provinceCode":provincecode,
					    	"contractnumber":contractnumber,
					    	"contractid":contractid,
					    	"stateactupaymentdate":$("#startlastupdatedatePayment").val(),
					    	"endactupaymentdate":$("#endlastupdatedatePayment").val()
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
			function successCallback(result) {
					layer.alert(result.data.label+";"+result.data.value);
			}
}
//四个接口调用
function flowStart5(){
	//业务表单校验等。
	var provincecode=$("#provincecodeAllInfo").val();
	var startlastupdatedateAllInfo=$("#startlastupdatedateAllInfo").val();
	var endlastupdatedateAllInfo=$("#endlastupdatedateAllInfo").val();
	if(provincecode.length==0){
		layer.msg("请填写省份代码！");
		return;
	}
	if(startlastupdatedateAllInfo.length==0){
		layer.msg("请填写起始日期！");
		return;
	}
	if(endlastupdatedateAllInfo.length==0){
		layer.msg("请填写结束日期！");
		return;
	}
	var createDateBegin =  $("#startlastupdatedateAllInfo").val();
	var createDateEnd = $("#endlastupdatedateAllInfo").val();
	if(!App.checkDate(createDateBegin,createDateEnd)){
		layer.msg("结束日期不能早于起始日期");
		return;
	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveAllInfo",
		    "type": "post",
		    "data":{"provinceCode":provincecode,
					    	"startlastupdatedate":$("#startlastupdatedateAllInfo").val(),
					    	"endlastupdatedate":$("#endlastupdatedateAllInfo").val()
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
			function successCallback(result) {
//					layer.alert(result.data.label+";"+result.data.value);
			}
}
