//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

var importErrorText = "";

//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id) {
}
/*
 * 生成显示更多内容选择区域
 */
function initselectLR() {
	var theadList = $("#lineInfor input[name='relationType']:checked").val() == 1 ? relationContractTheadList : notRelationContractTheadList;
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
	var checkedRelationType = $("#lineInfor input[name='relationType']:checked").val();
	if (checkedRelationType == 1) {
		relationContractTheadList = data;
	} else if (checkedRelationType == 0) {
		notRelationContractTheadList = data;
	}
	;
	initLineInforTable();
}
/*
 * 线路基本信息未关联合同和已关联合同切换
 */
$("#lineInfor input[name='relationType']").on("change", function() {
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if (isInit) {
		initLineInforTable();
	} else {
		if ($(this).val() == 1) {
			$("#lineInforTableConNum").removeClass("hidden");
		} else {
			$("#lineInforTableConNum").addClass("hidden");
		}
	}
})
/*
 * 线路基本信息点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchLineInfor() {
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if (isInit) {
		reloadPageDataTable("#lineInforTable");
	} else {
		initLineInforTable();
	}
}
/*
 * 线路基本信息表格初始化
 * 表头为动态表头，第一次加载时需要去掉其中的内容
 */
function initLineInforTable() {
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if (!isInit) {
		$("#lineInforTable").html("");
	}
	;
	App.initDataTables('#lineInforTable', "#lineInforLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'lineMangerController/listLineInfo',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) {
				d.isRelateContract = $("#lineInfor input[name='relationType']:checked").val();
				d.businessId = $("#searchInput").val().trim();
				return JSON.stringify(d);
			}
		},
		"columns" : lineInforTableColumns()
	});
}

function lineInforTableColumns() {
	var theadList = $("#lineInfor input[name='relationType']:checked").val() == 1 ? relationContractTheadList : notRelationContractTheadList;
	var columns = [
		{
			"data" : null,
			"title" : "序号",
			"render" : function(data, type, full, meta) {
				var start = App.getDatatablePaging("#lineInforTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(theadList, function(k, v) {
		if (v.checked == true) {
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
}
;
/*
 * 手工导入线路信息点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchImportline() {
	var isInitImportlineTable = $.fn.dataTable.isDataTable("#importlineTable");
	if (isInitImportlineTable) {
		reloadPageDataTable("#importlineTable");
	} else {
		initImportlineTable();
	}
}
/*
 * 初始化手工导入线路信息表格
 */
function initImportlineTable() {
	App.initDataTables('#importlineTable', "#importlineLoading", {
		ajax : {
			"type" : "POST",
			"url" : serverPath + 'lineMangerController/listLineInfoImportTmp',
			"contentType" : "application/json;charset=utf-8",
			"data" : function(d) {
				d.businessId = $("#searchImportInput").val().trim();
				return JSON.stringify(d);
			}
		},
		"columns" : [
			{
				"data" : null,
				"className" : "whiteSpaceNormal ",
				"render" : function(data, type, full, meta) {
					var start = App.getDatatablePaging("#importlineTable").pageStart;
					var a = start + meta.row + 1;
					var radioHtml = "<label class='ui-checkbox'><input type='checkbox' name='checkImportItem' value=" + full.lineId + "><span></span></label>";
					return radioHtml;
				}
			},
			{
				"data" : null,
				"className" : "whiteSpaceNormal",
				"render" : function(data, type, full, meta) {
					var start = App.getDatatablePaging("#importlineTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{
				"data" : "businessId",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "circuitCode",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "productName",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "contractNumber",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "customerCode",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "customerName",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "startCityName",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "monthRentCost",
				"className" : "whiteSpaceNormal",
				"render" : function(data, type, full, meta) {
					return App.unctionToThousands(data);
				}
			},
			{
				"data" : "rentState",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "customerManagerName",
				"className" : "whiteSpaceNormal"
			},
			{
				"data" : "createdDate",
				"className" : "whiteSpaceNormal",
				"render" : function(data, type, full, meta) {
					return App.formatDateTime(data, "yyyy-mm-dd");
				}
			}
		]
	});
}
/*
 * 线路导入
 */
function lineImport() {
	var setting = {
		title : "线路信息导入",
		url : 'lineMangerController/importLineExcel',
		postfix : [ "xlsx", "xls" ],
		accept : ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
		extraData : {}
	};
	function callback(result) {
		if (result.status == 1) {
			var data = result.data;
			layer.msg("成功导入" + data + "条线路信息");
			$("#commomModal").modal("hide");
			searchImportline();
		} else{
			importErrorText = result.message;
			layer.alert("必填项校验失败，请   <a onclick='downloadErrorText()'>查看</a>  并修改后重新上传！",{icon:2});
		}
	}
	App.getFileImportModal(setting, callback);
}

// 导出生成文本
function downloadErrorText() {
    var blob = new Blob([importErrorText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "线路导入错误信息.txt");
}
/*
 * 下载线路模板
 */
function lineExport() {  
		var postData = {
			templateCode: "lineInfoExcel"
		};
		App.formAjaxJson(serverPath + "lineMangerController/lineExport", "get", postData, successCallback);
		function successCallback(result) {
			var key = result.data.fileStoreId;
			if(key){
				var url = serverPath + 'fileload/downloadS3?key='+key;
	    		location.href = encodeURI(url);	
			}else{
				showLayerErrorMsg("暂无该模板");
			}
		} 
}
/*
 * 提交全部导入线路
 */
function lineUpdate() {
	layer.confirm("是否提交本公司下的所有线路信息?",
		{
			btn : [ '是', '否' ] //按钮
		}, function() { 
			var url = serverPath + "lineMangerController/subLineInfoImportTmp";
			App.formAjaxJson(url, "post",null, successCallback);
			function successCallback(result) {
				layer.msg("提交成功");
				searchImportline();
			} 
		})  
}
/*
 * 删除选择的线路
 */
function lineDelete() {
	var checkedList = [];
	$("input[name='checkImportItem']:checked").each(function(k, v) {
		checkedList.push($(v).val());
	});
 	if(checkedList.length==0){
		layer.msg("至少选择一条记录");
		return;
	}
	var postData = {
		businessId : JSON.stringify(checkedList)
	}
	var url = serverPath + "lineMangerController/delLineInfoImportTmp";
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		layer.msg("删除成功");
		searchImportline();
	}

}
/*
 * 页面内表格初始化完成之后查询事件
 */
function reloadPageDataTable(tableId, retainPaging) {
	var table = $(tableId).DataTable();
	if (retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
//已关联合同表格头
var relationContractTheadList = [
	{
		data : "业务信息ID",
		id : "businessId",
		checked : true
	},
	{
		data : "电路代号",
		id : "circuitCode",
		checked : true
	},
	{
		data : "产品名称",
		id : "productName",
		checked : true
	},
	{
		data : "合同编号",
		id : "contractNumber",
		checked : true
	},
	{
		data : "集客客户编号",
		id : "customerCode",
		checked : true
	},
	{
		data : "集客客户名称",
		id : "customerName",
		checked : true
	},
	{
		data : "发起分公司",
		id : "startCityName",
		checked : true
	},
	{
		data : "租用范围",
		id : "rentingScope",
		checked : true
	},
	{
		data : "月租费",
		id : "monthRentCost",
		checked : true
	},
	{
		data : "租用状态",
		id : "rentState",
		checked : true
	},
	{
		data : "客户经理姓名",
		id : "customerManagerName",
		checked : true
	},
	{
		data : "来源",
		id : "sourceName",
		checked : true
	},
	{
		data : "接入速率/带宽",
		id : "accessRate"
	},
	{
		data : "发起省分名称",
		id : "startProvinceName"
	},
	{
		data : "发起省分CODE",
		id : "startProvinceCode"
	},
	{
		data : "发起地市CODE",
		id : "startCityCode"
	},
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
		data : "币种",
		id : "currencyType"
	},
	{
		data : "止租时间",
		id : "stopRentingTime"
	},
	{
		data : "一次性费用",
		id : "onceCost"
	},
	{
		data : "客户经理账号",
		id : "customerManagerCode"
	},
	{
		data : "添加人姓名",
		id : "createdBy"
	},
	{
		data : "添加人账号",
		id : "createdCode"
	},
	{
		data : "导入时间",
		id : "createdDate"
	}
];
//未关联合同表格头
var notRelationContractTheadList = [
	{
		data : "业务信息ID",
		id : "businessId",
		checked : true
	},
	{
		data : "电路代号",
		id : "circuitCode",
		checked : true
	},
	{
		data : "产品名称",
		id : "productName",
		checked : true
	},
	{
		data : "集客客户编号",
		id : "customerCode",
		checked : true
	},
	{
		data : "集客客户名称",
		id : "customerName",
		checked : true
	},
	{
		data : "发起分公司",
		id : "startCityName",
		checked : true
	},
	{
		data : "租用范围",
		id : "rentingScope",
		checked : true
	},
	{
		data : "月租费",
		id : "monthRentCost",
		checked : true
	},
	{
		data : "租用状态",
		id : "rentState",
		checked : true
	},
	{
		data : "客户经理姓名",
		id : "customerManagerName",
		checked : true
	},
	{
		data : "来源",
		id : "sourceName",
		checked : true
	},
	{
		data : "接入速率/带宽",
		id : "accessRate"
	},
	{
		data : "发起省分名称",
		id : "startProvinceName"
	},
	{
		data : "发起省分CODE",
		id : "startProvinceCode"
	},
	{
		data : "发起地市CODE",
		id : "startCityCode"
	},
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
		data : "币种",
		id : "currencyType"
	},
	{
		data : "止租时间",
		id : "stopRentingTime"
	},
	{
		data : "一次性费用",
		id : "onceCost"
	},
	{
		data : "客户经理账号",
		id : "customerManagerCode"
	},
	{
		data : "添加人姓名",
		id : "createdBy"
	},
	{
		data : "添加人账号",
		id : "createdCode"
	},
	{
		data : "导入时间",
		id : "createdDate"
	}
];