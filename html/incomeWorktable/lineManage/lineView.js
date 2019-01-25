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
if(parm.returnbtn == "true"){
	$("#returnBtn").show();
};
if(parm.relationType == "0"){
	$("#lineInforTableConNum").remove();
}else if(parm.relationType == null){
	layer.alert("请确定线路的关联方式",{icon:2})
};
$(function(){ 
	//线路信息表格初始化
	initLineInforTable();
})
function initselectLR() {
 	var theadList = parm.relationType == 1 ? relationContractTheadList : notRelationContractTheadList;
	var options = {
		modalId: "#commomModal",
		data: theadList
	}
	$.initSelectLRFn(options);
}
/*
 * 点击确定回调的页面方法
 */
function returnSelectLRData(data) {
	$("#commomModal").modal("hide");
	if(parm.relationType == 1){
		relationContractTheadList = data;
	}else if(parm.relationType == 0){
		notRelationContractTheadList = data;
	};
	initLineInforTable();
}
/*
 * 点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchLineInfor(){
	reloadPageDataTable("#lineInforTable");
}
/*
 * 线路信息表格初始化
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
			"url" : serverPath + 'lineMangerController/listLineInfoForCustomer',
			"contentType" : "application/json;charset=utf-8",
			"data": function(d) {
				d.isRelateContract = parm.relationType;
				d.contractId = parm.contractId;
				d.customerCode = parm.customerCode;
				d.customerName = parm.customerName; 
				d.businessId = $("#searchInput").val().trim();
				return JSON.stringify(d);
			}
		},
		"columns": lineInforTableColumns()
	});
}
/*
 * 生成动态线路表格列
 */
function lineInforTableColumns(){
	var theadList = parm.relationType == 1 ? relationContractTheadList : notRelationContractTheadList;
	var columns = [
		{"data" : null,"title":"序号",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#lineInforTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(theadList, function(k,v) {
		if(v.isShow == false){
			return true;
		};
		if(v.checked == true){
			if (v.id == "onceCost" || v.id == "monthRentCost") {
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

//已关联合同表格头
var relationContractTheadList = [
	{data:"业务信息ID",id:"businessId",checked:true},
	{data:"电路代号",id:"circuitCode",checked:true},
	{data:"产品名称",id:"productName",checked:true},
	{data:"合同编号",id:"contractNumber",checked:true},
	{data:"集客客户编号",id:"customerCode",checked:true},
	{data:"集客客户名称",id:"customerName",checked:true},
	{data:"发起分公司",id:"startCityName",checked:true},
	{data:"租用范围",id:"rentingScope",checked:true},
	{data:"月租费",id:"monthRentCost",checked:true},
	{data:"租用状态",id:"rentState",checked:true},
	{data:"客户经理姓名",id:"customerManagerName",checked:true},
	{data:"来源",id:"sourceName",checked:true},
	{data:"接入速率/带宽",id:"accessRate"},
	{data:"发起省分名称",id:"startProvinceName"},
	{data:"发起省分CODE",id:"startProvinceCode"},
	{data:"发起地市CODE",id:"startCityCode"},
	{data:"A端/CE端城市",id:"acCity"},
	{data:"A端/CE端装机地址",id:"acInstallAddr"},
	{data:"Z端/PE端城市",id:"zpCity"},
	{data:"Z端/PE端装机地址",id:"zpInstallAddr"},
	{data:"全程竣工时间",id:"finishTime"},
	{data:"起租时间",id:"rentingTime"},
	{data:"币种",id:"currencyType"},
	{data:"止租时间",id:"stopRentingTime"},
	{data:"一次性费用",id:"onceCost"},
	{data:"客户经理账号",id:"customerManagerCode"}, 
	{data:"导入时间",id:"createdDate"}
];
//未关联合同表格头
var notRelationContractTheadList = [
	{data:"业务信息ID",id:"businessId",checked:true},
	{data:"电路代号",id:"circuitCode",checked:true},
	{data:"产品名称",id:"productName",checked:true},
	{data:"集客客户编号",id:"customerCode",checked:true},
	{data:"集客客户名称",id:"customerName",checked:true},
	{data:"发起分公司",id:"startCityName",checked:true},
	{data:"租用范围",id:"rentingScope",checked:true},
	{data:"月租费",id:"monthRentCost",checked:true},
	{data:"租用状态",id:"rentState",checked:true},
	{data:"客户经理姓名",id:"customerManagerName",checked:true},
	{data:"来源",id:"sourceName",checked:true},
	{data:"接入速率/带宽",id:"accessRate"},
	{data:"发起省分名称",id:"startProvinceName"},
	{data:"发起省分CODE",id:"startProvinceCode"},
	{data:"发起地市CODE",id:"startCityCode"},
	{data:"A端/CE端城市",id:"acCity"},
	{data:"A端/CE端装机地址",id:"acInstallAddr"},
	{data:"Z端/PE端城市",id:"zpCity"},
	{data:"Z端/PE端装机地址",id:"zpInstallAddr"},
	{data:"全程竣工时间",id:"finishTime"},
	{data:"起租时间",id:"rentingTime"},
	{data:"币种",id:"currencyType"},
	{data:"止租时间",id:"stopRentingTime"},
	{data:"一次性费用",id:"onceCost"},
	{data:"客户经理账号",id:"customerManagerCode"}, 
	{data:"导入时间",id:"createdDate"}
];
