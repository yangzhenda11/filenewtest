//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

var ajaxObj = {
    "url" :  serverPath + "dicts/listChildrenByDicttId",
    "type" : "post",
    "data" : {"dictId": 9040}
}
App.initAjaxSelect2("#wcardStatus",ajaxObj,"dictValue","dictLabel","请选择工单状态");
/*
 * 初始化表格
 */
function getWorkOrderQueryTable(){
	App.initDataTables('#workOrderQueryTable', "#submitBtn", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'workOrderQuery/workOrderQueryList',
	        "data": function(d) {//自定义传入参数
	        	var searchParmData = getSearchParm();
	        	d = $.extend(d,searchParmData);
	           	return JSON.stringify(d);
	        }
		},
		"columns": [
	        {"data" : null,"title":"序号","className": "text-center","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#workOrderQueryTable").pageStart;
					return start + meta.row + 1;
			   	}
			},
	        {"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"15%"},
	        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width": "10%"},
	        {"data": "contractTypeName","title": "合同类型","className":"whiteSpaceNormal","width": "14%"},
	        {"data": "wcardNumber","className":"whiteSpaceNormal","title": "工单编号","width": "9%",
				"render": function(data, type, full, meta) {
					var result = '<a href="../workOrderEdit/workOrderEdit.html?pageType=4&taskFlag=yb&taskDefinitionKey=GDQR&wcardId='+full.wcardId+'">'+data+'</a>';
					return result;
				}
			},
	        {"data": "wcardStatusStr","title": "工单状态","className":"whiteSpaceNormal","width": "6%"},
	        {"data": "ctreatedDate","title": "创建日期","className":"whiteSpaceNormal","width": "5%",
		        "render": function(data, type, full, meta) {
		            return App.formatDateTime(data,"yyyy-MM-dd");
		        }
		    },
		    {"data": "undertakeName","title": "承办人","className":"whiteSpaceNormal","width": "6%"},
		    {"data": "unicomPartyId","bVisible":false,"title": "我方主体"},
	        {"data": "unicomPartyName","title": "我方主体","className":"whiteSpaceNormal","width":"15%"},
	        {"data": "oppoPartyId","bVisible":false,"title": "对方主体"},
	        {"data": "oppoPartyName","title": "对方主体","className":"whiteSpaceNormal","width":"15%"}
		],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 ) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
	});	
}

/*
 * 搜索点击事件
 */
function searchWorkOrder(retainPaging) {
	var ctreatedDateBegin = $("#create_date_begin").val();
    var ctreatedDateEnd = $("#create_date_end").val();
	var approveDateBegin = $("#approve_date_begin").val();
	var approveDateEnd = $("#approve_date_end").val();
	var sealAndSignDateBegin = $("#sealAndSign_date_begin").val();
	var sealAndSignDateEnd = $("#sealAndSign_date_end").val();
	if(!App.checkDate(ctreatedDateBegin,ctreatedDateEnd)){
		layer.msg("工单创建日期开始日期不能早于截止日期");
		return;
	}else if(!App.checkDate(approveDateBegin,approveDateEnd)){
		layer.msg("合同审批通过日期开始日期不能早于截止日期");
		return;
	}else if(!App.checkDate(sealAndSignDateBegin,sealAndSignDateEnd)){
		layer.msg("签订盖章日期开始日期不能早于截止日期");
		return;
	}else{
		if($.fn.DataTable.isDataTable("#workOrderQueryTable")){
			var table = $('#workOrderQueryTable').DataTable();
			if(retainPaging) {
				table.ajax.reload(null, false);
			} else {
				table.ajax.reload();
			}
		}else{
			$("#emptyTableDom").hide();
			$("#toolbars").show();
			getWorkOrderQueryTable();
		}
	}
}
/*
 * 日期修改时监听事件
 */
function dataChangeEvent(dom){
	var ctreatedDateBegin = $("#create_date_begin").val();
    var ctreatedDateEnd = $("#create_date_end").val();
	var approveDateBegin = $("#approve_date_begin").val();
	var approveDateEnd = $("#approve_date_end").val();
	var sealAndSignDateBegin = $("#sealAndSign_date_begin").val();
	var sealAndSignDateEnd = $("#sealAndSign_date_end").val();
	if(!App.checkDate(ctreatedDateBegin,ctreatedDateEnd)){
		layer.msg("工单创建日期开始日期不能早于截止日期");
		$(dom).val("");
	}else if(!App.checkDate(approveDateBegin,approveDateEnd)){
		layer.msg("合同审批通过日期开始日期不能早于截止日期");
		$(dom).val("");
	}else if(!App.checkDate(sealAndSignDateBegin,sealAndSignDateEnd)){
		layer.msg("签订盖章日期开始日期不能早于截止日期");
		$(dom).val("");
	};
}
//点击iconfont弹出模态框事件
$(function(){
	//合同类型
	$("#searchContractType").click(function(){
		App.getCommonModal("contractType","#contractType","typeFullname","typeCode");
	})
	//承办人
	$("#searchAgentStaff").click(function(){
		App.getCommonModal("agentStaff","#agentStaff","name","staffOrgId");
	})
	//承办部门
	$("#searchAgentDepartment").click(function(){
		App.getCommonModal("agentDepartment","#agentDepartment","orgName","orgId");
	})
	//我方主体
	$("#searchOurSubject").click(function(){
		App.getCommonModal("ourSubject","#ourSubject","partnerName","partnerId");
	})
	//对方主体
	$("#searchOtherSubject").click(function(){
		App.getCommonModal("otherSubject","#otherSubject","partnerName","partnerId");
	})
	
	$("#contractType").on("change",function(){
		$(this).data("exactSearch",false);
	})
	$("#agentStaff").on("change",function(){
		$(this).data("exactSearch",false);
	})
	$("#agentDepartment").on("change",function(){
		$(this).data("exactSearch",false);
	})
	$("#ourSubject").on("change",function(){
		$(this).data("exactSearch",false);
	})
	$("#otherSubject").on("change",function(){
		$(this).data("exactSearch",false);
	})
})

/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
		contractNumber : $("#contractNumber").val().trim(),
    	contractName : $("#contractName").val().trim(),
    	wcardStatus : $("#wcardStatus").val().trim(),
    	wcardNumber : $("#wcardNumber").val().trim(),
    	contractOrganitzation : $("#contractOrganitzation").val().trim(),
    	ctreatedDateBegin : $("#create_date_begin").val().trim(),
    	ctreatedDateEnd : $("#create_date_end").val().trim(),
		approveDateBegin : $("#approve_date_begin").val().trim(),
		approveDateEnd : $("#approve_date_end").val().trim(),
		sealAndSignDateBegin : $("#sealAndSign_date_begin").val().trim(),
		sealAndSignDateEnd : $("#sealAndSign_date_end").val().trim(),
	};
	if($("#contractType").data("exactSearch")){
		searchData.contractType = $("#contractType").data("typeCode");
	}else{
		searchData.contractTypeName = $("#contractType").val().trim();
	};
	
	if($("#otherSubject").data("exactSearch")){
		searchData.oppoPartyId = $("#otherSubject").data("partnerId");
	}else{
		searchData.oppoPartyName = $("#otherSubject").val().trim();
	};
	
	if($("#ourSubject").data("exactSearch")){
		searchData.unicomPartyId = $("#ourSubject").data("partnerId");
	}else{
		searchData.unicomPartyName = $("#ourSubject").val().trim();
	};
	
	if($("#agentStaff").data("exactSearch")){
		searchData.undertakerId = $("#agentStaff").data("staffOrgId");
	}else{
		searchData.undertakeName = $("#agentStaff").val().trim();
	};
	
	if($("#agentDepartment").data("exactSearch")){
		searchData.executeDeptId = $("#agentDepartment").data("orgId");
	}else{
		searchData.executeDeptName = $("#agentDepartment").val().trim();
	};
	return searchData;
}

//导出合同扫描件Excel
function exportResultExcel(){
	var searchParmData = getSearchParm();
	var url = serverPath + 'workOrderQuery/workOrderQueryExpoetList' + App.urlEncode(searchParmData);
    location.href = encodeURI(url);
}
