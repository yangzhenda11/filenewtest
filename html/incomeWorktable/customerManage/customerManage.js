//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//区域展开时判断是否重新加载的标志位
var reloadRelationCustomerTable = false;
var reloadEmphasisCustomerTable = false;

$(function(){
	/*
	 * 我的客户（未关联合同）功能，稽核管理和商务经理需具备全省权限的角色才可以使用。
	 * roleType
	 * 91216：客户经理
	 * 91217：业务管理
	 * 91218：稽核管理
	 * 91219：商务经理
	 * dataPermission
	 * 0个人，1部门，2公司，3省分
	 */
	var roleArr = config.curRole;
	var dataPermission = config.dataPermission;

	if(isInArray(roleArr,91218) || isInArray(roleArr,91219)){
		if(dataPermission == 3) {
			$("#notRelationCustomer").show();
		}
		else {
			$("#notRelationCustomer").remove();			
		}
	}else{
		$("#notRelationCustomer").show();
	};
})
//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	if(id == "emphasisCustomer"){
		var isInitEmphasisCustomerTable = $.fn.dataTable.isDataTable("#emphasisCustomerTable");
		if(!isInitEmphasisCustomerTable){
			initEmphasisCustomerTable();
		}
	}
}

//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	if(id == "customerView"){
		var isInitRelationCustomerTable = $.fn.dataTable.isDataTable("#relationCustomerTable");
		if(isInitRelationCustomerTable && reloadRelationCustomerTable){
			reloadPageDataTable("#relationCustomerTable",true);
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
//标签切换
$("#customerView .fieldsetChangeTitle").on("click",function(){
	$(this).addClass("checked").siblings().removeClass("checked");
	if($(this).data("dom") == "relationCustomerDom"){
		$("#notRelationCustomerDom").hide();
		$("#relationCustomerDom").show();
	}else if($(this).data("dom") == "notRelationCustomerDom"){
		$("#relationCustomerDom").hide();
		$("#notRelationCustomerDom").show();
	}
})

/*
 * 已关联合同客户点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchRelationCustomer(){
	var isInitRelationCustomerTable = $.fn.dataTable.isDataTable("#relationCustomerTable");
	if(isInitRelationCustomerTable){
		reloadPageDataTable("#relationCustomerTable");
	}else{
		initRelationCustomerTable();
	}
}
/*
 * 已关联合同客户表格初始化
 */
function initRelationCustomerTable(){

	App.initDataTables('#relationCustomerTable', "#relationCustomerLoading", {
		ajax: {
			"type": "POST",					//请求方式
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'customerInfo/listCustomerInfoRelate',	//请求地址
			"data": function(d) {							//自定义传入参数
	        	d.customerInfoRelateSearch = $("#customerInfoRelateSearch").val().trim();
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#relationCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "customerName","className": "whiteSpaceNormal","width": "20%"},
			{"data": "customerCode","className": "whiteSpaceNormal","width": "20%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width": "19%"},
			{"data": "customerManagerName","className": "whiteSpaceNormal","width": "20%"},
			{"data": null,"className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.customerCode+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon","width": "8%",
				"render" : function(data, type, full, meta){
					return "<img onclick='focusCustomer(\""+data.partyId+"\")' src='/static/img/add.png' />";
				}
			}
		]
	});
}

/*
 * 我的客户添加重点关注
 */
function focusCustomer(partyId){
	var url = serverPath + "customerInfo/saveFocusCustomer";
	layer.confirm("确定添加该客户的重点关注?", {icon: 0}, function() {
    	var postData = {
    		partyId: partyId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {

			if(result.data == 1) {

				layer.msg("已添加重点关注");
				reloadPageDataTable("#relationCustomerTable",true);
				var isInitFocusCustomerTable = $.fn.dataTable.isDataTable("#emphasisCustomerTable");
				if(isInitFocusCustomerTable){
					if($("#emphasisCustomer .form-fieldset-body").is(':hidden')){
						reloadEmphasisCustomerTable = true;
					}else{
						reloadPageDataTable("#emphasisCustomerTable",true);
					};
				}
			}
			else {
				layer.msg("已关注，无需重新关注");				
			}
		}
   	});
}

/*
 * 未关联合同客户切换来源时重新初始化表格
 */
$("#notRelationCustomerDom input[name='customerFor']").on("change",function(){
	var isInit = $.fn.dataTable.isDataTable("#notRelationCustomerTable");
	if(isInit){
		initNotRelationCustomerTable();
	}else{
		if($(this).val() == 1){
			$("#notRelationCustomerFrom").removeClass("hidden");
		}else{
			$("#notRelationCustomerFrom").addClass("hidden");
		}
	}
})
/*
 * 未关联合同客户点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchNotRelationCustomer(){
	var isInit = $.fn.dataTable.isDataTable("#notRelationCustomerTable");
	if(isInit){
		reloadPageDataTable("#notRelationCustomerTable");
	}else{
		initNotRelationCustomerTable();
	}
}
/*
 * 未关联合同客户表格初始化
 */
function initNotRelationCustomerTable(){
	var visible = $("#notRelationCustomerDom input[name='customerFor']:checked").val() == 1 ? true : false;
	App.initDataTables('#notRelationCustomerTable', "#notRelationCustomerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'customerInfo/listCustomerInfoUnrelate',
			"data": function(d) {
	        	d.customerInfoUnrelateSearch = $("#customerInfoUnrelateSearch").val().trim();
				d.customerFor = $("#notRelationCustomerDom input[name='customerFor']:checked").val();
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#notRelationCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal"},
			{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal"},
			{"data": "customerManagerName","title":"客户经理","className": "whiteSpaceNormal"},
			{"data": null,"title":"线路基本信息","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.customerCode+"\")'>查看</a>";
				}
			},
			{"data": "sourceName","title":"来源","className": "whiteSpaceNormal","visible":visible,
				"render" : function(data, type, full, meta){
					var sourceName = "未知"   // 来源  1:一站式系统2手工导入3:BSS系统
					if(data == 1){
						sourceName = "一站式系统";
					}else if(data == 2){
						sourceName = "手工导入";
					}else if(data == 3){
						sourceName = "BSS系统";
					};
					return sourceName;
				}
			}
		]
	});
}


/*
 * 我重点关注点击查询事件
 * 已加载表格直接可以刷新操作
 */
function searchEmphasisCustomer(){
	reloadPageDataTable("#emphasisCustomerTable");
}
/*
 * 我重点关注表格初始化
 */
function initEmphasisCustomerTable(){
	App.initDataTables('#emphasisCustomerTable', "#emphasisCustomerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'customerInfo/listFocusCustomerInfoRelate',
			"data": function(d) {
	        	d.customerInfoRelateSearch = $("#focusCustomerInfoRelateSearch").val().trim();
				return JSON.stringify(d);
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#emphasisCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "customerName","className": "whiteSpaceNormal","width": "20%"},
			{"data": "customerCode","className": "whiteSpaceNormal","width": "20%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width": "19%"},
			{"data": "customerManagerName","className": "whiteSpaceNormal","width": "20%"},
			{"data": null,"className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.customerCode+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon","width": "8%",
				"render" : function(data, type, full, meta){
					return "<img onclick='deleteFocusCustomer(\""+data.partyId+"\",\""+data.focusId+"\")' src='/static/img/delete.png' />";
				}
			}
		]
	});
}

/*
 * 我重点关注的客户（已关联合同）取消重点关注
 */
function deleteFocusCustomer(partyId, focusId){
	layer.confirm('确定取消该客户的重点关注?', {icon: 0}, function() {
    	var url = serverPath + "customerInfo/delFocusCustomerById";
		var postData = {
			partyId: partyId,
			focusId: focusId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.msg("已取消重点关注");
			reloadPageDataTable("#emphasisCustomerTable",true);
			var isInitRelationCustomerTable = $.fn.dataTable.isDataTable("#relationCustomerTable");
			if(isInitRelationCustomerTable){
				if($("#customerView .form-fieldset-body").is(':hidden')){
					reloadRelationCustomerTable = true;
				}else{
					reloadPageDataTable("#relationCustomerTable",true);
				};
			}
		}
   	});
}

/*
 * 我的客户查询点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchCustomerList(){
	var isInitCustomerListTable = $.fn.dataTable.isDataTable("#customerListTable");
	if(isInitCustomerListTable){
		reloadPageDataTable("#customerListTable");
	}else{
		initCustomerListTable();
	}
}
/*
 * 我的客户查询表格初始化
 */
function initCustomerListTable(){
	App.initDataTables('#customerListTable', "#customerListLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'customerInfo/listMyCustomerInfo',
			"data": function(d) {
	        	d.customerName = $("#customerNameSearch").val().trim();
	        	d.customerCode = $("#customerCodeSearch").val().trim();
	        	d.partnerCode = $("#partnerCodeSearch").val().trim();
				return JSON.stringify(d);
			}
		},
		"columns": myCustomerTableColumns()
	});
}

function myCustomerTableColumns(){
	var columns = [
		{"data" : null,"title":"序号","width": "5%",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#customerListTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(customerTheadList, function(k,v) {
		if(v.checked == true){
			if(v.id == "jumpContract"){
				var item = {
					"data": "customerCode",
					"title": v.data,
					"render": function(data, type, full, meta){
						return "<a onclick='jumpContractManage(\""+data+"\")'>查看</a>";
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
	var url = "/html/incomeWorktable/lineManage/lineView.html?relationType=0&returnbtn=false&id="+data;
	top.showSubpageTab(url,"线路信息");
}
/*
 * 跳转合同信息
 */
function jumpContractManage(customerCode){
	var url = "/html/incomeWorktable/contractManage/performContract.html?customerCode="+customerCode;
	top.showSubpageTab(url,"查看履行中合同");
}

//我的合同查询选择查看更多
function myCustomerInitselectLR() {
	var options = {
		modalId: "#commomModal",
		data: customerTheadList
	}
	$.initSelectLRFn(options);
}
/*
* 点击确定回调的页面方法
*/
function returnSelectLRData(data) {
	$("#commomModal").modal("hide");
	customerTheadList = data;
	initCustomerListTable();
}
//我的客户查询表格头
var customerTheadList = [
	{data:"客户名称",id:"customerName",checked:true},
	{data:"集客客户编号",id:"customerCode",checked:true},
	{data:"合作方编号",id:"partnerCode",checked:true},
	{data:"客户经理名称",id:"customerManagerName",checked:true},
	{data:"履行中合同",id:"jumpContract",checked:true},
	{data:"客户经理编号",id:"customerManagerCode"}
];