//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//区域展开时判断是否重新加载的标志位
var reloadFocusContractTable = false;
//获取参数
var parm = App.getPresentParm();
//获取工单类型字典
var ticketStateType = new Object();
ticketStateType = App.getDictInfo(9040);
$(function(){
	if(parm.expandFocusContract){
		$("#focusContractList .form-fieldset-tools").click();
	}
	//我的合同查询合同类型选择
	$("#contractTypeModal").click(function(){
		App.getCommonModal("contractType","#contractType","typeFullname","typeCode");
	})
	$("#contractType").on("change",function(){
		$(this).data("exactSearch",false);
	})
	var ajaxObj = {
	    "url" :  serverPath + "dicts/listChildrenByDicttId",
	    "type" : "post",
	    "data" : {"dictId": 9040}
	}
	App.initAjaxSelect2("#contractStatus",ajaxObj,"dictValue","dictLabel","全部");
})

//区域展开时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	if(id == "focusContractList"){
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
	        "url": serverPath+'performanceContractPay/listPerformanceContractPay',
	        "data": function(d) {
	        	d.contractInfoSearch = $("#contractInfoInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#performanceContractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal","width": "23%"},
			{"data": "contractNumber","className": "whiteSpaceNormal","width": "15%"},
			{"data": "partnerName","className": "whiteSpaceNormal","width": "17%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width": "10%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "contractNumber","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpOrderManageByContract(\""+data+"\")'>查看</a>";
				}
			},
			{"data": "contractId","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='showContractPerformerModal(\""+data+"\")'>查看</a>";
				}
			},
			{"data": "contractId","className": "whiteSpaceNormal tableImgCon","width": "7%",
				"render" : function(data, type, full, meta){
					return "<img onclick='focusContract(\""+data+"\")' src='/static/img/add.png' />";
				}
			}
		]
	});
}
/*
 * 根据合同id显示我的合同履行人
 * 合同履行人查看
 */
function showContractPerformerModal(contractId) {
	var url = serverPath + "contractPerformer/contractPerformerList";
	App.formAjaxJson(url, "post", JSON.stringify({contractId: contractId}), successCallback);
	function successCallback(result) {
		var data = result.data;
		var html = '';
		if(data.length > 0){
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				var performerType = item.performerType == 1 ? "是" : "否";
				html += "<tr>"+
							"<td class='align-center'>"+(i+1)+"</td>"+
							"<td>"+item.performerStaffName+"</td>"+
							"<td>"+item.performerOrgName+"</td>"+
							"<td>"+performerType+"</td>"+
							"<td></td>"+"<td></td>"+
							"<td>"+item.addStaff+"</td>"+
							"<td>"+item.addStaffOrg+"</td>"+
						"</tr>";
			}
		}else{
			html = '<tr><td colspan="8">暂无合同履行人信息</td></tr>'
		};
		$("#contractPerformerTbody").html(html);
		$("#contractPerformerModal").modal("show");
	}
}

/*
 * 我履行中的合同跟踪添加和取消重点关注
 * 参数：editFlag  "add":增加 | "delete":取消   20181008 delete 统一显示add图片
 */
function focusContract(contractId){
	var url = serverPath + "performanceContractPay/saveFocusContractPay";
	layer.confirm("确定添加该合同的重点关注?", {icon: 0}, function() {
    	var postData = {
        	contractId: contractId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			if(result.data == 1) {
				layer.msg("已添加重点关注");
				var isInitFocusContractTable = $.fn.dataTable.isDataTable("#focusContractTable");
				if(isInitFocusContractTable){
					if($("#focusContractList .form-fieldset-body").is(':hidden')){
						reloadFocusContractTable = true;
					}else{
						reloadPageDataTable("#focusContractTable",true);
					};
				}
			} else {
				layer.msg("已关注，无需重新关注");				
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
 * 我重点关注的合同表格初始化
 */
function initFocusContractTable(){
	App.initDataTables('#focusContractTable', "#focusContractLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'performanceContractPay/listFocusContractPay',
	        "data": function(d) {
	        	d.contractInfoSearch = $("#focusContractInput").val().trim();
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#focusContractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal","width": "23%"},
			{"data": "contractNumber","className": "whiteSpaceNormal","width": "15%"},
			{"data": "partnerName","className": "whiteSpaceNormal","width": "17%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width": "10%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "contractNumber","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpOrderManageByContract(\""+data+"\")'>查看</a>";
				}
			},
			{"data": "contractId","className": "whiteSpaceNormal","width": "8%",
				"render" : function(data, type, full, meta){
					return "<a onclick='showContractPerformerModal(\""+data+"\")'>查看</a>";
				}
			},
			{"data": null,"className": "whiteSpaceNormal tableImgCon","width": "7%",
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
    	var url = serverPath + "performanceContractPay/delFocusContractByIdPay";
		var postData = {
			contractId: contractId,
			focusId: focusId
		};
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			layer.msg("已取消重点关注");
			reloadPageDataTable("#focusContractTable",true);
		}
   	});
}

/*
 * 我的合同查询点击查询事件
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
	        "url": serverPath+'performanceContractPay/listMyContractPaySearch',
	        "data": function(d) {
	        	d.contractName = $("#contractNameSearch").val().trim();
	        	d.contractNumber = $("#contractNumberSearch").val().trim();
	        	d.partnerName = $("#partnerNameSearch").val().trim();
	        	d.partnerCode = $("#partnerCodeSearch").val().trim();
	        	d.contractStatus = $("#contractStatus").val().trim();
	        	if($("#contractType").data("exactSearch")){
					d.contractTypeCode = $("#contractType").data("typeCode");
				}else{
					d.contractType = $("#contractType").val().trim();
				};
	        	d.signDateBegin = $("#signDateBegin").val();
	        	d.signDateEnd = $("#signDateEnd").val();
	        	d.expiryDateBegin = $("#expiryDateBegin").val();
	        	d.expiryDateEnd = $("#expiryDateEnd").val();
	           	return JSON.stringify(d);
	        }
		},
		"columns": myContractTableColumns()
	});
}
/*
 * 动态生成表格列的数据配置
 */
function myContractTableColumns(){
	var columns = [
		{"data" : null,"title":"序号","width": "5%",
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
			}else if(v.id == "jumpOrder"){
				var item = {
					"data": null,
					"title": v.data,
					"render": function(data, type, full, meta){
						return "<a onclick='jumpOrderManageByContract(\""+data.contractNumber+"\")'>查看</a>";
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
 * 跳转订单信息（已关联合同）
 */
function jumpOrderManageByContract(contractNumber){
	var url = "/html/expenseWorktable/orderManage/orderManageForContract.html?contractNumber="+contractNumber;
	top.showSubpageTab(url,"订单信息");
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
	{data:"合同名称",id:"contractName",checked:true,"width": "40%"},
	{data:"合同编号",id:"contractNumber",checked:true},
	{data:"合作方名称",id:"partnerName",checked:true},
	{data:"合作方编号",id:"partnerCode",checked:true},
	{data:"含增值税合同金额",id:"contractValue",checked:true},
	{data:"订单",id:"jumpOrder",checked:true},
	{data:"我方主体",id:"partnerA"},
	{data:"签订盖章日期",id:"signDate"},
	{data:"合同终止日期",id:"expiryDate"},
	{data:"合同类型",id:"contractType"},
	{data:"合同状态",id:"contractStatus"},
	{data:"是否固定金额",id:"isFixed"}
];