//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//区域展开时判断是否重新加载的标志位
var reloadPerformanceContractTable = false;
var reloadFocusContractTable = false;
var reloadMyContractManagerTable = false;
var reloadMyContractSearchTable = false;

var roleArr = config.curRole;
if(isInArray(roleArr,91216)){
	$("#myContractManagerList").show();
}else{
	$("#myContractManagerList").remove();
}

//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	
	if(id == "performanceContractList"){
		var isInitPerformanceContractTable = $.fn.dataTable.isDataTable("#performanceContractTable");
		if(isInitPerformanceContractTable && reloadPerformanceContractTable){
			reloadPageDataTable("#performanceContractTable",true);
		}
	}else if(id == "focusContractList"){
		var isInitFocusContractTable = $.fn.dataTable.isDataTable("#focusContractTable");
		if(isInitFocusContractTable && reloadFocusContractTable){
			reloadPageDataTable("#focusContractTable",true);
		}else if(isInitFocusContractTable == false){
			initFocusContractTable();
		}
	}else if(id == "myContractManagerList"){
		var isInitMyContractManagerTable = $.fn.dataTable.isDataTable("#myContractManagerTable");
		if(isInitMyContractManagerTable && reloadMyContractManagerTable){
			reloadPageDataTable("#myContractManagerTable",true);
		}
	}else if(id == "myContractSearchList"){
		var isInitMyContractSearchTable = $.fn.dataTable.isDataTable("#myContractSearchTable");
		if(isInitMyContractSearchTable && reloadMyContractSearchTable){
			reloadPageDataTable("#myContractSearchTable",true);
		}
	}
}

/*
 * 我履行中的合同跟踪点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchPerformanceContract(){
	var isInitPerformanceContractTable = $.fn.dataTable.isDataTable("#performanceContractTable");
	if(isInitPerformanceContractTable){
		reloadPageDataTable("#performanceContractTable");
	}else{
		initPerformanceContractTable();
	}
}
/*
 * 我履行中的合同跟踪表格初始化
 */
function initPerformanceContractTable(){
	App.initDataTables('#performanceContractTable', "#contractLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContract/listPerformanceContract',
	        "data": function(d) {
	        	d.contractInfoSearch = $("#contractInfoInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#performanceContractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal"},
			{"data": "contractNumber","className": "whiteSpaceNormal"},
			{"data": "customerName","className": "whiteSpaceNormal"},
			{"data": "customerCode","className": "whiteSpaceNormal"},
			{"data": "partnerCode","className": "whiteSpaceNormal"},
			{"data": "contractValue","className": "whiteSpaceNormal"},
			{"data": "customerManagerName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.contractId+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					var editFlag = "add";
					if(full.isFocus == 1){
						editFlag = "delete";
					};
					return "<img onclick='focusContract(\""+data.contractId+"\",\""+data.focusId+"\",\""+editFlag+"\")' src='/static/img/"+editFlag+".png' />";
				}
			}
		]
	});
}
/*
 * 我履行中的合同跟踪添加和取消重点关注
 * 参数：editFlag  "add":增加 | "delete":取消
 */
function focusContract(contractId, focusId, editFlag){
	var url = serverPath + "performanceContract/saveFocusContract";
	var massage = "添加";
	if(editFlag == "delete"){
		url = serverPath + "performanceContract/delFocusContractById";
		massage = "取消";
	};
	layer.confirm("确定"+massage+"该合同的重点关注?", {icon: 0}, function() {
    	var postData = {
        	contractId: contractId,
    		focusId: focusId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.msg("已"+massage+"重点关注");
			reloadPageDataTable("#performanceContractTable",true);
			var isInitFocusContractTable = $.fn.dataTable.isDataTable("#focusContractTable");
			if(isInitFocusContractTable){
				if($("#focusContractList .form-fieldset-body").is(':hidden')){
					reloadFocusContractTable = true;
				}else{
					reloadPageDataTable("#focusContractTable",true);
				};
			}
		}
   	});
}

/*
 * 我重点关注的合同点击查询事件
 * 已加载表格直接可以刷新操作
 */
function searchFocusContract(){
	reloadPageDataTable("#focusContractTable");
}
/*
 * 我重点关注的客户经理表格初始化
 */
function initFocusContractTable(){
	App.initDataTables('#focusContractTable', "#focusContractLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContract/listFocusContract',
	        "data": function(d) {
	        	d.contractInfoSearch = $("#focusContractInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#focusContractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal"},
			{"data": "contractNumber","className": "whiteSpaceNormal"},
			{"data": "customerName","className": "whiteSpaceNormal"},
			{"data": "customerCode","className": "whiteSpaceNormal"},
			{"data": "partnerCode","className": "whiteSpaceNormal"},
			{"data": "contractValue","className": "whiteSpaceNormal"},
			{"data": "customerManagerName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.contractId+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					var editFlag = "add";
					if(full.isFocus == 1){
						editFlag = "delete";
					};
					return "<img onclick='deleteFocusContract(\""+data.contractId+"\",\""+data.focusId+"\",\""+editFlag+"\")' src='/static/img/"+editFlag+".png' />";
				}
			}
		]
	});
}

/*
 * 我重点关注的合同取消重点关注
 */
function deleteFocusContract(contractId, focusId){
	layer.confirm('确定取消该合同的重点关注?', {icon: 0}, function() {
    	var url = serverPath + "performanceContract/delFocusContractById";
		var postData = {
			contractId: contractId,
			focusId: focusId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.msg("已取消重点关注");
			reloadPageDataTable("#focusContractTable",true);
			var isInitPerformanceContractTable = $.fn.dataTable.isDataTable("#performanceContractTable");
			if(isInitPerformanceContractTable){
				if($("#performanceContractList .form-fieldset-body").is(':hidden')){
					reloadPerformanceContractTable = true;
				}else{
					reloadPageDataTable("#performanceContractTable",true);
				};
			}
		}
   	});
}

/*
 * 我的合同管理跟踪点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchMyContractManager(){
	var isInitMyContractManagerTable = $.fn.dataTable.isDataTable("#myContractManagerTable");
	if(isInitMyContractManagerTable){
		reloadPageDataTable("#myContractManagerTable");
	}else{
		initMyContractManagerTable();
	}
}
/*
 * 我的合同管理跟踪表格初始化
 */
function initMyContractManagerTable(){
	App.initDataTables('#myContractManagerTable', "#myContractManagerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContract/listMyContractManager',
	        "data": function(d) {
	        	d.contractName = $("#contractName").val().trim();
	        	d.contractNumber = $("#contractNumber").val().trim();
	        	d.customerName = $("#customerName").val().trim();
	        	d.customerCode = $("#customerCode").val().trim();
	        	if($("#contractType").data("exactSearch")){
					d.contractTypeCode = $("#contractType").data("typeCode");
				}else{
					d.contractType = $("#contractType").val().trim();
				};
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#myContractManagerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal"},
			{"data": "contractNumber","className": "whiteSpaceNormal"},
			{"data": "customerName","className": "whiteSpaceNormal"},
			{"data": "customerCode","className": "whiteSpaceNormal"},
			{"data": "partnerCode","className": "whiteSpaceNormal"},
			{"data": "contractValue","className": "whiteSpaceNormal"},
			{"data": "customerManagerName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.contractId+"\")'>添加/删除客户经理</a>";
				}
			}
		]
	});
}

/*
 * 我的合同查询跟踪点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchMyContractSearch(){
	var isInitMyContractSearchTable = $.fn.dataTable.isDataTable("#myContractSearchTable");
	if(isInitMyContractSearchTable){
		reloadPageDataTable("#myContractSearchTable");
	}else{
		initMyContractSearchTable();
	}
}
/*
 * 我的合同查询跟踪表格初始化
 */
function initMyContractSearchTable(){
	App.initDataTables('#myContractSearchTable', "#myContractSearchLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContract/listMyContractSearch',
	        "data": function(d) {
	        	d.contractName = $("#contractNameSearch").val().trim();
	        	d.contractNumber = $("#contractNumberSearch").val().trim();
	        	d.customerName = $("#customerNameSearch").val().trim();
	        	d.customerCode = $("#customerCodeSearch").val().trim();
	        	d.contractStatus = $("#contractStatusSearch").val().trim();
	        	d.partnerCode = $("#partnerCode").val().trim();
	        	d.customerManagerName = $("#customerManagerName").val().trim();
<<<<<<< HEAD
	        	d.signDateBegin = $("#signDateBegin").val().trim();
	        	d.signDateEnd = $("#signDateEnd").val().trim();
	        	d.expiryDateBegin = $("#expiryDateBegin").val().trim();
	        	d.expiryDateEnd = $("#expiryDateEnd").val().trim();
=======
	        	d.signDateBegin = $("#signDateBegin").val();
	        	d.signDateEnd = $("#signDateEnd").val();
	        	d.expiryDateBegin = $("#expiryDateBegin").val();
	        	d.expiryDateEnd = $("#expiryDateEnd").val();
	        	if($("#contractTypeSearch").data("exactSearch")){
					d.contractTypeCode = $("#contractTypeSearch").data("typeCode");
				}else{
					d.contractType = $("#contractTypeSearch").val().trim();
				};
>>>>>>> 16dc2314cfb652db2d24e923c7fc281b94f25cc6
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#myContractSearchTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal"},
			{"data": "contractNumber","className": "whiteSpaceNormal"},
			{"data": "customerName","className": "whiteSpaceNormal"},
			{"data": "customerCode","className": "whiteSpaceNormal"},
			{"data": "partnerCode","className": "whiteSpaceNormal"},
			{"data": "contractValue","className": "whiteSpaceNormal"},
			{"data": "customerManagerName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.contractId+"\")'>查看</a>";
				}
			}
		]
	});
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

/*
 * 跳转线路信息
 */
function jumpLineManage(data){
	var url = "/html/incomeWorktable/lineManage/lineView.html?id=123&relationType=1&returnbtn=true";
	window.location.href = url;
}
