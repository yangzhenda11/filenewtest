//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId = config.curStaffOrgId;
//区域展开时判断是否重新加载的标志位
var reloadCustomerListTable = false;
var reloadEmphasisCustomerTable = false;
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
 * 合作方点击查询事件
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
 * 合作方管理表格初始化
 */
function initCustomerListTable(){
	App.initDataTables('#customerListTable', "#customerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'partnersManage/searchPartnersManage',
	        "data": function(d) {
	        	d.partnerCodeOrName = $("#partnerCodeOrName").val().trim();
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
			{"data": "partyCode","className": "whiteSpaceNormal"},
			{"data": "partyName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.partyId+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					var editFlag = "add";
//					if(full.isValid == 1){
//						editFlag = "delete";
//					};
//					return "<img onclick='emphasisOfCustomer()' src='/static/img/"+editFlag+".png' />";
					return "<img onclick='emphasisOfCustomer(\""+data.partyId+"\",\""+curStaffOrgId+"\",\""+data.focusId+"\",\""+editFlag+"\")' src='/static/img/"+editFlag+".png' />";
				}
			}
		]
	});
}
/*
 * 添加和取消重点关注
 * 参数：editFlag  "add":增加 | "delete":取消
 */
function emphasisOfCustomer(partyId,curStaffOrgId,focusId,editFlag){
	var url = serverPath + "partnersManage/searchReadType";
    	var postData = {
    			partyId: partyId,
    			addStaffOrgId:curStaffOrgId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			console.log(result);
			if(result.data.length>=1&&editFlag != "delete"){
				layer.msg("已关注，无需重新关注");
				return ;
			}
				var url = serverPath + "partnersManage/savePartnersFocusManage";
				var massage = "添加";
				var postData = {
		    			partyId: partyId,
		    			addStaffOrgId:curStaffOrgId
				};
				if(editFlag == "delete"){
					postData = {
			    			partyId: partyId,
			    			addStaffOrgId:curStaffOrgId,
			    			focusId:focusId
					};
					url = serverPath + "partnersManage/updatePartnersFocusManage";
					massage = "取消";
				};
				layer.confirm("确定"+massage+"该合作方的重点关注?", {icon: 0}, function() {
					App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
					function successCallback(result) {
						console.log(result);
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
}

/*
 * 我重点关注的客户经理点击查询事件
 * 已加载表格直接可以刷新操作
 */
function searchEmphasisCustomer(){
	reloadPageDataTable("#emphasisCustomerTable");
}
/*
 * 关注的合作方表格初始化
 */
function initEmphasisCustomerTable(){
	App.initDataTables('#emphasisCustomerTable', "#emphasisCustomerLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'partnersManage/searchPartnersManageFocus',
	        "data": function(d) {
	        	d.partnerCodeOrName = $("#partnerCodeOrNameFocus").val().trim();
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
			{"data": "partyCode","className": "whiteSpaceNormal"},
			{"data": "partyName","className": "whiteSpaceNormal"},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpContractManage(\""+data.partyId+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon",
				"render" : function(data, type, full, meta){
					var editFlag="delete";
					return "<img onclick='emphasisOfCustomer(\""+data.partyId+"\",\""+curStaffOrgId+"\",\""+data.focusId+"\",\""+editFlag+"\")' src='/static/img/"+editFlag+".png' />";
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
 * 跳转合同信息
 */
function jumpContractManage(partyId){
	var url = "/html/expenseWorktable/contractManage/performContract.html?id=123&partyId="+partyId;
	top.showSubpageTab(url,"履行中合同");
}
