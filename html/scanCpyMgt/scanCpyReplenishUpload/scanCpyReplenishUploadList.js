//系统的全局变量
var serverPath = top.globalConfig.serverPath;

$(function(){
	/*
	 * 点击iconfont弹出模态框事件
	 */
	$("#searchContractType").click(function() {
		App.getCommonModal("contractType", "#contractTypeName","typeFullname","typeCode");
	})
	$("#searchUndertakerName").click(function(){
		App.getCommonModal("agentStaff","#undertakeName","name","staffOrgId");
	})
	$("#searchOtherSubject").click(function(){
		App.getCommonModal("otherSubject","#oppoPartyName","partnerName","partnerId");
	})
	//初始化表格
	initScanCpyReplenishUploadTable();
})
/*
 * 初始化表格
 */
function initScanCpyReplenishUploadTable(){
	App.initDataTables('#scanCpyReplenishUploadTable', "#submitBtn", {
		ajax: {
	        "type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'contractUpload/oldContractUploadList',
	        "data": function(d) {
	        	var searchParmData = getSearchParm();
        		d = $.extend(d,searchParmData);
				return JSON.stringify(d);
	        }
	    },
	    "columns": [
	        {"data" : null,"title":"序号","className": "text-center",
				"render" : function(data, type, full, meta){
					return meta.row + 1;
				}
			},
	        {"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"20%"},
	        {"data": "contractNumber","title": "合同编号","width":"10%"},
	        {"data": "executeDeptName","title": "承办部门","className":"whiteSpaceNormal","width":"15%"},
	        {"data": "undertakeName","title": "承办人"},
	        {"data": "unicomPartyName","title": "我方主体","className":"whiteSpaceNormal","width":"15%"},
	        {"data": "oppoPartyName","title": "对方主体","className":"whiteSpaceNormal","width":"15%"},
	        {"data": "approveDate","title": "审批通过时间",
	            render: function(data, type, full, meta) {
	                return App.formatDateTime(data,"yyyy-MM-dd");
	        	}
	        },
	        {
				"data": null,
				"className": "text-center",
				"title": "操作",
				"render": function(data, type, full, meta) {
					if(data) {
						var btnArray = new Array();
	                    btnArray.push({ "name": "添加", "fn": "jumpContractUploadEdit(\'"+data.id+"\')","icon":"iconfont icon-add"});
	                    return App.getDataTableBtn(btnArray);
					} else {
						return '';
					}
				}
			},
	    ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 && col < 8) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
	});	
}
//跳转到上传页面
function jumpContractUploadEdit(id){
	var src = "./scanCpyReplenishUploadEdit.html?pageType=2&id="+id;
	App.changePresentUrl(src);
}
/*
 * 搜索按钮点击事件
 */
function searchContractUpload() {
	var table = $('#scanCpyReplenishUploadTable').DataTable();
	table.ajax.reload();
}
/*
 * 用户手动输入时重置自定义“exactSearch”属性
 */
$("#contractTypeName").on("change",function(){
	$(this).data("exactSearch",false);
})
$("#undertakeName").on("change",function(){
	$(this).data("exactSearch",false);
})
$("#oppoPartyName").on("change",function(){
	$(this).data("exactSearch",false);
})

/**
 * 导出excel方法
 * */
function getSearchParm(){
	var searchData = {
		contractNumber : $("#contractNumber").val().trim(),
		contractName : $("#contractName").val().trim(),
		approveDateBegin : $("#approveDateBegin").val().trim(),
		approveDateEnd : $("#approveDateEnd").val().trim()
	};
	if($("#contractTypeName").data("exactSearch")){
	    searchData.typeCode = $("#contractTypeName").data("typeCode");
	}else{
	    searchData.contractTypeName = $("#contractTypeName").val().trim();
	};
	if($("#undertakeName").data("exactSearch")){
	    searchData.undertakerId = $("#undertakeName").data("staffOrgId");
	}else{
	    searchData.undertakeName = $("#undertakeName").val().trim();
	};
	if($("#oppoPartyName").data("exactSearch")){
	    searchData.oppoPartyId = $("#oppoPartyName").data("partnerId");
	}else{
	    searchData.oppoPartyName = $("#oppoPartyName").val().trim();
	};
	return searchData;
}

function exportResultExcel(){
	var searchParmData = getSearchParm();
	var url = serverPath + 'contractUpload/exportResultExcel' + App.urlEncode(searchParmData);
    location.href = encodeURI(url);
}