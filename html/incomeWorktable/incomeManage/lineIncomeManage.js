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
 		initLineInforTable();
 	}
})
/*
 * 点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchLineInfor(){
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if(isInit){
		reloadPageDataTable("#lineInforTable");
	}else{
		initLineInforTable();
	}
}
/*
 * 未关联合同客户表格初始化
 * 表头为动态表头，第一次加载时需要去掉其中的内容
 */
function initLineInforTable(){
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if(!isInit){
		$("#lineInforTable").html("");
	}
	debugger;
	App.initDataTables('#lineInforTable', "#lineInforLoading", {
		ajax: {
			"type": "POST",
			"url" : serverPath + 'lineIncomeMangerController/listLineIncomeForCustomer',
			"contentType" : "application/json;charset=utf-8",
			"data": function(d) { 
				d.customerCode = parm.customerCode;
				d.customerName = parm.customerName;
				d.contractNumber = parm.contractNumber;
				d.contractId = parm.contractId;
				d.customerName = parm.customerName;
				d.accountPeriodName = parm.accountPeriodName;
 				return  JSON.stringify(d);
			}
		},
		"columns": lineInforTableColumns()
	});
}
function lineInforTableColumns(){
	var theadList = incomeTheadList ;
	var columns = [
		{"data" : null,"title":"序号",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#lineInforTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(theadList, function(k,v) {
		if(v.checked == true){
			if (v.id == "onceCost" || v.id == "monthRentCost" || v.id == "receivableAmount" || v.id == "arrearsAmount" || v.id == "collectedAmount") {
				var item = {
					"data" : v.id,
					"title" : v.data,
					"render" : function(data, type, full, meta) {
						return App.unctionToThousands(data);
					}
				};
			} else if (v.id == "finishTime" || v.id == "rentingTime" || v.id == "stopRentingTime" || v.id == "createdDate") {
				var item = {
					"data" : v.id,
					"title" : v.data,
					"render" : function(data, type, full, meta) {
						return App.formatDateTime(data);
					}
				};
			} else {
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
	initLineInforTable();
}


var  incomeTheadList = [
	{data:"服务号码",id:"serviceNumber",checked:true},
	{data:"业务信息ID",id:"businessId",checked:true},
	{data:"电路代号",id:"circuitCode",checked:true},
	{data:"产品名称",id:"productName",checked:true}, 
	{data:"发起分公司",id:"startCityName",checked:true},
	{data:"租用范围",id:"rentingScope",checked:true},
	{data:"账期",id:"accountPeriodName",checked:true}, 
	{data:"月租费",id:"monthRentCost",checked:true}, 
	{data:"应收（元）",id:"receivableAmount",checked:true},
	{data:"欠费（元）",id:"arrearsAmount",checked:true},
	{data:"实收（元）",id:"collectedAmount",checked:true} ,
	
	{data:"合同编号",id:"contractNumber" },
	{data:"客户名称",id:"customerManagerName" },
	{data:"集客系统客户编号",id:"customerManagerCode" },
	{data:"接入速率/带宽",id:"accessRate" },
 
	{
		data : "A端/CE端城市",
		id : "acCity"
	},
	{
		data : "A端/CE端装机地址",
		id : "acInstallAddr"
	},
	{
		data : "Z端/PE端城市",
		id : "zpCity"
	},
	{
		data : "Z端/PE端装机地址",
		id : "zpInstallAddr"
	},
	{
		data : "全程竣工时间",
		id : "finishTime"
	},
	{
		data : "起租时间",
		id : "rentingTime"
	},
	{
		data : "止租时间",
		id : "stopRentingTime"
	} 
	
];
