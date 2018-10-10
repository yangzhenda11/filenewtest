//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//区域展开时判断是否重新加载的标志位
var reloadCustomerListTable = false;
var reloadEmphasisCustomerTable = false;
//获取参数
var parm = App.getPresentParm();
$(function(){
	if(parm.expandFocusCustomer){
		$("#emphasisCustomer .form-fieldset-tools").click();
	}
})
//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	if(id == "customerList"){
		var isInitCustomerListTable = $.fn.dataTable.isDataTable("#customerListTable");
		if(isInitCustomerListTable && reloadCustomerListTable){
			reloadPageDataTable("#customerListTable",true);
		}
	}else if(id == "emphasisCustomer"){
		var isInitEmphasisCustomerTable = $.fn.dataTable.isDataTable("#emphasisCustomerTable");
		if(isInitEmphasisCustomerTable && reloadEmphasisCustomerTable){
			reloadPageDataTable("#emphasisCustomerTable",true);
		}else if(isInitEmphasisCustomerTable == false){
			initEmphasisCustomerTable();
		}
	}
}

/*
 * 我管理的客户经理点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchCustomer(){
	var isInitCustomerListTable = $.fn.dataTable.isDataTable("#customerListTable");
	if(isInitCustomerListTable){
		reloadPageDataTable("#customerListTable");
	}else{
		initCustomerListTable();
	}
}
/*
 * 我管理的客户经理表格初始化
 */
function initCustomerListTable(){
	App.initDataTables('#customerListTable', "#customerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'customerManager/listManagementCustomer',
	        "data": function(d) {
	        	d.managerStaffName = $("#customerInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#customerListTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "managerStaffName","className": "whiteSpaceNormal"},
			{"data": "orgName","className": "whiteSpaceNormal"},
			{"data": "phone","className": "whiteSpaceNormal"},
			{"data": "email","className": "whiteSpaceNormal"},
			{"data": "managerStaffOrgId","className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					var editFlag = "add";
					if(full.isValid == 1){
						editFlag = "delete";
					};
					return "<img onclick='emphasisOfCustomer(\""+data.managerStaffOrgId+"\",\""+editFlag+"\")' src='/static/img/"+editFlag+".png' />";
				}
			}
		]
	});
}
/*
 * 我管理的客户经理添加和删除重点关注
 * 参数：editFlag  "add":增加 | "delete":取消
 */
function emphasisOfCustomer(managerStaffOrgId,editFlag){
	var url = serverPath + "customerManager/saveFocusCustomerManager";
	var massage = "添加";
	if(editFlag == "delete"){
		url = serverPath + "customerManager/delFocusCustomerManager";
		massage = "取消";
	};
	layer.confirm("确定"+massage+"该客户经理的重点关注?", {icon: 0}, function() {
    	var postData = {
			managerStaffOrgId: managerStaffOrgId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.msg("已"+massage+"重点关注");
			reloadPageDataTable("#customerListTable",true);
			var isInitEmphasisCustomerTable = $.fn.dataTable.isDataTable("#emphasisCustomerTable");
			if(isInitEmphasisCustomerTable){
				if($("#emphasisCustomer .form-fieldset-body").is(':hidden')){
					reloadEmphasisCustomerTable = true;
				}else{
					reloadPageDataTable("#emphasisCustomerTable",true);
				};
			}
		}
   	});
}

/*
 * 我重点关注的客户经理点击查询事件
 * 已加载表格直接可以刷新操作
 */
function searchEmphasisCustomer(){
	reloadPageDataTable("#emphasisCustomerTable");
}
/*
 * 我重点关注的客户经理表格初始化
 */
function initEmphasisCustomerTable(){
	App.initDataTables('#emphasisCustomerTable', "#emphasisCustomerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'customerManager/listFocusCustomerManager',
	        "data": function(d) {
	        	d.managerStaffName = $("#emphasisCustomerInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#emphasisCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "managerStaffName","className": "whiteSpaceNormal"},
			{"data": "orgName","className": "whiteSpaceNormal"},
			{"data": "phone","className": "whiteSpaceNormal"},
			{"data": "email","className": "whiteSpaceNormal"},
			{"data": "managerStaffOrgId","className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data+"\")'>查看</a>";
				}
			},
			{"data": "managerStaffOrgId","className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					return "<img onclick='deleteEmphasisOfEmp(\""+data+"\")' src='/static/img/delete.png' />";
				}
			}
		]
	});
}

/*
 * 我重点关注的客户经理删除重点关注
 */
function deleteEmphasisOfEmp(managerStaffOrgId){
	layer.confirm('确定取消该客户经理的重点关注?', {icon: 0}, function() {
    	var url = serverPath + "customerManager/delFocusCustomerManager";
		var postData = {
			managerStaffOrgId: managerStaffOrgId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.msg("已删除重点关注");
			reloadPageDataTable("#emphasisCustomerTable",true);
			var isInitCustomerListTable = $.fn.dataTable.isDataTable("#customerListTable");
			if(isInitCustomerListTable){
				if($("#customerList .form-fieldset-body").is(':hidden')){
					reloadCustomerListTable = true;
				}else{
					reloadPageDataTable("#customerListTable",true);
				};
			}
		}
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
 * 跳转合同信息
 */
function jumpContractManage(managerStaffOrgId){
	var url = "/html/incomeWorktable/contractManage/performContractForAccount.html?managerStaffOrgId="+managerStaffOrgId;
	top.showSubpageTab(url,"履行中的合同跟踪");
}
