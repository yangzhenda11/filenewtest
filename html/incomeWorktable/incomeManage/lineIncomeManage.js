//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 该dom中可接受的配置参数
 * contractId:合同id，根据合同id查询合同下的线路
 * relationType：是否确定是否关联合同 1：已关联  0：未关联
 * returnbtn：是否显示返回按钮，默认不传值为false
 */
var parm = App.getPresentParm();
console.log(parm);
 
if(parm.returnbtn == "true"){
	$("#returnBtn").show();
};
 
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
	App.initDataTables('#lineInforTable', "#lineInforLoading", {
		ajax: {
			"type": "POST",
			"url" : serverPath + 'lineIncomeMangerController/listLineIncomeForCustomer',
			"contentType" : "application/json;charset=utf-8",
			"data": function(d) { 
				d.contractId = parm.id;
				d.businessId = $("#searchInput").val().trim();
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
  
var  incomeTheadList = [
	{data:"业务信息ID",id:"businessId",checked:true},
	{data:"电路代号",id:"circuitCode",checked:true},
	{data:"产品名称",id:"productName",checked:true}, 
	{data:"发起分公司",id:"startCityName",checked:true},
	{data:"租用范围",id:"rentingScope",checked:true},
	{data:"账期",id:"accountPeriodName",checked:true}, 
	{data:"月租费",id:"monthRentCost",checked:true}, 
	{data:"应收（元）",id:"receivableAmount",checked:true},
	{data:"欠费（元）",id:"arrearsAmount",checked:true},
	{data:"实收（元）",id:"collectedAmount",checked:true} 
	
];
