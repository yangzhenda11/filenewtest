//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 接受的配置参数
 */
var parm = App.getPresentParm();
console.log(parm);
if(parm.returnbtn == "true"){
	$("#returnBtn").show();
};
$(function(){ 
 	if(!parm.contractId && !parm.contractNumber && !parm.customerCode && !parm.customerName){
 		layer.alert("页面参数错误，请联系系统管理员。",{icon:2});
		return;
 	}else{
 		if(null!=parm.contractId){
 			$("#parmContractNum").text('合同ID:'+parm.contractId);
 		}else if(null!=parm.contractNumber){
 			$("#parmContractNum").text('合同编号:'+parm.contractNumber);
 		}else if(null!=parm.customerCode){
 			$("#parmContractNum").text('客户编号:'+parm.customerCode);
 		}
 		initLineIncomeforTable();
 	}
})
/*
 * 点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchLineIncomefor(){
	var isInit = $.fn.dataTable.isDataTable("#lineIncomeforTable");
	if(isInit){
		reloadPageDataTable("#lineIncomeforTable");
	}else{
		initLineIncomeforTable();
	}
}
/*
 * 未关联合同客户表格初始化
 * 表头为动态表头，第一次加载时需要去掉其中的内容
 */
function initLineIncomeforTable(){
	var isInit = $.fn.dataTable.isDataTable("#lineIncomeforTable");
	if(!isInit){
		$("#lineIncomeforTable").html("");
	}

	if (null != parm.customerCode) {
		App.initDataTables('#lineIncomeforTable', "#lineIncomeforLoading", {
			ajax: {
				"type": "POST",
				"url" :serverPath + 'incomeForecast/listLineIncomeForecast' ,
				"contentType" : "application/json;charset=utf-8",
				"data": function(d){ 
					d.customerCode = parm.customerCode; 
					d.forecastAccountPeriod = parm.forecastAccountPeriod;
					d.customerName = parm.customerName;
	 				return  JSON.stringify(d);
				}
			},
			"columns": lineIncomeforTableColumns()
		});
	} else { 
		App.initDataTables('#lineIncomeforTable', "#lineIncomeforLoading", {
			ajax: {
				"type": "POST",
				"url" :serverPath + 'incomeForecast/listLineIncomeForecastByContractId' ,
				"contentType" : "application/json;charset=utf-8",
				"data": function(d) { 
 					d.contractNumber = parm.contractNumber;
					d.contractId = parm.contractId;
					d.forecastAccountPeriod = parm.forecastAccountPeriod;
	 				return  JSON.stringify(d);
				}
			},
			"columns": lineIncomeforTableColumns()
		});
	}
}
function lineIncomeforTableColumns(){
	var theadList = incomeTheadList ;
	var columns = [
		{"data" : null,"title":"序号",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#lineIncomeforTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(theadList, function(k,v) {
		if(v.checked == true){
			if (v.id == "forecastReceivable" || v.id == "monthRentCost"  ) {
				var item = {
					"data" : v.id,
					"title" : v.data,
					"render" : function(data, type, full, meta) {
						return App.unctionToThousands(data);
					}
				};
			}   else {
				var item = {
					"data" : v.id,
					"title" : v.data
				};
			};
			columns.push(item);
		}
	});
	return columns;
};

/*
 * 生成显示更多内容选择区域
 */
function initselectLR() {
	var theadList =  incomeTheadList;
	var options = {
		modalId : "#commomModal",
		data : theadList
	}
	$.initSelectLRFn(options);
}

/*
 * 显示更多点击确定回调页面方法
 */
function returnSelectLRData(data) {
	$("#commomModal").modal("hide");
	incomeTheadList = data; 
	initLineIncomeforTable();
}

/*
 * 页面内表格初始化完成之后查询事件
 */
function reloadPageDataTable(tableId,retainPaging) {
	var table = $(tableId).DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
$("#returnBtn").on("click",function(){
	 window.history.go(-1);
})
  
var  incomeTheadList = [
	{data:"业务信息ID",id:"businessId",checked:true},
	{data:"电路代号",id:"circuitCode",checked:true},
	{data:"产品名称",id:"productName",checked:true}, 
	{data:"发起分公司",id:"startCityName",checked:true},
	{data:"租用范围",id:"rentingScope",checked:true},
	{data:"账期",id:"forecastAccountPeriod",checked:true}, 
	{data:"月租费",id:"monthRentCost",checked:true},
	{data:"预测金额",id:"forecastReceivable",checked:true} 
];
