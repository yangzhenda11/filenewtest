//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	if(id == "emphasisCustomer"){
		var isInitEmphasisCustomerTable = $.fn.dataTable.isDataTable("#emphasisCustomerTable");
		if(!isInitEmphasisCustomerTable){
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
			"type": "GET",					//请求方式
			"url": serverPath + 'staffPartner/getStaffPartnerList',	//请求地址
			"data": function(d) {							//自定义传入参数
//				d.staffName = $("input[name='staffName']").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return relationCustomerData;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#relationCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "name","className": "whiteSpaceNormal"},
			{"data": "number","className": "whiteSpaceNormal"},
			{"data": "number1","className": "whiteSpaceNormal"},
			{"data": "user","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.user+"\")'>查看</a>";
				}
			},
		]
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
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
//				d.staffName = $("input[name='staffName']").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return notRelationCustomerData;
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#notRelationCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "name","title":"客户名称","className": "whiteSpaceNormal"},
			{"data": "number","title":"集客客户编号","className": "whiteSpaceNormal"},
			{"data": "user","title":"客户经理","className": "whiteSpaceNormal"},
			{"data": null,"title":"线路基本信息","className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.user+"\")'>查看</a>";
				}
			},
			{"data": "laiyuan","title":"来源","className": "whiteSpaceNormal","visible":visible}
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
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
//				d.staffName = $("input[name='staffName']").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return relationCustomerData;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#emphasisCustomerTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "name","className": "whiteSpaceNormal"},
			{"data": "number","className": "whiteSpaceNormal"},
			{"data": "number1","className": "whiteSpaceNormal"},
			{"data": "user","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.user+"\")'>查看</a>";
				}
			},
		]
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
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
//				d.staffName = $("input[name='staffName']").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return relationCustomerData;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#customerListTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "name","className": "whiteSpaceNormal"},
			{"data": "number","className": "whiteSpaceNormal"},
			{"data": "number1","className": "whiteSpaceNormal"},
			{"data": "user","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.user+"\")'>查看</a>";
				}
			},
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
	var url = "/html/incomeWorktable/lineManage/lineView.html?id=123&relationType=0&returnbtn=false";
	top.showSubpageTab(url,"线路基本信息");
}
/*
 * 跳转合同信息
 */
function jumpContractManage(customerCode){
	var url = "/html/incomeWorktable/contractManage/performContract.html?customerCode=515200000000005326";
	top.showSubpageTab(url,"查看履行中合同");
}
