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
App.initDataTables('#workOrderQueryTable', "#submitBtn", {
	ajax: {
		"type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'workOrderQuery/workOrderQueryList',
        "data": function(d) {//自定义传入参数
        	if($("#contractType").data("exactSearch")){
        		d.contractType = $("#contractType").data("typeCode");
        	}else{
        		d.contractTypeName = $("#contractType").val();
        	};
        	
        	if($("#otherSubject").data("exactSearch")){
        		d.oppoPartyId = $("#otherSubject").data("partnerId");
        	}else{
        		d.oppoPartyName = $("#otherSubject").val();
        	};
        	
        	if($("#ourSubject").data("exactSearch")){
        		d.unicomPartyId = $("#ourSubject").data("partnerId");
        	}else{
        		d.unicomPartyName = $("#ourSubject").val();
        	};
        	
        	if($("#agentStaff").data("exactSearch")){
        		d.undertakerId = $("#agentStaff").data("staffOrgId");
        	}else{
        		d.undertakeName = $("#agentStaff").val();
        	};
        	
        	if($("#agentDepartment").data("exactSearch")){
        		d.executeDeptId = $("#agentDepartment").data("orgId");
        	}else{
        		d.executeDeptName = $("#agentDepartment").val();
        	};
        	
        	d.contractNumber = $("#contractNumber").val();
        	d.contractName = $("#contractName").val();
        	d.wcardStatus = $("#wcardStatus").val();
        	d.wcardNumber = $("#wcardNumber").val();
        	d.contractOrganitzation = $("#contractOrganitzation").val();
        	d.ctreatedDateBegin = $("#create_date_begin").val();
        	d.ctreatedDateEnd = $("#create_date_end").val();
			d.approveDateBegin = $("#approve_date_begin").val();
			d.approveDateEnd = $("#approve_date_end").val();
			d.sealAndSignDateBegin = $("#sealAndSign_date_begin").val();
			d.sealAndSignDateEnd = $("#sealAndSign_date_end").val();
           	return JSON.stringify(d);
        }
	},
	"columns": [
		//增加序号列
        {"data" : null,
         "title":"序号",
         "className": "text-center",
         "width": "3%",
		"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#workOrderQueryTable").pageStart;
				return start + meta.row + 1;
		   }
		},
        {"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"15%"},
        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width": "10%"},
        {"data": "contractTypeName","title": "合同类型","className":"whiteSpaceNormal","width": "15%"},
        {
			"data": "wcardNumber",
			"className":"whiteSpaceNormal",
			"title": "工单编号",
			"width": "10%",
			"render": function(data, type, full, meta) {
				var result = '<a href="../workOrderEdit/workOrderEdit.html?pageType=4&taskFlag=yb&taskDefinitionKey=GDQR&wcardId='+full.wcardId+'">'+data+'</a>';
				return result;
			}
		},
        {
        	"data": "wcardStatus",
        	"title": "工单状态",
        	"width": "5%",
        	"className":"whiteSpaceNormal",
        	"render": function(data, type, full, meta) {
	            if(data=='904010'){
	            	return "工单草稿";
	            }else if(data=='904020'){
	            	return "工单复核";
	            }else if(data=='904030'){
	            	return "合同已激活";
	            }
	        }
        },
        {
	        "data": "ctreatedDate",
	        "title": "创建日期",
	        "width": "5%",
	        "className":"whiteSpaceNormal",
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


/*
 * 搜索点击事件
 */
function searchWorkOrder(retainPaging) {
	var table = $('#workOrderQueryTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
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
