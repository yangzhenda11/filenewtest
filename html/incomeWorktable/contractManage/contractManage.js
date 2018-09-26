//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//区域展开时判断是否重新加载的标志位
var reloadPerformanceContractTable = false;
var reloadFocusContractTable = false;
$(function(){
	var roleArr = config.curRole;
	if(isInArray(roleArr,91216)){
		$("#myContractManagerList").show();
	}else{
		$("#myContractManagerList").remove();
	};
	//我的合同管理合同类型选择
	$("#contractTypeModal").click(function(){
		App.getCommonModal("contractType","#contractType","typeFullname","typeCode");
	})
	$("#contractType").on("change",function(){
		$(this).data("exactSearch",false);
	})
	//我的合同管理合同类型选择
	$("#contractTypeSearchModal").click(function(){
		App.getCommonModal("contractType","#contractTypeSearch","typeFullname","typeCode");
	})
	$("#contractTypeSearch").on("change",function(){
		$(this).data("exactSearch",false);
	})
})

//获取工单类型字典
var ticketStateType = new Object();
ticketStateType = App.getDictInfo(9040);

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
			{"data": "contractValue","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "customerManagerName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManageByContract(\""+data.contractId+"\")'>查看</a>";
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
			{"data": "contractValue","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "customerManagerName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManageByContract(\""+data.contractId+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					return "<img onclick='deleteFocusContract(\""+data.contractId+"\",\""+data.focusId+"\")' src='/static/img/delete.png' />";
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
					d.contractType = $("#contractType").data("typeCode");
				}else{
					d.contractStatus = $("#contractType").val().trim();
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
			{"data": "contractValue","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "customerManagerName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpWorkOrderEdit(\""+data.contractId+"\")'>添加/删除客户经理</a>";
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
		$("#myContractSearchTable").html("");
		initMyContractSearchTable();
	}
}
/*
 * 我的合同查询跟踪表格初始化
 */
function initMyContractSearchTable(){
	var isInitMyContractSearchTable = $.fn.dataTable.isDataTable("#myContractSearchTable");
	if(!isInitMyContractSearchTable){
		$("#myContractSearchTable").html("");
	}
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
	        	d.customerManagerName = $("#customerManagerName").val().trim();
	        	d.signDateBegin = $("#signDateBegin").val();
	        	d.signDateEnd = $("#signDateEnd").val();
	        	d.expiryDateBegin = $("#expiryDateBegin").val();
	        	d.expiryDateEnd = $("#expiryDateEnd").val();
	        	if($("#contractTypeSearch").data("exactSearch")){
					d.contractType = $("#contractTypeSearch").data("typeCode");
				}else{
					d.contractStatus = $("#contractTypeSearch").val().trim();
				};
	           	return JSON.stringify(d);
	        }
		},
		"columns": myContractTableColumns()
	});
}
function myContractTableColumns(){
	var columns = [
		{"data" : null,"title":"序号",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#myContractSearchTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(contractTheadList, function(k,v) {
		if(v.checked == true){
			if(v.id == "contractValue"){
				var item = {
					"data": v.id,
					"title": v.data,
					"render": function(data, type, full, meta){
						return App.unctionToThousands(data);
					}
				};
			}else if(v.id == "jumpLine"){
				var item = {
					"data": null,
					"title": v.data,
					"render": function(data, type, full, meta){
						return "<a onclick='jumpLineManageByContract(\""+data.contractId+"\")'>查看</a>";
					}
				};
			}else if(v.id == "signDate" || v.id == "expiryDate"){
				var item = {
					"data": v.id,
					"title": v.data,
					"render": function(data, type, full, meta){
		            	return App.formatDateTime(data);
					}
				};
			}else if(v.id == "contractStatus"){
				var item = {
					"data": v.id,
					"title": v.data,
					"render": function(data, type, full, meta){
						return ticketStateType[data];
					}
				};
			}else if(v.id == "isFixed"){
				var item = {
					"data": v.id,
					"title": v.data,
					"render": function(data, type, full, meta){
						var isFixed = "未知"
						if(data == 1){
							isFixed = "是";
						}else if(data == 2){
							isFixed = "否";
						};
						return isFixed;
					}
				};
			}else{
				var item = {
					"data": v.id,
					"title": v.data
				};
			};
			columns.push(item);
		}
	});
	return columns;
};
/*
 * 日期修改时监听事件
 */
function dataChangeEvent(dom){	
	var signDateBegin = $("#signDateBegin").val();
    var signDateEnd = $("#signDateEnd").val();
	var expiryDateBegin = $("#expiryDateBegin").val();
	var expiryDateEnd = $("#expiryDateEnd").val();
	if(!App.checkDate(signDateBegin,signDateEnd)){
		layer.msg("签订盖章开始日期不能早于终止日期");
		$(dom).val("");
	}else if(!App.checkDate(expiryDateBegin,expiryDateEnd)){
		layer.msg("合同终止开始日期不能早于截止日期");
		$(dom).val("");
	}
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
 * 跳转线路信息（已关联合同）
 */
function jumpLineManageByContract(contractId){
	alert(contractId);
	var url = "/html/incomeWorktable/lineManage/lineView.html?relationType=1&contractId="+contractId;
	top.showSubpageTab(url,"线路信息");
}
/*
 * 增加或删除客户经理》》》》跳转工单编辑页面
 */
function jumpWorkOrderEdit(wcardId){
//	var url = "/workOrderEdit/workOrderEdit.html?pageType=5&taskFlag=yb&taskDefinitionKey=GDQR&wcardId="+ wcardId;
//	top.showSubpageTab(url,"工单处理");
}

//我的合同查询选择查看更多
function myContractInitselectLR() {
	var options = {
		modalId: "#commomModal",
		data: contractTheadList
	}
	$.initSelectLRFn(options);
}
/*
 * 点击确定回调的页面方法
 */
function returnSelectLRData(data) {
	$("#commomModal").modal("hide");
	contractTheadList = data;
	initMyContractSearchTable();
}
//我的合同查询表格头
var contractTheadList = [
	{data:"合同名称",id:"contractName",checked:true},
	{data:"合同编号",id:"contractNumber",checked:true},
	{data:"客户名称",id:"customerName",checked:true},
	{data:"集客客户编号",id:"customerCode",checked:true},
	{data:"合作方编号",id:"partnerCode",checked:true},
	{data:"含增值税合同金额",id:"contractValue",checked:true},
	{data:"客户经理名称",id:"customerManagerName",checked:true},
	{data:"线路",id:"jumpLine",checked:true},
	{data:"我方主体",id:"partnerA"},
	{data:"签订盖章日期",id:"signDate"},
	{data:"合同终止日期",id:"expiryDate"},
	{data:"合同类型",id:"contractType"},
	{data:"合同状态",id:"contractStatus"},
	{data:"是否固定金额",id:"isFixed"},
	{data:"客户经理所属部门",id:"managerOrgName"}
];