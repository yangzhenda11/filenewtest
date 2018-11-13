//该方法为发起查询采购订单头信息服务。
function flowStart(){
	//业务表单校验等。
	var provincecode=$("#provincecodeHeadInfo").val();
	var contractnumber=$("#contractnumberHeadInfo").val();
	if(provincecode.length==0){
		layer.msg("请填写省份代码！");
		return;
	}
//	if(contractnumber.length==0){
//		layer.msg("请填合同编号！");
//		return;
//	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveTIOrderHeadInfo",
		    "type": "post",
		    "data":{"provincecode":provincecode,
					    	"contractnumber":contractnumber,
					    	"orgname":$("#orgnameHeadInfo").val(),
					    	"ponumber":$("#ponumberHeadInfo").val(),
					    	"startlastupdatedate":$("#startlastupdatedateHeadInfo").val(),
					    	"endlastupdatedate":$("#endlastupdatedateHeadInfo").val()
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
//			layer.msg("" + result.data[0].orgName + "")
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
//	if(ponumber.length==0){
//		layer.msg("请填写采购订单号！");
//		return;
//	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveTIOrderRowInfo",
		    "type": "post",
		    "data":{"provincecode":provincecode,
					    	"orgname":orgname,
					    	"poheaderid":$("#poheaderidHeadLine").val(),
					    	"ponumber":$("#ponumberHeadLine").val(),
					    	"startlastupdatedate":$("#startlastupdatedateHeadLine").val(),
					    	"endlastupdatedate":$("#endlastupdatedateHeadLine").val(),
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
//			layer.msg("" + result.data[0].orgName + "")
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
//	if(orgnameHead.length==0){
//		layer.msg("请填OU名称！");
//		return;
//	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveTIOrderReceiveInfo",
		    "type": "post",
		    "data":{"provincecode":provincecode,
					    	"orgname":orgname,
					    	"vendornum":$("#vendornumHeadReceived").val(),
					    	"vendorname":$("#vendornameHeadReceived").val(),
					    	"ponumber":$("#ponumberHeadReceived").val(),
					    	"itemnumber":$("#itemnumberHeadReceived").val(),
					    	"startlastupdatedate":$("#startlastupdatedateReceived").val(),
					    	"endlastupdatedate":$("#endlastupdatedateReceived").val()
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
//			layer.msg("" + result.data[0].orgName + "")
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
//	if(contractnumber.length==0){
//		layer.msg("请填合同编号！");
//		return;
//	}
//	if(contractid.length==0){
//		layer.msg("请填合同流水号！");
//		return;
//	}
	var ajaxObj = {
		    "url":  "/payInfoSrv/saveTIInvoicePaymentRow",
		    "type": "post",
		    "data":{"provincecode":provincecode,
					    	"contractnumber":contractnumber,
					    	"contractid":contractid,
					    	"stateactupaymentdate":$("#startlastupdatedatePayment").val(),
					    	"endactupaymentdate":$("#endlastupdatedatePayment").val()
		    	}
		};
		App.formAjaxJson(ajaxObj.url, ajaxObj.type, JSON.stringify(ajaxObj.data), successCallback);
		function successCallback(result) {
//			layer.msg("" + result.data[0].orgName + "")
		}
}
